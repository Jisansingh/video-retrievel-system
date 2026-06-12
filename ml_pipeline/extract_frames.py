"""
Frame extraction: read every video, sample every Nth frame, save as JPEG.

Run from the project root:
    python ml_pipeline/extract_frames.py

Output lands in data/frames/, organised as:
    frames/<category>/<video_name>/frame_0001.jpg
"""

from __future__ import annotations

import os
import sys

# Make sure the project root is on sys.path so `from ml_pipeline...` works
# regardless of whether the user runs this as `python ml_pipeline/extract_frames.py`
# or `python -m ml_pipeline.extract_frames`.
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import cv2

from ml_pipeline.config import VIDEOS_DIR, FRAMES_DIR, FRAME_INTERVAL
from ml_pipeline.utils import get_video_files, create_directory, log, log_header


def extract_frames(video_path: str, output_dir: str, interval: int) -> int:
    """Open *video_path*, save every *interval*-th frame to *output_dir*.

    Args:
        video_path: Absolute path to a video file.
        output_dir: Directory where frames for this video will be saved.
        interval: Extract every Nth frame (e.g. 30 → every 30th frame).

    Returns:
        Number of frames saved. Returns 0 if the video could not be opened.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        log(f"  SKIP — cannot open: {os.path.basename(video_path)}")
        return 0

    create_directory(output_dir)

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    saved = 0
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % interval == 0:
            out_path = os.path.join(output_dir, f"frame_{saved:05d}.jpg")
            cv2.imwrite(out_path, frame)
            saved += 1

        frame_idx += 1

    cap.release()
    return saved


def main() -> None:
    log_header("Step 1: Frame Extraction")
    log(f"Videos directory : {VIDEOS_DIR}")
    log(f"Frames directory  : {FRAMES_DIR}")
    log(f"Frame interval    : every {FRAME_INTERVAL}th frame")
    print()

    if not os.path.isdir(VIDEOS_DIR):
        log(f"ERROR: Videos directory not found: {VIDEOS_DIR}")
        log("Place your video files (or category subfolders) inside data/videos/")
        sys.exit(1)

    video_paths = get_video_files(VIDEOS_DIR)

    if not video_paths:
        log(f"ERROR: No video files found in {VIDEOS_DIR}")
        log(f"Supported extensions: .mp4, .avi, .mov, .mkv, .webm")
        sys.exit(1)

    log(f"Found {len(video_paths)} video(s) to process.\n")

    total_frames_saved = 0
    total_skipped = 0

    for i, video_path in enumerate(video_paths, start=1):
        # Derive output path: preserve category/video_name structure
        rel = os.path.relpath(video_path, VIDEOS_DIR)          # e.g. "animals/lion.mp4"
        name_no_ext = os.path.splitext(rel)[0]                  # e.g. "animals/lion"
        output_dir = os.path.join(FRAMES_DIR, name_no_ext)      # e.g. frames/animals/lion/

        video_name = rel
        log(f"[{i}/{len(video_paths)}] {video_name}")

        n = extract_frames(video_path, output_dir, interval=FRAME_INTERVAL)

        if n == 0:
            total_skipped += 1
        else:
            log(f"       → {n} frames saved")
            total_frames_saved += n

    # Summary
    print()
    log_header("Extraction complete")
    log(f"Videos processed : {len(video_paths)}")
    log(f"Frames extracted  : {total_frames_saved}")
    log(f"Videos skipped    : {total_skipped}")
    log(f"Output directory  : {FRAMES_DIR}")


if __name__ == "__main__":
    main()