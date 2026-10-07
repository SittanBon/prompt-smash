/**
 * The four journeys and their interface configuration. Content comes straight
 * from the typed journey files; this file only adds presentation settings
 * (theme, step list), so journey behaviour stays configuration, not code.
 */
import type { JourneyContent, JourneyId, LayerKey } from '../data/schema';
import { hamburger } from '../data/journeys/hamburger';
import { crispyChicken } from '../data/journeys/crispyChicken';
import { baconCheese } from '../data/journeys/baconCheese';
import { chilliCheese } from '../data/journeys/chilliCheese';
import { UNIVERSAL_LAYERS } from '../data/framework';

export const JOURNEY_ORDER: readonly JourneyId[] = ['hamburger', 'crispy-chicken', 'bacon-cheese', 'chilli-cheese'];

export const JOURNEYS: Record<JourneyId, JourneyContent> = {
  hamburger,
  'crispy-chicken': crispyChicken,
  'bacon-cheese': baconCheese,
  'chilli-cheese': chilliCheese,
};

export const LAYER_KEYS: readonly LayerKey[] = UNIVERSAL_LAYERS.map((l) => l.key);

export const isJourneyId = (v: string): v is JourneyId => (JOURNEY_ORDER as readonly string[]).includes(v);
export const isLayerKey = (v: string): v is LayerKey => (LAYER_KEYS as readonly string[]).includes(v);

/** Journey steps after the overview. "testing" appears only for journeys with an evaluation plan. */
export type JourneyView = 'overview' | 'build' | 'techniques' | 'testing' | 'practice' | 'bite' | 'safety' | 'finish';

export interface StepDef {
  view: JourneyView;
  /** Hash segment. */
  slug: string;
  label: string;
}

const ALL_STEPS: readonly StepDef[] = [
  { view: 'overview', slug: 'overview', label: 'Overview' },
  { view: 'build', slug: 'layer', label: 'Build' },
  { view: 'techniques', slug: 'techniques', label: 'Techniques' },
  { view: 'testing', slug: 'testing', label: 'Test' },
  { view: 'bite', slug: 'bite', label: 'BITE' },
  { view: 'safety', slug: 'safety', label: 'Safety' },
  { view: 'practice', slug: 'practice', label: 'Practise' },
  { view: 'finish', slug: 'finish', label: 'Finish' },
];

export function stepsFor(j: JourneyContent): StepDef[] {
  return ALL_STEPS.filter((s) => s.view !== 'testing' || Boolean(j.evaluation));
}

/** Short card lines; the first best-for items read as a summary. */
export const bestForSummary = (j: JourneyContent) => j.bestFor.slice(0, 3).join(' · ');

/** Short burger name for tight spaces ("Crispy Chicken" rather than "Crispy Chicken Burger"). */
export const shortBurgerName = (j: JourneyContent) => j.burgerName.replace(/ Burger$/, '');

/**
 * Where each journey's own interface microcopy appears. Hints sit on a layer;
 * warnings appear on a layer when the learner's answer matches a simple,
 * deterministic pattern. Both are interface text and never enter the prompt.
 */
export interface JourneyHints {
  layerHints: Partial<Record<LayerKey, string[]>>;
  warnings: { key: string; pattern: RegExp; layers: LayerKey[] }[];
}

const ALL_BUT_RULES: LayerKey[] = ['goal', 'task', 'context', 'requirements', 'style', 'format'];

export const JOURNEY_HINTS: Partial<Record<JourneyId, JourneyHints>> = {
  'bacon-cheese': {
    layerHints: {
      task: ['editPreserveHint', 'variationHint'],
      context: ['noImageUpload'],
      requirements: ['critiquePrompt'],
      style: ['lensNote'],
      format: ['formatCheck', 'transparencyNote'],
    },
    warnings: [
      { key: 'textInImageWarning', pattern: /\b(tagline|headline|caption|lettering|slogan|the words?|text (saying|that reads|reading))\b/i, layers: ['task', 'requirements', 'style'] },
      { key: 'realPersonWarning', pattern: /\b(real (person|people|customer)|colleague|staff member|employee|selfie|my face|(his|her|their) face|photo of (me|my|our|him|her))\b/i, layers: ALL_BUT_RULES },
    ],
  },
  'chilli-cheese': {
    layerHints: {
      task: ['repairHint'],
      context: ['versionHint', 'untrustedCodeNote'],
      requirements: ['testsFirstHint', 'dependencyCheck'],
      format: ['patchOrFile'],
      rules: ['runReviewReminder'],
    },
    warnings: [
      {
        key: 'secretWarning',
        pattern: /(sk-[A-Za-z0-9]{12,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{12,}|(api[_-]?key|secret|token|password)\s*[:=]\s*['"]?(?!YOUR_|<|\[)[^\s'"]{6,})/i,
        layers: ['goal', 'task', 'context', 'requirements', 'style', 'format', 'rules'],
      },
      { key: 'personalDataWarning', pattern: /[\w.+-]+@(?!example\.)[\w-]+\.[a-z]{2,}/i, layers: ALL_BUT_RULES },
    ],
  },
};
