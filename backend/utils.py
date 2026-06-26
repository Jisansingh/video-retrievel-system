"""
File I/O utilities for the video retrieval API.

Responsibilities:
- Validate uploaded files are actually images of an allowed format.
- Save uploads to a temporary location so CLIP can read them from disk.
- Clean up temp files after inference.
"""

from __future__ import annotations

import logging
import os
import tempfile

from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)

# Whitelist of MIME types we accept. Pillow can read more formats, but we
# constrain to common image types to avoid security / compatibility surprises.
ALLOWED_CONTENT_TYPES: frozenset[str] = frozenset(
    {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
)
MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

ALLOWED_VIDEO_CONTENT_TYPES: frozenset[str] = frozenset(
    {"video/mp4", "video/x-msvideo", "video/quicktime", "video/x-matroska", "video/webm"}
)
MAX_VIDEO_FILE_SIZE_BYTES: int = 200 * 1024 * 1024  # 200 MB


def validate_image(upload: UploadFile) -> None:
    """Check that the uploaded file is a supported image format and not too large.

    Raises:
        HTTPException(400): If the file fails validation.
    """
    if upload.content_type is None:
        raise HTTPException(status_code=400, detail="Content-Type header is required.")

    if upload.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{upload.content_type}'. "
                   f"Allowed: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}",
        )

    # Read the file to check its size, then seek back so downstream can read it.
    # We do this in-memory to avoid writing invalid files to disk.
    upload.file.seek(0, os.SEEK_END)
    size = upload.file.tell()
    upload.file.seek(0)

    if size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size} bytes). Maximum is {MAX_FILE_SIZE_BYTES} bytes.",
        )


def validate_video(upload: UploadFile) -> None:
    """Check that the uploaded file is a supported video format and not too large."""
    if upload.content_type is None:
        raise HTTPException(status_code=400, detail="Content-Type header is required.")
    if upload.content_type not in ALLOWED_VIDEO_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{upload.content_type}'. "
                   f"Allowed: {', '.join(sorted(ALLOWED_VIDEO_CONTENT_TYPES))}",
        )
    upload.file.seek(0, os.SEEK_END)
    size = upload.file.tell()
    upload.file.seek(0)
    if size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if size > MAX_VIDEO_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size} bytes). Maximum is {MAX_VIDEO_FILE_SIZE_BYTES} bytes.",
        )


def save_temp_image(upload: UploadFile, prefix: str = "search_img_") -> str:
    """Save an uploaded file to a temporary location and return the path.

    The file is saved with the original extension so consumer libraries can
    auto-detect the format correctly. The caller is responsible for deleting
    the file after use (see ``cleanup_temp_file``).

    Args:
        upload: A validated FastAPI UploadFile.
        prefix: Prefix for the temporary file name.

    Returns:
        Absolute path to the temporary file.
    """
    suffix = _extension_from_content_type(upload.content_type)
    fd, path = tempfile.mkstemp(suffix=suffix, prefix=prefix)
    os.close(fd)  # We don't need the file descriptor; just want a unique path.

    with open(path, "wb") as dst:
        # Read the file content (seek is already at 0 from validation)
        content = upload.file.read()
        dst.write(content)

    return path


def cleanup_temp_file(path: str) -> None:
    """Delete a temporary file if it exists. Best-effort."""
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError:
        logger.warning("Failed to clean up temp file: %s", path)


def _extension_from_content_type(content_type: str | None) -> str:
    """Map a MIME type to a file extension. Falls back to .jpg for unknown types."""
    mapping = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/bmp": ".bmp",
        "image/tiff": ".tiff",
        "video/mp4": ".mp4",
        "video/x-msvideo": ".avi",
        "video/quicktime": ".mov",
        "video/x-matroska": ".mkv",
        "video/webm": ".webm",
    }
    return mapping.get(content_type or "", ".jpg")