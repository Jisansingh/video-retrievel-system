"""
FastAPI application for content-based video retrieval.

Start with:
    uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

Endpoints:
    POST /search  —  upload an image, get top-k similar videos.
    GET  /health  —  quick liveness check.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, Query
from PIL import Image

from backend.model import init_model, generate_embedding
from backend.search import init_index, search_similar, text_search
from backend.utils import validate_image, save_temp_image, cleanup_temp_file


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
    # 1. Validate the uploaded file
    validate_image(image)

    # 2. Save to a temp file so Pillow can open it reliably
    temp_path = save_temp_image(image)

    try:
        # 3. Open with Pillow and convert to RGB (CLIP requires 3-channel)
        pil_image = Image.open(temp_path).convert("RGB")

        # 4. Generate normalized CLIP embedding
        embedding = generate_embedding(pil_image)

        # 5. Search FAISS index
        results = search_similar(embedding, top_k=top_k)

    finally:
        # Always clean up the temp file, even if inference fails
        cleanup_temp_file(temp_path)

    # 6. Build response
    return {
        "query": image.filename or "uploaded_image",
        "results": [
            {"video": r.video_filename, "score": round(r.score, 4)} for r in results
        ],
    }