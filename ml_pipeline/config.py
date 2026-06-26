"""
Central configuration for the ML pipeline.

Everything path-related or tunable lives here so no other script needs
hardcoded strings. Change a path once and every script picks it up.
"""

from __future__ import annotations

import os
import torch


# ---------------------------------------------------------------------------
# Project root — everything else is relative to this.
# ---------------------------------------------------------------------------
ROOT = os.path.dirname(os.path.abspath(__file__))  # ml_pipeline/

# ---------------------------------------------------------------------------
# Data directories
# ---------------------------------------------------------------------------
DATA_DIR = os.path.join(ROOT, "data")
VIDEOS_DIR = os.path.join(DATA_DIR, "videos")
FRAMES_DIR = os.path.join(DATA_DIR, "frames")
EMBEDDINGS_DIR = os.path.join(DATA_DIR, "embeddings")
INDEXES_DIR = os.path.join(DATA_DIR, "indexes")

# ---------------------------------------------------------------------------
# Output filenames (saved inside INDEXES_DIR / EMBEDDINGS_DIR)
# ---------------------------------------------------------------------------
VIDEO_EMBEDDINGS_FILE = os.path.join(EMBEDDINGS_DIR, "video_embeddings.npy")
VIDEO_METADATA_FILE = os.path.join(EMBEDDINGS_DIR, "video_metadata.json")
FAISS_INDEX_FILE = os.path.join(INDEXES_DIR, "video_index.faiss")
INDEX_METADATA_FILE = os.path.join(INDEXES_DIR, "video_metadata.json")

FRAME_EMBEDDINGS_FILE = os.path.join(EMBEDDINGS_DIR, "frame_embeddings.npy")
FRAME_METADATA_FILE = os.path.join(EMBEDDINGS_DIR, "frame_metadata.json")
FRAME_FAISS_INDEX_FILE = os.path.join(INDEXES_DIR, "frame_faiss.index")
FRAME_INDEX_METADATA_FILE = os.path.join(INDEXES_DIR, "frame_metadata.json")

# ---------------------------------------------------------------------------
# Feature-extraction tuning
# ---------------------------------------------------------------------------
FRAME_INTERVAL: int = 30  # Extract every 30th frame
CLIP_MODEL_NAME: str = "ViT-B/32"
CLIP_EMBEDDING_DIM: int = 512  # ViT-B/32 outputs 512-d vectors
BATCH_SIZE: int = 32  # Frames per forward pass through CLIP

# ---------------------------------------------------------------------------
# Search defaults
# ---------------------------------------------------------------------------
DEFAULT_TOP_K: int = 5

# ---------------------------------------------------------------------------
# Device selection
# ---------------------------------------------------------------------------
if torch.cuda.is_available():
    DEVICE = "cuda"
elif torch.backends.mps.is_available():
    DEVICE = "mps"
else:
    DEVICE = "cpu"
