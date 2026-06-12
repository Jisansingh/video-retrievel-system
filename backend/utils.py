"""
File I/O utilities for the video retrieval API.

Responsibilities:
- Validate uploaded files are actually images of an allowed format.
- Save uploads to a temporary location so CLIP can read them from disk.
- Clean up temp files after inference.
"""

from __future__ import annotations

import os
import tempfile

from fastapi import UploadFile, HTTPException

# Whitelist of MIME types we accept. Pillow can read more formats, but we
# constrain to common image types to avoid security / compatibility surprises.
ALLOWED_CONTENT_TYPES: frozenset[str] = frozenset(
    {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
)
MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB


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


def save_temp_image(upload: UploadFile) -> str:
    """Save an uploaded image to a temporary file and return the path.

    The file is saved with the original extension so Pillow can auto-detect
    the format correctly. The caller is responsible for deleting the file
    after use (see ``cleanup_temp_file``).

    Args:
        upload: A validated FastAPI UploadFile.

    Returns:
        Absolute path to the temporary file.
    """
    suffix = _extension_from_content_type(upload.content_type)
    fd, path = tempfile.mkstemp(suffix=suffix, prefix="search_img_")
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
        pass  # File system hiccup; not actionable at this level.


def _extension_from_content_type(content_type: str | None) -> str:
    """Map a MIME type to a file extension. Falls back to .jpg."""
    mapping = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/bmp": ".bmp",
        "image/tiff": ".tiff",
    }
    return mapping.get(content_type or "", ".jpg")