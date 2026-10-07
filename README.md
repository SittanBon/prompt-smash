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
```

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

The display stack prefers Futura or Futura PT when the viewer already has it installed (for example on macOS), and otherwise falls back to Avenir Next, Century Gothic or the system sans-serif. No commercial font files are bundled.
