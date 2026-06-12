"""
Shared helper utilities for the ML pipeline.

One rule: no ML logic here. Just filesystem, validation, and logging
helpers that every pipeline script can use.
"""

from __future__ import annotations

import json
import os
from datetime import datetime


# ---------------------------------------------------------------------------
# Supported video formats — we only process these extensions.
# ---------------------------------------------------------------------------
SUPPORTED_VIDEO_EXTENSIONS: frozenset[str] = frozenset(
    {".mp4", ".avi", ".mov", ".mkv", ".webm"}
)


# ---------------------------------------------------------------------------
# Directory helpers
# ---------------------------------------------------------------------------
def create_directory(path: str) -> None:
    """Create a directory if it doesn't already exist.

    Uses exist_ok=True so it's safe to call even when the folder is already
    there — no race conditions, no noisy errors.
    """
    os.makedirs(path, exist_ok=True)


# ---------------------------------------------------------------------------
# Video file helpers
# ---------------------------------------------------------------------------
def validate_video_file(path: str) -> bool:
    """Check that *path* is a real, non-empty video file with a supported extension.

    Returns True if the file passes all checks, False otherwise.
    Intentionally does NOT raise — callers decide whether to skip or error out.
    """
    if not os.path.isfile(path):
        return False
    if os.path.getsize(path) == 0:
        return False
    ext = os.path.splitext(path)[1].lower()
    if ext not in SUPPORTED_VIDEO_EXTENSIONS:
        return False
    return True


def get_video_files(root_dir: str) -> list[str]:
    """Walk *root_dir* recursively and return absolute paths of every valid video file.

    Broken / unsupported files are silently skipped. Returns a sorted list
    so the order is deterministic across runs.
    """
    video_paths: list[str] = []

    if not os.path.isdir(root_dir):
        return video_paths

    for dirpath, _, filenames in os.walk(root_dir):
        for fname in sorted(filenames):
            full_path = os.path.join(dirpath, fname)
            if validate_video_file(full_path):
                video_paths.append(full_path)

    return video_paths


# ---------------------------------------------------------------------------
# JSON helpers
# ---------------------------------------------------------------------------
def save_json(data: object, path: str) -> None:
    """Serialize *data* to *path* as pretty-printed JSON.

    Creates parent directories if needed so the caller doesn't have to worry
    about ordering.
    """
    create_directory(os.path.dirname(path))
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def load_json(path: str) -> object:
    """Load and return the JSON content from *path*."""
    with open(path, "r") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Logging helper
# ---------------------------------------------------------------------------
def log(msg: str) -> None:
    """Print a timestamped log line. Keeps debugging predictable across scripts."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {msg}")


def log_header(title: str) -> None:
    """Print a clearly-visible section header — useful in long pipeline runs."""
    print()
    print("=" * 60)
    print(f"  {title}")
    print("=" * 60)


# ---------------------------------------------------------------------------
# Path-existence helpers
# ---------------------------------------------------------------------------
def file_exists(path: str) -> bool:
    return os.path.isfile(path)


def dir_exists(path: str) -> bool:
    return os.path.isdir(path)