# Video Retrieval System — API Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000`  
**Authentication:** None  

A FastAPI-based service for multimodal video retrieval using OpenAI CLIP (ViT-B/32) embeddings and FAISS cosine similarity search. Supports three query modalities: natural language text, example image, and example video.

---

## Endpoints Overview

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `GET` | `/` | Root — server status |
| `GET` | `/library` | List all videos grouped by category |
| `GET` | `/search` | Text-to-video retrieval |
| `GET` | `/search/frames` | Text-to-frame retrieval |
| `POST` | `/search` | Image-to-video retrieval |
| `POST` | `/search/video` | Video-to-video retrieval |
| `GET` | `/download/frame` | Download a matched frame as JPEG |
| `GET` | `/videos/*` | Static video file serving |
| `GET` | `/frames/*` | Static thumbnail serving |

---

## 1. Health Check

```
GET /health
```

Returns a simple liveness indicator. No parameters.

**Example request:**

```bash
curl http://localhost:8000/health
```

**Response `200 OK`:**

```json
{
  "status": "ok"
}
```

---

## 2. Root

```
GET /
```

Returns a message confirming the server is running.

**Example request:**

```bash
curl http://localhost:8000/
```

**Response `200 OK`:**

```json
{
  "message": "Video Retrieval System Running"
}
```

---

## 3. Library

```
GET /library
```

List all videos grouped by category. Built dynamically from the filesystem — no database.

**Example request:**

```bash
curl http://localhost:8000/library
```

**Response `200 OK`:**

```json
{
  "animals": [
    {
      "title": "animals_14.mp4",
      "category": "animals",
      "video_url": "/videos/animals/animals_14.mp4",
      "thumbnail_url": "/frames/animals/animals_14/frame_00000.jpg"
    }
  ],
  "humans": [],
  "indoors": [],
  "nature": [],
  "vehicles": []
}
```

---

## 4. Text-to-Video Search

```
GET /search
```

Encode a natural-language description with CLIP and retrieve the most semantically similar videos from the index.

### Query Parameters

| Parameter | Type | Required | Default | Constraints |
|---|---|---|---|---|
| `query` | `string` | Yes | — | Minimum 1 character |
| `top_k` | `integer` | No | `5` | 1–50 |

### Example Request

```bash
curl "http://localhost:8000/search?query=a+dog+running+on+grass&top_k=3"
```

### Response `200 OK`

```json
{
  "query": "a dog running on grass",
  "results": [
    {
      "rank": 1,
      "video": "animals/animals_14",
      "category": "animals",
      "score": 0.2761,
      "title": "animals_14.mp4",
      "video_url": "/videos/animals/animals_14.mp4",
      "thumbnail_url": "/frames/animals/animals_14/frame_00000.jpg"
    }
  ]
}
```

### Error Responses

| Status | Condition |
|---|---|
| `400` | Empty query string |
| `422` | Missing `query` parameter or `top_k` out of range |
| `500` | Search failure (e.g. index not loaded, model not initialised) |

---

## 5. Image-to-Video Search

```
POST /search
```

Upload an image and retrieve videos with visually similar content. The image is encoded with CLIP and compared against the FAISS index using cosine similarity.

### Request (multipart/form-data)

| Field | Type | Required | Constraints |
|---|---|---|---|
| `image` | file | Yes | JPEG, PNG, WebP, BMP, or TIFF; max 10 MB |
| `top_k` | integer | No (query param) | 1–50, default 5 |

### Supported Image Formats

| Format | MIME Type |
|---|---|
| JPEG | `image/jpeg` |
| PNG | `image/png` |
| WebP | `image/webp` |
| BMP | `image/bmp` |
| TIFF | `image/tiff` |

### Example Request

```bash
curl -X POST "http://localhost:8000/search?top_k=3" \
  -F "image=@query_image.jpg"
```

### Response `200 OK`

```json
{
  "query": "query_image.jpg",
  "results": [
    {
      "video": "animals/animals_14",
      "score": 0.8912,
      "title": "animals_14.mp4",
      "category": "animals",
      "video_url": "/videos/animals/animals_14.mp4",
      "thumbnail_url": "/frames/animals/animals_14/frame_00000.jpg"
    }
  ]
}
```

### Error Responses

| Status | Condition |
|---|---|
| `400` | Missing Content-Type, unsupported format, empty file, or file exceeds 10 MB |
| `422` | Missing `image` field or `top_k` out of range |
| `500` | Embedding generation or search failure |

---

## 6. Video-to-Video Search

```
POST /search/video
```

Upload a video and retrieve the most similar videos from the index.

### Processing Pipeline

```
Uploaded video
  → sample every 30th frame via OpenCV
  → encode each sampled frame with CLIP ViT-B/32
  → mean-pool frame embeddings into a single 512-d vector
  → L2-normalize
  → search FAISS IndexFlatIP (cosine similarity)
  → return top-k results
```

All processing happens in memory. Temporary files are cleaned up after the response is generated.

### Request (multipart/form-data)

| Field | Type | Required | Constraints |
|---|---|---|---|
| `video` | file | Yes | MP4, AVI, MOV, MKV, or WebM; max 200 MB |
| `top_k` | integer | No (query param) | 1–50, default 5 |

### Supported Video Formats

| Format | MIME Type |
|---|---|
| MP4 | `video/mp4` |
| AVI | `video/x-msvideo` |
| MOV | `video/quicktime` |
| MKV | `video/x-matroska` |
| WebM | `video/webm` |

### Example Request

```bash
curl -X POST "http://localhost:8000/search/video?top_k=5" \
  -F "video=@query_video.mp4"
```

### Response `200 OK`

```json
{
  "query": "query_video.mp4",
  "results": [
    {
      "video": "animals/animals_14",
      "score": 0.8231,
      "title": "animals_14.mp4",
      "category": "animals",
      "video_url": "/videos/animals/animals_14.mp4",
      "thumbnail_url": "/frames/animals/animals_14/frame_00000.jpg"
    }
  ]
}
```

### Error Responses

| Status | Condition |
|---|---|
| `400` | Missing Content-Type, unsupported format, empty file, file exceeds 200 MB, or video contains no readable frames |
| `422` | Missing `video` field or `top_k` out of range |
| `500` | Embedding generation or search failure |

---

## 7. Text-to-Frame Search

```
GET /search/frames
```

Encode a natural-language description with CLIP and retrieve the most semantically similar individual frames from the frame-level FAISS index. Results include an approximate timestamp derived from the frame number and sampling interval.

### Query Parameters

| Parameter | Type | Required | Default | Constraints |
|---|---|---|---|---|
| `query` | `string` | Yes | — | Minimum 1 character |
| `top_k` | `integer` | No | `12` | 1–50 |

### Example Request

```bash
curl "http://localhost:8000/search/frames?query=a+dog+running&top_k=3"
```

### Response `200 OK`

```json
{
  "query": "a dog running",
  "results": [
    {
      "frame_url": "/frames/animals/animals_14/frame_00005.jpg",
      "video": "animals/animals_14",
      "video_url": "/videos/animals/animals_14.mp4",
      "timestamp": 5.0,
      "category": "animals",
      "score": 0.3124
    }
  ]
}
```

### Error Responses

| Status | Condition |
|---|---|
| `400` | Empty query string |
| `422` | Missing `query` parameter or `top_k` out of range |
| `500` | Search failure (e.g. frame index not loaded) |

---

## 8. Frame Download

```
GET /download/frame
```

Download a matched frame as a JPEG file. The endpoint validates the path to prevent directory traversal.

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | `string` | Yes | Relative frame path (e.g. `animals/animals_14/frame_00005.jpg`) |

### Example Request

```bash
curl -o frame.jpg "http://localhost:8000/download/frame?path=animals/animals_14/frame_00005.jpg"
```

### Response `200 OK`

Returns the JPEG file with `Content-Disposition: attachment`.

### Error Responses

| Status | Condition |
|---|---|
| `400` | Invalid or traversed path |
| `404` | Frame file not found |

---

## Response Format

All video search endpoints (`GET /search`, `POST /search`, `POST /search/video`) return a JSON object with this structure:

```json
{
  "query": "<query string or filename>",
  "results": [
    {
      "video": "animals/animals_14",
      "score": 0.2761,
      "title": "animals_14.mp4",
      "category": "animals",
      "video_url": "/videos/animals/animals_14.mp4",
      "thumbnail_url": "/frames/animals/animals_14/frame_00000.jpg"
    }
  ]
}
```

The frame search endpoint (`GET /search/frames`) returns a different result schema:

```json
{
  "query": "a dog running",
  "results": [
    {
      "frame_url": "/frames/animals/animals_14/frame_00005.jpg",
      "video": "animals/animals_14",
      "video_url": "/videos/animals/animals_14.mp4",
      "timestamp": 5.0,
      "category": "animals",
      "score": 0.3124
    }
  ]
}
```

### Video Search Fields

| Field | Type | Description |
|---|---|---|
| `query` | `string` | Original query text or uploaded filename |
| `results` | `array` | Ranked list of matching videos (highest score first) |
| `results[].video` | `string` | Video path relative to the dataset (e.g. `"animals/animals_14"`) |
| `results[].score` | `float` | Cosine similarity in [0, 1]. Higher = more similar |
| `results[].title` | `string` | Display filename (e.g. `"animals_14.mp4"`) |
| `results[].category` | `string` | Top-level category (e.g. `"animals"`) |
| `results[].video_url` | `string` | URL to stream the video (e.g. `"/videos/animals/animals_14.mp4"`) |
| `results[].thumbnail_url` | `string` | URL to the first frame thumbnail (e.g. `"/frames/animals/animals_14/frame_00000.jpg"`) |

### Text Search Additional Fields

The text-to-video search (`GET /search`) includes one additional field per result:

| Field | Type | Description |
|---|---|---|
| `rank` | `integer` | 1-based rank position |

### Frame Search Fields

| Field | Type | Description |
|---|---|---|
| `query` | `string` | Original query text |
| `results` | `array` | Ranked list of matching frames |
| `results[].frame_url` | `string` | URL to the matched frame thumbnail |
| `results[].video` | `string` | Parent video path (e.g. `"animals/animals_14"`) |
| `results[].video_url` | `string` | URL to stream the parent video |
| `results[].timestamp` | `float` | Approximate timestamp in seconds |
| `results[].category` | `string` | Top-level category |
| `results[].score` | `float` | Cosine similarity in [0, 1] |

---

## Error Responses

All errors follow a consistent JSON structure:

```json
{
  "detail": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning | Common Causes |
|---|---|---|
| `200` | Success | — |
| `400` | Bad Request | Invalid file type, empty file, file too large, empty query, unreadable video |
| `422` | Unprocessable Entity | Missing required field or parameter, `top_k` out of 1–50 range |
| `500` | Internal Server Error | Model not initialised, FAISS index not found, unexpected runtime failure |

---

## Startup Requirements

Before the server accepts requests it loads these resources at startup:

| Resource | Loaded From |
|---|---|
| CLIP ViT-B/32 model | Automatically downloaded by the `clip` library on first use |
| Video FAISS index | `ml_pipeline/data/indexes/video_index.faiss` |
| Video metadata | `ml_pipeline/data/indexes/video_metadata.json` |
| Frame FAISS index | `ml_pipeline/data/indexes/frame_faiss.index` |
| Frame metadata | `ml_pipeline/data/indexes/frame_metadata.json` |

The server will fail to start if any FAISS index or metadata file is missing. These are produced by running the ML pipeline:

```
python ml_pipeline/extract_frames.py
python ml_pipeline/generate_embeddings.py
python ml_pipeline/build_faiss.py
python ml_pipeline/generate_frame_embeddings.py
```

---

## Notes and Limitations

**Device selection.** The server automatically selects the best available compute device: CUDA → MPS (Apple Silicon) → CPU. CLIP encoding runs on the selected device; FAISS search runs on CPU.

**Frame sampling interval.** Video-to-video search samples every 30th frame, matching the ML pipeline's `FRAME_INTERVAL`. Shorter videos yield fewer frames; a video with fewer than 30 total frames produces at least one embedding.

**Embedding dimension.** All CLIP embeddings are 512-dimensional float32 vectors, L2-normalised so that inner product equals cosine similarity.

**Index type.** The service uses FAISS `IndexFlatIP` (brute-force inner product). At the current scale (500 vectors) search latency is under 0.1 ms. For deployments exceeding 100,000 vectors, consider switching to an IVF or HNSW index.

**Concurrent requests.** The model and index are module-level singletons. CLIP encoding is not thread-safe for concurrent forward passes; for high throughput use a request-level mutex or deploy multiple workers behind a load balancer.

**File size limits.** Images are limited to 10 MB. Videos are limited to 200 MB. These are configurable in `backend/utils.py`.

**No streaming.** The entire request body is read into memory before processing. Large video uploads consume memory proportional to their file size.
