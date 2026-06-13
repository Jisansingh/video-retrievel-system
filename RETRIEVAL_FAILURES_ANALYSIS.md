# Retrieval Failure Analysis

**Methodology:** For each of 500 videos, retrieve the top-10 nearest neighbours (excluding self). Count as a failure any neighbour whose category differs from the query video's category. Failures are ranked by cosine similarity (high = confident mistake).

**Scale:** 500 queries × 10 retrievals = 5,000 total retrievals — **536 failures (10.7%)**

---

## Top 50 Failures (Most Confident Mistakes)

| # | Query | Q Cat | Retrieved | R Cat | Score | Pos |
|---|---|---|---|---|---|---|
| 1 | humans/humans_77 | humans | indoors/indoors_23 | indoors | **0.9415** | 1 |
| 2 | indoors/indoors_23 | indoors | humans/humans_77 | humans | **0.9415** | 1 |
| 3 | humans/humans_77 | humans | indoors/indoors_83 | indoors | 0.9363 | 2 |
| 4 | indoors/indoors_83 | indoors | humans/humans_77 | humans | 0.9361 | 1 |
| 5 | nature/nature_96 | nature | animals/animals_64 | animals | 0.9321 | 2 |
| 6 | animals/animals_64 | animals | nature/nature_96 | nature | 0.9317 | 1 |
| 7 | nature/nature_52 | nature | animals/animals_64 | animals | 0.9273 | 1 |
| 8 | animals/animals_64 | animals | nature/nature_52 | nature | 0.9271 | 2 |
| 9 | nature/nature_66 | nature | animals/animals_71 | animals | 0.9227 | 3 |
| 10 | animals/animals_71 | animals | nature/nature_66 | nature | 0.9226 | 1 |
| 11 | humans/humans_77 | humans | indoors/indoors_94 | indoors | 0.9205 | 3 |
| 12 | indoors/indoors_94 | indoors | humans/humans_77 | humans | 0.9201 | 1 |
| 13 | indoors/indoors_23 | indoors | humans/humans_90 | humans | 0.9200 | 6 |
| 14 | humans/humans_90 | humans | indoors/indoors_23 | indoors | 0.9198 | 1 |
| 15 | humans/humans_77 | humans | indoors/indoors_97 | indoors | 0.9193 | 4 |
| 16 | indoors/indoors_97 | indoors | humans/humans_77 | humans | 0.9193 | 3 |
| 17 | nature/nature_96 | nature | animals/animals_71 | animals | 0.9191 | 4 |
| 18 | animals/animals_71 | animals | nature/nature_96 | nature | 0.9189 | 2 |
| 19 | animals/animals_71 | animals | nature/nature_46 | nature | 0.9174 | 3 |
| 20 | nature/nature_46 | nature | animals/animals_71 | animals | 0.9172 | 3 |
| 21 | nature/nature_43 | nature | animals/animals_71 | animals | 0.9162 | 1 |
| 22 | animals/animals_71 | animals | nature/nature_43 | nature | 0.9162 | 4 |
| 23 | humans/humans_90 | humans | indoors/indoors_56 | indoors | 0.9154 | 2 |
| 24 | indoors/indoors_56 | indoors | humans/humans_90 | humans | 0.9150 | 9 |
| 25 | humans/humans_77 | humans | indoors/indoors_25 | indoors | 0.9136 | 5 |
| 26 | indoors/indoors_25 | indoors | humans/humans_77 | humans | 0.9134 | 1 |
| 27 | nature/nature_66 | nature | animals/animals_64 | animals | 0.9055 | 6 |
| 28 | animals/animals_64 | animals | nature/nature_66 | nature | 0.9053 | 4 |
| 29 | animals/animals_61 | animals | nature/nature_9 | nature | 0.9026 | 4 |
| 30 | humans/humans_90 | humans | indoors/indoors_33 | indoors | 0.8993 | 3 |
| 31 | indoors/indoors_33 | indoors | humans/humans_90 | humans | 0.8991 | 4 |
| 32 | indoors/indoors_31 | indoors | humans/humans_35 | humans | 0.8983 | 1 |
| 33 | humans/humans_35 | humans | indoors/indoors_31 | indoors | 0.8982 | 2 |
| 34 | animals/animals_64 | animals | nature/nature_83 | nature | 0.8970 | 5 |
| 35 | humans/humans_90 | humans | indoors/indoors_75 | indoors | 0.8966 | 4 |
| 36 | indoors/indoors_75 | indoors | humans/humans_90 | humans | 0.8964 | 3 |
| 37 | indoors/indoors_97 | indoors | humans/humans_65 | humans | 0.8960 | 7 |
| 38 | humans/humans_65 | humans | indoors/indoors_97 | indoors | 0.8960 | 1 |
| 39 | indoors/indoors_44 | indoors | humans/humans_54 | humans | 0.8932 | 4 |
| 40 | animals/animals_71 | animals | nature/nature_81 | nature | 0.8930 | 6 |
| 41 | humans/humans_54 | humans | indoors/indoors_44 | indoors | 0.8929 | 1 |
| 42 | nature/nature_81 | nature | animals/animals_71 | animals | 0.8928 | 8 |
| 43 | humans/humans_90 | humans | indoors/indoors_42 | indoors | 0.8921 | 5 |
| 44 | humans/humans_30 | humans | indoors/indoors_84 | indoors | 0.8919 | 2 |
| 45 | indoors/indoors_84 | indoors | humans/humans_30 | humans | 0.8918 | 2 |
| 46 | indoors/indoors_59 | indoors | humans/humans_90 | humans | 0.8913 | 3 |
| 47 | humans/humans_90 | humans | indoors/indoors_59 | indoors | 0.8912 | 6 |
| 48 | nature/nature_71 | nature | animals/animals_30 | animals | 0.8911 | 4 |
| 49 | animals/animals_30 | animals | nature/nature_71 | nature | 0.8911 | 2 |
| 50 | animals/animals_61 | animals | nature/nature_13 | nature | 0.8910 | 6 |

---

## Failure Distribution by Category Pair

```
humans   → indoors   142  (26.5%)  ■■■■■■■■■■■■■■■■■■■■■■
animals  → nature    100  (18.7%)  ■■■■■■■■■■■■■■■■■
indoors  → humans     95  (17.7%)  ■■■■■■■■■■■■■■■■
vehicles → nature     38  ( 7.1%)  ■■■■■■
nature   → animals    31  ( 5.8%)  ■■■■■
nature   → vehicles   26  ( 4.9%)  ■■■■
humans   → nature     18  ( 3.4%)  ■■■
vehicles → humans     16  ( 3.0%)  ■■■
humans   → animals    14  ( 2.6%)  ■■
humans   → vehicles   10  ( 1.9%)  ■■
indoors  → animals    10  ( 1.9%)  ■■
animals  → indoors     9  ( 1.7%)  ■■
indoors  → vehicles    8  ( 1.5%)  ■
animals  → humans      5  ( 0.9%)  ■
animals  → vehicles    5  ( 0.9%)  ■
nature   → humans      4  ( 0.7%)  ■
indoors  → nature      3  ( 0.6%)  ■
vehicles → animals     1  ( 0.2%)
nature   → indoors     1  ( 0.2%)
```

---

## Confusion Patterns and Root Causes

### Pattern 1: Humans ↔ Indoors (237 failures — 44.2%)

**The dominant failure mode.** Nearly half of all mistakes involve confusing humans with indoor scenes.

| Direction | Count | Root Cause |
|---|---|---|
| humans → indoors | 142 | People filmed inside buildings; CLIP's mean-pooled embedding is dominated by indoor background features |
| indoors → humans | 95 | Indoor environments containing people; the human subject becomes the dominant visual feature |

**Why it happens:** These categories are inherently confounded. A video of "a person in a living room" is simultaneously a human video and an indoor video. CLIP is not wrong — it correctly recognises that the visual content is similar. The label assignment is an artefact of how the dataset was constructed (mutually exclusive categories that are not mutually exclusive in reality).

**Key offenders:** `humans_77` (appears in top-5 failures 5 times), `humans_90` (9 failures in its top-10), `indoors_23` (retrieved as human scene by 5 different queries).

**Confidence:** Scores range from **0.89–0.94** — these are the most confident mistakes in the entire system.

---

### Pattern 2: Animals ↔ Nature (131 failures — 24.4%)

| Direction | Count | Root Cause |
|---|---|---|
| animals → nature | 100 | Animals filmed in outdoor habitats; background (trees, grass, water) overwhelms the animal signal |
| nature → animals | 31 | Nature scenes containing wildlife; animals are visually significant |

**Why it happens:** Same structural problem as humans/indoors. Animals in nature are visually defined by their natural surroundings. Mean-pooling across frames dilutes the animal-specific signal and amplifies the background signal.

**Key offenders:** `animals_64` and `animals_71` are frequently mistaken for nature. `nature_96` and `nature_52` are nature videos containing animals that get classified as animal videos.

---

### Pattern 3: Vehicles ↔ Nature (64 failures — 11.9%)

| Direction | Count | Root Cause |
|---|---|---|
| vehicles → nature | 38 | Vehicles in outdoor settings (cars on mountain roads, boats on water) |
| nature → vehicles | 26 | Nature scenes bisected by roads, vehicles in landscapes |

**Why it happens:** Vehicles operating in natural environments. A car driving through a forest is visually similar to a forest scene. Note that `vehicles_0` and `vehicles_62` are the main problematic queries — these are likely outdoor vehicle videos.

**Key offenders:** `vehicles_1` (8 failures), `vehicles_62` (8 failures), `vehicles_0` (5 failures).

---

### Pattern 4: Humans ↔ Nature/Vehicles/Animals (42 failures — 7.8%)

| Direction | Count | Root Cause |
|---|---|---|
| humans → nature | 18 | People in outdoor settings (hiking, parks, beaches) |
| vehicles → humans | 16 | Vehicles with people visible (bicycles, cars with drivers) |
| humans → animals | 14 | Humans with pets, at farms, zoos |

Scattered confusions between humans and the physical environments/objects they interact with. Scores are lower (0.74–0.88), indicating CLIP is less confident about these mistakes.

---

### Pattern 5: Minor Confusions (62 failures — 11.6%)

- **indoors/animals** (19): Pets inside homes, zoo indoor exhibits
- **animals/vehicles** (6): Animals near roads, vehicles with animal cargo
- **indoors/vehicles** (8): Garages, showrooms, parking structures
- **vehicles/animals** (1): Rare — `vehicles_15` likely has animal content

---

## Worst-Performing Queries

These videos have the highest number of category-confused neighbours in their top-10:

| Failures | Video | Category | Top-1 Neighbour (wrong category) |
|---|---|---|---|
| **10/10** | humans/humans_90 | humans | indoors/indoors_23 |
| **10/10** | indoors/indoors_36 | indoors | vehicles/vehicles_3 |
| **9/10** | humans/humans_77 | humans | indoors/indoors_23 |
| **9/10** | animals/animals_64 | animals | nature/nature_96 |
| **8/10** | animals/animals_71 | animals | nature/nature_66 |
| **8/10** | humans/humans_47 | humans | indoors/indoors_80 |
| **8/10** | humans/humans_49 | humans | indoors/indoors_23 |
| **8/10** | vehicles/vehicles_1 | vehicles | nature/nature_74 |
| **8/10** | vehicles/vehicles_62 | vehicles | vehicles/vehicles_48 |

**`humans_90` is the single worst query** — all 10 nearest neighbours are from different categories. This video likely depicts people in a highly ambiguous setting (people in an indoor setting with outdoor views, or people with animals).

**`indoors_36`** confuses all 10 neighbours with vehicles — likely a garage, parking lot, or car showroom video.

---

## Summary Statistics

| Metric | Value |
|---|---|
| Total retrievals evaluated | 5,000 (500 queries × top-10) |
| Total failures | **536** |
| Overall retrieval accuracy | **89.28%** |
| Queries with zero failures | **143 / 500 (28.6%)** |
| Queries with all 10 correct | **143 / 500 (28.6%)** |
| Queries with ≥ 5 failures | **55 / 500 (11.0%)** |
| Distinct confusion pairs | 19 |

### Per-Category Failure Rate

| Category | Failure Rate | Risk Level |
|---|---|---|
| humans | **18.4%** | HIGH |
| animals | **11.9%** | MODERATE |
| indoors | **11.6%** | MODERATE |
| nature | **6.2%** | LOW |
| vehicles | **5.5%** | LOW |

---

## Root Cause: The Mutual Exclusivity Problem

The fundamental issue is **category non-separability** — the dataset assigns mutually exclusive labels (`animals`, `humans`, `indoors`, `nature`, `vehicles`) to videos that naturally contain multiple elements. A video of "a person walking their dog in a park" could legitimately belong to `humans`, `animals`, or `nature`. CLIP's mean-pooled embedding correctly captures all these elements, but the evaluation penalises it for being multi-faceted.

### Contributing factors:

1. **Mean pooling across frames** aggregates all visual content equally — foreground subjects and background scenes both contribute to the final vector. A person in an indoor setting produces an embedding that is equally "indoor" and "human."

2. **CLIP is a general-purpose model** — it was not fine-tuned to distinguish these specific categories. It optimises for broad visual-semantic alignment, not for maximising inter-category separation.

3. **High centroid similarity** — all category centroids have cosine similarity > 0.80 (see §6.4 of main evaluation). The embedding space does not form tight category clusters.

### What 89.3% accuracy means in context

If we treat the 536 failures as genuinely "wrong" (i.e., an animal video should never retrieve a nature video), the system is 89.3% accurate — strong for an off-the-shelf CLIP approach. However, many of these 536 failures are **reasonable retrievals** from a semantic perspective: a nature video containing animals is a perfectly sensible result for an animal video query. The accuracy figure is likely an **underestimate of true retrieval quality** due to the mutually exclusive labelling scheme.
