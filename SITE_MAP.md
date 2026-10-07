# Prompt Smash! — Site Map

**Status:** planning document (Numbered Prompt 4). Nothing here is implemented beyond the homepage hero from Numbered Prompt 3.
**Governed by:** `CONTENT_CONSTITUTION.md`.

## 1. Architecture

The site is a **single static page application**, built with Vite and deployed later to GitHub Pages.

- **No server.** Every route resolves inside the browser.
- **Long-scroll chapters with in-page navigation.** The cinematic burger journeys need continuous native scrolling, so separate pages don't fit.
- **Shareable states use the URL hash**, for example `#/hamburger/layer/task?mode=pro`. GitHub Pages can't rewrite deep paths, so hash routing is the reliable choice there. A `404.html` fallback catches mistyped paths.
- **No router is added yet.** The URL scheme below is a plan.

## 2. Page and section inventory

| # | Section | Purpose (what, why, what next) | Key contents | Status |
|---|---|---|---|---|
| 1 | **Homepage hero** | Introduces the promise and invites the learner to start | Oversized "PROMPT SMASH!", burger, badge, "Start building", BITE note, scroll cue | Static version built (Prompt 3) |
| 2 | **Four-burger selector** | Lets the learner choose a journey | Four cards: name, discipline, "Best for" line, progress indicator | Built in the hero as a compact preview |
| 3 | **Hamburger journey: Prompt Design** | Teaches the seven layers using the anchor case | Purpose intro → scroll-driven burger → seven focus states with handbook panels → live prompt → techniques → BITE → responsible-AI review → copy and download → result and summary | Planned (first to build) |
| 4 | **Crispy Chicken journey: Prompt Engineering** | Testing and iterating on repeatable prompts | Same journey frame with discipline-specific content | Planned |
| 5 | **Bacon Cheese journey: Text-to-Image** | Visual prompts | Same journey frame | Planned |
| 6 | **Chilli Cheese journey: Text-to-Code** | Coding prompts | Same journey frame | Planned |
| 7 | **Technique Lab** | Zero-shot, one-shot, few-shot and other techniques, shown side by side | Technique cards, comparison, "when to use", linked from journeys. Dark contrasting chapter (per the manifest) | Planned |
| 8 | **BITE chapter** | Explains and runs the final quality check | Four letters, linked layers, an interactive check of the learner's prompt | Planned. The hero's "See how BITE works" link is restored when this exists. |
| 9 | **Responsible-AI chapter** | Explains the five checks in depth | Risk, Injection, Hallucination, Bias and Data Protection; review states; prompt instruction vs workflow control | Planned |
| 10 | **DACH case study** | Professional proof | A neutral, anonymised instructional reconstruction of a prompt structure | Planned |
| 11 | **Glossary** | Plain definitions of every term used | A–Z list, each entry with a Simple and a Pro definition | Planned |
| 12 | **About the method** | Why the burger works, and its limits | The seven-layer rationale, BITE, the review model, sources | Planned |
| 13 | **Accessibility help** | How to use the site with a keyboard, screen reader or reduced motion | Shortcuts, motion settings, contact | Planned |
| 14 | **Privacy and local saving** | Explains browser-only storage | What is stored, where, how to clear it, what is never sent | Planned |
| 15 | **Educational disclaimer** | Sets expectations | Not legal, security or compliance advice; AI outputs need checking | Planned |
| 16 | **Footer** | Persistent secondary navigation | Links to 7, 8, 9, 10, 11, 12, 13, 14 and 15; licence notices | Planned |
| 17 | **404 / invalid state** | Recovers from bad links | Friendly message and a link back to the selector. Handles unknown journeys and layers, and broken saved state. | Planned |

## 3. Journey anatomy (shared by all four burgers)

1. **Purpose:** what this burger is for, "Best for", the learning outcomes and the anchor use case, plus a short **weak-versus-improved prompt** comparison on the first screen
2. **Assembled burger:** the full stack at the start
3. **Separation:** the scroll-driven opening of the stack
4. **Seven focus states**, in fixed order. Each has:
   - the definition and the learner question
   - the answer field and its state message
   - collapsed extras: "See an example", "Practical tip", "Why it matters", "Common mistake" and "Learn more"
   - in Pro mode, one collapsible "Pro notes" panel (Constitution §3a)
5. **Live prompt:** assembles as layers are filled in, and is visible alongside the focus states
6. **Techniques:** a short bridge of at most three technique cards (one sentence each, linking into the Technique Lab), with "Continue to BITE" always visible
7. **BITE:** the final quality check
8. **Responsible-AI review:** five checks, each with its review state
9. **Copy or download:** `.txt` and `.md`
10. **Result and summary:** an example output (text, image or code, labelled "Example only. Real outputs vary."), the lesson summary and the next recommended journey. Crispy Chicken also shows its evaluation plan: test cases, criteria and iterations.

## 4. Navigation

### Desktop (from about 1024px)

- **Top bar** (pill navigation):
  - wordmark, which returns to the selector
  - the current journey
  - the Simple/Pro toggle
  - a chapter menu: Technique Lab, BITE, Responsible AI, Case study, Glossary
- **In a journey:**
  - a **vertical seven-dot progress indicator** on the right edge, adapted from ref5
    - each dot shows its ingredient and layer name on hover and focus
    - completed and available layers are clickable
  - the handbook panel sits beside the active ingredient
- **Chapter transitions** use native scrolling, with "Next" and "Back" links at each chapter end
- **The footer** holds the secondary pages

### Mobile (below about 768px)

- **Top bar:** wordmark plus the Simple/Pro toggle. The chapter menu becomes a "Menu" button that opens a full-height sheet with a focus trap.
- **Progress:** the vertical dots become a **horizontal seven-step progress bar**, fixed under the top bar while inside a journey. Tapping it opens a layer list.
- **Handbook panels** stack below the active ingredient, not beside it.
- **Live prompt:** a bottom sheet ("View prompt") rather than a side column.
- **Touch targets:** all at least 44 × 44px.

### Tablet

Tablet uses the desktop structure, with handbook panels below the burger when space is tight.

### Keyboard and assistive technology

- A skip link to the main content.
- Every navigation element can be reached with Tab.
- The progress indicator is an ordered list of links, with `aria-current="step"` on the active layer.
- Chapter headings form a logical outline.
- With reduced motion, the scroll journey becomes stepped sections with no motion.

## 5. Shareable state (planned URL scheme; not implemented)

| Hash | Meaning |
|---|---|
| `#/` | Homepage |
| `#/burgers` | Selector |
| `#/hamburger` | Hamburger journey start |
| `#/hamburger/layer/goal` … `/rules` | A specific focus state (layer keys: `goal`, `task`, `context`, `requirements`, `style`, `format`, `rules`) |
| `#/hamburger/bite` | That journey's BITE step |
| `#/hamburger/review` | That journey's responsible-AI review |
| `#/hamburger/summary` | That journey's result and summary |
| `#/technique-lab`, `#/bite`, `#/responsible-ai`, `#/case-study`, `#/glossary`, `#/about`, `#/accessibility`, `#/privacy`, `#/disclaimer` | Chapters and secondary pages |
| `?mode=simple` or `?mode=pro` | Optional query on any route |

The same pattern applies to `crispy-chicken`, `bacon-cheese` and `chilli-cheese`.

**Privacy rule:** URLs never contain the learner's text or answers. See Constitution §12.

**Invalid state:** an unknown journey or layer key shows the 404 / invalid-state content (section 17), with a link back to the selector.

## 6. Development-only exceptions (current)

- **Coming-later cards:** the three non-Hamburger cards show "Coming later" while in development. They must not remain that way at launch.
- **BITE note:** the hero's "See how BITE works" is temporarily plain text ("Final check: BITE — Brief · Information · Taste · Expected result"). It is restored as a link once the BITE chapter (section 8) exists.
