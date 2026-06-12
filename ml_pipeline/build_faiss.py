"""
Build a FAISS similarity index from CLIP video embeddings.

Run from the project root:
    python ml_pipeline/build_faiss.py

What it does:
    1. Loads video_embeddings.npy (shape: N x 512).
    2. L2-normalizes every row so inner product = cosine similarity.
    3. Builds a FAISS IndexFlatIP.
    4. Saves the index + metadata to data/indexes/.
    5. Runs a quick self-query to verify correctness.
"""

from __future__ import annotations

import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import faiss
import numpy as np

from ml_pipeline.config import (
    VIDEO_EMBEDDINGS_FILE,
    VIDEO_METADATA_FILE,
    FAISS_INDEX_FILE,
    INDEX_METADATA_FILE,
    EMBEDDINGS_DIR,
    INDEXES_DIR,
    CLIP_EMBEDDING_DIM,
)
from ml_pipeline.utils import create_directory, load_json, save_json, log, log_header


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    log_header("Step 3: FAISS Index Construction")

    # 1. Load embeddings
    if not os.path.isfile(VIDEO_EMBEDDINGS_FILE):
        log(f"ERROR: Embeddings file not found: {VIDEO_EMBEDDINGS_FILE}")
        log("Run generate_embeddings.py first.")
        sys.exit(1)

    embeddings = np.load(VIDEO_EMBEDDINGS_FILE).astype(np.float32)
    num_vectors, dim = embeddings.shape
    log(f"Loaded embeddings  : {VIDEO_EMBEDDINGS_FILE}")
    log(f"Shape               : ({num_vectors}, {dim})")

    if dim != CLIP_EMBEDDING_DIM:
        log(f"WARNING: Expected {CLIP_EMBEDDING_DIM}-d vectors, got {dim}-d. "
            f"Check your CLIP model config.")

    # 2. L2-normalize so IndexFlatIP behaves like cosine similarity
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1.0  # guard against zero vectors
    embeddings = embeddings / norms
    log("Normalization       : L2 (all rows have unit norm)")

    # 3. Build the FAISS index
    log(f"Building IndexFlatIP({dim})...")
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)
    log(f"Index built          : {index.ntotal} vectors")

    # 4. Save the index
    create_directory(INDEXES_DIR)
    faiss.write_index(index, FAISS_INDEX_FILE)
    log(f"Index saved          : {FAISS_INDEX_FILE}")

    # 5. Copy metadata alongside the index (so search/backend can find it)
    if os.path.isfile(VIDEO_METADATA_FILE):
        metadata = load_json(VIDEO_METADATA_FILE)
        save_json(metadata, INDEX_METADATA_FILE)
        log(f"Metadata saved       : {INDEX_METADATA_FILE}")
    else:
        log("WARNING: No metadata found; skipping metadata copy.")

    # 6. Self-sanity check: query with embedding[0], should get itself back
    print()
    log("Running self-query sanity check...")
    query = embeddings[0:1]  # shape (1, dim)
    distances, indices = index.search(query, k=3)

    log(f"Top-3 results for self-query (vector 0):")
    for rank, (dist, idx) in enumerate(zip(distances[0], indices[0]), start=1):
        label = metadata[idx] if os.path.isfile(VIDEO_METADATA_FILE) else str(idx)
        log(f"  #{rank}: idx={idx}  score={dist:.6f}  video={label}")

    # Best hit should be vector 0 with score ~1.0 (cosine similarity to itself)
    if indices[0][0] == 0 and abs(distances[0][0] - 1.0) < 0.001:
        log("Sanity check PASSED — self-match score is ~1.0 ✓")
    else:
        log("Sanity check WARNING — unexpected top result. Check your embeddings.")

    # 7. Summary
    print()
    log_header("FAISS index construction complete")
    log(f"Vectors indexed : {num_vectors}")
    log(f"Dimension       : {dim}")
    log(f"Index type      : IndexFlatIP (cosine similarity)")
    log(f"Index file      : {FAISS_INDEX_FILE}")


if __name__ == "__main__":
    main()