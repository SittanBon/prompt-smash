# Prompt Smash! — Content Coverage Matrix

**Purpose:** make missing content obvious. A unit counts as finished **only at ✅ Approved**. A field existing in `src/data/schema.ts` does **not** mean its content exists.
**Rules:** `CONTENT_CONSTITUTION.md`. **Last updated:** Numbered Prompt 4 (2026-10-07).

## Status pipeline

Each unit moves left to right. Skipping a stage needs the owner's approval.

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
| Hamburger | 62 | 61 | 1 | 0 | 0 | 0 | 0 | 0 |
| Crispy Chicken Burger | 63 | 62 | 1 | 0 | 0 | 0 | 0 | 0 |
| Bacon Cheese Burger | 62 | 61 | 1 | 0 | 0 | 0 | 0 | 0 |
| Chilli Cheese Burger | 62 | 61 | 1 | 0 | 0 | 0 | 0 | 0 |
| Site-wide chapters | 14 | 13 | 0 | 0 | 0 | 0 | 0 | 1 |
| **All** | **263** | **258** | **4** | **0** | **0** | **0** | **0** | **1** |

**Launch readiness: 1 of 263 units approved.**

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

Anchor use case (proposed): *Structure a useful prompt for a practical GenAI marketing or content workflow.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | ⬜ Not started | |
| Anchor use case | ✏️ Drafted | Proposed wording recorded in the Constitution §11; still needs to be confirmed |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 2 | Patty / main filling | **Task** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 3 | Cheese | **Context/Input** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 4 | Toppings | **Requirements/Details** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 5 | Sauce | **Style/Quality** | Optional | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 6 | Bottom Bun | **Output Format** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | ⬜ Not started | |
| Relevant techniques (linked to the Technique Lab) | ⬜ Not started | |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |

### BITE

| Letter | Status |
|---|---|
| B — Brief | ⬜ Not started |
| I — Information | ⬜ Not started |
| T — Taste | ⬜ Not started |
| E — Expected result | ⬜ Not started |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | ⬜ Not started |
| Injection | ⬜ Not started |
| Hallucination | ⬜ Not started |
| Bias | ⬜ Not started |
| Data Protection | ⬜ Not started |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | ⬜ Not started | |
| Prompt testing (final prompt run against at least one real model, with results noted) | ⬜ Not started | |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Only possible once every row above is ✅ |

---

## Crispy Chicken Burger — Prompt Engineering

Anchor use case (proposed): *Systematically test and improve a repeatable business-analysis prompt.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | ⬜ Not started | |
| Anchor use case | ✏️ Drafted | Proposed wording recorded in the Constitution §11; still needs to be confirmed |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 2 | Patty / main filling | **Task** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 3 | Cheese | **Context/Input** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 4 | Toppings | **Requirements/Details** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 5 | Sauce | **Style/Quality** | Optional | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 6 | Bottom Bun | **Output Format** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | ⬜ Not started | |
| Evaluation plan (test cases, criteria, iterations v1→vN) | ⬜ Not started | Required for this burger only |
| Relevant techniques (linked to the Technique Lab) | ⬜ Not started | |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |

### BITE

| Letter | Status |
|---|---|
| B — Brief | ⬜ Not started |
| I — Information | ⬜ Not started |
| T — Taste | ⬜ Not started |
| E — Expected result | ⬜ Not started |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | ⬜ Not started |
| Injection | ⬜ Not started |
| Hallucination | ⬜ Not started |
| Bias | ⬜ Not started |
| Data Protection | ⬜ Not started |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | ⬜ Not started | |
| Prompt testing (final prompt run against at least one real model, with results noted) | ⬜ Not started | |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Only possible once every row above is ✅ |

---

## Bacon Cheese Burger — Text-to-Image

Anchor use case (proposed): *Create a clear visual prompt for a polished website hero image.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | ⬜ Not started | |
| Anchor use case | ✏️ Drafted | Proposed wording recorded in the Constitution §11; still needs to be confirmed |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 2 | Patty / main filling | **Task** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 3 | Cheese | **Context/Input** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 4 | Toppings | **Requirements/Details** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 5 | Sauce | **Style/Quality** | Optional | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 6 | Bottom Bun | **Output Format** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | ⬜ Not started | |
| Relevant techniques (linked to the Technique Lab) | ⬜ Not started | |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |

### BITE

| Letter | Status |
|---|---|
| B — Brief | ⬜ Not started |
| I — Information | ⬜ Not started |
| T — Taste | ⬜ Not started |
| E — Expected result | ⬜ Not started |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | ⬜ Not started |
| Injection | ⬜ Not started |
| Hallucination | ⬜ Not started |
| Bias | ⬜ Not started |
| Data Protection | ⬜ Not started |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | ⬜ Not started | |
| Prompt testing (final prompt run against at least one real model, with results noted) | ⬜ Not started | |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Only possible once every row above is ✅ |

---

## Chilli Cheese Burger — Text-to-Code

Anchor use case (proposed): *Request a small, responsive and testable interactive web feature.*

### Journey framing

| Item | Status | Notes |
|---|---|---|
| Short description, “Best for”, learning outcomes | ⬜ Not started | |
| Anchor use case | ✏️ Drafted | Proposed wording recorded in the Constitution §11; still needs to be confirmed |

### Seven layers

| # | Ingredient | Layer | Status | Simple | Pro | Input (question, placeholder, example) | Why it matters + common mistake | Learn More | Assembly template + empty/warning/complete states |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Top Bun | **Goal** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 2 | Patty / main filling | **Task** | Required | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 3 | Cheese | **Context/Input** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 4 | Toppings | **Requirements/Details** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 5 | Sauce | **Style/Quality** | Optional | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 6 | Bottom Bun | **Output Format** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |
| 7 | Wrapper | **Rules/Boundaries** | Recommended | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started | ⬜ Not started |

### Examples, techniques and exercises

| Item | Status | Notes |
|---|---|---|
| Weak prompt → diagnosed weaknesses → improved prompt → final structure → example output | ⬜ Not started | |
| Relevant techniques (linked to the Technique Lab) | ⬜ Not started | |
| Exercise 1 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 2 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 3 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |
| Exercise 4 (type, question, answer rule, Simple + Pro feedback) | ⬜ Not started | Minimum of 4 |

### BITE

| Letter | Status |
|---|---|
| B — Brief | ⬜ Not started |
| I — Information | ⬜ Not started |
| T — Taste | ⬜ Not started |
| E — Expected result | ⬜ Not started |

### Responsible-AI review (all six parts per check: Simple, Pro, burger example, warning sign, corrective action, prompt vs workflow)

| Check | Status |
|---|---|
| Risk | ⬜ Not started |
| Injection | ⬜ Not started |
| Hallucination | ⬜ Not started |
| Bias | ⬜ Not started |
| Data Protection | ⬜ Not started |

### Close and sign-off

| Item | Status | Notes |
|---|---|---|
| Completion summary + next recommended journey | ⬜ Not started | |
| Prompt testing (final prompt run against at least one real model, with results noted) | ⬜ Not started | |
| Editorial approval (owner sign-off for the whole journey) | ⬜ Not started | Only possible once every row above is ✅ |

---

## Site-wide chapters

| Section | Status | Notes |
|---|---|---|
| Homepage hero copy | ✅ Approved | Supplied by the owner (Prompt 3), implemented, and the foundation was approved |
| Four-burger selector copy (“Best for” lines) | ⬜ Not started | The cards currently show name + discipline only |
| Technique Lab: zero-shot, one-shot, few-shot | ⬜ Not started |  |
| Technique Lab: other techniques | ⬜ Not started | List to be agreed |
| BITE chapter | ⬜ Not started | Restores the hero’s “See how BITE works” link |
| Responsible-AI chapter (5 checks, review states, prompt vs workflow) | ⬜ Not started |  |
| DACH case study (instructional reconstruction only) | ⬜ Not started |  |
| Glossary | ⬜ Not started |  |
| About the method | ⬜ Not started |  |
| Accessibility help | ⬜ Not started |  |
| Privacy and local saving | ⬜ Not started |  |
| Educational disclaimer | ⬜ Not started |  |
| Footer | ⬜ Not started |  |
| 404 / invalid state | ⬜ Not started |  |
