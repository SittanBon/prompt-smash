/**
 * Fixed, journey-independent definitions from CONTENT_CONSTITUTION.md:
 * the seven universal layers, BITE, the responsible-AI checks and the four
 * journeys with their proposed anchor use cases.
 */
import type {
  BiteKey,
  JourneyId,
  LayerKey,
  LayerStatus,
  SafetyCheckKey,
  SafetyReviewState,
} from './schema';

export interface UniversalLayer {
  key: LayerKey;
  order: number;
  /** Generic ingredient — used for asset and DOM ids. */
  ingredientId: 'top-bun' | 'patty' | 'cheese' | 'toppings' | 'sauce' | 'bottom-bun' | 'wrapper';
  ingredient: string;
  /** Full label for headings. */
  label: string;
  /** Compact label where space is tight. */
  shortLabel: string;
  status: LayerStatus;
}

export const UNIVERSAL_LAYERS: readonly UniversalLayer[] = [
  { key: 'goal', order: 1, ingredientId: 'top-bun', ingredient: 'Top bun', label: 'Goal', shortLabel: 'Goal', status: 'required' },
  { key: 'task', order: 2, ingredientId: 'patty', ingredient: 'Patty', label: 'Task', shortLabel: 'Task', status: 'required' },
  { key: 'context', order: 3, ingredientId: 'cheese', ingredient: 'Cheese', label: 'Context and Input', shortLabel: 'Context/Input', status: 'recommended' },
  { key: 'requirements', order: 4, ingredientId: 'toppings', ingredient: 'Toppings', label: 'Requirements and Details', shortLabel: 'Requirements/Details', status: 'recommended' },
  { key: 'style', order: 5, ingredientId: 'sauce', ingredient: 'Sauce', label: 'Style and Quality', shortLabel: 'Style/Quality', status: 'optional' },
  { key: 'format', order: 6, ingredientId: 'bottom-bun', ingredient: 'Bottom bun', label: 'Output Format', shortLabel: 'Output Format', status: 'recommended' },
  { key: 'rules', order: 7, ingredientId: 'wrapper', ingredient: 'Wrapper', label: 'Rules and Boundaries', shortLabel: 'Rules/Boundaries', status: 'recommended' },
];

export const LAYER_STATUS_LABEL: Record<LayerStatus, string> = {
  required: 'Required',
  recommended: 'Recommended',
  optional: 'Optional',
};

export const BITE: readonly { key: BiteKey; letter: string; name: string; question: string; layers: LayerKey[] }[] = [
  { key: 'brief', letter: 'B', name: 'Brief', question: 'Are the Goal and Task clear?', layers: ['goal', 'task'] },
  { key: 'information', letter: 'I', name: 'Information', question: 'Did you provide enough Context and Requirements?', layers: ['context', 'requirements'] },
  { key: 'taste', letter: 'T', name: 'Taste', question: 'Did you describe the intended Style and Quality?', layers: ['style'] },
  { key: 'expectedResult', letter: 'E', name: 'Expected result', question: 'Did you specify the Format and Boundaries?', layers: ['format', 'rules'] },
];

export const SAFETY_CHECKS: readonly { key: SafetyCheckKey; name: string; question: string }[] = [
  { key: 'risk', name: 'Risk', question: 'What could go wrong?' },
  { key: 'injection', name: 'Injection', question: 'Are hidden or untrusted instructions trying to control the AI?' },
  { key: 'hallucination', name: 'Hallucination', question: 'Could the AI invent unsupported information?' },
  { key: 'bias', name: 'Bias', question: 'Could the result represent or treat people unfairly?' },
  { key: 'dataProtection', name: 'Data Protection', question: 'Are personal, confidential or sensitive data being exposed?' },
];

export const SAFETY_REVIEW_STATE_LABEL: Record<SafetyReviewState, string> = {
  'not-yet-reviewed': 'Not yet reviewed',
  'needs-attention': 'Needs attention',
  'action-added': 'Action added',
  'not-relevant': 'Not relevant',
};

/** Four journeys and their proposed anchor use cases (Constitution §11). */
export const JOURNEY_META: readonly {
  id: JourneyId;
  burgerName: string;
  discipline: string;
  anchorUseCase: string;
  anchorStatus: 'proposed' | 'approved';
}[] = [
  {
    id: 'hamburger',
    burgerName: 'Hamburger',
    discipline: 'Prompt Design',
    anchorUseCase: 'Structure a useful prompt for a practical GenAI marketing or content workflow.',
    anchorStatus: 'proposed',
  },
  {
    id: 'crispy-chicken',
    burgerName: 'Crispy Chicken Burger',
    discipline: 'Prompt Engineering',
    anchorUseCase: 'Systematically test and improve a repeatable business-analysis prompt.',
    anchorStatus: 'proposed',
  },
  {
    id: 'bacon-cheese',
    burgerName: 'Bacon Cheese Burger',
    discipline: 'Text-to-Image',
    anchorUseCase: 'Create a clear visual prompt for a polished website hero image.',
    anchorStatus: 'proposed',
  },
  {
    id: 'chilli-cheese',
    burgerName: 'Chilli Cheese Burger',
    discipline: 'Text-to-Code',
    anchorUseCase: 'Request a small, responsive and testable interactive web feature.',
    anchorStatus: 'proposed',
  },
];

/** What BITE does and does not mean — shown with every BITE result (Constitution §7). */
export const BITE_LIMITS: readonly string[] = [
  'Passing BITE means your prompt is better specified.',
  'It does not guarantee that the AI’s answer will be accurate.',
  'It does not mean the task is safe.',
  'It does not replace human review or the responsible-AI review.',
];

/** Shown with the responsible-AI review (Constitution §8). */
export const REVIEW_DISCLAIMER =
  'Reviewed means you considered the issue. It does not guarantee that the prompt or its result is safe.';

/** Screen framing for BITE and the responsible-AI review (Constitution §6, §10). */
export const REVIEW_SCREEN_COPY = {
  biteIntro:
    'BITE is your own test bite before you hand the prompt to the AI. Four quick checks show whether anything important is missing. Fix anything marked Needs attention, then continue.',
  biteNext: 'Next: the responsible-AI review asks what could still go wrong when this prompt is used.',
  reviewIntro:
    'Your prompt is clear. Now check what could still go wrong. For each of the five checks, add an action or mark it Not relevant with a reason. Then copy or download your prompt.',
} as const;

/** Evaluation scale used in every evaluation plan (deliberately coarse — no fake precision). */
export const EVALUATION_SCALE: readonly { key: string; label: string; meaning: string }[] = [
  { key: 'meets', label: 'Meets', meaning: 'The result does what the criterion asks, with no problems a reviewer would need to fix.' },
  { key: 'partly', label: 'Partly meets', meaning: 'Some of it is right, but a reviewer would need to correct or complete it.' },
  { key: 'does-not-meet', label: 'Does not meet', meaning: 'The result misses or breaks the criterion.' },
  { key: 'not-applicable', label: 'Not applicable', meaning: 'This criterion does not apply to this test case.' },
];

export const CHECK_TYPE_LABEL: Record<'deterministic' | 'human-judgement' | 'factual-verification' | 'safety-governance', string> = {
  deterministic: 'Deterministic check (structure, required fields — can be checked automatically)',
  'human-judgement': 'Human judgement (is it useful, sensible, well prioritised?)',
  'factual-verification': 'Factual verification (checked against the source data)',
  'safety-governance': 'Safety and governance review',
};

/** Interface microcopy for evaluation and version comparison. {{version}} and {{case}} are filled in by the interface. */
export const EVALUATION_MICROCOPY = {
  testCaseNotRun: 'Not tested yet. Run the prompt on this case and record what happened.',
  recordResult: 'How did the result do against each criterion?',
  resultRecorded: 'Result recorded for {{case}}.',
  oneRunReminder: 'One good result is not proof. Try the same prompt on more cases, or run it again.',
  changeOneThing: 'Change one thing at a time, so you can tell what made the difference.',
  versionSaved: 'Version {{version}} saved in this browser.',
  compareVersions: 'Compare versions on the same test cases and the same criteria.',
  compareWarning: 'These versions were tested on different cases, so the comparison is not fair yet.',
  illustrativeLabel: 'Illustrative result from one test run. Results vary between runs, models and versions.',
  noCriteria: 'Define what success looks like before you judge any result.',
} as const;
