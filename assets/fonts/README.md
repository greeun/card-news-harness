# Bundled fonts — Pretendard (SIL OFL 1.1)

This folder ships **Pretendard** for **offline, deterministic Korean text rendering**.
Pretendard is licensed under the **SIL Open Font License 1.1** (see `LICENSE` in this
folder), which permits bundling and redistribution with the license file. The
`@font-face` declarations in `../base.css` load these files via a relative `url(...)`,
so `scripts/render.mjs` never touches the network during a screenshot.

## Files present

| File | Weight | Used for |
|------|--------|----------|
| `Pretendard-Regular.woff2` | 400 | body text, captions |
| `Pretendard-Medium.woff2` | 500 | sub-notes, labels |
| `Pretendard-SemiBold.woff2` | 600 | secondary headlines, list cores |
| `Pretendard-Bold.woff2` | 700 | headlines |
| `Pretendard-ExtraBold.woff2` | 800 | cover headline, big numbers |
| `Pretendard-Black.woff2` | 900 | shock-stat figures, max emphasis |

All six are valid `wOF2` files (magic bytes `wOF2`).

## If a re-download is ever needed

These were fetched from the npm mirror on jsDelivr (the `gh` mirror exceeded jsDelivr's
50 MB package limit and 404'd, so use the **npm** path):

```bash
BASE="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2"
for w in Regular Medium SemiBold Bold ExtraBold Black; do
  curl -sSL -o "Pretendard-$w.woff2" "$BASE/Pretendard-$w.woff2"
done
curl -sSL -o LICENSE "https://raw.githubusercontent.com/orioncactus/pretendard/main/LICENSE"
```

If a download is blocked in your environment, the `@font-face` in `base.css` falls back
to the OS Korean system stack (`-apple-system`, `Apple SD Gothic Neo`, `Malgun Gothic`,
`sans-serif`). Rendering still succeeds, but line breaks and metrics may shift, so the
Evaluator's per-PNG inspection becomes more important.

## Fallback fonts (referenced by name only — NOT bundled)

- **나눔스퀘어네오 (NanumSquare Neo)** — OFL; safe to bundle later if desired.
- **Gmarket Sans** — has its **own** license; do **NOT** bundle unless the user confirms
  its license terms. Referenced by name only.
