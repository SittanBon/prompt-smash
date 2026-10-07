# Prompt Smash! — Content Coverage Matrix

**Purpose:** make missing content obvious. A unit counts as finished **only at ✅ Approved**. A field existing in `src/data/schema.ts` does **not** mean its content exists.
**Rules:** `CONTENT_CONSTITUTION.md`. **Last updated:** Deadline Numbered Prompt 8 (2026-10-08). The four-journey interface is built. Every unit whose content is reachable and working in the browser is now 🧩 UX integrated. Units already tagged “+ 🧪 tested” now formally count as 🧪 Prompt tested, as the tag rule below says. The exception is Bacon Cheese’s interpretation-only testing, which stays below 🧪 because no image model was run. Final editorial approval is still open for all four journeys.

## Status pipeline

Each unit moves left to right. Skipping a stage needs the owner's approval.

**The "+ 🧪 tested" tag** marks a unit whose example prompt was already run in illustrative tests, ahead of UX integration. The unit's stage is unchanged. It only reaches 🧪 Prompt tested formally once it has been UX integrated.

| Status | Meaning |
|---|---|
| ⬜ Not started | Nothing written |
| ✏️ Drafted | First draft exists |
| 📘 Theory reviewed | Prompt-expert review passed (accuracy, layer consistency, Simple/Pro contract) |
| 🛡️ Safety reviewed | Responsible-AI and data-protection review passed |
| 🧩 UX integrated | Content is live in the interface and checked in the browser |
| 🧪 Prompt tested | Example prompts were run against a real model and behaved as described |
| ✅ Approved | Owner sign-off |

## Totals

| Scope | Units | ⬜ Not started | ✏️ Drafted | 📘 Theory reviewed | 🛡️ Safety reviewed | 🧩 UX integrated | 🧪 Prompt tested | ✅ Approved |
|---|---|---|---|---|---|---|---|---|
| Hamburger | 62 | 1 | 0 | 0 | 0 | 48 | 12 | 1 |
| Crispy Chicken Burger | 63 | 1 | 0 | 0 | 0 | 47 | 14 | 1 |
| Bacon Cheese Burger | 62 | 1 | 0 | 0 | 1 | 59 | 0 | 1 |
| Chilli Cheese Burger | 62 | 1 | 0 | 0 | 0 | 59 | 1 | 1 |
| Site-wide chapters | 16 | 0 | 0 | 0 | 0 | 15 | 0 | 1 |
| **All** | **265** | **4** | **0** | **0** | **1** | **228** | **27** | **5** |

The four remaining ⬜ units are the per-journey editorial approvals. They wait for the owner’s visual review of the interface. The one 🛡️ unit is Bacon Cheese’s interpretation-only prompt testing.

**Launch readiness: 5 of 265 units approved. All required content is written, and 260 of 265 units are UX integrated or beyond.**

Units per burger:
- Framing: 2
- Seven layers × 6 parts: 42
- Worked example: 1
- Techniques: 1
- Exercises: 4
- BITE: 4
- Safety checks: 5
- Summary, testing and approval: 3

Total: 62 per burger. Crispy Chicken has 63, because it also has an evaluation plan.

The Simple column includes the layer's metaphor link. Any example answer counts under Input.

---

## Hamburger — Prompt Design

Anchor use case (approved): *Create a one-week cross-channel marketing content plan from an approved campaign brief for a fictional European lifestyle retailer.* Originally proposed as: *Structure a useful prompt for a practical GenAI marketing or content workflow.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🧩 UX integrated | Also key ideas and title |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 2 | Patty / main filling | **Task** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 3 | Cheese | **Context/Input** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 4 | Toppings | **Requirements/Details** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 5 | Sauce | **Style/Quality** | Optional | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 6 | Bottom Bun | **Output Format** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🧪 Prompt tested | Also includes the first-screen comparison, why it is better, limitations and a non-marketing variation |
| Relevant techniques (linked to the Technique Lab) | 🧩 UX integrated | Technique bridge: zero-shot, one-shot, iteration |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated | Seven exercises written; rows 1–4 track the required minimum, and exercises 5–7 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🧩 UX integrated |
| I — Information | 🧩 UX integrated |
| T — Taste | 🧩 UX integrated |
| E — Expected result | 🧩 UX integrated |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🧩 UX integrated |
| Injection | 🧪 Prompt tested |
| Hallucination | 🧪 Prompt tested |
| Bias | 🧩 UX integrated |
| Data Protection | 🧪 Prompt tested |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🧩 UX integrated | |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🧪 Prompt tested | 7 scenarios plus 2 re-runs, illustrative only. See content/tests/hamburger-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting the owner’s visual review. The journey has been UX integrated since Prompt 8. |

---

## Crispy Chicken Burger — Prompt Engineering

Anchor use case (approved): *Systematically test and improve a repeatable prompt that analyses fictional customer feedback and produces an evidence-linked business-priority report.* Originally proposed as: *Systematically test and improve a repeatable business-analysis prompt.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🧩 UX integrated | Also includes key ideas and the first-screen approach comparison |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 2 | Patty / main filling | **Task** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 3 | Cheese | **Context/Input** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 4 | Toppings | **Requirements/Details** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 5 | Sauce | **Style/Quality** | Optional | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 6 | Bottom Bun | **Output Format** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧪 Prompt tested | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🧪 Prompt tested | Also includes the test cycle (baseline, failure, one change, retest), limitations and a non-feedback variation |
| Evaluation plan (test cases, criteria, iterations v1→vN) | 🧪 Prompt tested | 9 criteria, 10 test cases, V0 → V3.1. Results come from illustrative runs. |
| Relevant techniques (linked to the Technique Lab) | 🧩 UX integrated | Bridge: few-shot, structured approach, iterative evaluation |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated | Ten exercises written; rows 1–4 track the minimum, and exercises 5–10 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🧩 UX integrated |
| I — Information | 🧩 UX integrated |
| T — Taste | 🧩 UX integrated |
| E — Expected result | 🧩 UX integrated |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🧪 Prompt tested |
| Injection | 🧪 Prompt tested |
| Hallucination | 🧪 Prompt tested |
| Bias | 🧩 UX integrated |
| Data Protection | 🧪 Prompt tested |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🧩 UX integrated | |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🧪 Prompt tested | 19 illustrative runs (versions, techniques, 10 scenarios, chain, retest, final ×2). See content/tests/crispy-chicken-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting the owner’s visual review. The journey has been UX integrated since Prompt 8. |

---

## Bacon Cheese Burger — Text-to-Image

Anchor use case (approved): *Create a cinematic homepage hero image of a premium separated burger for the fictional Prompt Smash learning website.* Originally proposed as: *Create a clear visual prompt for a polished website hero image.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🧩 UX integrated | Also key ideas and title |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 2 | Patty / main filling | **Task** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 3 | Cheese | **Context/Input** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 4 | Toppings | **Requirements/Details** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 5 | Sauce | **Style/Quality** | Optional | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 6 | Bottom Bun | **Output Format** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🧩 UX integrated | Also includes the first-screen comparison, why it is better, a written image description (no image generated), limitations and an image-edit variation |
| Relevant techniques (linked to the Technique Lab) | 🧩 UX integrated | Bridge: one reference image, generate then edit, iterative visual critique |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated | Eight exercises written; rows 1–4 track the minimum, and exercises 5–8 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🧩 UX integrated |
| I — Information | 🧩 UX integrated |
| T — Taste | 🧩 UX integrated |
| E — Expected result | 🧩 UX integrated |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🧩 UX integrated |
| Injection | 🧩 UX integrated |
| Hallucination | 🧩 UX integrated |
| Bias | 🧩 UX integrated |
| Data Protection | 🧩 UX integrated |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🧩 UX integrated | Also journey-specific interface microcopy |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🛡️ Safety reviewed + 🧪 tested | 3 illustrative interpretation tests (full, no composition, identity-sensitive). No image model was used, so this stays interpretation-only and does not reach 🧪 Prompt tested (owner decision, Prompt 8). See content/tests/bacon-cheese-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting the owner’s visual review. The journey has been UX integrated since Prompt 8. |

---

## Chilli Cheese Burger — Text-to-Code

Anchor use case (approved): *Build a responsive, accessible seven-step progress component for a static React and TypeScript learning website.* Originally proposed as: *Request a small, responsive and testable interactive web feature.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🧩 UX integrated | Also key ideas and title |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 2 | Patty / main filling | **Task** | Required | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 3 | Cheese | **Context/Input** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 4 | Toppings | **Requirements/Details** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 5 | Sauce | **Style/Quality** | Optional | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 6 | Bottom Bun | **Output Format** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated | 🧩 UX integrated |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🧩 UX integrated | Also includes the first-screen comparison, why it is better, a code-output description with an excerpt, limitations and a debugging variation |
| Relevant techniques (linked to the Technique Lab) | 🧩 UX integrated | Bridge: plan → implement → test → repair, sample inputs and expected outputs, tests as the check |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated | Nine exercises written; rows 1–4 track the minimum, and exercises 5–9 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🧩 UX integrated |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🧩 UX integrated |
| I — Information | 🧩 UX integrated |
| T — Taste | 🧩 UX integrated |
| E — Expected result | 🧩 UX integrated |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🧩 UX integrated |
| Injection | 🧩 UX integrated |
| Hallucination | 🧩 UX integrated |
| Bias | 🧩 UX integrated |
| Data Protection | 🧩 UX integrated |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🧩 UX integrated | Also journey-specific interface microcopy |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🧪 Prompt tested | 3 illustrative runs (full, no environment, secret plus injection). The code was read, not executed. See content/tests/chilli-cheese-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting the owner’s visual review. The journey has been UX integrated since Prompt 8. |

---

## Site-wide chapters

Source: `src/data/sharedContent.ts`, rendered to `content/shared-handbook.md`.

| Section | Status | Notes |
|---|---|---|
| Homepage hero copy | ✅ Approved | Supplied by the owner (Prompt 3), implemented, and the foundation was approved |
| Welcome chapter | 🧩 UX integrated | Covers what a prompt is, prompt versus output, Design versus Engineering, why longer is not better, the seven layers, Simple and Pro, the weak-to-better demo and choosing a burger |
| Four-burger selector copy (“Best for” lines) | 🧩 UX integrated | Shown on the home-page journey cards and in the welcome chapter |
| Technique Lab: zero-shot, one-shot, few-shot | 🧩 UX integrated | Written in the Crispy Chicken Technique Lab (Prompt 6) |
| Technique Lab: other techniques | 🧩 UX integrated | Structured approach, self-consistency, alternative paths, prompt chaining and iterative evaluation (Crispy Chicken pack) |
| BITE chapter | 🧩 UX integrated | The hero’s “See how BITE works” link now opens it |
| Responsible-AI chapter (5 checks, review states, prompt vs workflow) | 🧩 UX integrated | Includes when “Not relevant” is legitimate, why the review cannot be switched off, and the disclaimer |
| DACH case study (instructional reconstruction only) | 🧩 UX integrated | Uses only the approved facts. “2+2” replaced with the owner’s explanation (two pilot locations, two comparable locations on the existing workflow, four in total), framed as a comparison, not a formal experiment. |
| Glossary | 🧩 UX integrated | 17 essential terms, Simple and Pro |
| About the method | 🧩 UX integrated | |
| Accessibility help | 🧩 UX integrated | Each feature has planned and present-tense wording; the present tense shows only for features flagged as implemented (all six are built) |
| Privacy and local saving | 🧩 UX integrated | Now describes the current site: local saving, downloads and clearing are built |
| Educational disclaimer | 🧩 UX integrated | |
| Footer | 🧩 UX integrated | |
| 404 / invalid state | 🧩 UX integrated | Invalid journey, invalid layer, 404 and invalid shared link |
| Global microcopy | 🧩 UX integrated | 31 interface states. Reuses the live-prompt microcopy wording, so the same action always has the same words. |
