# Prompt Smash! — Content Coverage Matrix

**Purpose:** make missing content obvious. A unit counts as finished **only at ✅ Approved**. A field existing in `src/data/schema.ts` does **not** mean its content exists.
**Rules:** `CONTENT_CONSTITUTION.md`. **Last updated:** Deadline Numbered Prompt 7 (2026-10-07). All four journey packs, the Technique Lab, every shared chapter and the global microcopy are written and reviewed. Nothing is UX integrated yet, so no unit can reach ✅ beyond those the owner already approved.

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
| Hamburger | 62 | 1 | 0 | 0 | 59 | 0 | 1 | 1 |
| Crispy Chicken Burger | 63 | 1 | 0 | 0 | 60 | 0 | 1 | 1 |
| Bacon Cheese Burger | 62 | 1 | 0 | 0 | 60 | 0 | 0 | 1 |
| Chilli Cheese Burger | 62 | 1 | 0 | 0 | 59 | 0 | 1 | 1 |
| Site-wide chapters | 16 | 0 | 0 | 0 | 15 | 0 | 0 | 1 |
| **All** | **265** | **4** | **0** | **0** | **253** | **0** | **3** | **5** |

The four remaining ⬜ units are the per-journey editorial approvals. These can only happen after interface review.

**Launch readiness: 5 of 265 units approved. All required content is written.**

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
| Short description, “Best for”, learning outcomes | 🛡️ Safety reviewed | Also key ideas and title |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 2 | Patty / main filling | **Task** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 3 | Cheese | **Context/Input** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 4 | Toppings | **Requirements/Details** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 5 | Sauce | **Style/Quality** | Optional | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 6 | Bottom Bun | **Output Format** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🛡️ Safety reviewed + 🧪 tested | Also includes the first-screen comparison, why it is better, limitations and a non-marketing variation |
| Relevant techniques (linked to the Technique Lab) | 🛡️ Safety reviewed | Technique bridge: zero-shot, one-shot, iteration |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed | Seven exercises written; rows 1–4 track the required minimum, and exercises 5–7 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🛡️ Safety reviewed |
| I — Information | 🛡️ Safety reviewed |
| T — Taste | 🛡️ Safety reviewed |
| E — Expected result | 🛡️ Safety reviewed |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🛡️ Safety reviewed |
| Injection | 🛡️ Safety reviewed + 🧪 tested |
| Hallucination | 🛡️ Safety reviewed + 🧪 tested |
| Bias | 🛡️ Safety reviewed |
| Data Protection | 🛡️ Safety reviewed + 🧪 tested |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🛡️ Safety reviewed | |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🧪 Prompt tested | 7 scenarios plus 2 re-runs, illustrative only. See content/tests/hamburger-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting owner. No unit can reach ✅ before UX integration. |

---

## Crispy Chicken Burger — Prompt Engineering

Anchor use case (approved): *Systematically test and improve a repeatable prompt that analyses fictional customer feedback and produces an evidence-linked business-priority report.* Originally proposed as: *Systematically test and improve a repeatable business-analysis prompt.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🛡️ Safety reviewed | Also includes key ideas and the first-screen approach comparison |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 2 | Patty / main filling | **Task** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 3 | Cheese | **Context/Input** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 4 | Toppings | **Requirements/Details** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 5 | Sauce | **Style/Quality** | Optional | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 6 | Bottom Bun | **Output Format** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed + 🧪 tested | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🛡️ Safety reviewed + 🧪 tested | Also includes the test cycle (baseline, failure, one change, retest), limitations and a non-feedback variation |
| Evaluation plan (test cases, criteria, iterations v1→vN) | 🛡️ Safety reviewed + 🧪 tested | 9 criteria, 10 test cases, V0 → V3.1. Results come from illustrative runs. |
| Relevant techniques (linked to the Technique Lab) | 🛡️ Safety reviewed | Bridge: few-shot, structured approach, iterative evaluation |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed | Ten exercises written; rows 1–4 track the minimum, and exercises 5–10 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🛡️ Safety reviewed |
| I — Information | 🛡️ Safety reviewed |
| T — Taste | 🛡️ Safety reviewed |
| E — Expected result | 🛡️ Safety reviewed |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🛡️ Safety reviewed + 🧪 tested |
| Injection | 🛡️ Safety reviewed + 🧪 tested |
| Hallucination | 🛡️ Safety reviewed + 🧪 tested |
| Bias | 🛡️ Safety reviewed |
| Data Protection | 🛡️ Safety reviewed + 🧪 tested |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🛡️ Safety reviewed | |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🧪 Prompt tested | 19 illustrative runs (versions, techniques, 10 scenarios, chain, retest, final ×2). See content/tests/crispy-chicken-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting owner. No unit can reach ✅ before UX integration. |

---

## Bacon Cheese Burger — Text-to-Image

Anchor use case (approved): *Create a cinematic homepage hero image of a premium separated burger for the fictional Prompt Smash learning website.* Originally proposed as: *Create a clear visual prompt for a polished website hero image.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🛡️ Safety reviewed | Also key ideas and title |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 2 | Patty / main filling | **Task** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 3 | Cheese | **Context/Input** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 4 | Toppings | **Requirements/Details** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 5 | Sauce | **Style/Quality** | Optional | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 6 | Bottom Bun | **Output Format** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🛡️ Safety reviewed | Also includes the first-screen comparison, why it is better, a written image description (no image generated), limitations and an image-edit variation |
| Relevant techniques (linked to the Technique Lab) | 🛡️ Safety reviewed | Bridge: one reference image, generate then edit, iterative visual critique |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed | Eight exercises written; rows 1–4 track the minimum, and exercises 5–8 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🛡️ Safety reviewed |
| I — Information | 🛡️ Safety reviewed |
| T — Taste | 🛡️ Safety reviewed |
| E — Expected result | 🛡️ Safety reviewed |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🛡️ Safety reviewed |
| Injection | 🛡️ Safety reviewed |
| Hallucination | 🛡️ Safety reviewed |
| Bias | 🛡️ Safety reviewed |
| Data Protection | 🛡️ Safety reviewed |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🛡️ Safety reviewed | Also journey-specific interface microcopy |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🛡️ Safety reviewed + 🧪 tested | 3 illustrative interpretation tests (full, no composition, identity-sensitive). No image model was used. See content/tests/bacon-cheese-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting owner. No unit can reach ✅ before UX integration. |

---

## Chilli Cheese Burger — Text-to-Code

Anchor use case (approved): *Build a responsive, accessible seven-step progress component for a static React and TypeScript learning website.* Originally proposed as: *Request a small, responsive and testable interactive web feature.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | 🛡️ Safety reviewed | Also key ideas and title |
| Anchor use case | ✅ Approved | Confirmed by the owner in Numbered Prompt 5 |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 2 | Patty / main filling | **Task** | Required | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 3 | Cheese | **Context/Input** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 4 | Toppings | **Requirements/Details** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 5 | Sauce | **Style/Quality** | Optional | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 6 | Bottom Bun | **Output Format** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed | 🛡️ Safety reviewed |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | 🛡️ Safety reviewed | Also includes the first-screen comparison, why it is better, a code-output description with an excerpt, limitations and a debugging variation |
| Relevant techniques (linked to the Technique Lab) | 🛡️ Safety reviewed | Bridge: plan → implement → test → repair, sample inputs and expected outputs, tests as the check |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed | Nine exercises written; rows 1–4 track the minimum, and exercises 5–9 are also reviewed |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | 🛡️ Safety reviewed |  |

### BITE

| Letter | Status |
|---|---|
| B — Brief | 🛡️ Safety reviewed |
| I — Information | 🛡️ Safety reviewed |
| T — Taste | 🛡️ Safety reviewed |
| E — Expected result | 🛡️ Safety reviewed |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | 🛡️ Safety reviewed |
| Injection | 🛡️ Safety reviewed |
| Hallucination | 🛡️ Safety reviewed |
| Bias | 🛡️ Safety reviewed |
| Data Protection | 🛡️ Safety reviewed |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | 🛡️ Safety reviewed | Also journey-specific interface microcopy |
| Prompt testing (final prompt run against at least one real model, with results noted) | 🧪 Prompt tested | 3 illustrative runs (full, no environment, secret plus injection). The code was read, not executed. See content/tests/chilli-cheese-prompt-tests.md |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Awaiting owner. No unit can reach ✅ before UX integration. |

---

## Site-wide chapters

Source: `src/data/sharedContent.ts`, rendered to `content/shared-handbook.md`.

| Section | Status | Notes |
|---|---|---|
| Homepage hero copy | ✅ Approved | Supplied by the owner (Prompt 3), implemented, and the foundation was approved |
| Welcome chapter | 🛡️ Safety reviewed | Covers what a prompt is, prompt versus output, Design versus Engineering, why longer is not better, the seven layers, Simple and Pro, the weak-to-better demo and choosing a burger |
| Four-burger selector copy (“Best for” lines) | 🛡️ Safety reviewed | In the welcome chapter. Not yet shown on the cards. |
| Technique Lab: zero-shot, one-shot, few-shot | 🛡️ Safety reviewed | Written in the Crispy Chicken Technique Lab (Prompt 6) |
| Technique Lab: other techniques | 🛡️ Safety reviewed | Structured approach, self-consistency, alternative paths, prompt chaining and iterative evaluation (Crispy Chicken pack) |
| BITE chapter | 🛡️ Safety reviewed | Restores the hero’s “See how BITE works” link once built |
| Responsible-AI chapter (5 checks, review states, prompt vs workflow) | 🛡️ Safety reviewed | Includes when “Not relevant” is legitimate, why the review cannot be switched off, and the disclaimer |
| DACH case study (instructional reconstruction only) | 🛡️ Safety reviewed | Uses only the approved facts. The meaning of “2+2” is not explained and awaits the owner. |
| Glossary | 🛡️ Safety reviewed | 17 essential terms, Simple and Pro |
| About the method | 🛡️ Safety reviewed | |
| Accessibility help | 🛡️ Safety reviewed | Written as planned capabilities until they are built |
| Privacy and local saving | 🛡️ Safety reviewed | Marked as planned behaviour until saving is built |
| Educational disclaimer | 🛡️ Safety reviewed | |
| Footer | 🛡️ Safety reviewed | |
| 404 / invalid state | 🛡️ Safety reviewed | Invalid journey, invalid layer, 404 and invalid shared link |
| Global microcopy | 🛡️ Safety reviewed | 31 interface states. Reuses the live-prompt microcopy wording, so the same action always has the same words. |
