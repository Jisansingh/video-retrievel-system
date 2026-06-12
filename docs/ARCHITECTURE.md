# System Architecture

## Overview

The Video Retrieval System is a multimodal search platform that enables users to retrieve videos using:

* Video queries
* Image queries
* Natural language text queries

The system uses CLIP embeddings for semantic understanding and FAISS for efficient similarity search.

---

# High-Level Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
      Video               Image               Text
      Query               Query              Query
         │                   │                   │
         └──────────► CLIP Encoder ◄────────────┘
                            │
                            ▼
                    Query Embedding
                            │
                            ▼
                     FAISS Search
                            │
                            ▼
                   Ranked Retrievals
                            │
                            ▼
                     FastAPI Backend
                            │
                            ▼
                        Frontend
```

---

# Data Processing Pipeline

The system uses an offline indexing pipeline.

```text
Videos
   │
   ▼
Frame Extraction
   │
   ▼
Frame Embeddings
   │
   ▼
Video Embeddings
   │
   ▼
FAISS Index
```

---

# Component Architecture

## 1. Dataset Layer

Location:

```text
ml_pipeline/data/videos/
```

Contains:

* Source video files
* Organized video dataset
* Input for indexing pipeline

Current dataset:

* Animals
* Humans
* Indoors
* Nature
* Vehicles

---

## 2. Frame Extraction Layer

File:

```text
ml_pipeline/extract_frames.py
```

Responsibilities:

* Load videos
* Extract frames at fixed intervals
* Save extracted frames

Output:

```text
ml_pipeline/data/frames/
```

Purpose:

Reduce processing cost while preserving video content.

---

## 3. Embedding Generation Layer

File:

```text
ml_pipeline/generate_embeddings.py
```

Model:

CLIP ViT-B/32

Responsibilities:

* Load extracted frames
* Generate image embeddings
* Aggregate frame embeddings
* Produce a single video embedding

Output:

```text
video_embeddings.npy
video_metadata.json
```

Embedding Size:

```text
512 dimensions
```

---

## 4. Index Construction Layer

File:

```text
ml_pipeline/build_faiss.py
```

Responsibilities:

* Load video embeddings
* Normalize vectors
* Build similarity index

FAISS Configuration:

```text
Index Type:
IndexFlatIP

Similarity:
Cosine Similarity
```

Output:

```text
video_index.faiss
```

---

## 5. Search Layer

Files:

```text
backend/search.py
ml_pipeline/search_index.py
```

Responsibilities:

* Receive query embeddings
* Search FAISS index
* Rank results
* Return similarity scores

---

# Search Workflows

## Image-to-Video Search

```text
Image Upload
      │
      ▼
CLIP Image Encoder
      │
      ▼
512-D Embedding
      │
      ▼
FAISS Search
      │
      ▼
Top Matching Videos
```

---

## Text-to-Video Search

```text
Text Query
      │
      ▼
CLIP Text Encoder
      │
      ▼
512-D Embedding
      │
      ▼
FAISS Search
      │
      ▼
Top Matching Videos
```

---

## Video-to-Video Search

```text
Video Query
      │
      ▼
Frame Extraction
      │
      ▼
CLIP Embeddings
      │
      ▼
Video Embedding
      │
      ▼
FAISS Search
      │
      ▼
Top Matching Videos
```

---

# Backend Architecture

Directory:

```text
backend/
```

Components:

### main.py

Responsibilities:

* FastAPI application
* API routes
* Request handling

### model.py

Responsibilities:

* CLIP model loading
* Device management

### search.py

Responsibilities:

* Retrieval execution
* Similarity ranking

### utils.py

Responsibilities:

* Shared helper functions

---

# API Layer

Current Search Endpoints:

```text
POST /search
```

Image-to-video retrieval.

```text
GET /search
```

Text-to-video retrieval.

Returns:

* Video path
* Similarity score
* Ranked results

---

# Storage Architecture

```text
ml_pipeline/data/
├── videos/
├── frames/
├── embeddings/
└── indexes/
```

Purpose:

* videos → source dataset
* frames → extracted frames
* embeddings → CLIP vectors
* indexes → FAISS index

---

# Hardware Utilization

Device Selection Order:

```text
CUDA GPU
     ↓
Apple MPS
     ↓
CPU
```

Automatic fallback is implemented.

---

# Retrieval Strategy

Model:

```text
CLIP ViT-B/32
```

Vector Size:

```text
512
```

Similarity Metric:

```text
Cosine Similarity
```

Index:

```text
FAISS IndexFlatIP
```

Benefits:

* Fast retrieval
* Semantic understanding
* Multimodal search support

---

# Future Architecture Enhancements

## Phase 2

* Scene-level indexing
* Timestamp retrieval
* Thumbnail generation
* Metadata database

## Phase 3

* Audio embeddings
* Hybrid search
* Distributed indexing
* Vector database integration
* User authentication

---

# Current System Status

Implemented:

✅ Frame extraction

✅ CLIP embedding generation

✅ FAISS indexing

✅ Image-to-video search

✅ Text-to-video search

✅ FastAPI backend

Planned:

⬜ Frontend integration

⬜ Video-to-video UI workflow

⬜ Advanced retrieval features
