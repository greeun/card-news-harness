<!-- Language: **English** | [한국어](./README.ko.md) -->

**English** | [한국어](./README.ko.md)

# card-news-harness

A [Claude Code](https://claude.com/claude-code) skill that turns a topic or a source text (blog post, article, memo, or URL) into a **Korean-style card-news set** — 6–10 PNG cards (default 8) at exactly **1080×1350 px (4:5 portrait)**, the dominant Instagram/Threads carousel ratio.

Cards are authored as **HTML/CSS** filled from a curated library of **8 archetype templates** and rendered to PNG by **Node + Playwright**, with **Pretendard** bundled locally for offline, deterministic Korean typography. No AI image generation is used for card bodies — Korean text fidelity and copy control require real text rendering.

Each invocation runs an internal **Planner → Generator → Evaluator** loop that verifies quality against a rubric and inspects the rendered PNGs multimodally before handing off to a human aesthetic sign-off.

<p align="center">
  <img src="./examples/sample-run/out/card-01.png" width="320" alt="Sample cover card (1080×1350)">
</p>

> Methodology ported from Anthropic's *"Harness Design for Long-Running Application Development"* (Prithvi Rajasekaran, 2026): role separation, context reset, rubric evaluation, context-anxiety prevention, and self-evaluation-bias prevention — applied to the card-news domain.

---

## Key features

- **Runtime harness.** Every run dispatches Planner / Generator / Evaluator as separate agents that communicate through files only — no role grades its own work (self-evaluation-bias prevention).
- **8 archetype template library.** `cover` · `list` · `step` · `compare` · `story` · `stat` · `quote` · `cta`. Card 1 is always a hook cover; the last card is always a CTA.
- **HTML/CSS → PNG pipeline.** `scripts/render.mjs` renders each card at exactly 1080×1350, waits for `document.fonts.ready`, and asserts the output dimensions.
- **Korean-native typography & emphasis.** Pretendard bundled offline; highlighter (`형광펜`), keyword color, page indicators (`N/총장수`), and safe-area conventions baked into `base.css`.
- **Pure-CSS background treatments.** Opt-in `bg-mesh` / `bg-grain` / `bg-dots` / `bg-glow` utilities — no external images, no licensing, deterministic rendering.
- **Rubric-graded quality.** 4 criteria (1–5), with cover-hook/copy craft and readability/visual-consistency weighted 2× (Claude's weak-by-default axes). Hard fails on text overflow, safe-area violation, wrong dimensions, missing hook/CTA/source.
- **Two sourcing modes.** *Fast* (built-in templates only) or *Research* (lightly validate current popular card-news patterns for the topic via web search).
- **Human aesthetic sign-off gate.** The LLM Evaluator inspects pixels, but the final subtle-taste call is an explicit human checkpoint.
- **No auto-publish.** Outputs a final PNG set + recommended caption/hashtags + posting checklist. You upload to Instagram/Threads manually. No scraping.

---

## Tech stack

- **Node.js** + **[Playwright](https://playwright.dev/)** (chromium) — headless HTML→PNG rendering
- **HTML / CSS** — card templates and the shared `base.css` design system
- **[Pretendard](https://github.com/orioncactus/pretendard)** (SIL OFL) — bundled Korean web font
- Authored as a **Claude Code skill** (`SKILL.md` + `references/` + `assets/` + `scripts/`)

---

## Project structure

```
card-news-harness/
├── SKILL.md                      # Orchestrator instructions (the runtime harness flow)
├── references/
│   ├── card-news-patterns.md     # 8 archetypes + Korean copy patterns + AI-slop blacklist
│   ├── korean-typography.md      # Pretendard, safe-area, char-count ceilings, emphasis rules
│   ├── harness-principles.md     # Article principles → card-news coverage mapping
│   ├── rubric.md                 # 4 criteria (1–5) + weights + verdict + hard fails
│   ├── planner-prompt.md         # Runtime Planner role prompt
│   ├── generator-prompt.md       # Runtime Generator role prompt + Strategic Decision block
│   ├── evaluator-prompt.md       # Runtime Evaluator role prompt + adversarial probes
│   └── evaluator-calibration.md  # Few-shot 1/3/5 score anchors per criterion
├── assets/
│   ├── templates/                # cover/list/step/compare/story/stat/quote/cta .html
│   ├── base.css                  # 4:5 box, safe-area, indicator, emphasis + background utils
│   └── fonts/                    # Pretendard (SIL OFL) + LICENSE
├── scripts/
│   └── render.mjs                # Playwright HTML→PNG, exactly 1080×1350 (+ package.json)
└── examples/
    └── sample-run/               # A full sample: spec/outline/brand/cards/out
```

---

## Installation

This is a Claude Code skill. Place the folder where your skills live and symlink it so Claude Code can discover it:

```bash
# from your skills repository
ln -s "$(pwd)/card-news-harness" ~/.claude/skills/card-news-harness
```

Install the renderer dependencies (one-time):

```bash
npm install --prefix card-news-harness/scripts
npx playwright install chromium      # first run only — downloads chromium
```

Verify the environment with the bundled sample:

```bash
node card-news-harness/scripts/render.mjs \
  --in  card-news-harness/examples/sample-run/cards \
  --out card-news-harness/examples/sample-run/out
# → 8 PNGs, all 1080×1350
```

---

## Usage

Invoke it inside Claude Code with a topic or a source URL/text. Trigger phrases include:

- KO: `카드뉴스 만들어`, `인스타 카드뉴스`, `스레드 카드뉴스`, `카드뉴스 제작`, `카드뉴스 템플릿`
- EN: `card news`, `Korean card news`, `Instagram card news`, `carousel post`

Example:

```
이 블로그 글로 인스타 카드뉴스 만들어줘: https://example.com/post
```

What happens:

1. **Intake** — reads your topic/URL (fact-checks a source before planning).
2. **Planner** — picks archetypes, designs the flow (cover hook → body → CTA), proposes 3 hook candidates, and asks you to choose *Fast* vs *Research* mode. Stops for your **go**.
3. **Generator** — writes per-card Korean copy, fills templates, renders 1080×1350 PNGs, self-verifies.
4. **Evaluator** — reads every rendered PNG, scores the rubric, runs adversarial probes, iterates until pass.
5. **Human aesthetic sign-off** — you review the rendered set and approve or request changes.
6. **Deliver** — `final/` with the PNG set + recommended caption/hashtags + a posting checklist.

Artifacts are written to a `card-news/` working directory inside your project (not inside the skill folder).

---

## License

- **Skill code & templates:** MIT (adjust to your preference).
- **Bundled font:** Pretendard is distributed under the **SIL Open Font License 1.1** — see [`assets/fonts/LICENSE`](./assets/fonts/LICENSE). Fallback fonts (나눔스퀘어네오 / Gmarket Sans) are referenced by name only and are **not** bundled.

> This skill never auto-publishes to or scrapes Instagram/Threads. Final PNGs are for manual upload.
