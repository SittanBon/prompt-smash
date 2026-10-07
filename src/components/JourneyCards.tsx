import { JOURNEYS, JOURNEY_ORDER, shortBurgerName } from '../app/registry';
import { journeyHash } from '../app/router';
import { hasProgress, layerState, useApp } from '../app/state';
import { LAYER_KEYS } from '../app/registry';
import BurgerVisual from './BurgerVisual';
import './JourneyCards.css';

/** Compact selector in the hero. Every burger is available. */
export default function JourneyCards() {
  const { lastJourney, savedJourneys } = useApp();
  return (
    <section className="journeys" aria-labelledby="journeys-title">
      <h2 id="journeys-title" className="journeys__title">
        Choose your burger
      </h2>
      <ul className="journeys__list">
        {JOURNEY_ORDER.map((id) => {
          const j = JOURNEYS[id];
          const selected = id === lastJourney;
          const p = savedJourneys[id];
          const done = p ? LAYER_KEYS.filter((k) => layerState(j, p, k) === 'filled' || layerState(j, p, k) === 'not-needed').length : 0;
          return (
            <li key={id}>
              <a className={`journey-card${selected ? ' journey-card--selected' : ''}`} href={journeyHash(id)} aria-current={selected ? 'true' : undefined}>
                <span className="journey-card__swatch" aria-hidden="true">
                  <BurgerVisual journey={id} variant="card" />
                </span>
                <span className="journey-card__text">
                  <span className="journey-card__name">{shortBurgerName(j)}</span>
                  <span className="journey-card__topic">{j.discipline}</span>
                </span>
                <span className={`journey-card__tag${selected ? ' journey-card__tag--selected' : ''}`}>
                  {selected && (
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {selected ? 'Selected' : hasProgress(p) ? `${done} of 7 layers` : 'Start'}
                </span>
                {selected && hasProgress(p) && <span className="visually-hidden">, {done} of 7 layers</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
