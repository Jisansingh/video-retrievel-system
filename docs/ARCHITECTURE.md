# System Architecture

## Overview

The Video Retrieval System is a multimodal search platform that enables users to retrieve videos using:

* Natural language text queries
* Example image queries
* Example video queries
* Frame-level text queries (find specific moments)

The system uses CLIP (ViT-B/32) embeddings for semantic understanding and FAISS for efficient similarity search. A React + Vite frontend provides the user interface, and a FastAPI backend serves the API and static assets.

---

# High-Level Architecture

```
                   ┌─────────────────────┐
                   │     React + Vite    │
                   │      Frontend       │
                   │  (Tailwind CSS v4)  │
                   └─────────┬───────────┘
                             │ HTTP (axios)
                             ▼
                   ┌─────────────────────┐
                   │   FastAPI Backend   │
                   │   (uvicorn server)  │
                   │                     │
                   │  ┌───────────────┐  │
                   │  │  CLIP Model   │  │
                   │  │  (ViT-B/32)   │  │
                   │  └──────┬────────┘  │
                   │         │           │
                   │  ┌──────┴────────┐  │
                   │  │ FAISS Search  │  │
                   │  │ IndexFlatIP   │  │
                   │  └──────┬────────┘  │
                   │         │           │
                   │  ┌──────┴────────┐  │
                   │  │ Static Mounts │  │
                   │  │ /videos /frames│  │
                   │  └───────────────┘  │
                   └─────────┬───────────┘
                             │
                   ┌─────────┴───────────┐
                   │   data/ (on disk)    │
                   │ videos/  frames/     │
                   │ embeddings/ indexes/ │
                   └─────────────────────┘
```

---

# Data Processing Pipeline

The system uses an offline indexing pipeline with two parallel paths:

## Video-Level Index

```
Videos (data/videos/)
   │
   ▼
Frame Extraction (extract_frames.py)
   │  — sample every 30th frame via OpenCV
   ▼
Frame Images (data/frames/)
   │
   ▼
CLIP Video Embedding (generate_embeddings.py)
   │  — encode each frame → mean-pool → L2-normalize
   ▼
Video Embeddings (data/embeddings/video_embeddings.npy)
   │
   ▼
FAISS IndexFlatIP (build_faiss.py)
   │
   ▼
data/indexes/video_index.faiss + video_metadata.json
```

## Frame-Level Index (per-frame retrieval)

```
Frame Images (data/frames/)
   │
   ▼
CLIP Frame Embedding (generate_frame_embeddings.py)
   │  — encode each frame individually → L2-normalize
   ▼
Frame Embeddings (data/embeddings/frame_embeddings.npy)
   │
   ▼
FAISS IndexFlatIP (generate_frame_embeddings.py)
   │
   ▼
data/indexes/frame_faiss.index + frame_metadata.json
```

---

# Component Architecture

## 1. Dataset Layer

Location: `ml_pipeline/data/videos/`

500 source videos organised into 5 category subdirectories (~100 each):

- `animals/`
- `humans/`
- `indoors/`
- `nature/`
- `vehicles/`

---

## 2. Frame Extraction Layer

File: `ml_pipeline/extract_frames.py`

Reads every video with OpenCV, samples every 30th frame, and saves individual JPEGs to `data/frames/<category>/<video_name>/frame_XXXXX.jpg`. Outputs ~9,500 frames total.

---

## 3. Video Embedding Generation Layer

File: `ml_pipeline/generate_embeddings.py`

For each video, loads its extracted frames, runs each through CLIP ViT-B/32 in batches of 32, mean-pools the per-frame embeddings into a single 512-d vector, and L2-normalizes. Saves `video_embeddings.npy` (N×512) and `video_metadata.json`.

---

## 4. Per-Frame Embedding Generation Layer

File: `ml_pipeline/generate_frame_embeddings.py`

Encodes every individual frame with CLIP (no mean-pooling) and builds a separate FAISS IndexFlatIP over all ~9,500 frame vectors. Each frame metadata entry records its `frame_path`, parent `video`, approximate `timestamp`, and `category`.

Outputs:
- `data/embeddings/frame_embeddings.npy`
- `data/embeddings/frame_metadata.json`
- `data/indexes/frame_faiss.index`
- `data/indexes/frame_metadata.json`

---

## 5. FAISS Index Construction Layer

File: `ml_pipeline/build_faiss.py`

Loads `video_embeddings.npy`, L2-normalizes all rows, and builds a FAISS `IndexFlatIP`. Saves `video_index.faiss` and copies metadata alongside it.

---

## 6. Backend (FastAPI)

Directory: `backend/`

| File | Responsibilities |
|---|---|
| `main.py` | FastAPI app instance, lifespan (model/index init), all API route handlers, static file mounts |
| `model.py` | CLIP ViT-B/32 singleton loader, device selection (CUDA → MPS → CPU), `generate_embedding()` |
| `search.py` | FAISS index loader (video + frame), `search_similar()`, `search_frame_similar()`, text search wrappers |
| `utils.py` | File validation (MIME types, size limits), temp file save/cleanup |

### API Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `GET` | `/` | Root status |
| `GET` | `/library` | List all videos grouped by category |
| `GET` | `/search` | Text-to-video search |
| `GET` | `/search/frames` | Text-to-frame search |
| `POST` | `/search` | Image-to-video search |
| `POST` | `/search/video` | Video-to-video search |
| `GET` | `/download/frame` | Download matched frame as JPEG |
| `GET` | `/videos/*` | Static video file serving |
| `GET` | `/frames/*` | Static thumbnail serving |

---

## 7. Frontend (React + Vite)

Directory: `frontend/`

| File | Purpose |
|---|---|
| `App.jsx` | React Router setup (`/`, `/search`, `/library`, `/history`) |
| `pages/About.jsx` | Landing page with project overview |
| `pages/Home.jsx` | Search page with text/image/video/frame query handling |
| `pages/Library.jsx` | Explore library with category filter + pagination |
| `pages/History.jsx` | Persisted search history with re-run |
| `components/SearchBar.jsx` | Text input with slash-command frame/video mode toggle |
| `components/SearchTabs.jsx` | Tab switcher (text, image, video) |
| `components/VideoCard.jsx` | Video search result card with score bar |
| `components/FrameCard.jsx` | Frame search result card with timestamp + download |
| `components/VideoModal.jsx` | Video player modal with filmstrip, playback controls, download |
| `components/LibraryVideoCard.jsx` | Library browser thumbnail card |
| `components/CategoryCard.jsx` | Library category filter card |
| `components/Navbar.jsx` | Top navigation bar |
| `lib/api.js` | Axios API client with all endpoint functions |

---

# Search Workflows

## Image-to-Video Search

```
Image Upload ──→ CLIP Image Encoder ──→ 512-d Embedding
                                              │
                                              ▼
                                       FAISS Search (video_index)
                                              │
                                              ▼
                                       Top Matching Videos
```

REST: `POST /search`

---

## Text-to-Video Search

```
Text Query ──→ CLIP Text Encoder ──→ 512-d Embedding
                                            │
                                            ▼
                                     FAISS Search (video_index)
                                            │
                                            ▼
                                     Top Matching Videos
```

REST: `GET /search`

---

## Text-to-Frame Search

```
Text Query ──→ CLIP Text Encoder ──→ 512-d Embedding
                                            │
                                            ▼
                                     FAISS Search (frame_index)
                                            │
                                            ▼
                                     Top Matching Frames
                                     (with timestamps)
```

REST: `GET /search/frames`

---

## Video-to-Video Search

```
Video Upload ──→ Sample every 30th frame (OpenCV)
                      │
                      ▼
               CLIP Encode each frame
                      │
                      ▼
               Mean-pool → L2-normalize
                      │
                      ▼
               512-d Embedding
                      │
                      ▼
               FAISS Search (video_index)
                      │
                      ▼
               Top Matching Videos
```

REST: `POST /search/video`

---

# Storage Architecture

```
data/                          # Created under ml_pipeline/
├── videos/                    # Source video files (input)
├── frames/                    # Extracted frame JPEGs (output of extract_frames.py)
├── embeddings/                # CLIP embedding arrays + metadata (output of embedding scripts)
└── indexes/                   # FAISS index files + metadata copies (output of build scripts)
```

---

# Hardware Utilization

Device selection order (automatic):

```
CUDA GPU (NVIDIA)
   ↓
Apple MPS (Apple Silicon)
   ↓
CPU
```

The CLIP model and encoding run on the selected device. FAISS search runs on CPU.

---

# Retrieval Strategy

| Property | Value |
|---|---|
| Model | CLIP ViT-B/32 |
| Embedding dimension | 512 |
| Similarity metric | Cosine similarity (L2 norm + inner product) |
| Index type | FAISS IndexFlatIP (brute-force) |
| Video index size | 500 vectors |
| Frame index size | ~9,500 vectors |

---

# Current System Status

All features are implemented:

✅ Frame extraction and thumbnail storage
✅ Video-level CLIP embedding generation (mean-pooled)
✅ Per-frame CLIP embedding generation with timestamps
✅ FAISS IndexFlatIP construction (video + frame)
✅ Text-to-video search (`GET /search`)
✅ Text-to-frame search (`GET /search/frames`)
✅ Image-to-video search (`POST /search`)
✅ Video-to-video search (`POST /search/video`)
✅ Frame download (`GET /download/frame`)
✅ Library browser with category filtering
✅ Search history (localStorage)
✅ Video player with filmstrip and playback controls
✅ FastAPI backend with static file serving
✅ React + Vite frontend (Tailwind CSS v4, React Router)
✅ CORS configuration for local development
