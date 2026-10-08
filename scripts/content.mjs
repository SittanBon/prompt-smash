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
import { UNIVERSAL_LAYERS, BITE, SAFETY_CHECKS, BITE_LIMITS, REVIEW_DISCLAIMER, REVIEW_SCREEN_COPY, LAYER_STATUS_LABEL, EVALUATION_SCALE, CHECK_TYPE_LABEL, EVALUATION_MICROCOPY } from '../src/data/framework.ts';
import { ASSEMBLY_RULES, ASSEMBLY_MICROCOPY, assembleExamplePrompt, assemblePrompt } from '../src/data/promptAssembly.ts';
import { hamburger } from '../src/data/journeys/hamburger.ts';
import { crispyChicken } from '../src/data/journeys/crispyChicken.ts';
import { baconCheese } from '../src/data/journeys/baconCheese.ts';
import { chilliCheese } from '../src/data/journeys/chilliCheese.ts';
import { sharedContent, CASE_STUDY_NOTICE } from '../src/data/sharedContent.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const JOURNEYS = [
  { data: hamburger, file: 'content/hamburger-prompt-design.md', minExercises: 4 },
  { data: crispyChicken, file: 'content/crispy-chicken-prompt-engineering.md', minExercises: 8 },
  { data: baconCheese, file: 'content/bacon-cheese-text-to-image.md', minExercises: 6 },
  { data: chilliCheese, file: 'content/chilli-cheese-text-to-code.md', minExercises: 6 },
];
const SHARED_FILE = 'content/shared-handbook.md';

/** Pro topics each new journey must cover somewhere in its content (Numbered Prompt 7, Parts C and D). */
const REQUIRED_TOPICS = {
  'bacon-cheese': ['camera angle', 'shot size', 'lens', 'composition', 'lighting direction', 'colour palette', 'reference', 'must not change', 'variation strategy', 'misspell', 'iterative visual critique', 'stereotype', 'synthetic people', 'deepfake', 'metadata', 'copyright', 'transparen', 'background-removal'],
  'chilli-cheese': ['sample input', 'edge case', 'acceptance criteri', 'error handling', 'tests', 'versions', 'existing code', 'incremental', 'patch', 'security review', 'accessib', 'plan → implement → test → repair', 'repository', 'tool output', 'invent packages', 'secret', 'review before running'],
};

/**
 * No overclaiming (Constitution §14): in the new content, every “guarantee”
 * must be negated nearby (“not”, “cannot”, “never”, “does not”…).
 */
function overclaims(value, where) {
  const text = JSON.stringify(value);
  const found = [];
  for (const m of text.matchAll(/guarantee|eliminat|prevents?\b/gi)) {
    const before = text.slice(Math.max(0, m.index - 60), m.index).toLowerCase();
    if (!/(not|cannot|never|n’t|n't|no|without)\b[^.]*$/.test(before)) found.push(`${where}: possible overclaim near “…${text.slice(Math.max(0, m.index - 40), m.index + 20)}…”`);
  }
  return found;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

function validate(j, minExercises) {
  const errors = [];
  const err = (m) => errors.push(`${j.id}: ${m}`);

  if (j.layers.length !== 7) err('must have exactly 7 layers');
  j.layers.forEach((layer, i) => {
    const u = UNIVERSAL_LAYERS[i];
    const at = `layer ${i + 1} (${layer.key})`;
    if (layer.key !== u.key) err(`${at}: expected key "${u.key}" (fixed order)`);
    if (layer.status !== u.status) err(`${at}: status "${layer.status}" must equal universal "${u.status}"`);
    if (words(layer.simple.definition) > 25) err(`${at}: Simple definition is ${words(layer.simple.definition)} words (max 25)`);
    if (!/^For (an? )?[a-z -]+, this may mean /.test(layer.simple.domainClause ?? '')) err(`${at}: domain clause must read “For …, this may mean …”`);
    else if (words(layer.simple.domainClause) > 25) err(`${at}: domain clause is ${words(layer.simple.domainClause)} words (max 25)`);
    if (words(layer.simple.example) > 20) err(`${at}: Simple example is ${words(layer.simple.example)} words (max 20)`);
    if (words(layer.metaphorLink) > 20) err(`${at}: metaphorLink is ${words(layer.metaphorLink)} words (max 20)`);
    if (/\binput\b/i.test(layer.answerField.label)) err(`${at}: field label must not say "input"`);
    if (!layer.assembly.template.includes('{{answer}}')) err(`${at}: assembly template needs {{answer}}`);
    if (layer.status === 'optional' && !layer.states.notNeeded) err(`${at}: optional layer needs a notNeeded state`);
  });
  if (j.exercises.length < minExercises) err(`needs at least ${minExercises} exercises (has ${j.exercises.length})`);
  for (const x of j.exercises) {
    if (!x.feedback.wrongAnswer) err(`exercise ${x.id}: missing wrong-answer help`);
    if ((x.type === 'free-text' || x.type === 'rewrite') && !x.modelAnswer) err(`exercise ${x.id}: free-form exercise needs a model answer`);
  }
  if (/TODO/.test(JSON.stringify(j))) err('contains unfinished TODO content');
  // Layer definitions are universal: they must match the Hamburger wording exactly.
  if (j.id !== 'hamburger')
    j.layers.forEach((l, i) => {
      if (l.simple.definition !== hamburger.layers[i].simple.definition) err(`layer ${l.key}: Simple definition differs from Hamburger`);
      if (l.metaphorLink.split(',')[0] === '') err(`layer ${l.key}: empty metaphor link`);
    });
  if (j.id === 'crispy-chicken') {
    const ev = j.evaluation;
    if (!ev || ev.testCases.length < 10) err('evaluation plan needs at least 10 test cases');
    if (!ev || ev.iterations.length < 4) err('evaluation plan needs at least 4 versions');
    const ids = new Set((ev?.criteria ?? []).map((c) => c.id));
    for (const t of ev?.testCases ?? []) for (const c of t.criterionIds) if (!ids.has(c)) err(`test case ${t.id}: unknown criterion "${c}"`);
    const lab = j.techniqueLab;
    if (!lab || lab.techniques.length !== 8) err('Technique Lab needs exactly 8 techniques');
    for (const t of lab?.techniques ?? [])
      for (const f of ['definition', 'definitionProAddition', 'burgerExample', 'limitation', 'costOrEffort', 'notNeededWhen', 'anchorLink'])
        if (!t[f]) err(`technique ${t.id}: missing ${f}`);
    if (/hidden (chain|reasoning)/i.test(JSON.stringify(lab)) && !/not ask for private or hidden/i.test(JSON.stringify(lab)))
      err('Technique Lab must not request hidden reasoning');
  }
  if (REQUIRED_TOPICS[j.id]) {
    const text = JSON.stringify(j).toLowerCase();
    for (const t of REQUIRED_TOPICS[j.id]) if (!text.includes(t)) err(`required Pro topic not covered: "${t}"`);
    if (!j.journeyMicrocopy || Object.keys(j.journeyMicrocopy).length < 8) err('needs journey-specific interface microcopy');
    overclaims(j, j.id).forEach(err);
  }
  if (j.workedExample.exampleOutput.kind === 'image-description' && !j.workedExample.exampleOutput.alt) err('image description needs alt text');
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

/** Shortens a pasted <feedback> block for display; full prompts stay available in collapsed panels. */
const abbreviate = (text) =>
  text.replace(/<feedback>\n([\s\S]*?)<\/feedback>/g, (_, body) => {
    const n = body.split('\n').filter((l) => l.trim()).length;
    return `<feedback>[${n} customer comments, as listed in the Context layer]</feedback>`;
  });
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
- **Definition (universal):** ${layer.simple.definition}
- **In this journey:** ${layer.simple.domainClause}
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
      .map(([id, v]) => `${id} → ${UNIVERSAL_LAYERS.find((l) => l.key === v)?.label ?? MAPPING_NAMES[v] ?? v}`)
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

const SOURCE_FILE = { hamburger: 'hamburger.ts', 'crispy-chicken': 'crispyChicken.ts', 'bacon-cheese': 'baconCheese.ts', 'chilli-cheese': 'chilliCheese.ts' };
const NEXT_TITLE = {
  'crispy-chicken': 'Crispy Chicken Burger — Prompt Engineering',
  'bacon-cheese': 'Bacon Cheese Burger — Text-to-Image',
  'chilli-cheese': 'Chilli Cheese Burger — Text-to-Code',
  hamburger: 'Hamburger — Prompt Design',
};
const TECHNIQUE_NAMES = Object.fromEntries((crispyChicken.techniqueLab?.techniques ?? []).map((t) => [t.id, t.name]));
const MAPPING_NAMES = { design: 'Prompt Design', engineering: 'Prompt Engineering', ...TECHNIQUE_NAMES };

function renderLab(j) {
  const lab = j.techniqueLab;
  return `---

## Technique Lab

${modeText(lab.intro)}

> **${lab.principle}**

*Progressive disclosure: each card shows its name and Simple definition. The other fields open on request, in the order below.*

${lab.techniques
  .map(
    (t, i) => `### ${i + 1}. ${t.name}
**${t.definition}** *Pro adds:* ${t.definitionProAddition}

- **Use it when:** ${t.whenToUse.simple} *Pro adds:* ${t.whenToUse.proAddition}
- **Tiny example:** ${t.burgerExample}
- **Limitation:** ${t.limitation}
- **Cost or effort:** ${t.costOrEffort}
- **Not needed when:** ${t.notNeededWhen}
- **In the anchor case:** ${t.anchorLink}${t.steps ? `\n- **Steps:**\n${t.steps.map((st, k) => `  ${k + 1}. ${st}`).join('\n')}` : ''}`,
  )
  .join('\n\n')}

`;
}

function versionPrompt(j, it) {
  if (it.promptText) return it.promptText;
  const answers = {};
  for (const l of j.layers) {
    const o = it.layerOverrides?.[l.key];
    answers[l.key] = o === null ? { state: 'empty' } : { state: 'filled', text: o ?? l.answerField.exampleAnswer };
  }
  return assemblePrompt(j.layers, answers).text;
}

function renderEvaluation(j) {
  const ev = j.evaluation;
  const crit = Object.fromEntries(ev.criteria.map((c) => [c.id, c.name]));
  return `---

## Evaluation plan

${modeText(ev.intro)}

### Scale
| Rating | Meaning |
|---|---|
${EVALUATION_SCALE.map((x) => `| ${x.label} | ${x.meaning} |`).join('\n')}

### Criteria
| Criterion | What it checks | Meets when… | How it is judged |
|---|---|---|---|
${ev.criteria.map((c) => `| ${c.name} | ${c.description} | ${c.passSignal} | ${CHECK_TYPE_LABEL[c.checkType]} |`).join('\n')}

### Test cases
| ID | Scenario | Input | What to check | Criteria |
|---|---|---|---|---|
${ev.testCases.map((t) => `| ${t.id} | ${t.scenario} | ${t.input} | ${t.whatToCheck} | ${t.criterionIds.map((c) => crit[c]).join(', ')} |`).join('\n')}

### Version history
${ev.iterations
  .map(
    (it) => `#### ${it.version}
- **What changed:** ${it.promptChange}${it.changedLayers.length ? ` *(Layers: ${it.changedLayers.map(label).join(', ')})*` : ''}
- **Why:** ${it.why}
- **Failure addressed:** ${it.failureAddressed}
- **Result (${it.evidence === 'observed-in-illustrative-test' ? 'observed in illustrative test runs, not a measurement' : 'illustrative description, not tested'}):** ${it.illustrativeResult}
- **Still uncertain:** ${it.remainingUncertainty}

<details><summary>See the full ${it.version} prompt</summary>

${fence(abbreviate(versionPrompt(j, it)))}

</details>`,
  )
  .join('\n\n')}

### Evaluation microcopy
| Situation | Copy |
|---|---|
${Object.entries(EVALUATION_MICROCOPY).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

`;
}

function render(j) {
  const w = j.workedExample;
  const full = assembleExamplePrompt(j.layers);
  const noStyle = assembleExamplePrompt(j.layers, [], { style: j.bite.taste.notNeeded.exampleReason });

  return `<!-- GENERATED FILE — do not edit. Source of truth: src/data/journeys/${SOURCE_FILE[j.id]}
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
${
  w.firstScreen.approachComparison
    ? `
| ${w.firstScreen.weakLabel} | ${w.firstScreen.improvedLabel} |
|---|---|
| ${w.firstScreen.approachComparison.weak} | ${w.firstScreen.approachComparison.improved} |

**Simple:** ${w.firstScreen.approachComparison.simple}

*Pro notes (collapsed by default):*
${list(w.firstScreen.approachComparison.proPoints)}

*The prompts behind the comparison:*
`
    : ''
}
**${w.firstScreen.weakLabel}**

${quote(w.weakPrompt)}

**${w.firstScreen.improvedLabel}**

${fence(abbreviate(w.improvedPrompt))}

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
${fence(abbreviate(w.improvedPrompt))}

### 4. Why it is better
${w.whyBetter.map((b) => `- **${label(b.layer)}:** ${b.point}`).join('\n')}

### 5. Final structured prompt
*Assembled automatically from the seven example answers above, using the live-prompt rules. Section order: ${w.finalPromptStructure.map(label).join(' → ')}.*

${fence(full.text)}

### 6. Illustrative output excerpt
*${w.exampleOutput.illustrativeLabel}*

${w.exampleOutput.content}
${w.exampleOutput.kind === 'image-description' ? `\n*Planned alt text:* ${w.exampleOutput.alt}\n` : ''}
${
  w.testCycle
    ? `### Test cycle: test → failure → one change → retest
- **Baseline test:** ${w.testCycle.baselineTest}
- **Failure found:** ${w.testCycle.failureFound}
- **Controlled revision:** ${w.testCycle.controlledRevision}
- **Retest:** ${w.testCycle.retest}

`
    : ''
}### 7. Limitations and review
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

${j.techniqueLab ? renderLab(j) : ''}${j.evaluation ? renderEvaluation(j) : ''}---

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

${j.nextJourney ? `**Recommended next journey:** ${NEXT_TITLE[j.nextJourney]}. ` : '**Next:** '}${j.completionSummary.nextJourneyPitch}
${
  j.journeyMicrocopy
    ? `
---

## Journey interface microcopy

| Situation | Copy |
|---|---|
${Object.entries(j.journeyMicrocopy).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}
`
    : ''
}`;
}

/* ------------------------------------------------------------------ */
/* Shared handbook                                                     */
/* ------------------------------------------------------------------ */

const REQUIRED_GLOSSARY = ['Prompt', 'Model', 'Input', 'Output', 'Context', 'Token', 'Zero-shot', 'One-shot', 'Few-shot', 'Evaluation', 'Hallucination', 'Prompt injection', 'Bias', 'Personal data', 'Human review', 'Prompt chain', 'Acceptance criteria'];
const REQUIRED_MICROCOPY = ['chooseBurger', 'changeBurger', 'startJourney', 'continue', 'previous', 'next', 'openLearnMore', 'closeLearnMore', 'simpleSelected', 'proSelected', 'required', 'recommended', 'optional', 'notNeeded', 'needsAttention', 'actionAdded', 'notRelevant', 'promptCopied', 'copyFailed', 'downloadStarted', 'savedLocally', 'localSaveFailed', 'clearSavedWork', 'resetConfirmation', 'exerciseCorrect', 'exerciseNeedsAnotherLook', 'journeyCompleted', 'buildAnotherPrompt', 'continueToNextBurger', 'reducedMotion', 'invalidSharedLink'];

function validateShared(sc) {
  const errors = [];
  const err = (m) => errors.push(`shared: ${m}`);
  if (/TODO/.test(JSON.stringify(sc))) err('contains unfinished TODO content');
  for (const b of BITE) if (!sc.bite.letters[b.key]) err(`BITE chapter missing "${b.key}"`);
  for (const c of SAFETY_CHECKS) {
    const x = sc.responsibleAi.checks[c.key];
    if (!x) { err(`responsible-AI chapter missing "${c.key}"`); continue; }
    if (words(x.simpleDefinition) > 25) err(`${c.key}: Simple definition over 25 words`);
    for (const f of ['proExplanation', 'correctiveAction', 'promptLevelControl', 'workflowLevelControl', 'notRelevantWhen', 'notRelevantExample'])
      if (!x[f]) err(`${c.key}: missing ${f}`);
    if (!x.warningSigns.length) err(`${c.key}: needs warning signs`);
  }
  const terms = sc.glossary.map((g) => g.term);
  for (const t of REQUIRED_GLOSSARY) if (!terms.includes(t)) err(`glossary missing "${t}"`);
  for (const g of sc.glossary) if (words(g.simple) > 25) err(`glossary "${g.term}": Simple definition over 25 words`);
  for (const k of REQUIRED_MICROCOPY) if (!sc.globalMicrocopy[k]) err(`global microcopy missing "${k}"`);
  const cs = sc.caseStudy;
  if (cs.steps.length !== 9) err('case study needs exactly 9 steps');
  if (!cs.reconstructionNotice.includes(CASE_STUDY_NOTICE) || !cs.promptReconstruction.note.includes(CASE_STUDY_NOTICE)) err('case study must show the reconstruction notice');
  for (const l of UNIVERSAL_LAYERS) if (!cs.promptReconstruction.layers[l.key]) err(`case-study reconstruction missing layer "${l.key}"`);
  if (/\d+\s?%|€|\$|revenue|turnover/i.test(JSON.stringify(cs).replace(/No other company, client, revenue or performance claims are made\./, '')))
    err('case study contains a number or financial claim that is not in the approved material');
  // A feature may be described in the present tense only once it is built (Numbered Prompt 8, Part N).
  const allBuilt = sc.accessibility.features.every((f) => f.implemented);
  if ((sc.accessibility.status === 'describes-current-site') !== allBuilt) err('accessibility status must match the features’ implemented flags');
  for (const f of sc.accessibility.features) if (!f.planned || !f.current) err(`accessibility feature "${f.name}" needs planned and current wording`);
  if (/2\+2/.test(JSON.stringify(sc.caseStudy))) err('case study must explain the pilot instead of “2+2”');
  overclaims(sc, 'shared').forEach(err);
  return errors;
}

const STATUS_NOTE = {
  'describes-current-site': '',
  'planned-until-ux-integration': '> *Status: describes planned behaviour. It becomes true when the interface is built and checked.*\n\n',
};
const sections = (list, level = '###') => list.map((x) => `${level} ${x.heading}\n${modeText(x.body)}`).join('\n\n');

function renderShared(sc) {
  const w = sc.welcome, b = sc.bite, r = sc.responsibleAi, cs = sc.caseStudy;
  return `<!-- GENERATED FILE — do not edit. Source of truth: src/data/sharedContent.ts
     Regenerate with \`npm run content:render\`; \`npm run content:check\` fails if this file is stale. -->

# Prompt Smash! — Shared handbook

*Every chapter outside the four burger journeys. Simple text comes first; “Pro adds” is shown after it in Pro mode, never instead of it.*

---

## 1. ${w.title}

> ${w.lead}

${sections(w.sections)}

### ${w.demo.heading}
**Before**

> ${w.demo.weak}

**After**

${fence(w.demo.better)}

What changed:
${list(w.demo.whatChanged)}

### ${w.selectHeading}
${w.selectHelp}

| Burger | Discipline | Card line |
|---|---|---|
${w.selectorCards.map((c) => `| ${c.burgerName} | ${c.discipline} | ${c.bestForLine} |`).join('\n')}

---

## 2. ${b.title}

${modeText(b.intro)}

${BITE.map((l) => `### ${l.letter} — ${l.name}: ${l.question}
${modeText(b.letters[l.key].explanation)}

*Tiny example:* ${b.letters[l.key].tinyExample}`).join('\n\n')}

${sections([b.passVersusAttention, b.tasteNotNeeded, b.notCorrectOrSafe, b.layerConnection])}

| Letter | Layers checked |
|---|---|
${BITE.map((l) => `| ${l.letter} — ${l.name} | ${l.layers.map(label).join(', ')} |`).join('\n')}

**What BITE does and does not mean**
${list(BITE_LIMITS)}

---

## 3. ${r.title}

${modeText(r.intro)}

${sections([r.reviewStates])}

${SAFETY_CHECKS.map((c) => {
  const x = r.checks[c.key];
  return `### ${c.name}: ${c.question}
**${x.simpleDefinition}**

*Pro adds:* ${x.proExplanation}

- **Warning signs:**
${x.warningSigns.map((s) => `  - ${s}`).join('\n')}
- **Corrective action:** ${x.correctiveAction}
- **Prompt-level control:** ${x.promptLevelControl}
- **Workflow or system-level control:** ${x.workflowLevelControl}
- **“Not relevant” is legitimate when:** ${x.notRelevantWhen} *(Example reason: “${x.notRelevantExample}”)*`;
}).join('\n\n')}

${sections([r.promptVersusWorkflow, r.whyNotSwitchedOff])}

*${r.disclaimer}*

---

## 4. ${cs.title}

*${cs.subtitle}*

> **${cs.reconstructionNotice}**

${cs.steps.map((st) => `### ${st.heading}\n${st.body}`).join('\n\n')}

### The prompt structure: ${cs.promptReconstruction.label}
*${cs.promptReconstruction.note}*

${fence(UNIVERSAL_LAYERS.map((l) => `${l.label}:\n${cs.promptReconstruction.layers[l.key]}`).join('\n\n'))}

### Implemented in the project
${list(cs.implementedInProject)}

### ${cs.futureAgenticControls.heading}
*Not part of the project. These are recommendations for a future workflow in which an AI agent can take actions.*

${list(cs.futureAgenticControls.items)}

*${cs.attribution}*

---

## 5. Glossary

| Term | Simple | Pro adds |
|---|---|---|
${sc.glossary.map((g) => `| **${g.term}** | ${g.simple} | ${g.pro} |`).join('\n')}

---

## 6. ${sc.about.title}

${sc.about.intro}

${STATUS_NOTE[sc.about.status]}${sections(sc.about.sections)}

---

## 7. ${sc.privacy.title}

${sc.privacy.intro}

${STATUS_NOTE[sc.privacy.status]}${sections(sc.privacy.sections)}

---

## 8. ${sc.accessibility.title}

${sc.accessibility.intro}

${STATUS_NOTE[sc.accessibility.status]}${sc.accessibility.features.every((f) => f.implemented) ? '' : `*${sc.accessibility.plannedNote}*\n\n`}${sc.accessibility.features.map((f) => `- **${f.name}:** ${f.implemented ? f.current : `${f.planned} *(planned)*`}`).join('\n')}

${sc.accessibility.contact ? `${sc.accessibility.contact}\n\n` : ''}---

## 9. ${sc.disclaimer.title}

${list(sc.disclaimer.points)}

**Footer note:** ${sc.disclaimer.footerNote}

---

## 10. Footer, invalid states and 404

### Footer
${sc.footerAndErrors.footer.navigation.map((n) => `- ${n.label} → \`${n.route}\``).join('\n')}

${sc.footerAndErrors.footer.copyright}

*${sc.footerAndErrors.footer.disclaimerNote}*

${['invalidJourney', 'invalidLayer', 'notFound']
  .map((k) => {
    const e = sc.footerAndErrors[k];
    return `### ${k === 'notFound' ? '404' : k === 'invalidJourney' ? 'Invalid journey' : 'Invalid layer'}\n**${e.heading}**\n\n${e.body}\n\n**[${e.action}]**`;
  })
  .join('\n\n')}

**Return-home action:** ${sc.footerAndErrors.returnHome}

---

## Global microcopy

*The same action always uses the same verb. \`{{filename}}\` and \`{{burger}}\` are filled in by the interface.*

| Situation | Copy |
|---|---|
${Object.entries(sc.globalMicrocopy).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}
`;
}

/* ------------------------------------------------------------------ */

const mode = process.argv[2] ?? 'check';
let failed = false;
const UNITS = [
  ...JOURNEYS.map(({ data, file, minExercises }) => ({ id: data.id, file, source: SOURCE_FILE[data.id], errors: validate(data, minExercises), md: render(data) })),
  { id: 'shared', file: SHARED_FILE, source: 'sharedContent.ts', errors: validateShared(sharedContent), md: renderShared(sharedContent) },
];
for (const { id, file, source, errors, md } of UNITS) {
  if (errors.length) {
    failed = true;
    console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  }
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
    } else console.log(`✓ ${file} matches ${source}`);
  }
  if (!errors.length) console.log(`✓ ${id}: Constitution checks passed`);
}
process.exit(failed ? 1 : 0);
