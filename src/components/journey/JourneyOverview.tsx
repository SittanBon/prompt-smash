import type { JourneyId } from '../../data/schema';
import { UNIVERSAL_LAYERS } from '../../data/framework';
import { sharedContent } from '../../data/sharedContent';
import { JOURNEYS } from '../../app/registry';
import { journeyHash } from '../../app/router';
import { hasProgress, useApp } from '../../app/state';
import BurgerVisual from '../BurgerVisual';
import RichText from '../common/RichText';
import { Arrow, Disclosure, PageTitle, ProOnly } from '../common/Common';

const label = (k: string) => UNIVERSAL_LAYERS.find((l) => l.key === k)?.label ?? k;

export default function JourneyOverview({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const { progress, savedJourneys, mode } = useApp();
  const p = progress(journey);
  const saved = hasProgress(savedJourneys[journey]);
  const we = j.workedExample;
  const fs = we.firstScreen;

  return (
    <div className="overview">
      <div className="overview__intro">
        <div className="overview__text">
          <PageTitle eyebrow={j.discipline} lead={j.shortDescription}>
            {j.burgerName}
          </PageTitle>
          <div className="overview__actions">
            {saved ? (
              <>
                <a className="btn btn--primary" href={journeyHash(journey, 'build', p.currentLayer)}>
                  Continue where you left off
                  <Arrow />
                </a>
                <a className="btn btn--ghost" href={journeyHash(journey, 'build', 'goal')}>
                  Start from the Goal
                </a>
              </>
            ) : (
              <a className="btn btn--primary" href={journeyHash(journey, 'build', 'goal')}>
                {sharedContent.globalMicrocopy.startJourney}
                <Arrow />
              </a>
            )}
          </div>
        </div>
        <div className="overview__burger" aria-hidden="true">
          <BurgerVisual journey={journey} variant="card" />
        </div>
      </div>

      <section className="overview__compare" aria-labelledby="compare-title">
        <h2 id="compare-title" className="section-title">
          {fs.heading}
        </h2>
        {fs.approachComparison && (
          <div className="compare compare--approach">
            <div className="compare__col compare__col--weak">
              <p className="compare__label">One-off approach</p>
              <p>{fs.approachComparison.weak}</p>
            </div>
            <div className="compare__col compare__col--better">
              <p className="compare__label">Engineering approach</p>
              <p>{fs.approachComparison.improved}</p>
            </div>
            <p className="compare__note">{fs.approachComparison.simple}</p>
            <ProOnly>
              <ul className="compare__pro">
                {fs.approachComparison.proPoints.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </ProOnly>
          </div>
        )}
        <div className="compare">
          <div className="compare__col compare__col--weak">
            <p className="compare__label">
              <span aria-hidden="true">✕ </span>
              {fs.weakLabel}
            </p>
            <pre className="prompt-block">{we.weakPrompt}</pre>
          </div>
          <div className="compare__col compare__col--better">
            <p className="compare__label">
              <span aria-hidden="true">✓ </span>
              {fs.improvedLabel}
            </p>
            <pre className="prompt-block prompt-block--long" tabIndex={0}>
              {we.improvedPrompt}
            </pre>
          </div>
        </div>
        <p className="overview__payoff">{fs.payoff}</p>
      </section>

      <div className="overview__grid">
        <section aria-labelledby="anchor-title" className="card">
          <h2 id="anchor-title" className="card__title">
            Your project in this journey
          </h2>
          <p className="card__strong">{j.anchorUseCase.title}</p>
          <p>{j.anchorUseCase.scenario}</p>
        </section>
        <section aria-labelledby="bestfor-title" className="card">
          <h2 id="bestfor-title" className="card__title">
            Best for
          </h2>
          <ul className="chips">
            {j.bestFor.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="outcomes-title" className="card">
          <h2 id="outcomes-title" className="card__title">
            What you will be able to do
          </h2>
          <ul className="ticks">
            {j.learningOutcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="ideas-title" className="card">
          <h2 id="ideas-title" className="card__title">
            Key ideas
          </h2>
          <ul className="bullets">
            {j.keyIdeas.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      </div>

      <Disclosure summary="See the full worked example" className="overview__worked">
        <h3 className="sub-title">What the rough prompt leaves out</h3>
        <dl className="layer-notes">
          {we.diagnosedWeaknesses.map((d) => (
            <div key={d.layer}>
              <dt>{label(d.layer)}</dt>
              <dd>{d.issue}</dd>
            </div>
          ))}
        </dl>
        <h3 className="sub-title">Why the improved prompt works better</h3>
        <dl className="layer-notes">
          {we.whyBetter.map((d) => (
            <div key={d.layer}>
              <dt>{label(d.layer)}</dt>
              <dd>{d.point}</dd>
            </div>
          ))}
        </dl>
        {we.testCycle && (
          <>
            <h3 className="sub-title">Test, fix one thing, test again</h3>
            <ol className="cycle">
              <li>
                <strong>Baseline test.</strong> {we.testCycle.baselineTest}
              </li>
              <li>
                <strong>Failure found.</strong> {we.testCycle.failureFound}
              </li>
              <li>
                <strong>One controlled change.</strong> {we.testCycle.controlledRevision}
              </li>
              <li>
                <strong>Retest.</strong> {we.testCycle.retest}
              </li>
            </ol>
          </>
        )}
        <h3 className="sub-title">Example result</h3>
        <p className="illustrative">{we.exampleOutput.illustrativeLabel}</p>
        {j.journeyMicrocopy?.resultLabel && <p className="illustrative">{j.journeyMicrocopy.resultLabel}</p>}
        <div className="example-output">
          <RichText text={we.exampleOutput.content} />
        </div>
        <h3 className="sub-title">Before you use a result like this</h3>
        <ul className="bullets">
          {we.limitationsAndReview.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h3 className="sub-title">{we.variation.title}</h3>
        <p>{we.variation.scenario}</p>
        <dl className="layer-notes layer-notes--pre">
          {UNIVERSAL_LAYERS.map((l) => (
            <div key={l.key}>
              <dt>{l.label}</dt>
              <dd>{we.variation.answers[l.key]}</dd>
            </div>
          ))}
        </dl>
        {mode === 'pro' && we.finalPromptStructure.join() !== UNIVERSAL_LAYERS.map((l) => l.key).join() && (
          <p className="illustrative">Reading order of the final prompt: {we.finalPromptStructure.map(label).join(', ')}.</p>
        )}
      </Disclosure>

      <div className="overview__start">
        <a className="btn btn--primary btn--large" href={journeyHash(journey, 'build', saved ? p.currentLayer : 'goal')}>
          {saved ? 'Continue building' : sharedContent.globalMicrocopy.startJourney}
          <Arrow />
        </a>
      </div>
    </div>
  );
}
