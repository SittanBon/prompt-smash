#!/usr/bin/env node
/**
 * Renders journey content (TypeScript, the source of truth) into editorial
 * Markdown, and checks the Constitution's measurable rules.
 *
 *   node scripts/content.mjs render   → writes content/*.md
 *   node scripts/content.mjs check    → validates; fails if Markdown is stale
 *
 * Requires Node 22.18+ (built-in TypeScript type stripping).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { UNIVERSAL_LAYERS, BITE, SAFETY_CHECKS, BITE_LIMITS, REVIEW_DISCLAIMER, REVIEW_SCREEN_COPY, LAYER_STATUS_LABEL } from '../src/data/framework.ts';
import { ASSEMBLY_RULES, ASSEMBLY_MICROCOPY, assembleExamplePrompt } from '../src/data/promptAssembly.ts';
import { hamburger } from '../src/data/journeys/hamburger.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const JOURNEYS = [{ data: hamburger, file: 'content/hamburger-prompt-design.md' }];

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

function validate(j) {
  const errors = [];
  const err = (m) => errors.push(`${j.id}: ${m}`);

  if (j.layers.length !== 7) err('must have exactly 7 layers');
  j.layers.forEach((layer, i) => {
    const u = UNIVERSAL_LAYERS[i];
    const at = `layer ${i + 1} (${layer.key})`;
    if (layer.key !== u.key) err(`${at}: expected key "${u.key}" (fixed order)`);
    if (layer.status !== u.status) err(`${at}: status "${layer.status}" must equal universal "${u.status}"`);
    if (words(layer.simple.definition) > 25) err(`${at}: Simple definition is ${words(layer.simple.definition)} words (max 25)`);
    if (words(layer.simple.example) > 20) err(`${at}: Simple example is ${words(layer.simple.example)} words (max 20)`);
    if (words(layer.metaphorLink) > 20) err(`${at}: metaphorLink is ${words(layer.metaphorLink)} words (max 20)`);
    if (/\binput\b/i.test(layer.answerField.label)) err(`${at}: field label must not say "input"`);
    if (!layer.assembly.template.includes('{{answer}}')) err(`${at}: assembly template needs {{answer}}`);
    if (layer.status === 'optional' && !layer.states.notNeeded) err(`${at}: optional layer needs a notNeeded state`);
  });
  if (j.exercises.length < 4) err(`needs at least 4 exercises (has ${j.exercises.length})`);
  for (const b of BITE) if (!j.bite[b.key]) err(`missing BITE check "${b.key}"`);
  if (!j.bite.taste.notNeeded || !j.bite.taste.stateCopy.notNeeded) err('Taste needs Not-needed content');
  for (const c of SAFETY_CHECKS) if (!j.responsibleAi[c.key]) err(`missing responsible-AI check "${c.key}"`);
  if (j.techniqueBridge.techniques.length > 3) err('technique bridge shows at most three techniques');

  const full = assembleExamplePrompt(j.layers);
  if (full.missingRequired.length) err('example answers leave a required layer empty');
  if (/\{\{|\}\}/.test(full.text.replace(/\{\{first_name\}\}/g, ''))) err('assembled prompt contains an unfilled placeholder');
  return errors;
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const quote = (s) => s.split('\n').map((l) => `> ${l}`).join('\n');
const fence = (s, lang = 'text') => `\`\`\`${lang}\n${s}\n\`\`\``;
const list = (items) => items.map((i) => `- ${i}`).join('\n');
const label = (key) => UNIVERSAL_LAYERS.find((l) => l.key === key).label;
const modeText = (m) => `${m.simple}\n\n*Pro adds:* ${m.proAddition}`;

function renderLayer(layer, i) {
  const u = UNIVERSAL_LAYERS[i];
  const p = layer.pro;
  return `### ${i + 1}. ${layer.ingredientName} — ${u.label}

| | |
|---|---|
| **Status** | ${LAYER_STATUS_LABEL[layer.status]}${layer.statusNote ? ` — ${layer.statusNote}` : ''} |
| **Why this ingredient** | ${layer.metaphorLink} |

#### Simple
- **Definition:** ${layer.simple.definition}
- **Learner question:** ${layer.simple.learnerQuestion}
- **Tiny example:** ${layer.simple.example}
- **Practical tip:** ${layer.simple.tip}${
    layer.simple.jargonExplained
      ? `\n- **Plain words:** ${layer.simple.jargonExplained.map((t) => `*${t.term}* — ${t.plain}`).join('; ')}`
      : ''
  }

#### Answer field
- **Label:** ${layer.answerField.label}
- **Question:** ${layer.answerField.question}
- **Placeholder:** ${layer.answerField.placeholder}
- **Example answer (anchor case):**

${fence(layer.answerField.exampleAnswer)}

#### Why it matters
${modeText(layer.whyItMatters)}

#### Common mistake
${modeText(layer.commonMistake)}

#### If this layer is left out
${modeText(layer.omissionEffect)}

#### Pro notes
- **Professional term:** ${p.professionalTerm}
- **Why it works:** ${p.whyItWorks}
- **Trade-off:** ${p.tradeOff}
- **Advanced options:**
${p.advancedOptions.map((o) => `  - ${o}`).join('\n')}
- **Workplace application:** ${p.workplaceApplication}${p.governanceNote ? `\n- **Verification, safety or governance:** ${p.governanceNote}` : ''}

#### Learn more: ${layer.learnMore.title}
${layer.learnMore.body}

#### Prompt preview and states
- **Section in the prompt:** \`${layer.assembly.sectionLabel}:\` then \`${layer.assembly.template}\`
- **Empty:** ${layer.states.empty}
- **Warning:** ${layer.states.warning}
- **Complete:** ${layer.states.complete}${layer.states.notNeeded ? `\n- **Not needed:** ${layer.states.notNeeded}` : ''}
`;
}

function renderExercise(x, n) {
  const exp = x.expected;
  let answer;
  if (exp.kind === 'option') answer = `Option **${exp.optionId}**`;
  else if (exp.kind === 'options') answer = `Options **${exp.optionIds.join(', ')}**`;
  else if (exp.kind === 'order') answer = exp.order.join(' → ');
  else if (exp.kind === 'mapping')
    answer = Object.entries(exp.pairs)
      .map(([id, v]) => `${id} → ${UNIVERSAL_LAYERS.find((l) => l.key === v)?.label ?? v}`)
      .join('; ');
  else answer = `Checklist (no single correct answer):\n${list(exp.criteria)}`;

  return `### Exercise ${n}: ${x.title}
*Type:* ${x.type}

**Question:** ${x.question}
${x.material ? `\n${quote(x.material)}\n` : ''}${x.options ? `\n${x.options.map((o) => `- **${o.id}.** ${o.label}`).join('\n')}\n` : ''}
**Expected answer / evaluation rule:** ${answer}
${x.modelAnswer ? `\n**Model answer (one good version):**\n\n${fence(x.modelAnswer)}\n` : ''}
- **Why it works:** ${x.feedback.explanation}
- **Simple feedback:** ${x.feedback.simple}
- **Pro adds:** ${x.feedback.proAddition}
- **If the answer is wrong:** ${x.feedback.wrongAnswer}
`;
}

function render(j) {
  const w = j.workedExample;
  const full = assembleExamplePrompt(j.layers);
  const noStyle = assembleExamplePrompt(j.layers, [], { style: j.bite.taste.notNeeded.exampleReason });

  return `<!-- GENERATED FILE — do not edit. Source of truth: src/data/journeys/${j.id}.ts
     Regenerate with \`npm run content:render\`; \`npm run content:check\` fails if this file is stale. -->

# ${j.title}

> ${j.shortDescription}

**Anchor use case (${j.anchorUseCase.status}):** ${j.anchorUseCase.title}

${j.anchorUseCase.scenario}

## Best for
${list(j.bestFor)}

## Key ideas this journey makes clear
${list(j.keyIdeas)}

## Learning outcomes
${list(j.learningOutcomes)}

---

## First screen: ${w.firstScreen.heading}

**${w.firstScreen.weakLabel}**

${quote(w.weakPrompt)}

**${w.firstScreen.improvedLabel}**

${fence(w.improvedPrompt)}

${w.firstScreen.payoff}

---

## The seven layers

${j.layers.map(renderLayer).join('\n---\n\n')}
---

## Live-prompt assembly

### Rules
${ASSEMBLY_RULES.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### Microcopy
| Situation | Copy |
|---|---|
${Object.entries(ASSEMBLY_MICROCOPY)
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join('\n')}

---

## Worked example

### 1. Weak prompt
${quote(w.weakPrompt)}

### 2. Diagnosis
| Layer | What is missing or unclear |
|---|---|
${w.diagnosedWeaknesses.map((d) => `| ${label(d.layer)} | ${d.issue} |`).join('\n')}

### 3. Improved prompt (still readable)
${fence(w.improvedPrompt)}

### 4. Why it is better
${w.whyBetter.map((b) => `- **${label(b.layer)}:** ${b.point}`).join('\n')}

### 5. Final structured prompt
*Assembled automatically from the seven example answers above, using the live-prompt rules. Section order: ${w.finalPromptStructure.map(label).join(' → ')}.*

${fence(full.text)}

### 6. Illustrative output excerpt
*${w.exampleOutput.illustrativeLabel}*

${w.exampleOutput.content}

### 7. Limitations and review
${list(w.limitationsAndReview)}

### 8. ${w.variation.title}
${w.variation.scenario}

${fence(
  j.layers
    .map((l) => `${l.assembly.sectionLabel}:\n${w.variation.answers[l.key]}`)
    .join('\n\n'),
)}

### Assembly check: the same prompt with Style and Quality marked Not needed
*Shows that removing an optional layer leaves no empty heading. Reason (not copied into the prompt): “${j.bite.taste.notNeeded.exampleReason}”*

Sections included: ${noStyle.includedLayers.map(label).join(', ')}. Not needed: ${noStyle.notNeeded.map(label).join(', ')}.

---

## Technique bridge
${j.techniqueBridge.intro}

*Each card shows its one-sentence definition; the other fields open on request.*

${j.techniqueBridge.techniques
  .map(
    (t) => `### ${t.name}
- **What it is:** ${t.definition}
- **Use it when:** ${t.whenToUse.simple} *Pro adds:* ${t.whenToUse.proAddition}
- **Tiny example:** ${t.burgerExample}
- **Limitation:** ${t.limitation}`,
  )
  .join('\n\n')}

${j.techniqueBridge.deeperLearning}

**[${j.techniqueBridge.continueLabel}]**

---

## Exercises

${j.exercises.map((x, i) => renderExercise(x, i + 1)).join('\n')}
---

## BITE review

*${REVIEW_SCREEN_COPY.biteIntro}*

${BITE.map((b) => {
  const c = j.bite[b.key];
  return `### ${b.letter} — ${b.name}
**${c.question}**

Look for:
${list(c.lookFor)}

${modeText(c.explanation)}

- **Passing example:** ${c.passingExample}
- **Needs-attention example:** ${c.needsAttentionExample}
- **Corrective action:** ${c.correctiveAction}
- **State copy (clear):** ${c.stateCopy.clear}
- **State copy (needs attention):** ${c.stateCopy.needsAttention}${c.stateCopy.notNeeded ? `\n- **State copy (not needed):** ${c.stateCopy.notNeeded}` : ''}${c.notNeeded ? `\n- **Not needed allowed:** yes. Example reason: “${c.notNeeded.exampleReason}”` : ''}
`;
}).join('\n')}
### What BITE does and does not mean
${list(BITE_LIMITS)}

*${REVIEW_SCREEN_COPY.biteNext}*

---

## Responsible-AI review

*${REVIEW_SCREEN_COPY.reviewIntro}*

*${REVIEW_DISCLAIMER}*

${SAFETY_CHECKS.map((s) => {
  const c = j.responsibleAi[s.key];
  return `### ${s.name}: ${s.question}
${modeText(c.explanation)}

- **Example:** ${c.burgerExample}
- **Warning sign:** ${c.warningSign}
- **Corrective action:** ${c.correctiveAction}
- **Prompt-level action:** ${c.promptVsWorkflow.promptInstruction}
- **Workflow or system-level action:** ${c.promptVsWorkflow.workflowControl}
- **Needs attention:** ${c.stateCopy.needsAttention}
- **Action added:** ${c.stateCopy.actionAdded}
- **Not relevant:** ${c.stateCopy.notRelevant} *(Example reason: “${c.notRelevantExampleReason}”)*
`;
}).join('\n')}
---

## Completion summary

### ${j.completionSummary.headline}
${list(j.completionSummary.recap)}

${modeText(j.completionSummary.takeaway)}

**Planned actions:** ${j.completionSummary.actions.join(' · ')}

**Recommended next journey:** Crispy Chicken Burger — Prompt Engineering. ${j.completionSummary.nextJourneyPitch}
`;
}

/* ------------------------------------------------------------------ */

const mode = process.argv[2] ?? 'check';
let failed = false;
for (const { data, file } of JOURNEYS) {
  const errors = validate(data);
  if (errors.length) {
    failed = true;
    console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  }
  const md = render(data);
  const path = join(root, file);
  if (mode === 'render') {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, md);
    console.log(`rendered ${file}`);
  } else {
    let current = '';
    try {
      current = readFileSync(path, 'utf8');
    } catch {}
    if (current !== md) {
      failed = true;
      console.error(`✗ ${file} is out of date — run: npm run content:render`);
    } else console.log(`✓ ${file} matches ${data.id}.ts`);
  }
  if (!errors.length) console.log(`✓ ${data.id}: Constitution checks passed`);
}
process.exit(failed ? 1 : 0);
