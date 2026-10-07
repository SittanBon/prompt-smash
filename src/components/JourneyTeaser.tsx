import { teaserContent } from '../data/content';
import './JourneyTeaser.css';

/** Beginning of the next chapter — only the transition is built in this step. */
export default function JourneyTeaser() {
  return (
    <section className="teaser" id="journey" aria-labelledby="teaser-title">
      <div className="teaser__panel">
        <p className="teaser__eyebrow">Hamburger — Prompt Design</p>
        <h2 id="teaser-title" className="teaser__headline">{teaserContent.headline}</h2>
        <p className="teaser__supporting">{teaserContent.supporting}</p>
      </div>
    </section>
  );
}
