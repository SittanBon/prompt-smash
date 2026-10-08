import { takeAwayContent, teaserContent } from '../data/content';
import { sharedContent } from '../data/sharedContent';
import { JOURNEYS, JOURNEY_ORDER, LAYER_KEYS, bestForSummary } from '../app/registry';
import { journeyHash, chapterHash } from '../app/router';
import { hasProgress, layerState, useApp } from '../app/state';
import BurgerVisual from './BurgerVisual';
import { Arrow, StatusPill } from './common/Common';
import './JourneySelector.css';

/** Full journey selector on the home page: all four burgers, with saved progress. */
export default function JourneySelector() {
  const { lastJourney, savedJourneys, progress } = useApp();
  const w = sharedContent.welcome;
  return (
    <section className="selector" id="choose" aria-labelledby="selector-title">
      <div className="selector__panel">
        <div className="selector__head">
          <p className="selector__eyebrow">{w.selectHeading}</p>
          <h2 id="selector-title" className="selector__headline">
            {teaserContent.headline}
          </h2>
          <p className="selector__supporting">{w.selectHelp}</p>
        </div>

        <ul className="selector__list">
          {JOURNEY_ORDER.map((id) => {
            const j = JOURNEYS[id];
            const p = progress(id);
            const saved = hasProgress(savedJourneys[id]);
            const done = LAYER_KEYS.filter((k) => ['filled', 'not-needed'].includes(layerState(j, p, k))).length;
            const selected = id === lastJourney;
            const card = w.selectorCards.find((c) => c.journeyId === id);
            return (
              <li key={id} className={`jcard${selected ? ' jcard--selected' : ''}`} data-journey={id}>
                <div className="jcard__visual" aria-hidden="true">
                  <BurgerVisual journey={id} variant="card" />
                </div>
                <div className="jcard__body">
                  <div className="jcard__tags">
                    {selected && <StatusPill tone="ok">Selected</StatusPill>}
                    {saved && <StatusPill tone="info">{done} of 7 layers saved</StatusPill>}
                  </div>
                  <h3 className="jcard__name">{j.burgerName}</h3>
                  <p className="jcard__discipline">{j.discipline}</p>
                  <p className="jcard__purpose">{j.shortDescription}</p>
                  <p className="jcard__bestfor">{card?.bestForLine ?? `Best for: ${bestForSummary(j)}`}</p>
                  <div className="jcard__actions">
                    {saved ? (
                      <>
                        <a className="btn btn--primary" href={journeyHash(id, 'build', p.currentLayer)}>
                          Continue<span className="visually-hidden"> {j.burgerName}</span>
                          <Arrow />
                        </a>
                        <a className="btn btn--ghost" href={journeyHash(id)}>
                          Overview<span className="visually-hidden"> of {j.burgerName}</span>
                        </a>
                      </>
                    ) : (
                      <a className="btn btn--primary" href={journeyHash(id)}>
                        Start<span className="visually-hidden"> {j.burgerName}</span>
                        <Arrow />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <TakeAwayMenu />

        <p className="selector__more">
          New to prompting? <a href={chapterHash('welcome')}>Read the welcome chapter</a> first, or open the{' '}
          <a href={chapterHash('glossary')}>glossary</a>.
        </p>
      </div>
    </section>
  );
}

/** Download card for the Prompting Menu PDF. BASE_URL keeps the link valid under a GitHub Pages sub-path. */
function TakeAwayMenu() {
  const t = takeAwayContent;
  return (
    <section className="takeaway" aria-labelledby="takeaway-title">
      <div className="takeaway__text">
        <p className="takeaway__eyebrow">{t.eyebrow}</p>
        <h2 id="takeaway-title" className="takeaway__headline">
          {t.headline}
        </h2>
        <p className="takeaway__description">{t.description}</p>
      </div>
      <div className="takeaway__action">
        <a className="btn btn--primary" href={`${import.meta.env.BASE_URL}${t.file}`} download aria-describedby="takeaway-meta">
          {t.cta}
          <span className="visually-hidden">: {t.ctaContext}</span>
          <Arrow dir="down" />
        </a>
        <p id="takeaway-meta" className="takeaway__meta">
          {t.meta}
        </p>
      </div>
    </section>
  );
}
