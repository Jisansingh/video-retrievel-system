# Product Requirements Document (PRD)

## Project Name

VidShazam – AI-Powered Video Retrieval System

## Overview

VidShazam is a multimodal video retrieval platform that allows users to find relevant videos using video clips, images, or natural language text queries.

The system uses CLIP embeddings and FAISS similarity search to retrieve semantically similar videos from a large indexed dataset.

---

## Problem Statement

Finding specific videos within large video collections is difficult when users do not know filenames or metadata.

Traditional search systems rely on tags and manual annotations, which are often incomplete or unavailable.

Users should be able to search using visual content or natural language descriptions.

---

## Goals

### Primary Goals

* Support Video-to-Video retrieval
* Support Image-to-Video retrieval
* Support Text-to-Video retrieval
* Return ranked matches with similarity scores
* Provide low-latency retrieval using vector search

### Secondary Goals

* Display timestamps for matching scenes — implemented via frame-level search
* Support large-scale video indexing
* Provide a modern web interface

---

## Target Users

* Content creators
* Video editors
* Researchers
* Media companies
* Students and educators

---

## Functional Requirements

### Video Search

Users can upload a video clip and retrieve similar videos.

Input: MP4, AVI, MOV, MKV, WebM (up to 200 MB)

Output:

* Ranked video matches
* Similarity score
* Video metadata (title, category, video URL, thumbnail URL)

---

### Image Search

Users can upload an image.

The system should:

* Generate CLIP image embeddings
* Search indexed video embeddings
* Return relevant videos

---

### Frame Search

Users can enter a natural language description and retrieve individual frames with timestamps.

The system should:

* Generate CLIP text embeddings
* Search the per-frame FAISS index
* Return matched frames with video source and timestamp

### Text Search

Users can enter a natural language description.

Example:

* "A car driving through a city at night"
* "A person walking in a forest"

The system should:

* Generate CLIP text embeddings
* Search indexed video embeddings
* Return relevant results with title, category, and thumbnail

---

## Non-Functional Requirements

### Performance

* Search latency under 1 second for indexed datasets
* Support at least 500 indexed videos

### Reliability

* Consistent retrieval quality
* Normalized embeddings
* Valid FAISS index

### Scalability

* Support future migration to larger vector databases

---

## Current Architecture

```
Dataset (data/videos/)
  → Frame Extraction (every 30th frame)
  → CLIP Video Embeddings (mean-pooled per video) + FAISS Index
  → CLIP Frame Embeddings (per-frame) + FAISS Index
  → FastAPI Backend (REST API + static file serving)
  → React + Vite Frontend (Tailwind CSS v4)
```

---

## Current Tech Stack

### ML

* OpenAI CLIP ViT-B/32
* PyTorch
* NumPy

### Search

* FAISS IndexFlatIP
* Cosine Similarity

### Backend

* FastAPI
* Uvicorn

### Frontend

* React 19
* Tailwind CSS v4
* Vite 8
* React Router v7
* Axios
* Lucide React (icons)

---

## Success Metrics

* Accurate retrieval results
* Fast response times
* Stable backend APIs
* Successful multimodal search support

---

## Future Enhancements

### Short Term

* Server-side pagination for library
* Advanced filtering (by category, duration, date)
* Retrieval analytics and result diversity

### Long Term

* Quantised FAISS index (IVF / HNSW) for sub-50ms search at scale
* Audio-based retrieval
* Hybrid text + visual search
* Distributed indexing
* User authentication and saved searches
* Docker deployment with CI/CD
