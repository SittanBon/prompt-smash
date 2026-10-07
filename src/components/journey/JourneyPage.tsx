/**
 * One interaction engine for all four journeys. The journey id selects the
 * content and the theme; only the active step renders.
 */
import type { JourneyId, LayerKey } from '../../data/schema';
import { JOURNEYS, stepsFor, type JourneyView } from '../../app/registry';
import { journeyHash } from '../../app/router';
import { useApp } from '../../app/state';
import JourneyOverview from './JourneyOverview';
import LayerJourney from './LayerJourney';
import TechniquesView from './TechniquesView';
import TestingView from './TestingView';
import ExercisesView from './ExercisesView';
import BiteReview from './BiteReview';
import ResponsibleAIReview from './ResponsibleAIReview';
import CompletionSummary from './CompletionSummary';
import './journey.css';

export default function JourneyPage({ journey, view, layer }: { journey: JourneyId; view: JourneyView; layer?: LayerKey }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const p = progress(journey);
  const steps = stepsFor(j);

  return (
    <div className="journey" data-journey={journey}>
      <nav className="journey-steps" aria-label={`${j.burgerName} journey steps`}>
        <p className="journey-steps__name">
          <span className="journey-steps__burger">{j.burgerName}</span>
          <span className="journey-steps__discipline">{j.discipline}</span>
        </p>
        <ol className="journey-steps__list">
          {steps.map((s, n) => (
            <li key={s.view}>
              <a
                href={journeyHash(journey, s.view, s.view === 'build' ? (layer ?? p.currentLayer) : undefined)}
                aria-current={s.view === view ? 'step' : undefined}
              >
                <span className="journey-steps__num" aria-hidden="true">
                  {n + 1}
                </span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {view === 'overview' && <JourneyOverview journey={journey} />}
      {view === 'build' && layer && <LayerJourney journey={journey} layerKey={layer} />}
      {view === 'techniques' && <TechniquesView journey={journey} />}
      {view === 'testing' && <TestingView journey={journey} />}
      {view === 'practice' && <ExercisesView journey={journey} />}
      {view === 'bite' && <BiteReview journey={journey} />}
      {view === 'safety' && <ResponsibleAIReview journey={journey} />}
      {view === 'finish' && <CompletionSummary journey={journey} />}
    </div>
  );
}

/** "Next step" link shown at the end of each step. */
export function NextStep({ journey, from, label }: { journey: JourneyId; from: JourneyView; label?: string }) {
  const steps = stepsFor(JOURNEYS[journey]);
  const idx = steps.findIndex((s) => s.view === from);
  const prev = steps[idx - 1];
  const next = steps[idx + 1];
  const { progress } = useApp();
  const current = progress(journey).currentLayer;
  return (
    <nav className="next-step" aria-label="Step navigation">
      {prev ? (
        <a className="btn btn--ghost" href={journeyHash(journey, prev.view, prev.view === 'build' ? current : undefined)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13 8H4M7.5 4l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {prev.view === 'build' ? 'Back to the layers' : `Back: ${prev.label}`}
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a className="btn btn--primary" href={journeyHash(journey, next.view, next.view === 'build' ? 'goal' : undefined)}>
          {label ?? `Next: ${next.label}`}
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </nav>
  );
}
