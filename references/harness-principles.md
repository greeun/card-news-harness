# Harness principles → card-news mapping

How Anthropic's *"Harness Design for Long-Running Application Development"* (Prithvi
Rajasekaran, 2026) maps onto this card-news skill. Every article element is mapped to a
concrete location. The only N/A rows are the **sprint construct** (V1-18, and the sprint half
of V2-1), N/A **because the tier is Simplified** for the Opus-class target model — not as a
generic shortcut.

---

## Coverage table (reproduces skill-spec.md §7)

| Checklist row | Article element | Location in this skill |
|---------------|-----------------|------------------------|
| V1-1 | Planner/Generator/Evaluator as separate Agent calls | SKILL.md orchestrator (§ "Activation flow" steps 2, 4, 5) |
| V1-2 | 4–6 criteria, 1–5 scored | `references/rubric.md` |
| V1-3 | 2× weighting on weak axes | `references/rubric.md` — C1, C2 weighted 2× |
| V1-4 | Criteria as qualities, not references | `references/rubric.md` — no brand/“museum” refs |
| V1-5 | Few-shot calibration 1/3/5 anchors | `references/evaluator-calibration.md` |
| V1-6 | Iteration range 5–15, warn vs low end | SKILL.md "Iteration cap" + "Iteration wisdom" |
| V1-7 | Wall-clock tolerance (~4h) | SKILL.md "Iteration wisdom" |
| V1-8 | Evaluator tuning via few-shot | `evaluator-calibration.md` + SKILL.md "Evaluator tuning workflow" |
| V1-9 | Strategic decision refine/pivot/escalate | `references/generator-prompt.md` Strategic Decision block |
| V1-10 | Dutch-Art-Museum late-leap wisdom | SKILL.md "Iteration wisdom" |
| V1-11 | Middle iterations can beat final | `references/evaluator-prompt.md` Iteration Quality Note |
| V1-12 | Planner: short prompt → full spec, ambitious | `references/planner-prompt.md` |
| V1-13 | Planner: product-level, not implementation | `references/planner-prompt.md` hard rule 1 |
| V1-14 / P-2 | Planner differentiation hook | `references/planner-prompt.md` "Differentiation hook" |
| V1-15 | Generator self-verify before handoff | `references/generator-prompt.md` step 4 |
| V1-16 | Adversarial probes + evidence | `references/evaluator-prompt.md` — probes + Read(image) every PNG |
| V1-17 | Hard threshold per criterion | `references/rubric.md` verdict logic |
| V1-18 | **Sprint contract negotiation** | **N/A — tier=Simplified** (V2-1 removes the sprint construct for the Opus-class target model) |
| V1-19 | File-based communication only | SKILL.md "Context reset policy" + orchestrator |
| V1-20 | Evaluator tuning loop across runs | SKILL.md "Evaluator tuning workflow" (a)–(d) |
| V1-21 | Context anxiety → handoff.md + reset | `references/generator-prompt.md` context-anxiety signals + SKILL.md |
| V1-22 | Reset ≠ compaction | SKILL.md "Context reset policy" |
| V2-1 | Sprint construct removed (Simplified) | SKILL.md orchestrator — sprint contract is **N/A — tier=Simplified** |
| V2-2 | Evaluator = single end-of-run pass, 3–5 rounds | SKILL.md orchestrator step 6 |
| V2-3 | Evaluator cost not a fixed yes/no | SKILL.md "V1-vs-V2 model guidance" |
| V2-4 | Context anxiety eliminated on Opus 4.5+ | SKILL.md "V1-vs-V2 model guidance" table |
| G-1 | Each component encodes an assumption | SKILL.md "Harness principles" |
| G-2 | Methodical one-at-a-time simplification | SKILL.md "V1-vs-V2 model guidance" |
| G-3 | "Building Effective Agents" simplicity citation | SKILL.md "Harness principles" |
| G-4 / P-3 | Operational tuning loop (a)–(d) | SKILL.md "Evaluator tuning workflow" |
| G-5 | Harness space shifts, not shrinks | SKILL.md "Iteration wisdom" |
| P-1 | Sensory-limit human checkpoint | SKILL.md orchestrator step 8 + `evaluator-prompt.md` human-checkpoint note |

No row is left blank. The only N/A rows — **V1-18** and the **sprint half of V2-1** — are
justified by the Simplified tier.

---

## Why the sprint construct is removed (V2-1 → tier=Simplified)

The article's V1 design decomposed long runs into **sprints**, each with a negotiated
`sprint_contract.md` and a per-sprint Evaluator, primarily to manage **context anxiety** — the
failure mode where a model, sensing its context filling, rushes to a shallow finish.

The V2 finding: on **Opus-class models (Opus 4.5 / 4.6 and up)** context anxiety is *largely
eliminated*, so the sprint scaffolding becomes overhead. The article's general principle (G-1,
G-2): every harness component encodes an assumption, and as models improve you should remove
those assumptions **one at a time and methodically** — radical all-at-once simplification
failed in the article; methodical removal succeeded.

This skill targets an Opus-class model, so it adopts the **Simplified tier**: a single
continuous Generator session and a single end-of-run Evaluator pass (capped at 3–5 Evaluator
rounds). No `sprint_contract.md`, no per-sprint Evaluator. The Planner produces a **Definition
of Done** (observable, binary) in place of per-round acceptance contracts. This is a
deliberate, model-tier-driven removal of exactly one assumption — not a generic shortcut.

G-3 anchors it: from *"Building Effective Agents"* — **"find the simplest solution possible,
and only increase complexity when needed."** If a future run targets a weaker model, the
sprint construct is the first thing to add back.
