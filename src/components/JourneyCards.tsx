import { journeys } from '../data/journeys';
import './JourneyCards.css';

export default function JourneyCards() {
  return (
    <section className="journeys" aria-labelledby="journeys-title">
      <h2 id="journeys-title" className="journeys__title">
        Choose your burger
      </h2>
      <ul className="journeys__list">
        {journeys.map((j) => {
          const body = (
            <>
              <span className={`journey-card__swatch journey-card__swatch--${j.accent}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <div className="journey-card__text">
                <h3 className="journey-card__name">{j.burger}</h3>
                <span className="journey-card__topic">{j.topic}</span>
              </div>
              {j.status === 'available' ? (
                <span className="journey-card__tag journey-card__tag--selected">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Selected
                </span>
              ) : (
                <span className="journey-card__tag">Coming later</span>
              )}
            </>
          );

          return (
            <li key={j.id}>
              {j.status === 'available' ? (
                <a className="journey-card journey-card--selected" href="#journey" aria-current="true">
                  {body}
                </a>
              ) : (
                <div className="journey-card journey-card--later">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
