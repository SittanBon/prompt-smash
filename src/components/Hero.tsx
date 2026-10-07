import { heroContent } from '../data/content';
import BurgerPlaceholder from './BurgerPlaceholder';
import HeroBadge from './HeroBadge';
import JourneyCards from './JourneyCards';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* Composition after ref3.jpg: oversized headline with the burger in front of it */}
      <div className="hero__stage">
        <h1 id="hero-title" className="hero__display">
          <span className="hero__display-line">Prompt</span>{' '}
          <span className="hero__display-line">Smash!</span>
        </h1>

        <div className="hero__burger">
          <BurgerPlaceholder />
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
            <a className="btn btn--primary" href="#journey">
              {heroContent.primaryCta}
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="btn btn--ghost" href="#bite">
              {heroContent.secondaryCta}
            </a>
          </div>
        </div>

        <a className="scroll-cue" href="#journey">
          <span>Scroll</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="visually-hidden">to the burger journey</span>
        </a>

        <div className="hero__journeys">
          <JourneyCards />
        </div>
      </div>
    </section>
  );
}
