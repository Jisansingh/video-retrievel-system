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

* Display timestamps for matching scenes
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

Input:

* MP4
* AVI
* MOV

Output:

* Ranked video matches
* Similarity score
* Video metadata

---

### Image Search

Users can upload an image.

The system should:

* Generate CLIP image embeddings
* Search indexed video embeddings
* Return relevant videos

---

### Text Search

Users can enter a natural language description.

Example:

* "A car driving through a city at night"
* "A person walking in a forest"

The system should:

* Generate CLIP text embeddings
* Search indexed video embeddings
* Return relevant results

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

Dataset
→ Frame Extraction
→ CLIP Embeddings
→ Mean Pooling
→ FAISS Index
→ FastAPI Backend
→ Frontend UI

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

### Frontend (Planned)

* React
* TailwindCSS

---

## Success Metrics

* Accurate retrieval results
* Fast response times
* Stable backend APIs
* Successful multimodal search support

---

## Future Enhancements

### Phase 2

* Scene-level retrieval
* Better timestamp precision
* Thumbnail generation
* Metadata database

### Phase 3

* Audio-based retrieval
* Hybrid text + visual search
* Distributed indexing
* User accounts and saved searches
