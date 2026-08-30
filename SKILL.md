---
name: card-news-harness
description: >-
  주제 또는 원문(블로그·기사·메모·URL)을 입력받아 한국형 카드뉴스를
  Planner→Generator→Evaluator 하네스로 기획·작성·평가하고, 8종 내장 템플릿
  라이브러리로 HTML/CSS→PNG(1080×1350, 4:5)를 Node+Playwright로 렌더링한다.
  최종 미학 사인오프는 사용자 휴먼 체크포인트로 두며, 인스타/스레드 자동 게시는
  하지 않는다(사용자가 직접 업로드).
  트리거 — KO: 카드뉴스, 카드뉴스 만들어, 인스타 카드뉴스, 스레드 카드뉴스,
  카드뉴스 제작, 카드뉴스 디자인, 정보성 카드뉴스, 카드뉴스 템플릿, 캐러셀 카드.
  EN: card news, Korean card news, Instagram card news, carousel post,
  make a card news, carousel design, swipe post, Instagram carousel.
version: 1.0.0
---

# card-news-harness

주제나 원문을 받아 **한국형 카드뉴스 세트**(기본 8장, 6–10장 범위, 각 **1080×1350px /
4:5**)를 만든다. 카드는 8종 아키타입 템플릿(`cover/list/step/compare/story/stat/quote/cta`)을
**HTML/CSS**로 채우고 **Node+Playwright(chromium)**로 PNG 렌더링한다. 본문 텍스트는 한글
충실도를 위해 AI 이미지 생성이 아니라 **실제 텍스트 렌더**로 그린다(Pretendard 로컬 번들).

매 호출은 내부적으로 **Planner → Generator → Evaluator** 루프를 돈다. 방법론은 Anthropic
*"Harness Design for Long-Running Application Development"* (Prithvi Rajasekaran, 2026)의
원칙 — 역할 분리, 컨텍스트 리셋, 루브릭 평가, 컨텍스트 불안 방지, 자기평가 편향 방지 — 을
카드뉴스 도메인에 이식한 것이다.

> **이 SKILL.md는 오케스트레이터(메인 세션)용 지침이다.** 세부는 `references/`로 분리했다.
> Planner/Generator/Evaluator는 각각 **별도 Agent 호출**로 디스패치하며, 역할 간 소통은
> **파일로만** 한다(서로의 추론을 보지 않는다).

---

## 0. 핵심 요약 (먼저 읽기)

- **티어 = Simplified.** 스프린트 계약 없음, 스프린트별 Evaluator 없음. **연속 Generator 1세션
  + 종단 Evaluator 1패스**(3–5라운드 cap). 이유는 §6 V1-vs-V2 참고 — **타깃이 Opus급 모델이라
  컨텍스트 불안이 사실상 사라졌기 때문**이지, 일반적 지름길이 아니다.
- **두 개의 숫자를 혼동하지 말 것:**
  - **창작 생성 반복 = 5–15 범위** (Generator가 핸드오프 전에 내부적으로 도는 render→점검→수정
    루프). **낮은 값으로 잡지 말 것.**
  - **Evaluator 라운드 = 3–5** (Simplified 종단 패스). 둘은 다른 층위다.
- **휴먼 미학 사인오프 게이트(필수).** 루브릭 PASS 후 렌더된 PNG를 사용자에게 보여주고
  **명시적 미학 승인 전까지 STOP**한다. "Evaluator가 알아서 한다"는 최종 미학 판단으로 불가.
- **3 안전 게이트:** ① 폰트 라이선스 ② Playwright chromium 최초 설치 안내 ③ **자동 게시 금지**.

---

## 1. 산출물 트리

```
card-news-harness/
├── SKILL.md                      # 이 파일 — 오케스트레이터 지침
├── references/
│   ├── card-news-patterns.md     # 8 아키타입 + 한국어 카피 패턴 + AI-슬롭 블랙리스트 + 후크 패턴
│   ├── korean-typography.md      # Pretendard/폴백, 세이프영역, 글자수 ceiling, 줄바꿈/강조 규칙
│   ├── harness-principles.md     # 아티클 원칙 → 카드뉴스 매핑(커버리지 표)
│   ├── rubric.md                 # 4 기준 1–5 + 가중치 + verdict + hard fail
│   ├── planner-prompt.md         # 런타임 Planner 역할 프롬프트(자기완결)
│   ├── generator-prompt.md       # 런타임 Generator 역할 프롬프트 + Strategic Decision
│   ├── evaluator-prompt.md       # 런타임 Evaluator 역할 프롬프트 + 적대적 프로브
│   └── evaluator-calibration.md  # 기준별 1/3/5 few-shot 앵커
├── assets/
│   ├── templates/                # cover/list/step/compare/story/stat/quote/cta .html (8개)
│   ├── base.css                  # 4:5 박스, 세이프영역, 페이지 인디케이터, 강조 유틸, 브랜드 변수
│   └── fonts/                    # Pretendard(SIL OFL) 번들 + LICENSE
├── scripts/
│   └── render.mjs                # Playwright HTML→PNG, 정확히 1080×1350 (+ package.json)
└── examples/
    └── sample-run/               # "직장인 시간관리 5가지" 8장 풀 샘플(spec/outline/brand/cards/out)
```

**런타임 작업 디렉터리**는 스킬 폴더가 아니라 **사용자 프로젝트 안**에 `card-news/`로 만든다.
한 호출의 아티팩트(`spec.md`, `outline.md`, `brand.json`, `cards/*.html`, `out/*.png`,
`handoff.md`, `critique_vN.md`, `final/`)는 모두 거기에 쓴다.

---

## 2. 활성화 플로우 (오케스트레이터 — FROZEN)

Planner, Generator, Evaluator를 **각각 별도 Agent 호출**로 디스패치한다. 역할 간 소통은
파일로만. 번호 순서대로 실행한다.

1. **인테이크.** 사용자가 안 줬으면 최소한만 묻는다: 주제/원문(또는 요약할 URL·텍스트),
   타깃·목적, 알려진 제약(브랜드색/로고, 카드 수, 톤, 필수 문구, 출처 표기 필요 여부).
   URL이면 **WebFetch**로 본문을 읽는다. "이 원문 요약" 요청이면 **읽고 사실 확인 후** 기획.
2. **Planner** (Agent 호출) — `references/planner-prompt.md`를 지침으로 디스패치.
   `spec.md`·`outline.md`·`brand.json`을 쓴다. 아키타입 선택, 플로우(커버 후크→본문→CTA),
   카드 수(기본 8, 범위 6–10), 후크 후보 3개, **빠른/리서치 모드 제시**. `SPEC_READY: spec.md`
   출력 후 STOP.
3. **사용자 확인 게이트 #1 (스펙 승인).** 사용자가 "go"(+ 소싱 모드 선택). "go" 없으면 생성 금지.
4. **Generator** (Agent 호출) — `references/generator-prompt.md`를 지침으로 디스패치.
   카드별 한국어 카피 작성 → 템플릿 채워 `cards/card-NN.html` → `scripts/render.mjs`로
   `out/card-NN.png`. 자기검증 후 Strategic Decision 블록과 함께 `handoff.md`. 핸드오프 전에
   **5–15 범위의 창작 생성 루프**를 돈다 — "그럴듯해 보임"으로 조기 종료 금지. `READY_FOR_QA:
   handoff.md` 출력.
5. **Evaluator** (Agent 호출) — `references/evaluator-prompt.md`를 지침으로 디스패치.
   `spec.md`+`handoff.md`를 읽고 **모든 `out/card-NN.png`를 `Read(image)`로 픽셀 검사**한다.
   루브릭(§ rubric.md) + 카드뉴스 적대적 프로브 실행 → `critique_vN.md`(verdict/점수/증거/
   Iteration Quality Note/옵션 `REDIRECT:`). `CRITIQUE_READY: critique_vN.md` 출력.
6. **통과까지 반복.** FAIL이면 **새 Generator 세션**이 `critique_vN.md`+파일을 읽고 REFINE
   (또는 REDIRECT/승인된 메모가 있을 때만 PIVOT) 후 재렌더. 4–6 단계 반복, **Evaluator 라운드
   3–5회 cap**(Simplified 종단 패스). 내부 창작 루프는 **5–15 범위**를 지키고 조기 종료에 저항.
7. **루브릭 PASS** = 4 기준 모두 ≥4, 프로브 클린, hard fail 없음. → 머신 측 품질 충족.
8. **휴먼 미학 사인오프 체크포인트 (P-1, FROZEN 게이트).** 렌더된 PNG 세트를 사용자에게
   제시하고 **명시적 미학 승인 전까지 STOP**. 사용자는 수정 요청(→ 4단계로) 또는 사인오프.
   하네스는 미묘한 시각적 취향을 스스로 최종 확정하지 않는다.
9. **딜리버.** 휴먼 사인오프 시 `final/` 구성: 최종 PNG 세트 + 추천 캡션/해시태그 + 게시
   체크리스트. **자동 게시 없음** — 사용자가 인스타/스레드에 **직접 업로드**.

**사용자 확인 게이트:** (#1) Planner 스펙 + 소싱 모드 승인(3단계); (#2) 최종 휴먼 미학
사인오프(8단계).

### 컨텍스트 불안 감지 트리거 (Generator로 전달)
다음 중 하나라도 관찰되면 → `handoff.md`를 쓰고 깔끔히 멈춘다(새 세션이 이어받음):
이전 카드를 새로 만드는 대신 재요약함 / 모든 카드 끝나기 전에 마무리 표현으로 직행 /
세트 중반부터 카드별 깊이 하락 / spec이 상세를 요구하는데 "지면상·간략히"를 쓰려 함 /
render·검증 단계를 건너뛰려 함. **compaction 금지**(불안 상태를 보존하므로 리셋이 아님).

---

## 3. 반복 cap & Iteration wisdom

### 반복 cap (런타임 창작 생성 루프): **5–15 범위** (낮은 단일값 아님)
Generator가 Evaluator 패스 전에 내부적으로 도는 render→Evaluator-점검→수정 루프는 **5–15
범위**로 잡는다. SKILL 운영자/오케스트레이터는:
- cap을 "5–15"로 명시하고 **낮은 끝값을 고르지 말 것**을 경고한다. 돌파(breakthrough) 반복이
  중요하다 — 아티클의 Dutch Art Museum 디자인은 **반복 10에서 품질이 도약**했다(V1-10, V1-25).
  반복 3에서 "괜찮아 보임"이라고 조기 종료하면 안 된다(V1-7: 벽시계 기준 ~4시간까지 허용).
- **루브릭 PASS로만 종료**한다(4 기준 ≥4, 프로브 클린, hard fail 없음). "그럴듯해 보임 / looks
  good enough"으로 절대 종료하지 않는다(컨텍스트 불안 방지).
- **Iteration wisdom:** 중간 반복이 최종보다 나을 수 있다(V1-11). Evaluator가 이를 Iteration
  Quality Note에 기록한다. 모델이 좋아져도 하네스 탐색 공간은 **줄지 않고 이동**한다(G-5) —
  더 야심찬 산출을 노릴 여지가 생긴다.

> **두 숫자 구분(FROZEN):** Simplified **종단 Evaluator 패스**는 **3–5 Evaluator 라운드**로
> cap한다(V2-2). 이는 Generator가 각 Evaluator 패스 전에 내부적으로 도는 **창작 생성 반복
> 범위(5–15)**와 **별개**다. 둘 다 본 SKILL에 등장하며 혼동 금물.

---

## 4. 컨텍스트 리셋 정책

- **파일 기반 소통만**(V1-19): 역할은 `spec.md`, `outline.md`, `brand.json`, `cards/*.html`,
  `out/*.png`, `handoff.md`, `critique_vN.md`로만 대화한다. 누구도 다른 역할의 인-컨텍스트
  추론을 읽지 않는다.
- 컨텍스트 압박 시 Generator는 `handoff.md`(무엇을 썼는지 / 가정 / 남은 작업 / 현재 최선
  버전)를 쓰고 깔끔히 멈춘다. **새(fresh) Generator 세션**이 파일에서 이어받는다.
- **리셋 ≠ compaction**(V1-21, V1-22): compaction은 불안 상태를 **보존**하므로 리셋 메커니즘으로
  **금지**다. 오직 새 세션 + `handoff.md`만이 불안을 해소한다.
- 티어가 Opus급 Simplified라 핸드오프/리셋은 **기본 리듬이 아니라 예외 경로**다.

---

## 5. 안전 게이트 (FROZEN)

1. **폰트 라이선스.** Pretendard는 **SIL OFL** — `assets/fonts/`에 `LICENSE`와 함께 번들 허용.
   폴백 **나눔스퀘어네오**(OFL)와 **Gmarket Sans**(자체 라이선스)는 **이름으로만** 참조하며,
   Gmarket Sans는 사용자가 라이선스를 확인하기 전엔 **번들하지 않는다**.
2. **Playwright chromium 최초 설치 안내.** 첫 실행은 `npx playwright install chromium`(대용량
   다운로드)가 필요하다. `render.mjs`와 본 SKILL이 렌더 전에 명확히 1회 안내한다. 스크립트
   의존성 설치는 `npm install --prefix scripts`.
3. **자동 게시 금지.** 인스타/스레드에 **게시하지 않고 스크래핑도 하지 않는다.** 최종 PNG 세트 +
   추천 캡션/해시태그 + 게시 체크리스트만 출력하고 **사용자가 수동 업로드**한다. 실시간
   스크래핑은 범위 외(ToS / 로그인 월 / 불안정).

---

## 6. V1-vs-V2 모델별 가이드 (FROZEN — 표 그대로 유지)

아티클은 모델 등급에 따라 하네스 복잡도를 조절한다. 본 스킬은 **Opus급 타깃**이라 Simplified
티어를 채택했고, **스프린트 구성은 그 모델 등급 때문에 제거**한 것이다(일반적 지름길이 아님).

| 모델 등급 | 컨텍스트 불안 | 스프린트 계약 | Evaluator | 본 스킬의 선택 |
|-----------|---------------|----------------|-----------|----------------|
| **Sonnet 4.5** | 존재(중간) — 컨텍스트가 차면 조기 마무리 경향 | 권장(분할로 불안 완화) | 스프린트별 + 종단 | (해당 시) Full 티어로 스프린트 복원 |
| **Opus 4.5** | 대부분 해소 | 불필요 | 종단 1패스 | Simplified 가능 |
| **Opus 4.6** | 사실상 없음 | 불필요 | 종단 1패스(3–5라운드) | **본 스킬 = Simplified** |

- **V2-3:** Evaluator의 비용 대비 가치는 고정된 yes/no가 아니라 **태스크–모델 경계**에 달려
  있다. 시각 품질·사실성처럼 Generator가 자가검증으로 놓치기 쉬운 축이 있는 한, 별도 Evaluator는
  카드뉴스에서 **여전히 유효**하다(그래서 Simplified여도 종단 Evaluator는 유지).
- **V2-4:** Opus 4.5+에서는 컨텍스트 불안이 **사실상 제거**되어 스프린트 분해가 불필요해졌다.
- **G-1/G-2:** 모든 하네스 구성요소는 **가정**을 인코딩한다. 모델이 좋아지면 그 가정을 **한 번에
  하나씩, 체계적으로** 제거한다 — 아티클에서 급진적 일괄 단순화는 실패했고 점진적 제거가
  성공했다. 본 스킬은 정확히 **스프린트라는 가정 하나**를 제거했다.
- **G-3:** *"Building Effective Agents"* — **"가능한 가장 단순한 해법을 찾고, 필요할 때만
  복잡도를 올려라."** 더 약한 모델을 타깃하게 되면 **가장 먼저 되돌릴 것이 스프린트 구성**이다.

> **스프린트 관련 N/A (명시):** `V1-18 스프린트 계약 협상 = N/A — tier=Simplified`,
> `V2-1의 스프린트 절반 = N/A — tier=Simplified`. 둘 다 Opus급 타깃 때문에 비활성이며,
> `references/harness-principles.md`에 같은 문구로 기록돼 있다. (V2-1의 나머지 절반 —
> 종단 Evaluator 단일 패스 — 은 **적용**된다.)

---

## 7. Evaluator 튜닝 워크플로 (P-3, G-4 — (a)–(d) 운영 절차)

미튜닝 Evaluator는 너무 관대하다. 첫 실행들은 **초안**으로 취급하고 다음 절차로 보정한다.

- **(a) 알려진 주제로 풀 사이클 1회 실행.** 한 가지 알려진 토픽으로 Planner→Generator→Evaluator
  를 끝까지 돌리고 `critique_vN.md`와 `out/*.png`를 모두 남긴다.
- **(b) critique를 실제 PNG 옆에 놓고 발산점을 찾는다.** 각 루브릭 점수마다 묻는다 —
  *"까다로운 인간 디자이너/카피에디터가 같은 점수를 줬을까?"* 전형적 발산: 일반/얕은 카피를
  통과시킴 / 잘린 텍스트를 놓침 / HTML만 보고 픽셀을 안 봄 / spec과 안 맞는데 칭찬함.
- **(c) 발산점을 겨냥해 calibration/프롬프트를 갱신한다.** `evaluator-calibration.md`의
  1/3/5 few-shot 앵커를 실제로 빗나간 표현으로 더 날카롭게 고치고, `evaluator-prompt.md`에
  반례를 추가한다(예: 약한 후크를 통과시켰다면 C1의 3/5·5/5 기준을 그 문구로 보강).
- **(d) verdict가 신중한 인간 패스와 상관될 때까지 재실행한다.** 여러 사이클을 예상하라.
  Evaluator가 올리는 모든 blocking issue가 **재현 가능**하고, 그 판정이 까다로운 인간 평가와
  일치하면 튜닝을 멈춘다.

---

## 8. 하네스 원칙 요약 (참조 인덱스)

- **역할 분리(V1-1):** Planner/Generator/Evaluator = 별도 Agent 호출. 자기평가 편향을 구조적으로
  차단한다(Generator는 자기 점수를 매기지 않는다).
- **루브릭(rubric.md):** 4 기준 1–5, **C1 표지 후크·카피 / C2 가독성·일관성 = 2×**(Claude의
  약한 축), C3 흐름 / C4 플랫폼·사실성 = 1×. verdict와 hard fail은 `references/rubric.md`.
- **적대적 프로브 + 증거(evaluator-prompt.md):** 모든 PNG를 `Read(image)`로 검사. 텍스트
  오버플로/세이프영역/후크 부재/CTA·출처 누락/인디케이터/글자수 ceiling/팔레트·폰트 일관성/
  사실성/AI-슬롭/치수 — 각 hard fail.
- **Strategic Decision(generator-prompt.md):** REFINE / PIVOT(카드뉴스 트리거: 후크가 스크롤을
  못 멈춤→커버 아키타입 전환, 본문 아키타입 미스매치→story/step 전환, 팔레트·폰트가 가독성과
  충돌→브랜드 방향 전환) / ESCALATE. **REDIRECT나 승인된 design_memo 없이는 PIVOT 금지.**
- **G-1~G-5 / V2:** §6 표 참조. 매핑 전체는 `references/harness-principles.md`.

---

## 9. 도메인 검증 (hard fail) — Evaluator와 render.mjs가 강제

1. **PNG 치수** — 모든 `out/card-NN.png`가 **정확히 1080×1350**(render.mjs가 캡처 버퍼로
   assert + Evaluator가 이미지로 재확인).
2. **폰트 로드 대기** — render.mjs가 `document.fonts.ready` 후 캡처(Pretendard 로컬, 무네트워크)
   → 폴백 플래시·줄바꿈 흔들림 없음.
3. **텍스트 오버플로/잘림 0건** — Evaluator 이미지 검사. `base.css` 세이프영역 박스가 제약.
4. **커버 후크 존재** — 카드 1에 숫자/질문/충격 수치.
5. **마지막 카드 CTA + 출처**.
6. **페이지 인디케이터** — 페이지 인디케이터(N/총장수)는 표지(cover)를 제외한 모든 카드에
   표기한다. cta 카드는 마지막 인덱스(예: 8/8)를 표기한다.
7. **카드별 글자수 ceiling** — `korean-typography.md` 기준.
8. **팔레트/폰트 일관** — 단일 팔레트(1–2 브랜드 + 1 포인트) + 단일 폰트.
9. **카드 수 범위** — 6–10(기본 8); >10이면 가독성/비용 경고.
10. **주장 출처** — 수치/인용은 출처 또는 `ASSUMPTION:` 라벨.

표준 스킬 검증도 통과해야 한다: 프론트매터(name + 트리거 포함 description), 본문 < 500줄,
번들 예시에서 `render.mjs`가 오류 없이 실행.

---

## 10. 설치 메모

- 리포 경로 `~/project/workspace/211-withwiz/claude-utils/claude-skills/card-news-harness/`에
  두고 심링크: `ln -s "$(pwd)/card-news-harness" ~/.claude/skills/card-news-harness`.
- 렌더 의존성(최초 1회): `npm install --prefix scripts` 후 `npx playwright install chromium`.
- 스모크 검증(설치 직후): 예시 번들 `examples/sample-run/`은 `.gitignore`로 배포에 포함되지 않으므로
  존재를 가정하지 않는다. 임시 카드를 즉석 생성해 렌더러를 확인한다 — `render.mjs`가 `assets/base.css`를
  주입하고 `.card`는 base.css 기본값(1080×1350)을 상속하므로 최소 카드 한 장이면 충분하다:
  ```bash
  mkdir -p /tmp/cn-smoke/cards /tmp/cn-smoke/out
  printf '<!doctype html><meta charset="utf-8"><div class="card"></div>' > /tmp/cn-smoke/cards/card-01.html
  node scripts/render.mjs --in /tmp/cn-smoke/cards --out /tmp/cn-smoke/out
  ```
  → `/tmp/cn-smoke/out/card-01.png`가 1080×1350로 나오면 환경 정상.
