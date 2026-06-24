"""
CLIP model loader and embedding generator.

Key decisions:
- ViT-B/32 is used to match the Colab pipeline exactly.
- The model is loaded once as a module-level singleton so every request
  reuses the same model—this avoids reloading ~350MB of weights per call.
- L2 normalization is applied to every embedding because the FAISS index
  uses IndexFlatIP (inner product). With normalized vectors, inner product
  equals cosine similarity.
- Device selection prefers CUDA, then MPS (Apple Silicon), then CPU.
"""

from __future__ import annotations

import numpy as np
import torch
import clip
from PIL import Image


def _select_device() -> str:
    """Pick the best available torch device."""
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


DEVICE: str = _select_device()

# Loaded once at import time (or explicitly via init_model).
_model = None
_preprocess = None


def _load_clip() -> tuple:
    """Download and load the CLIP ViT-B/32 model."""
    model, preprocess = clip.load("ViT-B/32", device=DEVICE)
    model.eval()
    return model, preprocess


def init_model() -> None:
    """Explicitly initialize the global CLIP model and preprocessing pipeline.

    Called from the FastAPI startup event so the model is warm before the
    first request arrives. Idempotent—safe to call multiple times.
    """
    global _model, _preprocess
    if _model is None:
        _model, _preprocess = _load_clip()
        print(f"[model] CLIP ViT-B/32 loaded on {DEVICE}")


def get_model():
    """Return the global (model, preprocess) tuple, loading it if needed.

    Avoids circular import issues: any module can call get_model() without
    worrying about import order.
    """
    global _model, _preprocess
    if _model is None:
        init_model()
    return _model, _preprocess


def generate_embedding(image: Image.Image) -> np.ndarray:
    """Convert a PIL Image into a normalized CLIP embedding vector."""
    model, preprocess = get_model()

    image_tensor = preprocess(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        embedding = model.encode_image(image_tensor)

    vector = embedding.cpu().numpy().astype(np.float32).flatten()

    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm

    return vector