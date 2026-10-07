/**
 * CSS burger, themed per journey. Temporary until photographic ingredients
 * replace it: every ingredient is a stable element
 * (`#ingredient-{journey}-{ingredientId}`, `data-layer`) so an image can be
 * dropped into each slot later without changing the interface.
 *
 * The food shapes are decorative. In the builder, the accessible controls are
 * the progress list; clicking a slice is only a mouse shortcut to the same place.
 */
import type { JourneyId, LayerKey } from '../data/schema';
import { UNIVERSAL_LAYERS } from '../data/framework';
import { JOURNEYS } from '../app/registry';
import type { LayerState } from '../app/state';
import './BurgerVisual.css';

interface BurgerVisualProps {
  journey: JourneyId;
  variant: 'hero' | 'builder' | 'compact' | 'card';
  activeLayer?: LayerKey;
  states?: Partial<Record<LayerKey, LayerState>>;
  onSelectLayer?: (key: LayerKey) => void;
}

export default function BurgerVisual({ journey, variant, activeLayer, states, onSelectLayer }: BurgerVisualProps) {
  const j = JOURNEYS[journey];
  const labelled = variant === 'hero';
  return (
    <div
      className={`burger burger--${journey} burger--${variant}`}
      data-journey={journey}
      {...(labelled
        ? { role: 'img', 'aria-label': `${j.burgerName}: seven layers, from the top bun (Goal) down to the wrapper (Rules and Boundaries).` }
        : { 'aria-hidden': true })}
    >
      <div className="burger__shadow" />
      <div className="burger__stack">
        {UNIVERSAL_LAYERS.map((l) => (
          <div
            key={l.key}
            id={variant === 'card' ? undefined : `ingredient-${journey}-${l.ingredientId}${variant === 'hero' ? '-hero' : ''}`}
            className={`burger__ing burger__ing--${l.ingredientId}`}
            data-layer={l.key}
            data-ingredient={l.ingredientId}
            data-state={states?.[l.key] ?? 'filled'}
            data-active={activeLayer === l.key || undefined}
            onClick={onSelectLayer ? () => onSelectLayer(l.key) : undefined}
          >
            <span className="burger__detail" />
          </div>
        ))}
      </div>
    </div>
  );
}
