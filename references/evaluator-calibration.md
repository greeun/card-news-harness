# Evaluator calibration — few-shot score anchors

Anchor your scoring with these concrete Korean card-news examples. The article found that
"calibrating the evaluator using few-shot examples with detailed score breakdowns ensured
the evaluator's judgment aligned with my preferences, and reduced score drift across
iterations." Read all four criteria's anchors before scoring a set. Each criterion has a
**1 / 3 / 5** anchor (an unacceptable, a weak-but-passable-looking, and an excellent case).

When the work-in-front-of-you sits between anchors, pick the lower score and name the gap.

---

## C1 — 표지 후크력 & 카피 독창성 (Cover hook & Korean copy craft) — 2×

- **1/5** — Cover reads "카드뉴스로 알아보는 시간관리" with no number/question/stat; body
  copy is 번역체: "당신은 시간을 관리할 필요가 있습니다." Several cards open with "요즘 핫한"
  / "꼭 알아야 할!". The set is generic and scroll-past; any AI could have written it.
- **3/5** — Cover poses a question but it's broad and safe ("시간관리 어떻게 할까요?").
  Body copy is clean and grammatical, but two cards still lean on clichés ("꼭 알아야 할",
  "여러분") and one sentence is faintly 번역체. Competent, not memorable.
- **5/5** — Cover leads with a concrete, surprising figure tied to the topic ("하루 8시간
  일하는데 왜 늘 시간이 부족할까?" / "월급 0원에서 시작한 3가지"). Every card's copy sounds
  like a specific Korean author with a point of view — zero slop, no 번역체, tone consistent
  from cover to CTA. The hook makes you want card 2.

## C2 — 가독성 & 비주얼 일관성 (Readability & visual consistency) — 2×

- **1/5** — In the rendered PNGs: card-05's headline is truncated at the right safe-area
  edge; card-02 uses a different accent color than the rest of the set; two body cards have
  no page indicator. Margins jump around card to card.
- **3/5** — No truncation and the palette is consistent, but card-06 is text-dense (two
  ideas crammed onto one card — the one-card-one-message rule is violated) and the body
  margins drift slightly between cards. Readable but not tight.
- **5/5** — Every card carries exactly one message; margins and the page-indicator rhythm
  are identical across the set; one palette (1–2 brand + 1 point) and one font family
  throughout; hierarchy is clean and the PNGs are crisp at 1080×1350 with comfortable air.

## C3 — 흐름 & 이어보기 (Flow & continuation pull) — 1×

- **1/5** — Cards are an unordered pile of facts. There is no arc, the cover doesn't set up
  the body, and nothing on any card creates a reason to swipe forward.
- **3/5** — The order is logical (intro → points → close) but flat: body cards state their
  point and stop, without baiting the next swipe. You could shuffle several cards and lose
  little.
- **5/5** — The cover poses a question the body progressively answers; each card ends on a
  small hook into the next ("그래서 결론은?"); the quote lands the thesis and the CTA closes
  the arc. The sequence reads as one deliberate story.

## C4 — 플랫폼 적합 & 사실 정확성 (Platform fit & factual accuracy) — 1×

- **1/5** — One card renders 1080×1080 (wrong ratio); a stat card claims "90%가 …" with no
  source anywhere; the last card has no CTA. Hard fails present.
- **3/5** — All cards are 1080×1350 and inside the safe area and the last card has a CTA,
  but one quote's attribution is vague ("한 연구에 따르면") and a second figure is unsourced
  rather than `ASSUMPTION:`-labeled.
- **5/5** — Every card is exactly 1080×1350, safe-area clean; every figure is sourced or
  explicitly `ASSUMPTION:`-labeled; page indicator on all body cards; the last card has a
  clear save/follow/comment CTA plus a source line.

---

## How to keep these anchors honest (tuning)

When SKILL.md's evaluator-tuning loop runs, update these anchors to target observed
divergences — e.g., if the Evaluator passed a cover that a human found weak, sharpen the
C1 **3/5** and **5/5** wording with the specific phrasing that failed, so the next run
catches it. Keep at least the 1/3/5 anchor per criterion; add a 2/5 or 4/5 only if a real
divergence needs it.
