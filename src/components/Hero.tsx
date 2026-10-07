import { heroContent } from '../data/content';
import { journeyHash, chapterHash } from '../app/router';
import { useApp } from '../app/state';
import BurgerVisual from './BurgerVisual';
import HeroBadge from './HeroBadge';
import JourneyCards from './JourneyCards';
import { Arrow } from './common/Common';
import './Hero.css';

export default function Hero() {
  const { lastJourney } = useApp();
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* Composition after ref3.jpg: oversized headline with the burger in front of it */}
      <div className="hero__stage">
        <h1 id="hero-title" className="hero__display" tabIndex={-1} data-route-focus>
          <span className="hero__display-line">Prompt</span>{' '}
          <span className="hero__display-line">Smash!</span>
        </h1>

        <div className="hero__burger">
          <BurgerVisual journey={lastJourney} variant="hero" />
          <div className="hero__badge">
            <HeroBadge />
          </div>
        </div>
      </div>

      <div className="hero__footer">
        <div className="hero__intro">
          <h2 className="hero__headline">{heroContent.headline}</h2>
          <p className="hero__supporting">{heroContent.supporting}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={journeyHash(lastJourney)}>
              {heroContent.primaryCta}
              <Arrow />
            </a>
            <a className="hero__bite-note" href={chapterHash('bite')}>
              <span>
                {heroContent.biteNote.lead} <strong>{heroContent.biteNote.name}</strong>
                <span className="hero__bite-link"> — {heroContent.secondaryCta}</span>
              </span>
              <span className="visually-hidden">: </span>
              <span className="hero__bite-expansion">{heroContent.biteNote.expansion}</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          className="scroll-cue"
          onClick={() => document.getElementById('choose')?.scrollIntoView({ block: 'start' })}
        >
          <span>Scroll</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="visually-hidden">to all four burger journeys</span>
        </button>

        <div className="hero__journeys">
          <JourneyCards />
        </div>
      </div>
    </section>
  );
}
