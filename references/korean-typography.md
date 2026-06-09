# Korean typography — card-news-harness

Rules for legible, consistent Korean text on a 1080×1350 (4:5) card. The Generator honors
the character-count ceilings and line-break rules here; the Evaluator probes against them.

---

## Font: Pretendard (bundled, OFL)

- **Pretendard** is the default. It is bundled in `assets/fonts/` and loaded by `base.css`
  via `@font-face` from a **relative** `url(...)`, so rendering is **offline and
  deterministic** — `render.mjs` waits for `document.fonts.ready` before the screenshot, so
  there is no fallback-font flash and line breaks are stable.
- Weights available: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold, 800 ExtraBold,
  900 Black.
- **Fallback stack** (in `--font`): `-apple-system, "Apple SD Gothic Neo", "Malgun Gothic",
  "Noto Sans KR", sans-serif`. If the bundled file is ever missing, text still renders in the
  OS Korean font — but metrics shift, so the Evaluator's per-PNG read matters more.
- **나눔스퀘어네오 (NanumSquare Neo)** — OFL; an acceptable alt headline face if a project
  wants a chunkier look (not bundled). **Gmarket Sans** — has its **own** license; referenced
  by name only, **never bundle without the user confirming its license**.

## Recommended sizes / weights per card role

`base.css` ships these defaults; the Generator may nudge a single card to fit, but should
keep the set consistent.

| Role | Class | Size | Weight |
|------|-------|------|--------|
| Cover headline | `.headline.big` | 100px | 800 ExtraBold |
| Body headline | `.headline` | 86px | 800 |
| List core | `.list-core` | 76px | 800 |
| Quote text | `.quote-text` | 76px | 800 |
| Compare panel text | `.cmp-text` | 50–52px | 700 |
| Big figure (stat) | `.figure` | 280px | 900 Black |
| Body copy | `.body` | 44px | 500 Medium |
| Kicker / label | `.kicker` | 34px | 700 |
| Sub-note / source | `.subnote` / source | 30–32px | 500 |
| Page indicator | `.page-indicator` | 30px | 700/800 |

Hierarchy rule: each card has exactly **one** dominant element (headline OR figure OR quote).
Don't make two things shout.

## 4:5 safe-area spec

- Card box: **1080 × 1350**. Safe-area padding: **96px** on all sides (`--safe`), applied by
  the `.safe` box. ALL copy and key graphics live inside `.safe`.
- The page indicator sits at top-right inside the safe inset; the brand row at bottom-left;
  the swipe cue at bottom-right. None of them touch the physical edge.
- Instagram/Threads can crop a few px at the edges in some views — the 96px margin absorbs
  that. **Nothing important within ~96px of any edge.**

## Per-card character-count CEILINGS (1080×1350, Pretendard)

These keep text on-card and overflow-free. They are ceilings, not targets — shorter is
usually better. "KR chars" counts Hangul syllables (spaces count loosely; punctuation light).

| Element | Ceiling | Note |
|---------|---------|------|
| Cover headline | **≤ 22 KR chars** (≤ 2 lines) | break into 2 balanced lines |
| Body card headline | **≤ 28 KR chars** (≤ 2 lines) | list-core / step-headline |
| Body copy paragraph | **≤ 90 KR chars** (≤ 3 lines) | the `.body` sub-note |
| Compare panel line | **≤ 38 KR chars** (≤ 2 lines) | per ❌/⭕ panel |
| Quote sentence | **≤ 32 KR chars** (≤ 2 lines) | one sentence only |
| Stat meaning line | **≤ 36 KR chars** (≤ 2 lines) | under the big figure |
| Stat figure | **≤ 4 glyphs** + unit | e.g. "23분", "1.2억" |
| CTA action pill | **≤ 22 KR chars** each | one line per pill |
| Kicker / label | **≤ 14 KR chars** | one line |
| Source line | **≤ 40 KR chars** | one line; wrap allowed |

If a sentence exceeds its ceiling: cut filler words first, then split the card, then (last
resort) drop the font a notch. Never let the renderer's `overflow:hidden` "save" you by
clipping — clipped text is a hard fail.

## Line-break rules for Korean

- **`word-break: keep-all`** is set on every text class so Korean breaks on **어절(word)**
  boundaries, never mid-eojeol. Keep it.
- **Balance two-line headlines** by hand: insert `<br>` at a natural phrase boundary so the
  two lines are close in length and a particle (조사: 은/는/이/가/을/를) never starts a line.
  - Good: "하루 8시간 일하는데<br>왜 늘 시간이 부족할까?"
  - Bad:  "하루 8시간 일하는데 왜 늘<br>시간이 부족할까?" (breaks awkwardly, "늘" dangles)
- Don't strand a single short syllable on its own line. Don't break a number from its unit
  ("23<br>분" ❌).
- Prefer ≤ 2 lines for headlines, ≤ 3 for body. More lines = denser = harder to scan.

## Emphasis conventions (use ONE per card at most)

`base.css` provides these utilities; over-using them flattens the emphasis.

- **형광펜 하이라이트 `.hl`** — highlighter wash behind a phrase (sits at 52% height so it
  reads as a marker stroke). Best for the single most important phrase on a card.
- **키워드 컬러 `.kw`** — accent-colored, ExtraBold keyword. Use for a number or the noun the
  card is about.
- **포인트 컬러 `.pt`** — point-colored keyword. Reserve for warnings / the ❌ side / urgency.
- **밑줄 강조 `.ul`** — thick accent underline. An alternative to `.hl` for a cleaner look.

Rule of thumb: emphasize **one** thing per card. If everything is emphasized, nothing is.
Keep the emphasis color consistent with `brand.json` across the whole set (a drifting accent
is a C2 consistency failure).
