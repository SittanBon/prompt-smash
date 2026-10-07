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

/** Learner-facing BITE state. 'not-needed' is only valid for Taste. */
export type BiteReviewState = 'not-yet-checked' | 'clear' | 'needs-attention' | 'not-needed';

/* ------------------------------------------------------------------ */
/* Simple / Pro contract (Constitution §3)                             */
/* ------------------------------------------------------------------ */

/** Simple mode: short, concrete, minimal jargon. */
export interface SimpleContent {
  /** One sentence, 25 words or fewer. Universal: identical in every journey. */
  definition: string;
  /**
   * Journey-specific example clause, shown after the universal definition as
   * secondary text ("For an image, this may mean…"). It clarifies the
   * definition for this burger without changing the layer's meaning.
   */
  domainClause: string;
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
    /** Visible field label, e.g. "Your answer". */
    label: string;
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

  /** What happens to the result when this layer is left out. */
  omissionEffect: ModeText;

  /** How this layer's answer is written into the assembled prompt (see promptAssembly.ts). */
  assembly: {
    /** Heading used in the assembled prompt, e.g. "Goal". */
    sectionLabel: string;
    /** Template with the {{answer}} placeholder. */
    template: string;
  };

  /** Feedback beside the answer field. */
  states: {
    empty: string;
    /** Shown when the answer looks too vague or seems to belong in another layer. */
    warning: string;
    complete: string;
    /** Optional layers only: shown when marked "Not needed". {{reason}} is the learner's reason. */
    notNeeded?: string;
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
  /** 'image-description': a written description of an image that was not generated (Bacon Cheese). */
  kind: 'text' | 'image' | 'image-description' | 'code';
  /** Text or code body, an image path under public/assets/, or an image description. */
  content: string;
  /** Required when kind is 'image'. */
  alt?: string;
  /** e.g. "Example only. Real outputs vary." */
  illustrativeLabel: string;
}

/** The same seven layers applied to a different, non-anchor task. */
export interface LayerVariation {
  title: string;
  scenario: string;
  answers: Record<LayerKey, string>;
}

export interface WorkedExample {
  /** First screen of the journey: the payoff before any building. */
  firstScreen: {
    heading: string;
    weakLabel: string;
    improvedLabel: string;
    payoff: string;
    /** Optional: compare two working approaches rather than two prompts (e.g. Prompt Engineering). */
    approachComparison?: {
      weak: string;
      improved: string;
      simple: string;
      proPoints: string[];
    };
  };
  weakPrompt: string;
  diagnosedWeaknesses: {
    layer: LayerKey;
    issue: string;
  }[];
  improvedPrompt: string;
  /** Why the improved prompt is better, one point per layer that changed. */
  whyBetter: { layer: LayerKey; point: string }[];
  /**
   * Reading order of sections in the final assembled prompt. May differ from
   * burger order when that serves the AI better (Constitution §5).
   */
  finalPromptStructure: LayerKey[];
  exampleOutput: ExampleOutput;
  /** What the example output still needs before use. */
  limitationsAndReview: string[];
  variation: LayerVariation;
  /** Optional: an explicit test → failure → one change → retest sequence (Prompt Engineering). */
  testCycle?: {
    baselineTest: string;
    failureFound: string;
    controlledRevision: string;
    retest: string;
  };
}

/* ------------------------------------------------------------------ */
/* Evaluation (Prompt Engineering — required for 'crispy-chicken')      */
/* ------------------------------------------------------------------ */

export interface IterationStep {
  /** e.g. "V0", "V1". */
  version: string;
  /** What changed, and in which layer. */
  promptChange: string;
  changedLayers: LayerKey[];
  /** Why the change was made. */
  why: string;
  /** The failure this version addresses. */
  failureAddressed: string;
  /** Labelled "Illustrative result" on screen — the site never runs a model. */
  illustrativeResult: string;
  remainingUncertainty: string;
  /** Whether the result was seen in an illustrative test run or is only described. */
  evidence: 'observed-in-illustrative-test' | 'illustrative-description';
  /**
   * How this version differs from the final layer answers: replacement text,
   * or null to leave the layer out. Lets the version prompt be rebuilt with the
   * real assembler.
   */
  layerOverrides?: Partial<Record<LayerKey, string | null>>;
  /** For versions that are not built from layers at all (e.g. a vague V0). */
  promptText?: string;
}

/** How a criterion is judged (Numbered Prompt 6, Part H). */
export type CheckType = 'deterministic' | 'human-judgement' | 'factual-verification' | 'safety-governance';

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  /** What "Meets" looks like. */
  passSignal: string;
  checkType: CheckType;
}

export interface TestCase {
  id: string;
  /** Short label, e.g. "Multiple issues in one comment". */
  scenario: string;
  input: string;
  whatToCheck: string;
  criterionIds: string[];
}

export interface EvaluationPlan {
  intro: ModeText;
  testCases: TestCase[];
  criteria: EvaluationCriterion[];
  iterations: IterationStep[];
}

/* ------------------------------------------------------------------ */
/* Techniques and exercises                                            */
/* ------------------------------------------------------------------ */

export interface TechniqueRef {
  /** Matches a Technique Lab entry, e.g. "few-shot". */
  id: string;
  name: string;
  /** One sentence. */
  definition: string;
  whenToUse: ModeText;
  /** Tiny example applied to this burger's anchor use case. */
  burgerExample: string;
  limitation: string;
}

/** A full Technique Lab card (Crispy Chicken). Extends the bridge card. */
export interface TechniqueCard extends TechniqueRef {
  /** Added after `definition` in Pro mode. */
  definitionProAddition: string;
  costOrEffort: string;
  notNeededWhen: string;
  /** Where the technique applies in this journey's anchor case. */
  anchorLink: string;
  /** Optional ordered steps, e.g. the stages of a prompt chain. */
  steps?: string[];
}

export interface TechniqueLab {
  intro: ModeText;
  /** The "choose the smallest technique that solves the problem" principle. */
  principle: string;
  techniques: TechniqueCard[];
}

/** Short contextual bridge between the live prompt and BITE (Constitution §9). */
export interface TechniqueBridge {
  intro: string;
  techniques: TechniqueRef[];
  /** Points to the journey that teaches techniques in depth. */
  deeperLearning: string;
  continueLabel: string;
}

export type ExerciseType =
  | 'multiple-choice'
  | 'spot-the-missing-layer'
  | 'order-the-layers'
  | 'match-layer'
  | 'rewrite'
  | 'free-text'
  /** Put stages or steps (not layers) in order. */
  | 'order-steps';

export type ExpectedAnswer =
  | { kind: 'option'; optionId: string }
  | { kind: 'options'; optionIds: string[] }
  | { kind: 'order'; order: string[] }
  /** For matching: option id → the layer (or category) it belongs to. */
  | { kind: 'mapping'; pairs: Record<string, string> }
  /** Open answers are checked against plain-language criteria, never "graded" by an AI. */
  | { kind: 'rubric'; criteria: string[] };

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  question: string;
  /** Prompt text the exercise refers to, shown as a quoted block. */
  material?: string;
  options?: { id: string; label: string }[];
  expected: ExpectedAnswer;
  feedback: {
    /** Why the answer is right — shown in both modes. */
    explanation: string;
    simple: string;
    /** Shown after `simple` in Pro mode, never instead of it. */
    proAddition: string;
    /** Helpful, non-judgemental response for a wrong or incomplete answer. */
    wrongAnswer: string;
  };
  /** Free-form tasks: one good answer, shown as a model, not as the only answer. */
  modelAnswer?: string;
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
  passingExample: string;
  needsAttentionExample: string;
  correctiveAction: string;
  stateCopy: {
    clear: string;
    needsAttention: string;
    /** Taste only. {{reason}} is the learner's reason. */
    notNeeded?: string;
  };
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
  /** {{reason}} is the learner's reason for "Not relevant". */
  stateCopy: {
    needsAttention: string;
    actionAdded: string;
    notRelevant: string;
  };
}

export type ResponsibleAiReview = Record<SafetyCheckKey, SafetyCheck>;

/* ------------------------------------------------------------------ */
/* Journey                                                             */
/* ------------------------------------------------------------------ */

export interface JourneyContent {
  id: JourneyId;
  /** e.g. "Hamburger — Prompt Design". */
  title: string;
  burgerName: string;
  discipline: string;
  /** One-line purpose. */
  shortDescription: string;
  bestFor: string[];
  /** Core ideas the journey must make clear. */
  keyIdeas: string[];
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
  techniqueBridge: TechniqueBridge;
  /** Full Technique Lab — required for 'crispy-chicken', absent elsewhere. */
  techniqueLab?: TechniqueLab;
  /** At least four per journey. */
  exercises: Exercise[];
  bite: BiteReview;
  responsibleAi: ResponsibleAiReview;

  /** Optional: interface copy specific to this journey (Bacon Cheese, Chilli Cheese). Keys are stable ids. */
  journeyMicrocopy?: Record<string, string>;

  completionSummary: {
    headline: string;
    recap: string[];
    takeaway: ModeText;
    /** Why the next journey is the natural step. */
    nextJourneyPitch: string;
    /** Planned interface actions, in display order. */
    actions: string[];
  };
  nextJourney: JourneyId | null;
}

/** Use this to type journey content files: Crispy Chicken must include its evaluation plan and Technique Lab. */
export type JourneyContentStrict =
  | (JourneyContent & { id: 'crispy-chicken'; evaluation: EvaluationPlan; techniqueLab: TechniqueLab })
  | (JourneyContent & { id: Exclude<JourneyId, 'crispy-chicken'> });
