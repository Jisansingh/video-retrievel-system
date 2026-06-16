"""
FastAPI application for content-based video retrieval.

Start with:
    uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

Endpoints:
    GET  /             —  root.
    GET  /health       —  quick liveness check.
    GET  /search       —  natural-language text search.
    POST /search       —  upload an image, get top-k similar videos.
    POST /search/video —  upload a video, get top-k similar videos.
    GET  /library      —  list all videos grouped by category.
    /videos/*          —  static video file serving.
    /frames/*          —  static thumbnail (frame) serving.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image

from backend.model import init_model, generate_embedding
from backend.search import init_index, search_similar, text_search
from backend.utils import validate_image, validate_video, save_temp_image, cleanup_temp_file
from ml_pipeline.config import VIDEOS_DIR, FRAMES_DIR


# ---------------------------------------------------------------------------
# Application lifespan — load heavy resources once at startup.
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load CLIP model and FAISS index before the app starts accepting requests."""
    init_model()
    init_index()
    yield
    # No explicit teardown needed; Python GC handles torch/faiss cleanup.


app = FastAPI(
    title="Video Retrieval System",
    description="Search for visually similar videos using CLIP + FAISS.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://(localhost|127\\.0\\.0\\.1)(:\\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
FRAME_INTERVAL: int = 30  # Must match ml_pipeline/config.py
_VIDEO_EXTS: tuple[str, ...] = (".mp4", ".avi", ".mov", ".mkv", ".webm")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def generate_video_embedding(video_path: str) -> np.ndarray:
    """Open a video, sample frames, encode each with CLIP, return a single
    mean-pooled L2-normalized embedding vector.

    Mirrors the ML pipeline logic (extract_frames + generate_embeddings) but
    processes frames in-memory without writing intermediate files.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Could not open video file")

    frame_embeddings: list[np.ndarray] = []
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % FRAME_INTERVAL == 0:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb)
            emb = generate_embedding(pil_image)
            frame_embeddings.append(emb)
        frame_idx += 1

    cap.release()

    if not frame_embeddings:
        raise ValueError("No frames could be extracted from the video")

    video_embedding = np.mean(frame_embeddings, axis=0)
    norm = np.linalg.norm(video_embedding)
    if norm > 0:
        video_embedding = video_embedding / norm
    return video_embedding.astype(np.float32)


def _video_ext(category: str, stem: str) -> str:
    """Return the actual file extension for a video by checking the filesystem."""
    for ext in _VIDEO_EXTS:
        if os.path.isfile(os.path.join(VIDEOS_DIR, category, stem + ext)):
            return ext
    return ".mp4"


def _enrich_video(video_path: str) -> dict:
    """Build frontend-facing fields from a metadata video path (e.g. 'animals/animals_0')."""
    category, stem = video_path.split("/", 1)
    ext = _video_ext(category, stem)
    return {
        "title": f"{stem}{ext}",
        "category": category,
        "video_url": f"/videos/{category}/{stem}{ext}",
        "thumbnail_url": f"/frames/{video_path}/frame_00000.jpg",
    }


# ---------------------------------------------------------------------------
# Static file mounts — serve videos and thumbnails directly from disk.
# ---------------------------------------------------------------------------
app.mount("/videos", StaticFiles(directory=VIDEOS_DIR), name="videos")
app.mount("/frames", StaticFiles(directory=FRAMES_DIR), name="frames")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health_check():
    """Liveness probe — returns 200 if the server is running."""
    return {"status": "ok"}


@app.get("/")
async def root():
    """Root endpoint — confirms the server is running."""
    return {"message": "Video Retrieval System Running"}


@app.get("/search")
async def text_search_endpoint(
    query: str = Query(..., min_length=1, description="Natural-language search query"),
    top_k: int = Query(default=5, ge=1, le=50, description="Number of results"),
):
    """Search for videos matching a text description."""
    try:
        results = text_search(query.strip(), top_k=top_k)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {e}")

    for r in results:
        r.update(_enrich_video(r["video"]))

    return {"query": query.strip(), "results": results}


@app.post("/search")
async def search(
    image: UploadFile = File(...),
    top_k: int = Query(default=5, ge=1, le=50, description="Number of results to return"),
):
    """Search for videos similar to the uploaded image.

    Args:
        image: An image file (JPEG, PNG, WebP, BMP, or TIFF, max 10 MB).
        top_k: How many similar videos to return (1–50).
    """
    validate_image(image)

    temp_path = save_temp_image(image)

    try:
        pil_image = Image.open(temp_path).convert("RGB")
        embedding = generate_embedding(pil_image)
        results = search_similar(embedding, top_k=top_k)
    finally:
        cleanup_temp_file(temp_path)

    return {
        "query": image.filename or "uploaded_image",
        "results": [
            {"video": r.video_filename, "score": round(r.score, 4), **_enrich_video(r.video_filename)}
            for r in results
        ],
    }


@app.post("/search/video")
async def search_video(
    video: UploadFile = File(...),
    top_k: int = Query(default=5, ge=1, le=50, description="Number of results to return"),
):
    """Search for videos similar to an uploaded video.

    The uploaded video is sampled (every 30th frame), each sampled frame is
    encoded with CLIP, and the frame embeddings are mean-pooled into a single
    query vector before searching the FAISS index.
    """
    validate_video(video)

    temp_path = save_temp_image(video, prefix="search_vid_")

    try:
        embedding = generate_video_embedding(temp_path)
        results = search_similar(embedding, top_k=top_k)
    finally:
        cleanup_temp_file(temp_path)

    return {
        "query": video.filename or "uploaded_video",
        "results": [
            {"video": r.video_filename, "score": round(r.score, 4), **_enrich_video(r.video_filename)}
            for r in results
        ],
    }


@app.get("/library")
async def library():
    """List all videos grouped by category with title, video_url, and thumbnail_url.

    Built dynamically from the filesystem — no database, no hardcoded values.
    """
    categories: dict[str, list[dict]] = {}

    for cat_name in sorted(os.listdir(VIDEOS_DIR)):
        cat_path = os.path.join(VIDEOS_DIR, cat_name)
        if not os.path.isdir(cat_path):
            continue

        entries: list[dict] = []
        for fname in sorted(os.listdir(cat_path)):
            if fname.startswith("."):
                continue
            stem, ext = os.path.splitext(fname)
            if ext.lower() not in _VIDEO_EXTS:
                continue
            video_path = f"{cat_name}/{stem}"
            entry = {"title": fname, "category": cat_name}
            entry.update(_enrich_video(video_path))
            entries.append(entry)

        if entries:
            categories[cat_name] = entries

    return categories