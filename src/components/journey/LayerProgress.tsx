import type { JourneyId, LayerKey } from '../../data/schema';
import { LAYER_STATUS_LABEL, UNIVERSAL_LAYERS } from '../../data/framework';
import { JOURNEYS } from '../../app/registry';
import { journeyHash } from '../../app/router';
import { LAYER_STATE_LABEL, layerState, useApp, type LayerState } from '../../app/state';

const MARK: Record<LayerState, string> = { filled: '✓', 'not-needed': '–', skipped: '↷', empty: '' };

/** Seven-step progress: vertical on desktop, a horizontal row on small screens. */
export default function LayerProgress({ journey, active, orientation }: { journey: JourneyId; active: LayerKey; orientation: 'vertical' | 'horizontal' }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const p = progress(journey);
  return (
    <nav className={`lp lp--${orientation}`} aria-label="Seven burger layers">
      <ol className="lp__list">
        {UNIVERSAL_LAYERS.map((u, i) => {
          const layer = j.layers[i];
          const st = layerState(j, p, u.key);
          const current = u.key === active;
          return (
            <li key={u.key} className="lp__item" data-state={st} data-current={current || undefined}>
              <a className="lp__link" href={journeyHash(journey, 'build', u.key)} aria-current={current ? 'step' : undefined}>
                <span className="lp__dot" aria-hidden="true">
                  {MARK[st] || i + 1}
                </span>
                <span className={orientation === 'horizontal' ? 'visually-hidden' : 'lp__text'}>
                  <span className="lp__label">
                    {i + 1}. {u.label}
                  </span>
                  <span className="lp__meta">
                    {layer.ingredientName}
                    <span className="visually-hidden">,</span> · {LAYER_STATUS_LABEL[u.status]}
                    <span className="visually-hidden">,</span> <span className="lp__state">{LAYER_STATE_LABEL[st]}</span>
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
