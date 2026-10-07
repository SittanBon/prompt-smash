// The fixed seven-layer Hamburger mapping. Do not rename or reorder without approval.
export type LayerId = 'top-bun' | 'patty' | 'cheese' | 'toppings' | 'sauce' | 'bottom-bun' | 'wrapper';

export interface PromptLayer {
  id: LayerId;
  ingredient: string;
  promptLayer: string;
}

export const hamburgerLayers: readonly PromptLayer[] = [
  { id: 'top-bun', ingredient: 'Top bun', promptLayer: 'Goal' },
  { id: 'patty', ingredient: 'Patty', promptLayer: 'Task' },
  { id: 'cheese', ingredient: 'Cheese', promptLayer: 'Context and Input' },
  { id: 'toppings', ingredient: 'Toppings', promptLayer: 'Requirements and Details' },
  { id: 'sauce', ingredient: 'Sauce', promptLayer: 'Style and Quality' },
  { id: 'bottom-bun', ingredient: 'Bottom bun', promptLayer: 'Output Format' },
  { id: 'wrapper', ingredient: 'Wrapper', promptLayer: 'Rules and Boundaries' },
];
