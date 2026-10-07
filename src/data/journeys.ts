// Development-stage selector data. "coming-later" is temporary: every journey
// must be complete before launch (CONTENT_CONSTITUTION.md §4).
import type { JourneyId } from './schema';

export type JourneyStatus = 'available' | 'coming-later';

export interface Journey {
  id: JourneyId;
  burger: string;
  topic: string;
  status: JourneyStatus;
  /** Accent used by the restrained card placeholder swatch. */
  accent: 'tomato' | 'mustard' | 'pickle' | 'ink';
}

export const journeys: readonly Journey[] = [
  { id: 'hamburger', burger: 'Hamburger', topic: 'Prompt Design', status: 'available', accent: 'tomato' },
  { id: 'crispy-chicken', burger: 'Crispy Chicken Burger', topic: 'Prompt Engineering', status: 'coming-later', accent: 'mustard' },
  { id: 'bacon-cheese', burger: 'Bacon Cheese Burger', topic: 'Text-to-Image', status: 'coming-later', accent: 'ink' },
  { id: 'chilli-cheese', burger: 'Chilli Cheese Burger', topic: 'Text-to-Code', status: 'coming-later', accent: 'pickle' },
];
