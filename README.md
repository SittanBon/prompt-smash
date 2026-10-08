# Prompt Smash!

**Prompt Smash! — Build Better AI Prompts** is an interactive prompting handbook. It teaches how to write effective AI prompts with a hamburger metaphor: every prompt is a burger built from seven layers, in a fixed order.

## The four learning journeys

| Burger | Journey | Focus |
|---|---|---|
| Hamburger | Prompt Design | The seven-layer method itself, built one layer at a time |
| Crispy Chicken Burger | Prompt Engineering | Techniques, testing and iteration in the Technique Lab |
| Bacon Cheese Burger | Text-to-Image | Image prompts, built with the same seven layers |
| Chilli Cheese Burger | Text-to-Code | Code prompts, with a responsible-AI review before you finish |

All four journeys share one engine. Each one has an overview, a seven-layer builder with a live prompt, techniques, exercises, a review and a finish screen. Shared handbook chapters cover BITE, responsible AI, a DACH case study, a glossary, privacy and accessibility.

## The seven-layer burger method

1. Top bun — Goal
2. Patty — Task
3. Cheese — Context and Input
4. Toppings — Requirements and Details
5. Sauce — Style and Quality
6. Bottom bun — Output Format
7. Wrapper — Rules and Boundaries

## Simple and Pro modes

**Simple** mode explains each idea in everyday words. **Pro** mode keeps that text and adds professional terms, trade-offs and workplace advice. You can switch at any time without losing your answers.

## BITE and the responsible-AI review

**BITE** is the final check of a written prompt: **B**rief (Goal and Task), **I**nformation (Context and Requirements), **T**aste (Style and Quality) and **E**xpected result (Format and Boundaries). BITE does not mean a prompt is correct or safe.

The **responsible-AI review** follows BITE and cannot be switched off. It has five checks: Risk, Injection, Hallucination, Bias and Data Protection. Every check starts as "Not yet reviewed", and nothing is pre-marked as safe.

## Privacy

- Everything runs in the browser. There is no server-side code, no account and no analytics.
- Your answers are saved only in this browser's local storage, under one key (`prompt-smash:v1:work`), and you can clear them from the site.
- Your prompt text is never sent to a server and never placed in the URL. Routes such as `#/hamburger/layer/goal` carry only navigation.
- Copy and download (`.txt` and `.md`) happen entirely in the browser.

## Accessibility

- Every control works with a keyboard and has a visible focus outline. A skip link leads to the main content.
- Form controls are labelled, and the seven-step progress indicator is announced to screen readers.
- States never rely on colour alone.
- Layouts adapt down to 320 px wide. On small screens, the live prompt opens in a labelled bottom sheet.
- When the device asks for reduced motion, the scroll animation is replaced by a static layout.

## Stack

- Vite + React + TypeScript, with plain CSS (design tokens in `src/styles/tokens.css`)
- No server-side code. Hash-based routing, so every page can be refreshed or shared on GitHub Pages.

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

**Node.js:** Node 24 is the recommended version for development and is used by the deployment workflow (`.nvmrc`). Node 22.18 is the minimum supported version (`engines` in `package.json`), because the content scripts use Node's built-in TypeScript type stripping.

## Project structure

| Path | Purpose |
|---|---|
| `src/app/` | Interface engine: journey registry and themes, hash router, learner state and local saving, copy and download |
| `src/components/` | Navigation, hero, CSS burger, journey selector and footer |
| `src/components/journey/` | The shared journey engine: overview, seven-layer builder, live prompt, techniques, testing, exercises, BITE, responsible-AI review, finish |
| `src/components/handbook/` | Shared handbook chapters |
| `src/data/` | Typed content (the single source of truth), framework definitions and the prompt assembler |
| `src/styles/` | Design tokens and global styles |
| `public/assets/source/` | Approved source assets |
| `public/assets/generated/` | Approved, optimised generated assets |
| `ref/` | Visual references and `REFERENCE_MANIFEST.md` (the confirmed reference hierarchy) |
| `qa/tools/` | Screenshot and comparison helpers (headless Chrome) |
| `qa/screenshots/`, `qa/comparisons/` | QA captures (local only, not committed) |
| `backups/` | Timestamped restore points (local only, not committed) |

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
| `src/data/sharedContent.ts`, `src/data/sharedSchema.ts` | **Source of truth** and types for the shared chapters (welcome, BITE, responsible AI, case study, glossary, about, privacy, accessibility, disclaimer, footer, errors, global microcopy) |
| `src/data/promptAssembly.ts` | Live-prompt assembly rules, microcopy and the pure `assemblePrompt` function |
| `content/*.md` | Editorial versions, **generated** from the journey files. Never edit them by hand. |
| `content/tests/` | Illustrative prompt-test reports |
| `src/data/fixtures/` | Fictional datasets used by journeys and tests (for example the customer-feedback sample) |
| `scripts/build-test-prompts.mjs` | Builds the illustrative test prompts from the real content and assembler into `qa/content-tests/` (local only) |
| `ref/REFERENCE_MANIFEST.md` | Visual reference hierarchy. The reference images stay local and are not committed. |

## Deployment (GitHub Pages)

The site is deployed by GitHub Actions (`.github/workflows/deploy-pages.yml`) on every push to `main`. The workflow runs on Node 24 and does the following:

1. Installs dependencies with `npm ci`
2. Runs `npm run content:check` and `npm run typecheck`
3. Builds with `npm run build`
4. Uploads `dist/` as the Pages artifact and deploys it

Only one deployment runs at a time. In the repository settings, **Pages → Source** must be set to **GitHub Actions**.

**Base path:** `vite.config.ts` reads the base path from the real repository. In CI it uses `actions/configure-pages`, which gives `/prompt-smash/` for a project site and `/` for a `USERNAME.github.io` repository. Local builds use a relative base (`./`), so `dist/` works from any sub-path. To test a local build under the Pages sub-path:

```bash
PAGES_BASE_PATH=/prompt-smash npm run build
```

## Current limitations and next steps

- In this release, the burgers are CSS illustrations, not photographs.
- After the deadline, the plan is higher-fidelity burger and ingredient visuals. These will be optimised assets for each of the seven layers and the four burgers, art-directed to match the current palette and focus states, with the CSS illustrations kept as a fallback.
