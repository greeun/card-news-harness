# Card-news patterns — the 8-archetype library

The full archetype library the Planner selects from and the Generator fills. For each
archetype: **when to use**, the **structural recipe**, **Korean copy patterns**, and the
template tokens. Below the library: a **hook pattern** guide and an **AI-slop / 번역체
blacklist** the copy must pass.

Card 1 is ALWAYS `cover`. The last card is ALWAYS `cta`. Everything between is chosen to fit
the content.

**페이지 인디케이터 규칙(정본):** 페이지 인디케이터(N/총장수)는 표지(cover)를 제외한 모든
카드에 표기한다. cta 카드는 마지막 인덱스(예: 8/8)를 표기한다.

---

## 1. cover — 후크 표지 (always card 1)

- **When:** every set's first card. Its only job is to stop the scroll and earn the next swipe.
- **Recipe:** one kicker (작은 라벨) + a big headline carrying a number / question / shock-stat
  + a one-line subline + a swipe cue. Emphasize ONE phrase (.kw or .hl).
- **Korean copy patterns:**
  - 숫자형: "하루 8시간 일하는데, 왜 늘 시간이 부족할까?"
  - 질문형: "퇴사 전에 이건 꼭 확인하셨나요?"
  - 충격수치형: "직장인 90%가 모르는 연차 사용법" (※ 수치는 출처/ASSUMPTION 필수)
  - 반전형: "바쁜 게 아니라 새는 거였습니다."
- **Tokens:** `{{KICKER}} {{HEADLINE}} {{SUBLINE}} {{TOTAL}} {{HANDLE}}` + brand color vars.

## 2. list — 리스트 ("N가지 방법/이유/꿀팁")

- **When:** the body is a set of parallel items — 방법 N가지, 이유 N가지, 꿀팁 N개.
- **Recipe:** index badge + a one-line core + a supporting sub-note. One item per card (two
  or three only if each is very short).
- **Korean copy patterns:**
  - core(한 줄): "<span class=hl>2분</span>이면 미루지 말고 지금 끝냅니다"
  - sub-note: "작은 잔무가 사라지면 집중할 여유가 생깁니다."
  - 라벨: "습관 ① / 이유 ② / 꿀팁 ③" 형태로 일관.
- **Tokens:** `{{INDEX}} {{TOTAL}} {{KICKER}} {{CORE}} {{SUBNOTE}} {{HANDLE}}`.

## 3. step — 단계 가이드 ("OO하는 법")

- **When:** a procedure with order that matters — 신청하는 법, 정리하는 법, 세팅하는 법.
- **Recipe:** STEP 라벨 + progress dots(완료/현재 = on) + action headline + how-to body.
- **Korean copy patterns:**
  - 라벨: "STEP 2 / 습관 ③ · 아침 3분"
  - headline(동사로 끝맺기): "오늘 할 일을 3개만 고르기"
  - body(①②③ 절차): "① 다 적고 → ② 3개에 동그라미 → ③ 가장 무거운 1개를 오전에."
- **Tokens:** `{{INDEX}} {{TOTAL}} {{STEPLABEL}} {{DOTS}} {{HEADLINE}} {{BODY}} {{HANDLE}}`.
  Build `{{DOTS}}` as `<i class="dot on"></i>` (done/current) and `<i class="dot"></i>`
  (upcoming) from INDEX/TOTAL of the step sequence.

## 4. compare — 비교 (Before/After, ❌ vs ⭕)

- **When:** contrast — 잘못된 방법 vs 올바른 방법, Before vs After, 비싼 것 vs 가성비.
- **Recipe:** two stacked panels (top = ❌/Before in point color, bottom = ⭕/After in accent)
  with clear color contrast. One short line of text per panel.
- **Korean copy patterns:**
  - ❌: "메일 보다 회의 자료 만들다 메신저… 결국 셋 다 늦어집니다."
  - ⭕: "25분은 한 가지만. 끝낸 뒤 다음 일로. 속도가 오히려 빨라집니다."
- 여기서 "메신저…"의 말줄임표(…)는 의도된 카피 장치다. 박스에서 물리적으로 잘린 텍스트가
  아니므로 Evaluator의 잘림 프로브 대상이 아니다.
- **Tokens:** `{{INDEX}} {{TOTAL}} {{KICKER}} {{BAD_LABEL}} {{BAD_TEXT}} {{GOOD_LABEL}} {{GOOD_TEXT}} {{HANDLE}}`.

## 5. story — 스토리/공감 (기승전결)

- **When:** an experience or empathy beat — "저도 그랬어요" 류, 사례, 전환 순간.
- **Recipe:** generous whitespace + rhythm: a scene-setting lead-in, a heavier headline, then
  a turn (전환) in accent color. One feeling per card.
- **Korean copy patterns:**
  - lead-in: "매일 야근인데 통장은 늘 비어 있었습니다."
  - headline: "문제는 시간이 아니라 우선순위였어요."
  - turn: "딱 한 가지만 바꿨더니, 6시 퇴근이 가능해졌습니다."
- **Tokens:** `{{INDEX}} {{TOTAL}} {{LEADIN}} {{HEADLINE}} {{TURN}} {{HANDLE}}`.

## 6. stat — 통계/인포그래픽 (데이터 강조)

- **When:** a single number deserves the spotlight. Source is **mandatory** on this card.
- **Recipe:** one large figure (with a unit) dominates + a one-line meaning + a SOURCE line.
- **Korean copy patterns:**
  - figure/unit: "23" / "분"
  - meaning: "한 번 끊긴 집중을 <span class=hl>되찾는 데</span> 걸리는 평균 시간."
  - source: "Gloria Mark, UC Irvine 집중 연구" (불확실하면 "(널리 인용되는 수치)" 부기)
- **Tokens:** `{{INDEX}} {{TOTAL}} {{KICKER}} {{FIGURE}} {{UNIT}} {{MEANING}} {{SOURCE}} {{HANDLE}}`.

## 7. quote — 인용/핵심 한 문장

- **When:** a real quote, or a one-sentence summary that should land with weight.
- **Recipe:** dark background, large quote mark, one big sentence, attribution underneath.
  Highlight one phrase with .hl (over the point color).
- **Korean copy patterns:**
  - quote: "시간은 <span class=hl>관리</span>하는 게 아니라 지켜내는 것입니다."
  - attrib: "— 피터 드러커" (실제 인용) 또는 "— 5가지 습관의 한 문장 요약" (자체 요약).
- **Tokens:** `{{INDEX}} {{TOTAL}} {{QUOTE}} {{ATTRIB}} {{HANDLE}}`.

## 8. cta — 마무리 (always the last card)

- **When:** the final card. CTA + source are **both mandatory**.
- **Recipe:** a closing headline + three action pills (save / follow / comment) + a source line.
- **Korean copy patterns:**
  - headline: "오늘 <span class=kw>하나</span>라도 시작해볼까요?"
  - 저장: "저장해두고 출근길에 다시 보기"
  - 팔로우: "팔로우하면 매주 직장인 꿀팁"
  - 댓글: "내 시간관리 습관 1개 댓글로"
  - source: "자체 정리 · 23분 수치: Gloria Mark, UC Irvine"
- **Tokens:** `{{INDEX}} {{TOTAL}} {{HEADLINE}} {{CTA1}} {{CTA2}} {{CTA3}} {{SOURCE}} {{HANDLE}}`.

---

## Hook patterns (card 1 — and mini-hooks into each next card)

A cover hook must do one of three things. The Planner proposes one of each flavor; the
Generator picks/refines; the Evaluator judges that it actually stops the scroll.

| Pattern | Shape | Example | Why it works |
|---------|-------|---------|--------------|
| **숫자(number)** | a concrete count or figure up front | "퇴근을 30분 앞당긴 3가지 루틴" | specificity beats vagueness; promises a finite payload |
| **질문(question)** | a question the reader can't help answering | "당신의 하루는 왜 항상 모자랄까요?" | opens a loop the body closes |
| **충격수치(shock-stat)** | a surprising verified statistic | "알림 하나가 23분을 가져갑니다" | tension + credibility (must be sourced) |

**Continuation mini-hooks** (end of each body card, to bait the next swipe): "그래서 결론은?",
"두 번째가 진짜 핵심", "이걸 모르면 손해", "다음 장에서 수치로". Use sparingly — one per card
at most, and never on the last card.

---

## AI-slop / 번역체 BLACKLIST — the copy must pass this checklist

The Evaluator flags any of these card by card. The Generator must strip them at write time.

**Cliché openers / fillers (BAN):**
- "요즘 핫한 …", "꼭 알아야 할!", "여러분", "주목!", "필수템", "총정리 끝판왕"
- "지금부터 알려드릴게요", "한 번쯤 들어보셨죠?", "안 보면 후회"
- empty intensifiers: "정말 너무너무", "완전 대박", "레전드"

**번역체 (translationese — BAN):**
- "당신은 ~할 필요가 있습니다" → "~하면 됩니다 / ~하세요"
- "그것은 ~입니다" 남발 → 주어 생략 자연스럽게
- "~에 대해 이야기해 보겠습니다" → 바로 본론
- "우리는 ~를 살펴볼 것입니다" → "~를 봅니다 / 정리했습니다"

**Generic structure smell (avoid):**
- 모든 카드가 "OO의 중요성 → OO하는 법 → 결론" 같은 똑같은 틀
- 카드마다 같은 문장 길이/같은 시작어 ("~는", "~은")로 단조롭게

**Replace with:** specific nouns and numbers, a named subject's voice, varied sentence
openings, and one emphasized phrase per card. If a sentence could sit on any brand's
carousel unchanged, rewrite it until it couldn't.
