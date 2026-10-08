import { heroContent } from '../data/content';
import { journeyHash, chapterHash } from '../app/router';
import { useApp } from '../app/state';
import BurgerVisual from './BurgerVisual';
import HeroBadge from './HeroBadge';
import JourneyCards from './JourneyCards';
import { Arrow } from './common/Common';
import './Hero.css';

/** The journey the home-page burger shows and tours. */
export const HOME_BURGER = 'hamburger' as const;

/** Oversized background headline: real text, partly covered by the burger (ref3.jpg). */
export function HeroDisplay({ ghost = false }: { ghost?: boolean }) {
  const lines = (
    <>
      <span className="hero__display-line">Prompt</span>{' '}
      <span className="hero__display-line">Smash!</span>
    </>
  );
  // The ghost copy only reserves the same space in the tour's pinned layer.
  return ghost ? (
    <p className="hero__display hero__display--ghost" aria-hidden="true">
      {lines}
    </p>
  ) : (
    <h1 id="hero-title" className="hero__display" tabIndex={-1} data-route-focus>
      {lines}
    </h1>
  );
}

/** Intro, scroll cue and (where they fit) the compact burger cards under the hero. */
export function HeroFooter({ onCue, cueHint }: { onCue: () => void; cueHint: string }) {
  const { lastJourney } = useApp();
  return (
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

      <button type="button" className="scroll-cue" onClick={onCue}>
        <span>Scroll</span>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="visually-hidden">{cueHint}</span>
      </button>

      <div className="hero__journeys">
        <JourneyCards />
      </div>
    </div>
  );
}

/** Static hero, used when the learner prefers reduced motion. */
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* Composition after ref3.jpg: oversized headline with the burger in front of it */}
      <div className="hero__stage">
        <HeroDisplay />
        <div className="hero__burger">
          <BurgerVisual journey={HOME_BURGER} variant="hero" />
          <div className="hero__badge">
            <HeroBadge />
          </div>
        </div>
      </div>

      <HeroFooter
        cueHint="to the seven burger layers"
        onCue={() => document.getElementById('layers')?.scrollIntoView({ block: 'start' })}
      />
    </section>
  );
}
