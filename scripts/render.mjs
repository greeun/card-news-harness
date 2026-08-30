#!/usr/bin/env node
/**
 * render.mjs — card-news-harness HTML → PNG renderer
 *
 * For each cards/card-NN.html, open via file://, set the viewport to EXACTLY
 * 1080×1350 (deviceScaleFactor 1), wait for document.fonts.ready (Pretendard
 * bundled in assets/fonts so there is no network dependency), screenshot the
 * .card element → out/card-NN.png, and ASSERT the output is exactly 1080×1350.
 *
 * Usage:
 *   node scripts/render.mjs --in <cards dir> --out <png dir>
 *   node scripts/render.mjs --in ./card-news/cards --out ./card-news/out
 *
 * First run requires chromium:  npx playwright install chromium
 */

import { readdir, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const W = 1080;
const H = 1350;

// The skill's own assets/ dir, resolved relative to THIS file (scripts/../assets).
// This is the default so base.css + bundled fonts resolve no matter where cards/ lives.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ASSETS = path.resolve(SCRIPT_DIR, "..", "assets");

function parseArgs(argv) {
  const args = { in: null, out: null, assets: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") args.in = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--assets") args.assets = argv[++i];
    else if (a === "-h" || a === "--help") args.help = true;
  }
  return args;
}

function usageAndExit(code = 0) {
  console.log(
    "Usage: node scripts/render.mjs --in <cards dir> --out <png dir> [--assets <dir>]\n" +
      "  Renders each cards/card-NN.html to out/card-NN.png at exactly 1080x1350.\n" +
      "  --assets defaults to the skill's own assets/ (scripts/../assets); the renderer\n" +
      "  injects base.css from there, so cards' relative ../base.css path need not resolve.\n" +
      "  First run needs chromium:  npx playwright install chromium"
  );
  process.exit(code);
}

async function loadPlaywright() {
  try {
    const mod = await import("playwright");
    return mod.chromium;
  } catch (err) {
    console.error(
      "\n[render.mjs] Could not load Playwright.\n" +
        "  Install it once in this skill's scripts/ folder:\n" +
        "    pnpm install --prefix scripts\n" +
        "  Then download the browser binary:\n" +
        "    npx playwright install chromium\n"
    );
    throw err;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.in || !args.out) usageAndExit(args.help ? 0 : 1);

  const inDir = path.resolve(args.in);
  const outDir = path.resolve(args.out);
  const assetsDir = path.resolve(args.assets || DEFAULT_ASSETS);

  if (!existsSync(inDir)) {
    console.error(`[render.mjs] --in directory does not exist: ${inDir}`);
    process.exit(1);
  }
  const baseCssPath = path.join(assetsDir, "base.css");
  if (!existsSync(baseCssPath)) {
    console.error(
      `[render.mjs] base.css not found in assets dir: ${baseCssPath}\n` +
        "  Pass the correct --assets <dir> (it must contain base.css and fonts/)."
    );
    process.exit(1);
  }
  // file:// href to the canonical base.css the renderer injects into every card.
  const baseCssHref = pathToFileURL(baseCssPath).href;
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(inDir))
    .filter((f) => /^card-\d+\.html$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.error(`[render.mjs] No card-NN.html files found in ${inDir}`);
    process.exit(1);
  }

  const chromium = await loadPlaywright();

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    console.error(
      "\n[render.mjs] chromium failed to launch — it is probably not installed.\n" +
        "  Run this one-time download (large, ~150MB):\n" +
        "    npx playwright install chromium\n"
    );
    throw err;
  }

  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
  });

  const failures = [];
  try {
    for (const file of files) {
      const htmlPath = path.join(inDir, file);
      const pngName = file.replace(/\.html$/i, ".png");
      const pngPath = path.join(outDir, pngName);

      const page = await context.newPage();
      await page.setViewportSize({ width: W, height: H });
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });

      // Renderer-resolved styling: drop whatever base.css <link> the card shipped
      // (its relative ../base.css may not resolve from this cards/ location) and
      // inject the canonical base.css from --assets. @font-face urls inside base.css
      // are relative to base.css itself, so the bundled Pretendard fonts also resolve.
      await page.evaluate((href) => {
        for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
          link.parentNode.removeChild(link);
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        // Insert FIRST so base.css loads before any per-card <style> block, keeping
        // the original cascade (per-card styles override base, brand vars win).
        document.head.insertBefore(link, document.head.firstChild);
      }, baseCssHref);

      // Let the freshly-injected stylesheet load before measuring/capturing.
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
            let pending = links.length;
            if (pending === 0) return resolve();
            for (const l of links) {
              if (l.sheet) {
                if (--pending === 0) resolve();
              } else {
                l.addEventListener("load", () => --pending === 0 && resolve());
                l.addEventListener("error", () => --pending === 0 && resolve());
              }
            }
          })
      );

      // Wait for bundled Pretendard to be ready BEFORE capture so there is no
      // fallback-font flash and line breaks are stable.
      await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      });

      const card = await page.$(".card");
      const target = card || page;
      await target.screenshot({ path: pngPath });

      // Assert exact dimensions from the captured buffer.
      const buf = await readFile(pngPath);
      const { width, height } = pngSize(buf);
      if (width !== W || height !== H) {
        failures.push(
          `${pngName}: rendered ${width}x${height}, expected ${W}x${H}`
        );
        console.error(`  ✗ ${pngName}  ${width}x${height} (WRONG)`);
      } else {
        console.log(`  ✓ ${pngName}  ${width}x${height}`);
      }
      await page.close();
    }
  } finally {
    await context.close();
    await browser.close();
  }

  if (failures.length > 0) {
    console.error(
      `\n[render.mjs] ${failures.length} card(s) not exactly ${W}x${H}:`
    );
    for (const f of failures) console.error("  - " + f);
    throw new Error("Dimension assertion failed — see above.");
  }

  console.log(
    `\n[render.mjs] OK — ${files.length} card(s) rendered to ${outDir}, all ${W}x${H}.`
  );
}

/** Minimal PNG IHDR width/height reader (no deps). */
function pngSize(buf) {
  // PNG signature is 8 bytes; IHDR length(4)+type(4) then width(4) height(4).
  const sig = "\x89PNG\r\n\x1a\n";
  for (let i = 0; i < 8; i++) {
    if (buf[i] !== sig.charCodeAt(i)) {
      throw new Error("Not a PNG file");
    }
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

main().catch((err) => {
  console.error("\n[render.mjs] FAILED:", err.message);
  process.exit(1);
});
