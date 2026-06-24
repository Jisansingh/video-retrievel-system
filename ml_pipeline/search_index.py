"""
Semantic text-to-video search using the trained FAISS index.

Run from the project root:
    python ml_pipeline/search_index.py

Or in interactive mode:
    python ml_pipeline/search_index.py "people walking"
"""

from __future__ import annotations

import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import clip
import faiss
import numpy as np
import torch

from ml_pipeline.config import (
    FAISS_INDEX_FILE,
    INDEX_METADATA_FILE,
    CLIP_MODEL_NAME,
    CLIP_EMBEDDING_DIM,
    DEFAULT_TOP_K,
    DEVICE,
)
from ml_pipeline.utils import load_json, log, log_header


# ---------------------------------------------------------------------------
# Load once at module level so multiple queries reuse the same resources.
# ---------------------------------------------------------------------------
def _load_resources() -> tuple:
    """Load FAISS index, metadata, and CLIP text encoder. Cached after first call."""
    if not os.path.isfile(FAISS_INDEX_FILE):
        raise FileNotFoundError(f"FAISS index not found: {FAISS_INDEX_FILE}")
    if not os.path.isfile(INDEX_METADATA_FILE):
        raise FileNotFoundError(f"Metadata not found: {INDEX_METADATA_FILE}")

    index = faiss.read_index(FAISS_INDEX_FILE)
    metadata = load_json(INDEX_METADATA_FILE)
    model, _ = clip.load(CLIP_MODEL_NAME, device=DEVICE)
    model.eval()
    return index, metadata, model


_index, _metadata, _model = None, None, None


def _init() -> None:
    global _index, _metadata, _model
    if _index is None:
        _index, _metadata, _model = _load_resources()
        log(f"Loaded FAISS index: {_index.ntotal} vectors, dim={_index.d}")
        log(f"Loaded metadata: {len(_metadata)} entries")
        log(f"CLIP model on: {DEVICE}")


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------
def search(query_text: str, top_k: int = DEFAULT_TOP_K) -> list[dict]:
    """Return top-k videos matching *query_text* ranked by cosine similarity."""
    _init()

    tokens = clip.tokenize([query_text], truncate=True).to(DEVICE)
    with torch.no_grad():
        text_embedding = _model.encode_text(tokens)

    vector = text_embedding.cpu().numpy().astype(np.float32).flatten()
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm

    top_k = min(top_k, _index.ntotal)
    query = np.expand_dims(vector, axis=0)
    distances, indices = _index.search(query, top_k)

    results: list[dict] = []
    for rank, (dist, idx) in enumerate(zip(distances[0], indices[0]), start=1):
        video_name = _metadata[idx] if idx < len(_metadata) else "unknown"
        category = video_name.split("/")[0] if "/" in video_name else "unknown"
        results.append({
            "rank": rank,
            "video": video_name,
            "category": category,
            "score": round(float(dist), 4),
        })

    return results


# ---------------------------------------------------------------------------
# Public API — called by the backend
# ---------------------------------------------------------------------------
def search_videos(query: str, top_k: int = DEFAULT_TOP_K) -> list[dict]:
    """Search for videos matching a text query. Raises ValueError on empty input."""
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    return search(query.strip(), top_k=top_k)


# ---------------------------------------------------------------------------
# Display
# ---------------------------------------------------------------------------
def print_results(query_text: str, results: list[dict]) -> None:
    """Pretty-print search results."""
    log_header(f'Search results: "{query_text}"')
    print(f"{'Rank':<6} {'Score':<8} {'Category':<12} Video")
    print("-" * 70)
    for r in results:
        print(f"{r['rank']:<6} {r['score']:<8} {r['category']:<12} {r['video']}")
    print()


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------
def main() -> None:
    # Accept a query from the command line or fall back to interactive mode.
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        results = search(query, top_k=DEFAULT_TOP_K)
        print_results(query, results)
        return

    # Interactive mode — keep asking until the user types "quit".
    log_header("Semantic Video Search (interactive mode)")
    log(f"Index: {FAISS_INDEX_FILE}")
    log(f"Type 'quit' to exit.\n")

    _init()

    while True:
        try:
            query = input("Query > ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if not query:
            continue
        if query.lower() in ("quit", "exit", "q"):
            break

        results = search(query)
        print_results(query, results)


if __name__ == "__main__":
    main()