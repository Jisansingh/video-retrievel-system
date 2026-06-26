"""
FAISS index loader and similarity search.

Key decisions:
- Expects an IndexFlatIP index (inner product). Because embeddings are
  L2-normalized before insertion AND at query time, inner product equals
  cosine similarity.
- A companion JSON file (video_metadata.json) maps integer FAISS positions
  to video filenames. This is a simple list where index N corresponds to
  the N-th row in the FAISS index.
- The index and metadata are loaded once at startup and held in memory.
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass

import faiss
import numpy as np
import clip
import torch

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class SearchResult:
    video_filename: str
    score: float


# Paths relative to the project root's data/embeddings directory.
DEFAULT_INDEX_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "ml_pipeline", "data", "indexes")
)
DEFAULT_INDEX_PATH = os.path.join(DEFAULT_INDEX_DIR, "video_index.faiss")
DEFAULT_METADATA_PATH = os.path.join(DEFAULT_INDEX_DIR, "video_metadata.json")

FRAME_INDEX_PATH = os.path.join(DEFAULT_INDEX_DIR, "frame_faiss.index")
FRAME_METADATA_PATH = os.path.join(DEFAULT_INDEX_DIR, "frame_metadata.json")

_index: faiss.Index | None = None
_metadata: list[str] | None = None

_frame_index: faiss.Index | None = None
_frame_metadata: list[dict] | None = None


def init_index(
    index_path: str | None = None,
    metadata_path: str | None = None,
) -> None:
    """Load the FAISS index and video metadata into memory.

    Called from the FastAPI startup event. Idempotent.

    Args:
        index_path: Path to the .faiss binary index file.
        metadata_path: Path to video_metadata.json (a JSON list of filenames).
    """
    global _index, _metadata

    ipath = index_path or DEFAULT_INDEX_PATH
    mpath = metadata_path or DEFAULT_METADATA_PATH

    if not os.path.exists(ipath):
        raise FileNotFoundError(
            f"FAISS index not found at {ipath}. "
            "Run the Colab pipeline first and copy video_index.faiss into data/embeddings/."
        )
    if not os.path.exists(mpath):
        raise FileNotFoundError(
            f"Metadata file not found at {mpath}. "
            "Run the Colab pipeline first and copy video_metadata.json into data/embeddings/."
        )

    _index = faiss.read_index(ipath)
    with open(mpath, "r") as f:
        _metadata = json.load(f)

    if not isinstance(_metadata, list):
        raise ValueError("video_metadata.json must be a JSON list of video filenames.")

    if _index.ntotal != len(_metadata):
        raise ValueError(
            f"FAISS index has {_index.ntotal} vectors but metadata has "
            f"{len(_metadata)} entries. They must match."
        )

    logger.info("FAISS index loaded: %d vectors, dim=%d", _index.ntotal, _index.d)


def get_index() -> faiss.Index:
    """Return the loaded FAISS index."""
    global _index
    if _index is None:
        raise RuntimeError("FAISS index not initialized. Call init_index() first.")
    return _index


def get_metadata() -> list[str]:
    """Return the video metadata list."""
    global _metadata
    if _metadata is None:
        raise RuntimeError("Metadata not initialized. Call init_index() first.")
    return _metadata


def search_similar(
    query_embedding: np.ndarray,
    top_k: int = 5,
) -> list[SearchResult]:
    """Search the FAISS index for the top-k most similar videos."""
    index = get_index()
    metadata = get_metadata()

    top_k = min(top_k, index.ntotal)

    query = np.expand_dims(query_embedding, axis=0).astype(np.float32)
    distances, indices = index.search(query, top_k)

    results: list[SearchResult] = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx == -1:
            continue
        results.append(SearchResult(video_filename=metadata[idx], score=float(dist)))

    return results


# ---------------------------------------------------------------------------
# Frame FAISS index — loaded separately from the video index.
# ---------------------------------------------------------------------------
def init_frame_index(
    index_path: str | None = None,
    metadata_path: str | None = None,
) -> None:
    global _frame_index, _frame_metadata

    ipath = index_path or FRAME_INDEX_PATH
    mpath = metadata_path or FRAME_METADATA_PATH

    if not os.path.exists(ipath):
        raise FileNotFoundError(
            f"Frame FAISS index not found at {ipath}. "
            "Run generate_frame_embeddings.py first."
        )
    if not os.path.exists(mpath):
        raise FileNotFoundError(
            f"Frame metadata not found at {mpath}. "
            "Run generate_frame_embeddings.py first."
        )

    _frame_index = faiss.read_index(ipath)
    with open(mpath, "r") as f:
        _frame_metadata = json.load(f)

    if not isinstance(_frame_metadata, list):
        raise ValueError("frame_metadata.json must be a JSON list.")

    if _frame_index.ntotal != len(_frame_metadata):
        raise ValueError(
            f"Frame index has {_frame_index.ntotal} vectors but metadata has "
            f"{len(_frame_metadata)} entries."
        )

    logger.info("Frame FAISS index loaded: %d vectors, dim=%d", _frame_index.ntotal, _frame_index.d)


def get_frame_index() -> faiss.Index:
    global _frame_index
    if _frame_index is None:
        raise RuntimeError("Frame FAISS index not initialized. Call init_frame_index() first.")
    return _frame_index


def get_frame_metadata() -> list[dict]:
    global _frame_metadata
    if _frame_metadata is None:
        raise RuntimeError("Frame metadata not initialized. Call init_frame_index() first.")
    return _frame_metadata


def search_frame_similar(
    query_embedding: np.ndarray,
    top_k: int = 12,
) -> list[dict]:
    """Search the frame FAISS index for the top-k most similar frames."""
    index = get_frame_index()
    metadata = get_frame_metadata()

    top_k = min(top_k, index.ntotal)

    query = np.expand_dims(query_embedding, axis=0).astype(np.float32)
    distances, indices = index.search(query, top_k)

    results: list[dict] = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx == -1:
            continue
        entry = dict(metadata[idx])
        entry["score"] = round(float(dist), 4)
        results.append(entry)

    return results


# ---------------------------------------------------------------------------
# Text-to-frame search wrapper.
# ---------------------------------------------------------------------------
def frame_text_search(query: str, top_k: int = 12) -> list[dict]:
    """Search frames by natural-language query using the already-loaded CLIP
    model and frame FAISS index."""
    from backend.model import get_model as _get_clip_model, DEVICE as _CLIP_DEVICE

    _model, _ = _get_clip_model()

    tokens = clip.tokenize([query], truncate=True).to(_CLIP_DEVICE)

    with torch.no_grad():
        text_embedding = _model.encode_text(tokens)

    vector = text_embedding.cpu().numpy().astype(np.float32).flatten()
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm

    results = search_frame_similar(vector, top_k=top_k)
    return results


# ---------------------------------------------------------------------------
# Text search wrapper — delegates to the ML pipeline.
# ---------------------------------------------------------------------------
def text_search(query: str, top_k: int = 5) -> list[dict]:
    """Search for videos by natural-language query. Uses the already-loaded
    CLIP model (from backend.model) and FAISS index (from backend.search)
    so we never load a second copy of either library."""
    from backend.model import get_model as _get_clip_model, DEVICE as _CLIP_DEVICE

    # 1. Reuse the already-loaded CLIP model for text encoding
    _model, _ = _get_clip_model()

    tokens = clip.tokenize([query], truncate=True).to(_CLIP_DEVICE)

    with torch.no_grad():
        text_embedding = _model.encode_text(tokens)

    # 2. L2-normalize
    vector = text_embedding.cpu().numpy().astype(np.float32).flatten()
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm

    # 3. Search with the already-loaded FAISS index
    results_sr = search_similar(vector, top_k=top_k)

    # 4. Convert SearchResult dataclasses to dicts matching ml_pipeline format
    results: list[dict] = []
    for rank, r in enumerate(results_sr, start=1):
        video_name = r.video_filename
        category = video_name.split("/")[0] if "/" in video_name else "unknown"
        results.append({
            "rank": rank,
            "video": video_name,
            "category": category,
            "score": round(r.score, 4),
        })

    return results