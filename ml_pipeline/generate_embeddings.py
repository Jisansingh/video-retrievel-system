"""
CLIP embedding generation for extracted video frames.

Run from the project root:
    python ml_pipeline/generate_embeddings.py

What it does:
    1. Walks data/frames/ to find all frame images, grouped by video.
    2. For each video, runs its frames through CLIP in batches.
    3. Mean-pools frame embeddings → one 512-d vector per video.
    4. Saves (N, 512) .npy array + video_metadata.json to data/embeddings/.

Why mean pooling: a single CLIP encoding of one frame captures only that
moment. Averaging across frames gives a rough summary of the whole video
without needing a full video encoder.
"""

from __future__ import annotations

import os
import sys

# Ensure `from ml_pipeline...` works regardless of invocation style.
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import clip
import numpy as np
import torch
from PIL import Image

from ml_pipeline.config import (
    FRAMES_DIR,
    EMBEDDINGS_DIR,
    VIDEO_EMBEDDINGS_FILE,
    VIDEO_METADATA_FILE,
    CLIP_MODEL_NAME,
    BATCH_SIZE,
    DEVICE,
)
from ml_pipeline.utils import create_directory, save_json, log, log_header


# ---------------------------------------------------------------------------
# Frame collection
# ---------------------------------------------------------------------------
def collect_video_frame_map(frames_root: str) -> dict[str, list[str]]:
    """Walk *frames_root* and return {video_name: [sorted frame paths]}.

    Expected directory layout:
        frames_root/
          animals/lion/frame_00000.jpg
          animals/lion/frame_00001.jpg
          animals/tiger/frame_00000.jpg

    The "video name" is the relative path from *frames_root* to the frame's
    parent directory (e.g. "animals/lion").
    """
    video_map: dict[str, list[str]] = {}

    if not os.path.isdir(frames_root):
        log(f"ERROR: Frames directory not found: {frames_root}")
        return video_map

    for dirpath, _, filenames in os.walk(frames_root):
        # Only consider leaf directories that contain frame images
        frame_files = sorted(
            f for f in filenames if f.lower().endswith((".jpg", ".jpeg", ".png"))
        )
        if not frame_files:
            continue

        rel_dir = os.path.relpath(dirpath, frames_root)  # e.g. "animals/lion"
        video_map[rel_dir] = [os.path.join(dirpath, f) for f in frame_files]

    return video_map


# ---------------------------------------------------------------------------
# Embedding generation
# ---------------------------------------------------------------------------
def load_model():
    """Load CLIP and return (model, preprocess_fn)."""
    log(f"Loading CLIP model '{CLIP_MODEL_NAME}' on {DEVICE}...")
    model, preprocess = clip.load(CLIP_MODEL_NAME, device=DEVICE)
    model.eval()
    log("CLIP model loaded.")
    return model, preprocess


def embed_video_frames(
    frame_paths: list[str],
    model,
    preprocess,
    batch_size: int = BATCH_SIZE,
) -> np.ndarray | None:
    """Run all frame images through CLIP and return a mean-pooled 512-d vector.

    Returns None if no frames could be successfully read.
    """
    all_embeddings: list[np.ndarray] = []
    batch_images: list[torch.Tensor] = []

    def _flush_batch():
        """Run the current batch through CLIP and collect embeddings."""
        nonlocal batch_images
        if not batch_images:
            return
        stack = torch.stack(batch_images).to(DEVICE)
        with torch.no_grad():
            feats = model.encode_image(stack)
        # L2-normalize each frame embedding so mean-pooling is well-behaved
        feats = feats / feats.norm(dim=-1, keepdim=True)
        all_embeddings.extend(feats.cpu().numpy())
        batch_images = []

    for path in frame_paths:
        try:
            img = Image.open(path).convert("RGB")
        except Exception:
            # Corrupted or unreadable image — skip silently
            continue

        tensor = preprocess(img)  # returns (3, 224, 224) tensor
        batch_images.append(tensor)

        if len(batch_images) >= batch_size:
            _flush_batch()

    _flush_batch()  # remaining frames

    if not all_embeddings:
        return None

    # Mean pool across frames → single 512-d video vector
    stacked = np.stack(all_embeddings, axis=0)  # (num_frames, 512)
    video_vector = stacked.mean(axis=0)          # (512,)

    # Re-normalize after mean pooling
    norm = np.linalg.norm(video_vector)
    if norm > 0:
        video_vector = video_vector / norm

    return video_vector.astype(np.float32)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    log_header("Step 2: CLIP Embedding Generation")
    log(f"Frames directory    : {FRAMES_DIR}")
    log(f"Embeddings directory: {EMBEDDINGS_DIR}")
    log(f"CLIP model          : {CLIP_MODEL_NAME}")
    log(f"Device              : {DEVICE}")
    log(f"Batch size          : {BATCH_SIZE}")
    print()

    # 1. Collect frame paths grouped by video
    video_map = collect_video_frame_map(FRAMES_DIR)
    if not video_map:
        log(f"ERROR: No frame images found under {FRAMES_DIR}")
        log("Run extract_frames.py first.")
        sys.exit(1)

    log(f"Found {len(video_map)} videos with frames:")
    total_frames = sum(len(v) for v in video_map.values())
    for vname, fpaths in sorted(video_map.items()):
        log(f"  {vname}  →  {len(fpaths)} frames")
    log(f"Total frames to encode: {total_frames}")
    print()

    # 2. Load CLIP model
    model, preprocess = load_model()

    # 3. Generate embeddings (one mean-pooled vector per video)
    create_directory(EMBEDDINGS_DIR)

    video_names: list[str] = []
    embeddings_list: list[np.ndarray] = []
    skipped = 0

    for i, (video_name, frame_paths) in enumerate(sorted(video_map.items()), start=1):
        log(f"[{i}/{len(video_map)}] Encoding: {video_name}  ({len(frame_paths)} frames)")

        vec = embed_video_frames(frame_paths, model, preprocess, batch_size=BATCH_SIZE)

        if vec is None:
            log(f"       SKIP — no valid frames could be read")
            skipped += 1
            continue

        video_names.append(video_name)
        embeddings_list.append(vec)

    if not embeddings_list:
        log("ERROR: No embeddings were generated. Check that frames are valid images.")
        sys.exit(1)

    # 4. Save
    embeddings_array = np.stack(embeddings_list, axis=0)  # (num_videos, 512)
    np.save(VIDEO_EMBEDDINGS_FILE, embeddings_array)
    save_json(video_names, VIDEO_METADATA_FILE)

    print()
    log_header("Embedding generation complete")
    log(f"Videos encoded  : {len(video_names)}")
    log(f"Videos skipped  : {skipped}")
    log(f"Embedding shape : {embeddings_array.shape}")
    log(f"Embeddings saved: {VIDEO_EMBEDDINGS_FILE}")
    log(f"Metadata saved  : {VIDEO_METADATA_FILE}")


if __name__ == "__main__":
    main()