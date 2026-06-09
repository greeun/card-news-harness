# Rubric — card-news-harness

The Evaluator scores a finished card-news set against these **4 criteria**, each **1–5**.
Two criteria are weighted **2×** because they sit on Claude's weakest-by-default axes
(`hook originality + natural Korean copy`, and `visual craft`). The other two are 1×
because Claude handles them mechanically well (logical ordering; fixed dimension + source
checking). Criteria are written as **qualities, not references** — no "museum-quality",
no brand names. Those belong in `spec.md`, never here (Style-Magnet warning).

---

## Criteria

| # | Criterion | Weight | What it measures |
|---|-----------|--------|------------------|
| **C1** | **표지 후크력 & 카피 독창성** (Cover hook & Korean copy craft) | **2×** | Does card 1 actually stop the scroll — a concrete number, a real question, or a surprising stat (not "카드뉴스로 알아보는 OO")? Is the Korean copy natural and tonally consistent across all cards, free of AI-slop clichés ("요즘 핫한…", "꼭 알아야 할!", "여러분") and 번역체 ("당신은 ~할 필요가 있습니다")? |
| **C2** | **가독성 & 비주얼 일관성** (Readability & visual consistency) | **2×** | One card = one message. Per-card character-count ceilings respected. **Zero text overflow / truncation** in the rendered PNG. Palette, fonts, margins, and the page indicator are unified across every card. Comfortable hierarchy and spacing rhythm. |
| **C3** | **흐름 & 이어보기** (Flow & continuation pull) | 1× | Logical card-to-card progression; each card gives a reason to swipe to the next; a coherent arc cover → body → CTA. |
| **C4** | **플랫폼 적합 & 사실 정확성** (Platform fit & factual accuracy) | 1× | Every PNG is exactly 1080×1350 with content inside the safe area; page indicator `N/총장수` on all body cards; the last card has a CTA + source; every numeric/quote claim is sourced or `ASSUMPTION:`-labeled. |

### Why C1 and C2 get 2×
Claude already scores well by default on **C3** (it orders content logically) and **C4**
(dimension is a fixed number; source-checking is procedural). What it lacks without
explicit pressure is (a) a cover that genuinely stops the scroll plus Korean copy that
reads like a specific human author — left alone it emits grammatical-but-generic filler
and weak hooks; and (b) visual craft held *consistent across a whole set* with no overflow.
Those two axes carry double weight.

---

## Scoring guide (per criterion)

| Score | Meaning |
|-------|---------|
| 5 | Exceeds — a picky art-director + copy-editor would be impressed |
| 4 | Meets — solid, ship-ready |
| 3 | Acceptable but noticeably weak — needs work |
| 2 | Below bar — significant gaps |
| 1 | Unacceptable — fundamental problems |

Concrete 1/3/5 anchors per criterion live in `evaluator-calibration.md`. Read them before
scoring; they prevent score drift across iterations.

---

## Verdict logic (frozen)

```
All 4 criteria ≥ 4  AND  all adversarial probes clean  AND  no unresolved hard-fail → PASS
Any 2×-weighted criterion (C1 or C2) < 4   → FAIL
Any 1×-weighted criterion (C3 or C4) < 3   → FAIL
Any Definition-of-Done item unverified     → FAIL
```

## Hard fails (immediate reject, regardless of scores)

These are observable/binary. Any one present = FAIL, even if every rubric score is high:

1. **Text overflow / truncation** in any rendered PNG (judged from the image, not the HTML).
2. **Safe-area violation** — content touching or exceeding the safe margin.
3. **Unverifiable numeric claim** — a figure/quote with no source and no `ASSUMPTION:` label.
4. **Cover hook absent** — card 1 has no number, question, or surprising stat.
5. **Required source missing** — last card (or a stat card) lacks its source attribution.
6. **Wrong dimension** — any card not exactly **1080×1350**.

A hard fail is not a "partial pass." The Evaluator lists it as a Blocking Issue and the
verdict is FAIL until it is fixed.

---

## Calibration checkpoint (when every score ≥ 4)

Before writing PASS, re-check through two lenses and add any findings:
1. **Picky designer lens:** would a careful Korean designer flag spacing, hierarchy, or a
   color that fights readability on any card?
2. **Picky copy-editor lens:** does any card still lean on a cliché, 번역체, or filler the
   first read glossed over?

If either lens surfaces something, it goes in the critique even if the numeric scores
already cleared the bar.
