import { hamburgerLayers } from '../data/layers';
import './BurgerPlaceholder.css';

/**
 * TEMPORARY. Flat CSS stand-in for the assembled burger. It only fixes position,
 * scale, headline overlap and badge placement until the approved ingredient
 * assets replace it. Set SHOW_PLACEHOLDER_LABEL to false (or delete this
 * component) when the real assets arrive.
 */
const SHOW_PLACEHOLDER_LABEL = true;

export default function BurgerPlaceholder() {
  return (
    <div className="burger-placeholder" role="img" aria-label="Assembled hamburger (temporary placeholder)">
      <div className="burger-placeholder__shadow" />
      <div className="burger-placeholder__stack">
        {hamburgerLayers.map((layer) => (
          <div key={layer.id} className={`bp-layer bp-layer--${layer.id}`} data-layer={layer.id} />
        ))}
      </div>
      {SHOW_PLACEHOLDER_LABEL && (
        <span className="dev-placeholder-label" aria-hidden="true">
          Burger asset placeholder
        </span>
      )}
    </div>
  );
}
