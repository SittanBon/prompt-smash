/**
 * Prompt Smash! content schema.
 *
 * One `JourneyContent` object holds everything a burger journey needs. The
 * shape is deliberately plain so a content designer can edit journey files
 * directly. Rules for what goes in each field live in CONTENT_CONSTITUTION.md;
 * progress is tracked in CONTENT_COVERAGE_MATRIX.md (a field existing here does
 * not mean its content is done).
 */

/* ------------------------------------------------------------------ */
/* Shared vocabulary                                                   */
/* ------------------------------------------------------------------ */

export type JourneyId = 'hamburger' | 'crispy-chicken' | 'bacon-cheese' | 'chilli-cheese';

/** The seven universal layers, in fixed burger order (Constitution §5). */
export type LayerKey = 'goal' | 'task' | 'context' | 'requirements' | 'style' | 'format' | 'rules';

export type LayerStatus = 'required' | 'recommended' | 'optional';

export type LearningMode = 'simple' | 'pro';

/** BITE letters (Constitution §7). */
export type BiteKey = 'brief' | 'information' | 'taste' | 'expectedResult';

/** Responsible-AI checks (Constitution §8). */
export type SafetyCheckKey = 'risk' | 'injection' | 'hallucination' | 'bias' | 'dataProtection';

/**
 * Learner-facing review state. A check starts as 'not-yet-reviewed'.
 * "Reviewed" means considered — never "guaranteed safe".
 */
export type SafetyReviewState = 'not-yet-reviewed' | 'needs-attention' | 'action-added' | 'not-relevant';

/* ------------------------------------------------------------------ */
/* Simple / Pro contract (Constitution §3)                             */
/* ------------------------------------------------------------------ */

/** Simple mode: short, concrete, minimal jargon. */
export interface SimpleContent {
  /** One sentence, 25 words or fewer. */
  definition: string;
  /** The question the learner should ask themselves. */
  learnerQuestion: string;
  /** One tiny illustration, 20 words or fewer (not the full example answer). */
  example: string;
  /** One practical tip. Doubles as the layer's "Practical tip". */
  tip: string;
  /** Plain-language explanations of any unavoidable term used above. */
  jargonExplained?: { term: string; plain: string }[];
}

/** Pro mode: shown in addition to Simple content, never instead of it. */
export interface ProContent {
  /** The recognised professional term. */
  professionalTerm: string;
  whyItWorks: string;
  tradeOff: string;
  advancedOptions: string[];
  workplaceApplication: string;
  /** Verification, safety or governance note — include where relevant. */
  governanceNote?: string;
}

/**
 * Text with a Simple version and a Pro addition. In Pro mode the addition is
 * shown AFTER the simple text — never instead of it (Constitution §3).
 */
export interface ModeText {
  simple: string;
  proAddition: string;
}

/* ------------------------------------------------------------------ */
/* Layers                                                              */
/* ------------------------------------------------------------------ */

export interface LayerContent {
  key: LayerKey;
  /** Burger-specific food name, e.g. "Crispy chicken fillet" for the Task layer. */
  ingredientName: string;
  /** One sentence, 20 words or fewer: why this ingredient fits this layer (Constitution §6). */
  metaphorLink: string;
  /** Must equal the universal status in UNIVERSAL_LAYERS — journeys never change it. */
  status: LayerStatus;
  /** Optional note on how the universal status applies to this burger. */
  statusNote?: string;

  simple: SimpleContent;
  pro: ProContent;

  /** The learner's text field (shown on screen as "Your answer", never "input"). */
  answerField: {
    /** The question shown above the field. */
    question: string;
    placeholder: string;
    /** A complete example answer for the anchor use case. */
    exampleAnswer: string;
  };

  whyItMatters: ModeText;
  commonMistake: ModeText;
  learnMore: {
    title: string;
    body: string;
  };

  /** How this layer's input is written into the assembled prompt. */
  assembly: {
    /** Heading used in the assembled prompt, e.g. "Goal". */
    sectionLabel: string;
    /** Template with the {{input}} placeholder, e.g. "My goal: {{input}}". */
    template: string;
  };

  /** Feedback beside the input field. */
  states: {
    empty: string;
    /** Shown when the input looks too vague or is missing something important. */
    warning: string;
    complete: string;
  };
}

/** Exactly seven layers, in fixed order. */
export type SevenLayers = [
  LayerContent & { key: 'goal' },
  LayerContent & { key: 'task' },
  LayerContent & { key: 'context' },
  LayerContent & { key: 'requirements' },
  LayerContent & { key: 'style' },
  LayerContent & { key: 'format' },
  LayerContent & { key: 'rules' },
];

/* ------------------------------------------------------------------ */
/* Worked example: weak → improved → final                             */
/* ------------------------------------------------------------------ */

/** Shown in the result step, always labelled as an example. */
export interface ExampleOutput {
  kind: 'text' | 'image' | 'code';
  /** Text or code body, or an image path under public/assets/. */
  content: string;
  /** Required when kind is 'image'. */
  alt?: string;
  /** e.g. "Example only. Real outputs vary." */
  illustrativeLabel: string;
}

export interface WorkedExample {
  weakPrompt: string;
  diagnosedWeaknesses: {
    layer: LayerKey;
    issue: string;
  }[];
  improvedPrompt: string;
  /**
   * Reading order of sections in the final assembled prompt. May differ from
   * burger order when that serves the AI better (Constitution §5).
   */
  finalPromptStructure: LayerKey[];
  exampleOutput: ExampleOutput;
}

/* ------------------------------------------------------------------ */
/* Evaluation (Prompt Engineering — required for 'crispy-chicken')      */
/* ------------------------------------------------------------------ */

export interface IterationStep {
  /** e.g. "v1", "v2". */
  version: string;
  /** What changed, and in which layer. */
  promptChange: string;
  changedLayers: LayerKey[];
  /** Labelled "Illustrative result" on screen — the site never runs a model. */
  illustrativeResult: string;
}

export interface EvaluationPlan {
  testCases: { id: string; input: string; whatToCheck: string }[];
  criteria: { id: string; description: string; passSignal: string }[];
  iterations: IterationStep[];
}

/* ------------------------------------------------------------------ */
/* Techniques and exercises                                            */
/* ------------------------------------------------------------------ */

export interface TechniqueRef {
  /** Matches a Technique Lab entry, e.g. "few-shot". */
  id: string;
  name: string;
  whenToUse: ModeText;
  /** How the technique applies to this burger's anchor use case. */
  burgerExample: string;
}

export type ExerciseType =
  | 'multiple-choice'
  | 'spot-the-missing-layer'
  | 'order-the-layers'
  | 'match-layer'
  | 'rewrite'
  | 'free-text';

export type ExpectedAnswer =
  | { kind: 'option'; optionId: string }
  | { kind: 'options'; optionIds: string[] }
  | { kind: 'order'; order: string[] }
  /** Open answers are checked against plain-language criteria, never "graded" by an AI. */
  | { kind: 'rubric'; criteria: string[] };

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: { id: string; label: string }[];
  expected: ExpectedAnswer;
  feedback: {
    /** Why the answer is right — shown in both modes. */
    explanation: string;
    simple: string;
    /** Shown after `simple` in Pro mode, never instead of it. */
    proAddition: string;
  };
}

/* ------------------------------------------------------------------ */
/* BITE and responsible-AI review                                      */
/* ------------------------------------------------------------------ */

export interface BiteCheck {
  /** Burger-specific wording of the BITE question. */
  question: string;
  /** What a good answer contains for this burger. */
  lookFor: string[];
  explanation: ModeText;
  /** Taste only: when Style/Quality genuinely doesn't apply, the learner confirms a reason. */
  notNeeded?: { allowed: boolean; exampleReason: string };
}

export type BiteReview = Record<BiteKey, BiteCheck>;

export interface SafetyCheck {
  explanation: ModeText;
  burgerExample: string;
  warningSign: string;
  correctiveAction: string;
  /** Example of a valid reason for marking this check "Not relevant". */
  notRelevantExampleReason: string;
  /** What a prompt can ask vs. what a workflow/system must enforce. */
  promptVsWorkflow: {
    promptInstruction: string;
    workflowControl: string;
  };
}

export type ResponsibleAiReview = Record<SafetyCheckKey, SafetyCheck>;

/* ------------------------------------------------------------------ */
/* Journey                                                             */
/* ------------------------------------------------------------------ */

export interface JourneyContent {
  id: JourneyId;
  burgerName: string;
  discipline: string;
  shortDescription: string;
  bestFor: string;
  learningOutcomes: string[];
  anchorUseCase: {
    title: string;
    scenario: string;
    status: 'proposed' | 'approved';
  };

  layers: SevenLayers;
  /** Shown in "Understand the purpose" (weak vs improved) and in the result step. */
  workedExample: WorkedExample;
  /** Required for 'crispy-chicken'; optional elsewhere. */
  evaluation?: EvaluationPlan;
  techniques: TechniqueRef[];
  /** At least four per journey. */
  exercises: Exercise[];
  bite: BiteReview;
  responsibleAi: ResponsibleAiReview;

  completionSummary: {
    headline: string;
    recap: string[];
    takeaway: ModeText;
  };
  nextJourney: JourneyId | null;
}

/** Use this to type journey content files: Crispy Chicken must include its evaluation plan. */
export type JourneyContentStrict =
  | (JourneyContent & { id: 'crispy-chicken'; evaluation: EvaluationPlan })
  | (JourneyContent & { id: Exclude<JourneyId, 'crispy-chicken'> });
