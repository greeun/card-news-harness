<!-- Language: [English](./README.md) | **한국어** -->

[English](./README.md) | **한국어**

# card-news-harness

주제나 원문(블로그·기사·메모·URL)을 받아 **한국형 카드뉴스 세트**를 만드는 [Claude Code](https://claude.com/claude-code) 스킬입니다. 기본 8장(6–10장 범위), 각 카드는 정확히 **1080×1350px (4:5 세로)** — 인스타그램/스레드 캐러셀의 표준 비율입니다.

카드는 **HTML/CSS**로 작성된 **8종 아키타입 템플릿**을 채워 **Node + Playwright**로 PNG 렌더링하며, **Pretendard**를 로컬 번들해 오프라인에서도 한글 타이포가 결정적으로 동일하게 나옵니다. 본문 텍스트는 한글 충실도·카피 제어를 위해 AI 이미지 생성이 아니라 **실제 텍스트 렌더**로 그립니다.

매 호출은 내부적으로 **Planner → Generator → Evaluator** 루프를 돌려 루브릭으로 품질을 검증하고, 렌더된 PNG를 멀티모달로 점검한 뒤 **휴먼 미학 사인오프**로 넘깁니다.

<p align="center">
  <img src="./examples/sample-run/out/card-01.png" width="320" alt="샘플 표지 카드 (1080×1350)">
</p>

> 방법론은 Anthropic의 *"Harness Design for Long-Running Application Development"* (Prithvi Rajasekaran, 2026) 원칙 — 역할 분리, 컨텍스트 리셋, 루브릭 평가, 컨텍스트 불안 방지, 자기평가 편향 방지 — 을 카드뉴스 도메인에 이식한 것입니다.

---

## 주요 기능

- **런타임 하네스.** 매 실행마다 Planner / Generator / Evaluator를 **별도 에이전트**로 디스패치하고 **파일로만** 소통합니다 — 어떤 역할도 자기 작업을 스스로 채점하지 않습니다(자기평가 편향 방지).
- **8종 아키타입 템플릿.** `cover` · `list` · `step` · `compare` · `story` · `stat` · `quote` · `cta`. 1번 카드는 항상 후크 표지, 마지막 카드는 항상 CTA.
- **HTML/CSS → PNG 파이프라인.** `scripts/render.mjs`가 각 카드를 정확히 1080×1350으로 렌더하고 `document.fonts.ready`를 기다린 뒤 치수를 assert.
- **한국형 타이포·강조.** Pretendard 오프라인 번들, 형광펜 하이라이트·키워드 컬러·페이지 인디케이터(`N/총장수`)·안전영역 관습을 `base.css`에 내장.
- **순수 CSS 배경 트리트먼트.** opt-in `bg-mesh` / `bg-grain` / `bg-dots` / `bg-glow` 유틸 — 외부 이미지·라이선스 없이 결정적 렌더링.
- **루브릭 채점.** 4기준(1–5점), 표지 후크·카피와 가독성·일관성에 **2× 가중**(Claude의 약한 축). 텍스트 잘림/안전영역 침범/치수 오류/후크·CTA·출처 누락은 하드페일.
- **두 가지 소싱 모드.** *빠른 모드*(내장 템플릿만) 또는 *리서치 모드*(주제에 맞는 최신 카드뉴스 패턴을 웹에서 가볍게 검증·보강).
- **휴먼 미학 사인오프 게이트.** LLM Evaluator가 픽셀을 검사하되, 미묘한 취향의 최종 판단은 명시적 휴먼 체크포인트로 둡니다.
- **자동 게시 금지.** 최종 PNG 세트 + 추천 캡션/해시태그 + 게시 체크리스트만 산출하고, 인스타/스레드 업로드는 사용자가 직접 합니다(스크래핑 없음).

---

## 기술 스택

- **Node.js** + **[Playwright](https://playwright.dev/)** (chromium) — 헤드리스 HTML→PNG 렌더링
- **HTML / CSS** — 카드 템플릿 및 공통 `base.css` 디자인 시스템
- **[Pretendard](https://github.com/orioncactus/pretendard)** (SIL OFL) — 번들된 한글 웹폰트
- **Claude Code 스킬**로 작성(`SKILL.md` + `references/` + `assets/` + `scripts/`)

---

## 프로젝트 구조

```
card-news-harness/
├── SKILL.md                      # 오케스트레이터 지침(런타임 하네스 플로우)
├── references/
│   ├── card-news-patterns.md     # 8 아키타입 + 한국어 카피 패턴 + AI-슬롭 블랙리스트
│   ├── korean-typography.md      # Pretendard, 안전영역, 글자수 천장, 강조 규칙
│   ├── harness-principles.md     # 아티클 원칙 → 카드뉴스 커버리지 매핑
│   ├── rubric.md                 # 4기준(1–5) + 가중치 + verdict + 하드페일
│   ├── planner-prompt.md         # 런타임 Planner 역할 프롬프트
│   ├── generator-prompt.md       # 런타임 Generator 역할 프롬프트 + Strategic Decision
│   ├── evaluator-prompt.md       # 런타임 Evaluator 역할 프롬프트 + 적대적 프로브
│   └── evaluator-calibration.md  # 기준별 1/3/5 few-shot 점수 앵커
├── assets/
│   ├── templates/                # cover/list/step/compare/story/stat/quote/cta .html
│   ├── base.css                  # 4:5 박스, 안전영역, 인디케이터, 강조 + 배경 유틸
│   └── fonts/                    # Pretendard (SIL OFL) + LICENSE
├── scripts/
│   └── render.mjs                # Playwright HTML→PNG, 정확히 1080×1350 (+ package.json)
└── examples/
    └── sample-run/               # 풀 샘플: spec/outline/brand/cards/out
```

---

## 설치

Claude Code 스킬입니다. 스킬 폴더를 두고 심볼릭 링크로 연결하면 Claude Code가 인식합니다:

```bash
# 스킬 저장소 디렉터리에서
ln -s "$(pwd)/card-news-harness" ~/.claude/skills/card-news-harness
```

렌더 의존성 설치(최초 1회):

```bash
pnpm install --prefix card-news-harness/scripts
npx playwright install chromium      # 최초 1회 — chromium 다운로드
```

번들 샘플로 환경 검증:

```bash
node card-news-harness/scripts/render.mjs \
  --in  card-news-harness/examples/sample-run/cards \
  --out card-news-harness/examples/sample-run/out
# → 8장 PNG, 전부 1080×1350
```

---

## 사용법

Claude Code 안에서 주제나 원문 URL/텍스트와 함께 호출합니다. 트리거 문구 예:

- 한국어: `카드뉴스 만들어`, `인스타 카드뉴스`, `스레드 카드뉴스`, `카드뉴스 제작`, `카드뉴스 템플릿`
- English: `card news`, `Korean card news`, `Instagram card news`, `carousel post`

예시:

```
이 블로그 글로 인스타 카드뉴스 만들어줘: https://example.com/post
```

진행 흐름:

1. **인테이크** — 주제/URL을 읽습니다(원문이면 기획 전 사실 확인).
2. **Planner** — 아키타입 선택, 플로우 설계(표지 후크 → 본문 → CTA), 후크 후보 3개 제안, *빠른/리서치 모드* 선택 요청. **"go"** 대기 후 정지.
3. **Generator** — 카드별 한국어 카피 작성, 템플릿 채움, 1080×1350 PNG 렌더, 자기검증.
4. **Evaluator** — 렌더된 모든 PNG를 읽어 루브릭 채점·적대적 프로브 실행, 통과까지 반복.
5. **휴먼 미학 사인오프** — 렌더 세트를 검토해 승인하거나 수정 요청.
6. **딜리버** — `final/`에 PNG 세트 + 추천 캡션/해시태그 + 게시 체크리스트.

산출물은 스킬 폴더가 아니라 사용자 프로젝트 안의 `card-news/` 작업 디렉터리에 작성됩니다.

---

## 라이선스

- **스킬 코드·템플릿:** MIT (원하는 대로 조정).
- **번들 폰트:** Pretendard는 **SIL Open Font License 1.1**로 배포됩니다 — [`assets/fonts/LICENSE`](./assets/fonts/LICENSE) 참고. 폴백 폰트(나눔스퀘어네오 / Gmarket Sans)는 이름으로만 참조하며 **번들하지 않습니다**.

> 이 스킬은 인스타/스레드에 자동 게시하거나 스크래핑하지 않습니다. 최종 PNG는 수동 업로드용입니다.
