# Prompt Smash! — Content Constitution

**Status:** authoritative. Every future page, component and learning journey must follow this document. Changes need the project owner's explicit approval.
**Created:** Numbered Prompt 4, 2026-10-07.
**Related documents:**
- `SITE_MAP.md`: structure and navigation
- `CONTENT_COVERAGE_MATRIX.md`: content progress
- `src/data/schema.ts`: content types
- `ref/REFERENCE_MANIFEST.md`: visual direction

---

## 1. Product promise

> **Build clearer, more reliable and safer AI prompts — one layer at a time.**

Every screen, example and exercise must serve this promise. If something doesn't make prompts clearer, more reliable or safer, it doesn't belong.

## 2. Audience

The audience is mixed:

- **Beginners** who may know almost nothing about prompting.
- **Working professionals** who want practical depth.

**The age-10 rule:** a curious ten-year-old must be able to understand every concept, and the wording must never sound childish to an adult.

| Do | Don't |
|---|---|
| Short sentences with concrete nouns ("Tell the AI who will read it.") | Baby talk, exclamation-mark overload, "Yummy!" |
| Explain a term the first time it appears | Unexplained acronyms or jargon in Simple mode |
| Respect the reader's intelligence | Talking down, or "Easy peasy!" |
| Real, workplace-plausible examples | Silly examples that undermine credibility |

## 3. Modes: the Simple/Pro contract

**Simple mode** contains, for every concept:

1. **One short definition**, a single sentence of 25 words or fewer
2. **One clear question for the learner**: what they should ask themselves or answer
3. **One small example**
4. **One practical tip**
5. **Minimal jargon.** Any unavoidable term is explained in plain words.

**Pro mode** keeps all Simple content visible, either unchanged or expanded in place, and adds:

1. **The recognised professional term**, for example "role and audience specification" or "few-shot prompting"
2. **Why it works**, in mechanism terms rather than magic
3. **A trade-off or limitation**
4. **Advanced options**
5. **A workplace application**
6. **A verification, safety or governance note** where relevant

**Pro is additive, never a replacement.** Pro text is always shown *after* the Simple text, never instead of it. In the schema this is `proAddition`.

**Pro never contradicts Simple.** If Pro needs to qualify a Simple statement, the Simple statement must be rewritten so it stays true.

**The Simple example and the example answer have different jobs.** The Simple *example* is a tiny illustration of 20 words or fewer. The *example answer* is a complete, ready-to-use answer for the burger's anchor use case. Never show both at once.

**Planned content lint check.** A check will reject Simple definitions over 25 words and flag unexplained jargon. Any unavoidable term goes in `jargonExplained`.

Switching between modes must eventually keep all of the following. This is documented now and implemented later:

- User input
- Selected ingredients
- The active layer
- Completion state
- Scroll position

## 3a. Progressive disclosure (anti-overload rule)

- **Visible by default:** the definition, the learner question, the answer field and its state message.
- **Opens on request:** "See an example", "Practical tip", "Why it matters", "Common mistake" and "Learn more". The tip may show by default only if the visible text stays within the word budget.
- **Pro mode:** adds **one collapsible "Pro notes" panel per layer**. It never adds inline blocks.
- **Word budget for visible text per layer:** 60 words or fewer in Simple, 120 or fewer in Pro (Pro notes count only when opened).
- **Responsible-AI review:** the one or two checks most relevant to the burger open first. The others stay collapsed but are always available. None is ever hidden or removed.

## 4. The four complete journeys

| Burger | Discipline | Implementation order |
|---|---|---|
| Hamburger | Prompt Design | 1st, the reusable interaction reference |
| Crispy Chicken Burger | Prompt Engineering | after the Hamburger is approved |
| Bacon Cheese Burger | Text-to-Image | after the Hamburger is approved |
| Chilli Cheese Burger | Text-to-Code | after the Hamburger is approved |

All four journeys must have **complete content before launch**. "Coming later" is allowed only during development. **Nothing may remain permanently labelled "Coming later".**

## 5. The seven universal layers

The layers keep the same order and meaning in every burger. The food may look different from burger to burger, but each layer's place in the stack and its meaning must stay recognisable.

| # | Ingredient (generic) | Prompt layer | Status | Simple definition (draft) |
|---|---|---|---|---|
| 1 | Top Bun | **Goal** | **Required** | Why you need this, and what the result should help you achieve. |
| 2 | Patty, or main filling | **Task** | **Required** | The exact job you want the AI to do. |
| 3 | Cheese | **Context / Input** | Recommended | The background and material the AI needs to know about. |
| 4 | Toppings | **Requirements / Details** | Recommended | The details the answer must include, such as facts, length and who it is for. |
| 5 | Sauce | **Style / Quality** | Optional when it doesn't affect the task | How it should sound or look, and how polished it needs to be. |
| 6 | Bottom Bun | **Output Format** | Recommended | The shape of the answer: list, table, code, image size and so on. |
| 7 | Wrapper | **Rules / Boundaries** | Recommended, and especially important for workplace, private-data, tool-using, image and coding use | What the AI must not do, change or include. |

**Rules**

- **Each layer owns one job.** Every Simple definition must pass the "which layer?" test: a learner can place any sentence of a prompt in exactly one layer.
  - **Purpose and use:** Goal.
  - **Things that must be included:** Requirements/Details.
  - **How polished it must be:** Style/Quality.
  - **Things that must not happen, change or be included:** Rules/Boundaries.
- **Status labels** are shown to the learner exactly as "Required", "Recommended" or "Optional".
- **An "Optional" layer is never a hidden one.** The learner chooses to skip it.
- **The Wrapper is not a safety switch.** It holds the boundaries the prompt states. Copy shown at the Wrapper step: *"Rules and Boundaries tell the AI what to avoid. The responsible-AI review comes later and checks what could still go wrong."*
- **Status comes from the universal table.** A journey may add a `statusNote` explaining how the status applies, but it never changes the status.
- **The responsible-AI review is separate.** It is always available and can never be turned off.
- **Layer names are fixed.** Never rename or reorder the seven layers without approval.
- **Display labels:** use "Context and Input", "Requirements and Details", "Style and Quality" and "Rules and Boundaries" in headings, and the slash forms only where space is tight.
- **The burger order is not always the prompt order.** The learner thinks in burger order, top to bottom. The assembled prompt may use a different reading order when that serves the AI better. Pro mode explains why, with hedged guidance, for example: "With some models, placing long source material first and restating the Task near the end often improves results. Check the model provider's guidance and test it."

## 6. The burger metaphor

**The single metaphor**

1. **The learner builds the burger.**
2. **Each ingredient adds one useful part of the prompt.**
3. **The assembled burger is the complete prompt.**
4. **The AI receives the prompt and produces an output.**

**Fixed metaphor links**

Each one is a single sentence of 20 words or fewer, stored as `metaphorLink`:

| Ingredient | Layer | Why it fits |
|---|---|---|
| Top Bun | Goal | It sits on top and shows the purpose first. |
| Patty | Task | The main job is the core of the burger. |
| Cheese | Context/Input | Background melts into everything else. |
| Toppings | Requirements/Details | The specific details you choose. |
| Sauce | Style/Quality | It adds the flavour and finish. |
| Bottom Bun | Output Format | It is the shape that holds the answer together. |
| Wrapper | Rules/Boundaries | It sits beneath and folds around the whole burger, because its rules apply to every layer. |

**Reading the stack**

- The stack is **read from the top down**. It is never described as a building or cooking order.
- **BITE is the builder's own test bite before handing the prompt to the AI.** Never describe the AI or the output eating anything.

**Forbidden mixed metaphors**

- The learner as a waiter or customer ordering food
- The prompt as both an order and a recipe
- The AI as the burger, the chef or the restaurant
- The output as "eating" the burger

**Tone**

- **Microcopy** may be playful: "Stack the Patty", "Smash it together".
- **Instructions, warnings and safety content** are always direct and literal, with no food puns.

## 7. BITE: the final prompt-quality check

| Letter | Name | Question | Layers checked |
|---|---|---|---|
| **B** | Brief | Are the Goal and Task clear? | Goal, Task |
| **I** | Information | Did you provide enough Context and Requirements? | Context/Input, Requirements/Details |
| **T** | Taste | Did you describe the intended Style and Quality? | Style/Quality |
| **E** | Expected result | Did you specify the Format and Boundaries? | Output Format, Rules/Boundaries |

**Rules**

- **BITE comes after building.** It is the final *quality* check.
- **BITE does not replace the responsible-AI review.**
- **Taste may be marked "Not needed" when Style/Quality genuinely doesn't apply**, for example for a data-extraction prompt. The interface asks the learner to confirm the reason rather than silently passing it.
- **E checks only that boundaries are *stated*.** Whether they are *adequate* is decided in the responsible-AI review. A passed E never means "safe".
- **Each BITE result is a prompt for reflection, not a score of the AI's output.**

## 8. Responsible-AI review

There are five checks, and each one is always available:

| Check | Question |
|---|---|
| **Risk** | What could go wrong? |
| **Injection** | Are hidden or untrusted instructions trying to control the AI? |
| **Hallucination** | Could the AI invent unsupported information? |
| **Bias** | Could the result represent or treat people unfairly? |
| **Data Protection** | Are personal, confidential or sensitive data being exposed? |

**Review states.** Never use ON/OFF switches.

- **Needs attention**: the learner has a concern they haven't addressed yet.
- **Action added**: the learner added a prompt instruction or planned a workflow control.
- **Not relevant**: the learner considered the check and decided it doesn't apply. A short reason is required.

**Every check starts unreviewed**, shown as "Not yet reviewed". Nothing is pre-marked as safe.

**"Reviewed" only means the learner considered the issue. It never guarantees that a prompt or its output is safe.** The interface must say this in plain words.

**Every check must eventually provide:**

1. A Simple explanation
2. A Pro explanation
3. A burger-specific example
4. A warning sign to look for
5. A corrective action
6. **The difference between a prompt instruction and a workflow or system control.** A prompt can ask the AI to behave; only workflows and systems can *enforce* it. Examples of workflow controls: human review, access permissions, removing personal data before sending, validation and testing.

**Prompt injection: be honest about the limits.** Delimiting untrusted content and telling the AI to treat it as data **reduces** injection risk but **cannot prevent** it. The real defences are workflow controls:
- Limit the tools and permissions the AI has when it reads untrusted content.
- Require human approval before any action is taken.
- Validate outputs.

**Treat these as untrusted input:**
- **Code:** repository files, issues and dependencies.
- **Images:** text inside reference images.

**Prompt-injection content must teach recognition and defence only.** It must never provide working attack payloads.

**"Not relevant" needs an example reason.** Each check's content includes an example of a valid reason, so learners see what a good reason looks like.

## 9. Core learning flow

> Choose a burger → Understand the purpose → Build the seven layers → Watch the live prompt assemble → Learn the relevant techniques → Run BITE → Run the responsible-AI review → Copy or download → See the result and a lesson summary → Try another journey

- **Order:** the flow is the default order, not a cage. Learners may revisit any completed step.
- **The techniques step is a short bridge, not a lesson.** It shows at most three technique cards, each one sentence plus a link to the Technique Lab, and a "Continue to BITE" button stays visible throughout.
- **"Understand the purpose" includes a short weak-versus-improved prompt comparison**, shown within the first screen of every journey, so the payoff is visible before the learner builds anything.
- **Each journey shows an example output** (text, image or code, depending on the discipline) in the result step. It is labelled "Example only. Real outputs vary."
- **Open owner decision:** the Creative Writer review suggested moving "Learn the relevant techniques" to after the summary, so building flows straight into BITE. This would change the owner-defined flow, so it has **not** been applied.
- **The result step** shows an example of what a well-built prompt produces, with a clear note that it is an example. **This website never sends the learner's prompt to any AI.** See §12.

## 10. Content principle

Every screen answers three questions, ideally in this order:

1. **What is this?**
2. **Why does it matter?**
3. **What should I do now?**

A screen that can't answer all three is incomplete.

## 11. Anchor use cases (proposed)

These are teaching examples, not limits on what each burger can be used for.

| Burger | Anchor use case | Status |
|---|---|---|
| Hamburger / Prompt Design | Structure a useful prompt for a practical GenAI marketing or content workflow. | Proposed |
| Crispy Chicken / Prompt Engineering | Systematically test and improve a repeatable business-analysis prompt. | Proposed |
| Bacon Cheese / Text-to-Image | Create a clear visual prompt for a polished website hero image. | Proposed |
| Chilli Cheese / Text-to-Code | Request a small, responsive and testable interactive web feature. | Proposed |

**How the layers apply to each discipline.** These are draft guidance notes, so content writers apply the seven layers the same way:

- **Prompt Engineering:** the layers describe the prompt being engineered. Engineering adds test cases, evaluation criteria and versioning, stored as the journey's `evaluation` plan and taught through techniques and exercises, never as an eighth layer. Iteration results are illustrative reconstructions, labelled as such, and never claimed as measurements.
- **Text-to-Image:**
  - *Task* is the subject and action.
  - *Context/Input* is any reference material.
  - *Requirements/Details* are composition, lighting, camera and other details.
  - *Style/Quality* is the art direction.
  - *Output Format* is the aspect ratio, resolution and file use.
  - *Rules/Boundaries* are exclusions, rights and likeness limits.
- **Text-to-Code:**
  - *Context/Input* is the existing code, stack and constraints.
  - *Requirements/Details* are the acceptance criteria and required tests.
  - *Style/Quality* covers code style, readability and accessibility standards.
  - *Output Format* is the files, diff or explanation required.
  - *Rules/Boundaries* include "don't add dependencies" and "don't touch the auth code".

## 12. Saving and privacy (future behaviour)

- **Storage:** no user accounts and no backend database. Everything the learner types stays in their own browser.
- **Saving:** browser-local only, through `localStorage`.
- **Downloads:** learners can download their assembled prompt as `.txt` or `.md`.
- **Clearing:** learners can clear their saved work with one clearly labelled action. The interface explains that clearing browser storage, using private browsing or switching device may lose saved work.
- **No transmission:** this website never sends prompt content anywhere. It doesn't call an AI and doesn't use analytics that capture typed content.
- **Shareable links** may encode only non-personal state (journey, layer, mode, chapter). **They never include the learner's text.**

## 13. DACH case study

- **What it is:** a separate professional proof chapter, with a neutral, anonymised DACH-region workplace scenario.
- **What it shows:** only an **instructional reconstruction** of the prompt structure.
- **Wording:** never confidential or production wording.
- **People and companies:** no real company, client, person or identifiable detail.
- **Tone:** neutral and factual, with no invented performance claims. Any outcome described is labelled as illustrative.

## 14. Writing rules

- **Language:** British English. A German-language version is not in scope unless requested.
- **Fixed terms**, used consistently: Goal, Task, Context/Input, Requirements/Details, Style/Quality, Output Format, Rules/Boundaries, BITE, responsible-AI review, Simple mode, Pro mode.
- **"Prompt"** means the text the learner gives the AI. **"Output"** means what the AI returns.
- **Never call the text field "input" on screen.** "Input" belongs to the Context/Input layer. Use "Your answer" or "Write your [layer]" for the field.
- **Keep internal terms off screen:** "focus state", "handbook panel" and "schema" stay in planning documents.
- **No overclaiming.** Never say a technique "guarantees", "eliminates" or "prevents" a problem. Say "reduces", "helps" or "makes it more likely".
- **Examples:** fictional, neutral and inclusive, with no real people's personal data.
- **Disclaimer:** the website is educational. It doesn't provide legal, security or compliance advice, and a footer note must say so.
