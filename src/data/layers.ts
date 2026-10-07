// The fixed seven-layer Hamburger mapping, derived from the universal layer
// definitions so names stay in one place. Do not rename or reorder without approval.
import { UNIVERSAL_LAYERS, type UniversalLayer } from './framework';

export type LayerId = UniversalLayer['ingredientId'];

export interface PromptLayer {
  id: LayerId;
  ingredient: string;
  promptLayer: string;
}

export const hamburgerLayers: readonly PromptLayer[] = UNIVERSAL_LAYERS.map((l) => ({
  id: l.ingredientId,
  ingredient: l.ingredient,
  promptLayer: l.label,
}));
