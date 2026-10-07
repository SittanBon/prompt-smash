/**
 * Live-prompt assembly rules and microcopy, shared by every journey.
 *
 * `assemblePrompt` is a pure function: the future interface calls it to build
 * the preview and the copied/downloaded prompt, and the content scripts use it
 * to render each journey's final prompt from its example answers, so the
 * documented final prompt can never drift from what the interface produces.
 *
 * Type-only imports keep this file runnable by Node's type stripping
 * (scripts/content.mjs).
 */
import type { LayerContent, LayerKey } from './schema';

/** What the learner has done with one layer. */
export type LayerAnswer =
  | { state: 'filled'; text: string }
  /** Deliberately skipped (optional layers only), with the learner's reason. */
  | { state: 'not-needed'; reason: string }
  | { state: 'empty' };

export type PromptAnswers = Partial<Record<LayerKey, LayerAnswer>>;

export interface PromptSection {
  key: LayerKey;
  /** Section heading, e.g. "Goal". */
  label: string;
  /** The learner's answer inside the layer's template. */
  body: string;
}

export interface AssembledPrompt {
  /** The exact text that is copied or downloaded. Never contains interface text. */
  text: string;
  /** The same sections as `text`, kept apart so the preview can highlight one. */
  sections: PromptSection[];
  /** Layer keys that produced a section, in fixed order (for preview highlighting). */
  includedLayers: LayerKey[];
  /** Required layers still empty. Copying is blocked until this is empty. */
  missingRequired: LayerKey[];
  /** Non-required layers left empty (as opposed to "Not needed"). Shown as a gentle note. */
  skipped: LayerKey[];
  /** Layers deliberately marked "Not needed". */
  notNeeded: LayerKey[];
}

/** The documented rules, in plain language (rendered into the editorial file). */
export const ASSEMBLY_RULES: readonly string[] = [
  'Goal and Task must always be present. Copying and downloading stay disabled until both are filled in.',
  'Recommended and optional layers appear only when the learner has completed them.',
  'Each included layer becomes a labelled section ("Goal:", "Task:" and so on). Empty layers leave no heading, no stray punctuation and no blank gap.',
  'The order of the sections is fixed: Goal, Task, Context and Input, Requirements and Details, Style and Quality, Output Format, Rules and Boundaries.',
  'Removing any optional or recommended layer still produces a well-formed prompt. The interface reminds the learner to check that the remaining sections do not refer to something they removed, such as “the brief”.',
  '"Not needed" is different from empty. A layer marked Not needed is left out of the prompt on purpose and its reason is shown in the interface, but the reason is not copied into the prompt. An empty layer is flagged as skipped.',
  'The assembler never invents missing information. It only uses what the learner wrote.',
  'Interface text (tips, warnings, status labels, BITE and responsible-AI review notes) is never part of the copied prompt.',
  'Safety warnings stay outside the copied prompt. A safety point only enters the prompt when the learner adds it to a layer themselves, usually Rules and Boundaries.',
  'Switching between Simple and Pro mode changes the explanations only. The learner\'s answers and the assembled prompt stay exactly the same.',
  'The preview can highlight the section that belongs to the active layer. The highlight is visual only and is not copied.',
];

/** Interface microcopy for the live prompt. {{layer}}, {{ingredient}}, {{reason}} and {{filename}} are filled in by the interface. */
export const ASSEMBLY_MICROCOPY = {
  previewEmpty: 'Your prompt will appear here as you stack each layer.',
  missingGoal: 'Add a Goal to finish your prompt. Without it, the AI can only guess why you are asking.',
  missingTask: 'Add a Task to finish your prompt. The AI needs to know what to do.',
  copyBlocked: 'Add a Goal and a Task before you copy or download your prompt.',
  recommendedSkipped:
    '{{layer}} is skipped. Your prompt still works, but the AI will have to guess this part. Add it now, or carry on.',
  styleNotNeeded: 'Style and Quality marked Not needed: “{{reason}}”. It will not appear in your prompt.',
  notNeededReasonMissing: 'Add a short reason so you remember why you skipped this layer.',
  incompleteAnswer: 'This answer looks unfinished. Add a little more, or carry on if it already says what you mean.',
  layerCompleted: '{{ingredient}} stacked. {{layer}} added to your prompt.',
  layerEdited: '{{layer}} updated in your prompt.',
  layerRemoved: '{{layer}} removed from your prompt.',
  promptCopied:
    'Prompt copied. Paste it into an AI tool you are allowed to use, and check the result before you rely on it.',
  promptDownloaded: 'Prompt downloaded as {{filename}}.',
  resetConfirm: 'Clear all seven layers and start again? This cannot be undone.',
  resetConfirmAction: 'Clear and start again',
  resetCancelAction: 'Keep my prompt',
  localSaved: 'Saved in this browser only. Nothing is sent anywhere.',
  localCleared: 'Your saved work has been removed from this browser.',
  localStorageNote:
    'Your work is saved only in this browser. Clearing your browser data, using private browsing or switching device can remove it.',
} as const;

const SECTION_SEPARATOR = '\n\n';

/** Build the prompt from the learner's answers. Pure and deterministic. */
export function assemblePrompt(layers: readonly LayerContent[], answers: PromptAnswers): AssembledPrompt {
  const sections: PromptSection[] = [];
  const includedLayers: LayerKey[] = [];
  const missingRequired: LayerKey[] = [];
  const skipped: LayerKey[] = [];
  const notNeeded: LayerKey[] = [];

  for (const layer of layers) {
    const answer = answers[layer.key] ?? { state: 'empty' };

    if (answer.state === 'filled' && answer.text.trim() !== '') {
      // A replacer function avoids special `$` patterns in the learner's text.
      const text = answer.text.trim();
      const body = layer.assembly.template.replace('{{answer}}', () => text);
      sections.push({ key: layer.key, label: layer.assembly.sectionLabel, body });
      includedLayers.push(layer.key);
      continue;
    }

    if (answer.state === 'not-needed' && layer.status === 'optional') {
      notNeeded.push(layer.key);
      continue;
    }

    if (layer.status === 'required') missingRequired.push(layer.key);
    else skipped.push(layer.key);
  }

  return {
    text: sections.map((x) => `${x.label}:\n${x.body}`).join(SECTION_SEPARATOR),
    sections,
    includedLayers,
    missingRequired,
    skipped,
    notNeeded,
  };
}

/** Convenience: assemble from each layer's example answer (used for documentation and tests). */
export function assembleExamplePrompt(
  layers: readonly LayerContent[],
  omit: readonly LayerKey[] = [],
  notNeeded: Partial<Record<LayerKey, string>> = {},
): AssembledPrompt {
  const answers: PromptAnswers = {};
  for (const layer of layers) {
    if (notNeeded[layer.key] !== undefined) answers[layer.key] = { state: 'not-needed', reason: notNeeded[layer.key]! };
    else if (omit.includes(layer.key)) answers[layer.key] = { state: 'empty' };
    else answers[layer.key] = { state: 'filled', text: layer.answerField.exampleAnswer };
  }
  return assemblePrompt(layers, answers);
}
