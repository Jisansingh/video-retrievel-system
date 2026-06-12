"""One-shot audit script. Checks normalization, FAISS, retrieval quality, scalability."""

from __future__ import annotations

import json, os, sys, time, math

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

import faiss, numpy as np, torch
import clip

from ml_pipeline.config import (
    FAISS_INDEX_FILE, INDEX_METADATA_FILE, VIDEO_EMBEDDINGS_FILE,
    CLIP_MODEL_NAME, CLIP_EMBEDDING_DIM, DEVICE, DEFAULT_TOP_K,
)

# ── helpers ──────────────────────────────────────────────────────────
def header(s):
    print(f"\n{'='*60}\n  {s}\n{'='*60}")

def ok(s):
    print(f"  PASS  {s}")

def warn(s):
    print(f"  WARN  {s}")

def fail(s):
    print(f"  FAIL  {s}")

# ── 1. Embedding normalization ───────────────────────────────────────
header("1. EMBEDDING NORMALIZATION")

emb = np.load(VIDEO_EMBEDDINGS_FILE).astype(np.float32)
N, D = emb.shape
print(f"  Shape: {N} x {D}")

norms = np.linalg.norm(emb, axis=1)
print(f"  Norms: min={norms.min():.6f}  max={norms.max():.6f}  mean={norms.mean():.6f}  std={norms.std():.6f}")

within_tol = np.all(np.abs(norms - 1.0) < 0.001)
if within_tol:
    ok(f"All {N} vectors L2-normalized (norm=1 ± 0.001)")
else:
    off = np.sum(np.abs(norms - 1.0) >= 0.001)
    fail(f"{off}/{N} vectors NOT normalized. Norm range [{norms.min():.4f}, {norms.max():.4f}]")

# Check for zero vectors
zeros = np.sum(norms < 0.0001)
if zeros > 0:
    fail(f"{zeros} zero vectors found")
else:
    ok("No zero vectors")

# Check for NaN/Inf
nans = np.sum(~np.isfinite(emb))
if nans > 0:
    fail(f"{nans} NaN/Inf values in embeddings")
else:
    ok("No NaN/Inf values")

# ── 2. FAISS index correctness ───────────────────────────────────────
header("2. FAISS INDEX CORRECTNESS")

index = faiss.read_index(FAISS_INDEX_FILE)
meta = json.load(open(INDEX_METADATA_FILE))

print(f"  FAISS ntotal={index.ntotal}  meta_len={len(meta)}  dim={index.d}")

# 2a. Count match
if index.ntotal == len(meta) == N:
    ok(f"Counts match: npy={N}  faiss={index.ntotal}  meta={len(meta)}")
else:
    fail(f"MISMATCH: npy={N}  faiss={index.ntotal}  meta={len(meta)}")

# 2b. Index type
if isinstance(index, faiss.IndexFlatIP):
    ok("Index type: IndexFlatIP (cosine similarity)")
else:
    fail(f"Unexpected index type: {type(index).__name__}")

# 2c. Self-search: every vector should retrieve itself with score ~1.0
self_dist, self_idx = index.search(emb, k=1)
self_hits = np.sum(self_idx.flatten() == np.arange(N))
self_rate = self_hits / N
self_mean_score = self_dist[self_idx.flatten() == np.arange(N)].mean()

print(f"  Self-retrieval: {self_hits}/{N} ({self_rate:.1%})  mean_self_score={self_mean_score:.4f}")
if self_rate >= 0.999:
    ok(f"Self-retrieval perfect ({self_rate:.1%})")
elif self_rate >= 0.95:
    warn(f"Self-retrieval slightly degraded ({self_rate:.1%})")
else:
    fail(f"Self-retrieval broken ({self_rate:.1%})")

# 2d. Check that index vectors are also normalized
recon = index.reconstruct_n(0, index.ntotal)
recon_norms = np.linalg.norm(recon, axis=1)
recon_ok = np.all(np.abs(recon_norms - 1.0) < 0.001)
if recon_ok:
    ok("FAISS stored vectors are L2-normalized")
else:
    fail("FAISS stored vectors NOT L2-normalized")

# 2e. Check npy == faiss reconstructed (within float32)
npy_vs_faiss_diff = np.max(np.abs(emb - recon))
print(f"  Max emb-vs-faiss diff: {npy_vs_faiss_diff:.2e}")
if npy_vs_faiss_diff < 1e-5:
    ok("Embeddings match FAISS stored vectors")
else:
    warn(f"Embeddings differ from FAISS stored vectors (max diff={npy_vs_faiss_diff:.2e})")

# ── 3. Retrieval quality realism ────────────────────────────────────
header("3. RETRIEVAL QUALITY")

# 3a. Category distribution in results
categories = [m.split("/")[0] for m in meta]
cat_counts = {}
for c in categories:
    cat_counts[c] = cat_counts.get(c, 0) + 1
print(f"  Categories: {cat_counts}")

# 3b. Cross-category similarity matrix
def cat_of(idx):
    return categories[idx]

# Build category mask (N x N_cats)
unique_cats = sorted(set(categories))
cat_to_id = {c: i for i, c in enumerate(unique_cats)}
cat_mask = np.zeros((N, len(unique_cats)), dtype=np.float32)
for i, c in enumerate(categories):
    cat_mask[i, cat_to_id[c]] = 1.0

# For each category, get mean intra-cat and inter-cat similarity
intra_sims = []
inter_sims = []
for c in unique_cats:
    c_ids = np.where(np.array(categories) == c)[0]
    if len(c_ids) < 2:
        continue
    c_emb = emb[c_ids]
    c_sim = c_emb @ c_emb.T  # all pairwise within category
    n_c = len(c_ids)
    triu = np.triu_indices(n_c, k=1)
    intra_sims.extend(c_sim[triu].tolist())

    # inter: against first 50 of other categories
    other_ids = np.where(np.array(categories) != c)[0]
    if len(other_ids) > 50:
        other_ids = np.random.default_rng(42).choice(other_ids, 50, replace=False)
    cross = c_emb @ emb[other_ids].T
    inter_sims.extend(cross.flatten().tolist())

intra_mean = np.mean(intra_sims) if intra_sims else 0
inter_mean = np.mean(inter_sims) if inter_sims else 0
print(f"  Intra-category mean cosine: {intra_mean:.4f}")
print(f"  Inter-category mean cosine: {inter_mean:.4f}")
print(f"  Separation ratio: {intra_mean / max(inter_mean, 1e-8):.2f}x")

if intra_mean > inter_mean * 1.5:
    ok(f"Clear intra > inter separation ({intra_mean:.3f} vs {inter_mean:.3f})")
elif intra_mean > inter_mean:
    warn(f"Weak but positive separation ({intra_mean:.3f} vs {inter_mean:.3f})")
else:
    fail(f"No category separation: intra={intra_mean:.3f} inter={inter_mean:.3f}")

# 3c. Text query testing — test that queries return relevant categories
print("\n  Text query tests:")
model, _ = clip.load(CLIP_MODEL_NAME, device=DEVICE)
model.eval()

test_queries = [
    ("car driving on road", "vehicles"),
    ("person walking", "humans"),
    ("a dog or cat animal", "animals"),
    ("mountain landscape sunset", "nature"),
    ("living room furniture interior", "indoors"),
    ("forest trees green", "nature"),
    ("office desk computer", "indoors"),
    ("bird flying sky", "animals"),
    ("truck bus transportation", "vehicles"),
    ("people crowd group", "humans"),
]
correct_top1 = 0
correct_top5 = 0
for text, expected_cat in test_queries:
    tokens = clip.tokenize([text], truncate=True).to(DEVICE)
    with torch.no_grad():
        t_emb = model.encode_text(tokens).cpu().numpy().astype(np.float32)
    t_emb = t_emb / np.linalg.norm(t_emb, axis=1, keepdims=True)
    dist, idx = index.search(t_emb, k=5)
    top_cats = [categories[i] for i in idx[0]]
    top1 = top_cats[0]
    hit = "HIT" if expected_cat in top_cats else "MISS"
    if top1 == expected_cat:
        hit += " (top1)"
        correct_top1 += 1
    if expected_cat in top_cats:
        correct_top5 += 1
    print(f"    {hit:>14s}  '{text}' -> top1={top1}  top5={top_cats}")

print(f"\n  Top-1 accuracy: {correct_top1}/{len(test_queries)} ({correct_top1/len(test_queries):.0%})")
print(f"  Top-5 accuracy: {correct_top5}/{len(test_queries)} ({correct_top5/len(test_queries):.0%})")

if correct_top1 >= 7:
    ok(f"Strong text-to-video retrieval ({correct_top1}/10 top-1 correct)")
elif correct_top1 >= 5:
    warn(f"Adequate text retrieval ({correct_top1}/10 top-1 correct)")
else:
    fail(f"Poor text retrieval ({correct_top1}/10 top-1 correct)")

# 3d. Score distribution sanity — not all scores near 1.0 or 0.0
all_scores = self_dist.flatten()
print(f"\n  Score distribution: min={all_scores.min():.4f} max={all_scores.max():.4f} mean={all_scores.mean():.4f} std={all_scores.std():.4f}")
pct_high = np.mean(all_scores > 0.99)
pct_low = np.mean(all_scores < 0.1)
print(f"  Scores >0.99: {pct_high:.1%}   Scores <0.1: {pct_low:.1%}")

# 3e. Check for duplicate/near-identical embeddings
sim = emb @ emb.T
np.fill_diagonal(sim, 0)
max_offdiag = sim.max()
above_995 = np.sum(sim > 0.995) // 2  # divide by 2 (symmetric)
above_99 = np.sum(sim > 0.99) // 2
print(f"\n  Duplicate check (off-diagonal cosine pairs):")
print(f"    Pairs >0.995: {above_995}")
print(f"    Pairs >0.990: {above_99}")
print(f"    Max off-diagonal similarity: {max_offdiag:.6f}")

if above_995 == 0:
    ok("No near-duplicate embeddings")
elif above_995 < 5:
    warn(f"{above_995} near-duplicate pairs found (>0.995)")
else:
    fail(f"{above_995} near-duplicate pairs — data leakage likely")

# ── 4. Scalability ──────────────────────────────────────────────────
header("4. SCALABILITY & PERFORMANCE")

# 4a. FAISS search latency
warmup = 3
iters = 50
query = emb[:1].copy()
for _ in range(warmup):
    index.search(query, k=5)

times = []
for _ in range(iters):
    t0 = time.perf_counter()
    index.search(query, k=5)
    times.append(time.perf_counter() - t0)

latency_ms = np.mean(times) * 1000
print(f"  IndexFlatIP search latency: {latency_ms:.3f}ms (mean of {iters}, k=5, {N} vectors)")

# 4b. Projected latency at larger scales
def flatip_latency_ms(n, d, k):
    # O(n*d) brute force: each dot product is d ops, n vectors
    ops = n * d
    # Calibrate from our measurement
    our_ops = N * CLIP_EMBEDDING_DIM
    scale = ops / our_ops
    return latency_ms * scale

scales = [1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000]
print(f"\n  Projected IndexFlatIP latency (linear extrapolation):")
for s in scales:
    est = flatip_latency_ms(s, CLIP_EMBEDDING_DIM, 5)
    flag = " <<< SUB-10ms" if est < 10 else (" <<< SUB-100ms" if est < 100 else " !!! TOO SLOW")
    print(f"    {s:>10,d} vectors → {est:8.2f}ms{flag}")

# 4c. Memory usage estimate
emb_bytes = N * D * 4  # float32
index_bytes = N * D * 4  # FAISS FlatIP stores full matrix
meta_bytes = sys.getsizeof(meta) + sum(sys.getsizeof(m) for m in meta)
print(f"\n  Memory (current):")
print(f"    Embeddings:  {emb_bytes/1024/1024:.1f} MB")
print(f"    FAISS index: {index_bytes/1024/1024:.1f} MB")
print(f"    Metadata:    {meta_bytes/1024:.1f} KB")
print(f"    Total:       {(emb_bytes + index_bytes + meta_bytes)/1024/1024:.1f} MB")

for s in scales:
    mem = (s * D * 4 * 2) / 1024 / 1024  # embeddings + index
    flag = " OK" if mem < 1000 else (" TIGHT" if mem < 4000 else " !!! NEED GPU")
    print(f"    {s:>10,d} vectors → {mem:8.0f} MB{flag}")

# 4d. MPS check
print(f"\n  Device: {DEVICE}")
if DEVICE == "mps":
    ok("MPS (Apple Silicon) active")
elif DEVICE == "cuda":
    ok("CUDA active")
else:
    warn(f"CPU-only — CLIP encoding will be slow ({DEVICE})")

# 4e. Index type recommendation
print(f"\n  Index recommendation for {N} vectors:")
if N < 10_000:
    print(f"    IndexFlatIP is fine (N={N})")
elif N < 100_000:
    print(f"    Consider IVF{N//1000},Flat for {N} vectors")
else:
    print(f"    Switch to IVF{PQ} or HNSW for {N} vectors")

# ── Summary ──────────────────────────────────────────────────────────
header("SUMMARY")
checks = [
    ("Normalization", within_tol and zeros == 0 and nans == 0),
    ("FAISS count match", index.ntotal == len(meta) == N),
    ("Self-retrieval", self_rate >= 0.999),
    ("FAISS vectors normalized", recon_ok),
    ("Category separation", intra_mean > inter_mean),
    ("Text retrieval top-1", correct_top1 >= 7),
    ("No duplicates", above_995 == 0),
    ("MPS/CUDA active", DEVICE in ("mps", "cuda")),
]
all_ok = True
for name, passed in checks:
    if passed:
        print(f"  [OK]    {name}")
    else:
        print(f"  [ISSUE] {name}")
        all_ok = False

if all_ok:
    print("\n  ML Pipeline: ALL CHECKS PASSED")
else:
    print("\n  ML Pipeline: ISSUES FOUND — review above")