# Prompt Smash!

An interactive, cinematic prompting handbook that teaches how to build effective AI prompts through a hamburger metaphor. The first journey is **Hamburger — Prompt Design**.

## Stack

- Vite + React + TypeScript, with plain CSS (design tokens in `src/styles/tokens.css`)
- No server-side code. `base: './'` keeps asset paths portable for a future GitHub Pages deployment.

## Scripts

```bash
npm install
npm run dev        # local development server
npm run typecheck  # TypeScript only
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
npm run content:render  # regenerate content/*.md from the TypeScript content
npm run content:check   # check the content rules and that content/*.md is up to date
```

The content scripts need Node 22.18 or newer, for built-in TypeScript support.

## Project structure

| Path | Purpose |
|---|---|
| `src/components/` | UI components (navigation, hero, badge, burger placeholder, journey cards, teaser) |
| `src/data/` | Content and fixed data (hero copy, journeys, the seven-layer mapping) |
| `src/styles/` | Design tokens and global styles |
| `public/assets/source/` | Approved source assets |
| `public/assets/generated/` | Approved, optimised generated assets |
| `ref/` | Visual references and `REFERENCE_MANIFEST.md` (the confirmed reference hierarchy) |
| `qa/tools/` | Screenshot and comparison helpers (headless Chrome) |
| `qa/screenshots/`, `qa/comparisons/` | QA captures (local only, not committed) |
| `backups/` | Timestamped restore points (local only, not committed) |

## The seven Hamburger layers (fixed order)

1. Top bun — Goal
2. Patty — Task
3. Cheese — Context and Input
4. Toppings — Requirements and Details
5. Sauce — Style and Quality
6. Bottom bun — Output Format
7. Wrapper — Rules and Boundaries

## QA screenshots

```bash
qa/tools/shot.sh http://localhost:5173/ 1920 1080 qa/screenshots/name.png
qa/tools/shot-narrow.sh http://localhost:5173/ 390 844 qa/screenshots/name-mobile.png
```

Use `shot-narrow.sh` for widths below about 500px. It renders the page inside an exact-size iframe, because headless Chrome can't make its window that narrow.

## Fonts

All text uses **Jost** (SIL Open Font License 1.1). The site bundles it through `@fontsource/jost`, using the Latin subset in weights 400, 600 and 700, so it looks the same on every device and needs no CDN. System sans-serif fonts are fallbacks only. See `THIRD_PARTY_NOTICES.md`.

## Content governance

| Document | Role |
|---|---|
| `CONTENT_CONSTITUTION.md` | Authoritative content rules: layers, Simple/Pro, BITE, responsible-AI review, privacy |
| `SITE_MAP.md` | Planned sections, navigation and shareable URL scheme |
| `CONTENT_COVERAGE_MATRIX.md` | Progress of every content unit; "done" means ✅ Approved |
| `src/data/schema.ts` | TypeScript content schema for all four journeys |
| `src/data/framework.ts` | Fixed definitions: seven layers, BITE, safety checks, anchor use cases, shared review copy |
| `src/data/journeys/*.ts` | **Source of truth** for each journey's content pack |
| `src/data/promptAssembly.ts` | Live-prompt assembly rules, microcopy and the pure `assemblePrompt` function |
| `content/*.md` | Editorial versions, **generated** from the journey files. Never edit them by hand. |
| `content/tests/` | Illustrative prompt-test reports |
| `src/data/fixtures/` | Fictional datasets used by journeys and tests (for example the customer-feedback sample) |
| `scripts/build-test-prompts.mjs` | Builds the illustrative test prompts from the real content and assembler into `qa/content-tests/` (local only) |
| `ref/REFERENCE_MANIFEST.md` | Visual reference hierarchy. The reference images stay local and are not committed. |
