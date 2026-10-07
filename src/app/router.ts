/**
 * Hash routing that works on GitHub Pages without a server router.
 * Routes carry only navigation state — never anything the learner wrote.
 *
 *   #/                                home
 *   #/hamburger/overview              journey overview
 *   #/hamburger/layer/goal            layer builder
 *   #/crispy-chicken/techniques       techniques (full Technique Lab for Crispy Chicken)
 *   #/bacon-cheese/bite               BITE review
 *   #/chilli-cheese/safety            responsible-AI review
 *   #/case-study, #/glossary …        shared handbook chapters
 */
import { useEffect, useState } from 'react';
import type { JourneyId, LayerKey } from '../data/schema';
import { JOURNEYS, isJourneyId, isLayerKey, stepsFor, type JourneyView } from './registry';

export const CHAPTERS = [
  'welcome',
  'technique-lab',
  'bite',
  'responsible-ai',
  'case-study',
  'glossary',
  'about',
  'privacy',
  'accessibility',
  'disclaimer',
] as const;
export type ChapterId = (typeof CHAPTERS)[number];

export type Route =
  | { name: 'home' }
  | { name: 'journey'; journey: JourneyId; view: Exclude<JourneyView, 'build'> }
  | { name: 'journey'; journey: JourneyId; view: 'build'; layer: LayerKey }
  | { name: 'chapter'; chapter: ChapterId }
  | { name: 'invalid-journey' }
  | { name: 'invalid-layer'; journey: JourneyId }
  | { name: 'not-found' };

export function parseHash(hash: string): Route {
  // In-page anchors (no leading "#/") belong to the home page.
  if (!hash.startsWith('#/')) return { name: 'home' };
  const parts = hash.slice(2).split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { name: 'home' };
  const [first, second, third, ...rest] = parts;

  if ((CHAPTERS as readonly string[]).includes(first) && parts.length === 1) return { name: 'chapter', chapter: first as ChapterId };
  if (!isJourneyId(first)) {
    // Something that looks like a journey link, or an unknown page.
    return parts.length > 1 ? { name: 'invalid-journey' } : { name: 'not-found' };
  }
  const journey = first;
  if (!second) return { name: 'journey', journey, view: 'overview' };
  if (rest.length) return { name: 'not-found' };

  if (second === 'layer') {
    if (!third) return { name: 'journey', journey, view: 'build', layer: 'goal' };
    return isLayerKey(third) ? { name: 'journey', journey, view: 'build', layer: third } : { name: 'invalid-layer', journey };
  }
  if (third) return { name: 'not-found' };
  const step = stepsFor(JOURNEYS[journey]).find((s) => s.slug === second && s.view !== 'build');
  if (!step) return { name: 'not-found' };
  return { name: 'journey', journey, view: step.view as Exclude<JourneyView, 'build'> };
}

export function journeyHash(journey: JourneyId, view: JourneyView = 'overview', layer: LayerKey = 'goal'): string {
  if (view === 'build') return `#/${journey}/layer/${layer}`;
  const step = stepsFor(JOURNEYS[journey]).find((s) => s.view === view);
  return `#/${journey}/${step?.slug ?? 'overview'}`;
}

export const chapterHash = (c: ChapterId) => `#/${c}`;

export function navigate(hash: string) {
  if (window.location.hash === hash) return;
  window.location.hash = hash;
}

/** Current route; follows browser back and forward through `hashchange`. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

/** A stable string for "did the page change?" checks (focus and scroll handling). */
export function routeKey(r: Route): string {
  if (r.name === 'journey') return `${r.journey}/${r.view}${r.view === 'build' ? `/${r.layer}` : ''}`;
  if (r.name === 'chapter') return `chapter/${r.chapter}`;
  if (r.name === 'invalid-layer') return `invalid-layer/${r.journey}`;
  return r.name;
}
