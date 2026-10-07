/**
 * Types for the shared handbook chapters (everything outside the four burger
 * journeys). Kept separate from JourneyContent on purpose: global pages must
 * not add fields to the journey schema.
 */
import type { BiteKey, JourneyId, LayerKey, ModeText, SafetyCheckKey } from './schema';

/** A heading with Simple text and a Pro addition (Pro is shown after Simple, never instead). */
export interface SharedSection {
  heading: string;
  body: ModeText;
}

/** Whether a chapter describes something that already works, or behaviour planned for the interface. */
export type ImplementationStatus = 'describes-current-site' | 'planned-until-ux-integration';

export interface WelcomeChapter {
  title: string;
  lead: string;
  sections: SharedSection[];
  demo: {
    heading: string;
    weak: string;
    better: string;
    whatChanged: string[];
  };
  selectHeading: string;
  selectHelp: string;
  selectorCards: { journeyId: JourneyId; burgerName: string; discipline: string; bestForLine: string }[];
}

export interface BiteChapter {
  title: string;
  intro: ModeText;
  letters: Record<BiteKey, { explanation: ModeText; tinyExample: string }>;
  passVersusAttention: SharedSection;
  tasteNotNeeded: SharedSection;
  notCorrectOrSafe: SharedSection;
  layerConnection: SharedSection;
}

export interface SharedSafetyCheck {
  simpleDefinition: string;
  proExplanation: string;
  warningSigns: string[];
  correctiveAction: string;
  promptLevelControl: string;
  workflowLevelControl: string;
  /** When marking the check "Not relevant" is legitimate. */
  notRelevantWhen: string;
  notRelevantExample: string;
}

export interface ResponsibleAiChapter {
  title: string;
  intro: ModeText;
  reviewStates: SharedSection;
  checks: Record<SafetyCheckKey, SharedSafetyCheck>;
  promptVersusWorkflow: SharedSection;
  whyNotSwitchedOff: SharedSection;
  disclaimer: string;
}

export interface CaseStudyChapter {
  title: string;
  subtitle: string;
  /** Must contain the exact reconstruction notice. */
  reconstructionNotice: string;
  steps: { heading: string; body: string }[];
  promptReconstruction: {
    label: string;
    note: string;
    layers: Record<LayerKey, string>;
  };
  implementedInProject: string[];
  futureAgenticControls: { heading: string; items: string[] };
  attribution: string;
}

export interface GlossaryEntry {
  term: string;
  /** 25 words or fewer. */
  simple: string;
  pro: string;
}

export interface InfoPage {
  title: string;
  intro: string;
  status: ImplementationStatus;
  sections: SharedSection[];
}

export interface AccessibilityPage {
  title: string;
  intro: string;
  status: ImplementationStatus;
  plannedNote: string;
  features: { name: string; description: string }[];
  contact: string;
}

export interface DisclaimerPage {
  title: string;
  points: string[];
  footerNote: string;
}

export interface FooterAndErrors {
  footer: {
    navigation: { label: string; route: string }[];
    copyright: string;
    disclaimerNote: string;
  };
  invalidJourney: { heading: string; body: string; action: string };
  invalidLayer: { heading: string; body: string; action: string };
  notFound: { heading: string; body: string; action: string };
  returnHome: string;
}

export type GlobalMicrocopyKey =
  | 'chooseBurger'
  | 'changeBurger'
  | 'startJourney'
  | 'continue'
  | 'previous'
  | 'next'
  | 'openLearnMore'
  | 'closeLearnMore'
  | 'simpleSelected'
  | 'proSelected'
  | 'required'
  | 'recommended'
  | 'optional'
  | 'notNeeded'
  | 'needsAttention'
  | 'actionAdded'
  | 'notRelevant'
  | 'promptCopied'
  | 'copyFailed'
  | 'downloadStarted'
  | 'savedLocally'
  | 'localSaveFailed'
  | 'clearSavedWork'
  | 'resetConfirmation'
  | 'exerciseCorrect'
  | 'exerciseNeedsAnotherLook'
  | 'journeyCompleted'
  | 'buildAnotherPrompt'
  | 'continueToNextBurger'
  | 'reducedMotion'
  | 'invalidSharedLink';

export interface SharedContent {
  welcome: WelcomeChapter;
  bite: BiteChapter;
  responsibleAi: ResponsibleAiChapter;
  caseStudy: CaseStudyChapter;
  glossary: GlossaryEntry[];
  about: InfoPage;
  privacy: InfoPage;
  accessibility: AccessibilityPage;
  disclaimer: DisclaimerPage;
  footerAndErrors: FooterAndErrors;
  globalMicrocopy: Record<GlobalMicrocopyKey, string>;
}
