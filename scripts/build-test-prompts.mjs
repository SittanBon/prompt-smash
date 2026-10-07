#!/usr/bin/env node
/**
 * Builds the illustrative test prompts for each journey from the real content
 * data and the real assembler, into qa/content-tests/prompts/<journey>/.
 * The folder is local-only (git-ignored); results are summarised in
 * content/tests/*.md.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemblePrompt } from '../src/data/promptAssembly.ts';
import { crispyChicken as j } from '../src/data/journeys/crispyChicken.ts';
import {
  FEEDBACK_SAMPLE, PERSONAL_DATA_SAMPLE, INJECTION_SAMPLE, TINY_SAMPLE, AMBIGUOUS_SAMPLE, FORMATTING_SAMPLE,
  LABELLED_EXAMPLES, feedbackBlock,
} from '../src/data/fixtures/customerFeedback.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'qa/content-tests/prompts/crispy-chicken');
mkdirSync(out, { recursive: true });

const finalAnswers = Object.fromEntries(j.layers.map((l) => [l.key, l.answerField.exampleAnswer]));
const build = (over = {}) => {
  const answers = {};
  for (const l of j.layers) {
    const o = over[l.key];
    answers[l.key] = o === null ? { state: 'empty' } : { state: 'filled', text: o ?? finalAnswers[l.key] };
  }
  return assemblePrompt(j.layers, answers).text;
};
const withData = (sample) => finalAnswers.context.replace(feedbackBlock(FEEDBACK_SAMPLE), feedbackBlock(sample));
const versionText = (v) => {
  const it = j.evaluation.iterations.find((x) => x.version === v);
  return it.promptText ?? build(it.layerOverrides ?? {});
};
const v2 = j.evaluation.iterations.find((x) => x.version === 'V2').layerOverrides;
const firstExample = LABELLED_EXAMPLES.split('\n\n')[0] + '\n</examples>';

const prompts = {
  'v0-vague': versionText('V0'),
  'v1-seven-layer': versionText('V1'),
  // Technique comparison on the V2 prompt: only the number of examples changes.
  't1-zero-shot': build({ ...v2, context: finalAnswers.context.replace(/\n\nTwo labelled examples show the expected pattern:\n<examples>[\s\S]*?<\/examples>/, '') }),
  't2-one-shot': build({ ...v2, context: finalAnswers.context.replace(LABELLED_EXAMPLES, firstExample).replace('Two labelled examples show', 'One labelled example shows') }),
  't3-few-shot-v2': versionText('V2'),
  't4-final-run-a': build(),
  't4-final-run-b': build(),
  't6-ambiguous': build({ context: withData(AMBIGUOUS_SAMPLE) }),
  't7-personal-data': build({ context: withData(PERSONAL_DATA_SAMPLE).replace(' Personal details were removed before sharing.', '') }),
  't8-injection': build({ context: withData(INJECTION_SAMPLE) }),
  't9-tiny-sample': build({ context: withData(TINY_SAMPLE) }),
  't10-empty': build({ context: finalAnswers.context.replace(feedbackBlock(FEEDBACK_SAMPLE), '<feedback>\n</feedback>') }),
  't11-formatting': build({ context: withData(FORMATTING_SAMPLE) }),
  // Prompt chain, stage 1: classification only. Stage 2 is built from stage 1's real output.
  't5-chain-stage1': build({
    goal: finalAnswers.goal,
    task: 'Classify each customer comment below using the approved categories. Do not prioritise or recommend anything yet.',
    requirements: '- A comment may belong to more than one category. Use “Unclear” when the meaning cannot be determined.\n- Note the sentiment of each comment.',
    style: null,
    format: 'One table only: ID | Categories | Sentiment | Note. Then a list headed “For human review” (or “None found”).',
  }),
};
for (const [name, text] of Object.entries(prompts)) writeFileSync(join(out, `${name}.txt`), text + '\n');
console.log(`wrote ${Object.keys(prompts).length} prompts to ${out}`);
