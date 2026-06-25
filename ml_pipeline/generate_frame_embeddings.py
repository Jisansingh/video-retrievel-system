"""
Per-frame CLIP embedding generation + FAISS index construction.

Run from the project root:
    python ml_pipeline/generate_frame_embeddings.py

What it does:
    1. Walks data/frames/ to find all individual frame images (~9479).
    2. For each frame, generates a CLIP embedding (no mean-pooling).
    3. Builds frame_metadata.json with {frame_path, video, timestamp, category}.
    4. Builds a FAISS IndexFlatIP over all frame embeddings.
    5. Saves to data/embeddings/ and data/indexes/.
"""

from __future__ import annotations

import os
import re
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import clip
import faiss
import numpy as np
import torch
from PIL import Image

from ml_pipeline.config import (
    FRAMES_DIR,
    EMBEDDINGS_DIR,
    INDEXES_DIR,
    FRAME_EMBEDDINGS_FILE,
    FRAME_METADATA_FILE,
    FRAME_FAISS_INDEX_FILE,
    FRAME_INDEX_METADATA_FILE,
    CLIP_MODEL_NAME,
    FRAME_INTERVAL,
    BATCH_SIZE,
    DEVICE,
)
from ml_pipeline.utils import create_directory, save_json, log, log_header


FRAME_RE = re.compile(r"frame_(\d+)\.")


def collect_frames(frames_root: str) -> list[dict]:
    """Walk *frames_root* and return a list of frame metadata dicts.

    Each dict has:
        frame_path: relative path from frames_root (e.g. "animals/lion/frame_00000.jpg")
        video: parent video name (e.g. "animals/lion")
        timestamp: approximate timestamp derived from frame number * interval / 30
        category: top-level category (e.g. "animals")

    Frames are sorted by (video, frame_number) for deterministic ordering.
    """
    if not os.path.isdir(frames_root):
        log(f"ERROR: Frames directory not found: {frames_root}")
        return []

    entries: list[dict] = []

    for dirpath, _, filenames in os.walk(frames_root):
        frame_files = sorted(f for f in filenames if f.lower().endswith((".jpg", ".jpeg", ".png")))
        if not frame_files:
            continue

        rel_dir = os.path.relpath(dirpath, frames_root)
        parts = rel_dir.split(os.sep)
        category = parts[0] if len(parts) >= 1 else "unknown"

        for fname in frame_files:
            m = FRAME_RE.match(fname)
            frame_num = int(m.group(1)) if m else 0
            timestamp = round(frame_num * FRAME_INTERVAL / 30.0, 1)

            entries.append({
                "frame_path": os.path.join(rel_dir, fname),
                "video": rel_dir,
                "timestamp": timestamp,
                "category": category,
            })

    return entries


def main() -> None:
    log_header("Frame Embedding Generation + FAISS Index")

    log(f"Frames directory    : {FRAMES_DIR}")
    log(f"Embeddings directory: {EMBEDDINGS_DIR}")
    log(f"Index directory     : {INDEXES_DIR}")
    log(f"CLIP model          : {CLIP_MODEL_NAME}")
    log(f"Device              : {DEVICE}")
    log(f"Batch size          : {BATCH_SIZE}")
    print()

    # 1. Collect all frames
    metadata = collect_frames(FRAMES_DIR)
    if not metadata:
        log("ERROR: No frames found. Run extract_frames.py first.")
        sys.exit(1)

    total_frames = len(metadata)
    log(f"Found {total_frames} frames")
    print()

    # 2. Load CLIP
    log(f"Loading CLIP model '{CLIP_MODEL_NAME}' on {DEVICE}...")
    model, preprocess = clip.load(CLIP_MODEL_NAME, device=DEVICE)
    model.eval()
    log("CLIP model loaded.")
    print()

    # 3. Generate frame embeddings in batches
    create_directory(EMBEDDINGS_DIR)

    all_embeddings: list[np.ndarray] = []
    batch_paths: list[str] = []
    batch_indices: list[list[int]] = []
    current_batch: list[torch.Tensor] = []

    skipped = 0

    def _flush_batch():
        nonlocal current_batch
        if not current_batch:
            return
        stack = torch.stack(current_batch).to(DEVICE)
        with torch.no_grad():
            feats = model.encode_image(stack)
        feats = feats / feats.norm(dim=-1, keepdim=True)
        all_embeddings.extend(feats.cpu().numpy())
        current_batch = []

    for idx, entry in enumerate(metadata):
        full_path = os.path.join(FRAMES_DIR, entry["frame_path"])
        try:
            img = Image.open(full_path).convert("RGB")
        except Exception:
            skipped += 1
            continue

        tensor = preprocess(img)
        current_batch.append(tensor)

        if len(current_batch) >= BATCH_SIZE:
            _flush_batch()

        if (idx + 1) % 500 == 0:
            log(f"[{idx+1}/{total_frames}] Processed (embeddings so far: {len(all_embeddings)})")

    _flush_batch()

    if not all_embeddings:
        log("ERROR: No embeddings generated.")
        sys.exit(1)

    embeddings_array = np.stack(all_embeddings, axis=0).astype(np.float32)
    log(f"Embeddings generated: {embeddings_array.shape} (skipped: {skipped})")

    # 4. Trim metadata to match successfully-embedded frames
    frame_metadata = [m for m in metadata if os.path.isfile(os.path.join(FRAMES_DIR, m["frame_path"]))]

    assert len(embeddings_array) == len(frame_metadata), (
        f"Mismatch: {len(embeddings_array)} embeddings vs {len(frame_metadata)} metadata entries"
    )

    # 5. Normalize
    norms = np.linalg.norm(embeddings_array, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    embeddings_array = embeddings_array / norms
    log("L2-normalized all embeddings")

    # 6. Save embeddings + metadata
    np.save(FRAME_EMBEDDINGS_FILE, embeddings_array)
    save_json(frame_metadata, FRAME_METADATA_FILE)
    log(f"Embeddings saved to : {FRAME_EMBEDDINGS_FILE}")
    log(f"Metadata saved to   : {FRAME_METADATA_FILE}")

    # 7. Build FAISS index
    create_directory(INDEXES_DIR)

    dim = embeddings_array.shape[1]
    log(f"Building IndexFlatIP({dim})...")
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings_array)
    faiss.write_index(index, FRAME_FAISS_INDEX_FILE)
    log(f"FAISS index saved   : {FRAME_FAISS_INDEX_FILE}")

    # 8. Copy metadata alongside the index
    save_json(frame_metadata, FRAME_INDEX_METADATA_FILE)
    log(f"Index metadata saved: {FRAME_INDEX_METADATA_FILE}")

    # 9. Sanity check
    print()
    log("Running self-query sanity check...")
    query = embeddings_array[0:1]
    distances, indices = index.search(query, k=3)
    log(f"Top-3 for self-query (vector 0):")
    for rank, (dist, idx) in enumerate(zip(distances[0], indices[0]), start=1):
        label = frame_metadata[idx]["frame_path"]
        log(f"  #{rank}: idx={idx}  score={dist:.6f}  frame={label}")
    if indices[0][0] == 0 and abs(distances[0][0] - 1.0) < 0.001:
        log("Sanity check PASSED")
    else:
        log("Sanity check WARNING")

    print()
    log_header("Complete")
    log(f"Frames indexed: {len(frame_metadata)}")
    log(f"Dimension     : {dim}")
    log(f"Index type    : IndexFlatIP (cosine similarity)")


if __name__ == "__main__":
    main()
