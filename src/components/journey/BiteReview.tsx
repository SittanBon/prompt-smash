/**
 * BITE: four checks of the learner's own prompt. The interface can only see
 * whether layers are filled in, so it flags what is missing and leaves the
 * judgement of clarity to the learner. It never says the prompt is correct or safe.
 */
import type { BiteKey, JourneyId } from '../../data/schema';
import { BITE, BITE_LIMITS, REVIEW_SCREEN_COPY, UNIVERSAL_LAYERS } from '../../data/framework';
import { JOURNEYS } from '../../app/registry';
import { journeyHash } from '../../app/router';
import { layerState, useApp } from '../../app/state';
import { fill } from '../../app/promptFiles';
import { ModeText, PageTitle, StatusPill, type Tone } from '../common/Common';
import { NextStep } from './JourneyPage';

export type BiteStatus = 'not-yet-checked' | 'clear' | 'needs-attention' | 'not-needed';
export const BITE_STATUS_LABEL: Record<BiteStatus, string> = {
  'not-yet-checked': 'Not yet checked',
  clear: 'Passing',
  'needs-attention': 'Needs attention',
  'not-needed': 'Not needed',
};
const TONE: Record<BiteStatus, Tone> = { 'not-yet-checked': 'neutral', clear: 'ok', 'needs-attention': 'attention', 'not-needed': 'muted' };
const label = (k: string) => UNIVERSAL_LAYERS.find((l) => l.key === k)!.label;

/** Status for one BITE part: missing layers always need attention; otherwise the learner decides. */
export function useBiteStatus(journey: JourneyId) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const p = progress(journey);
  return (key: BiteKey): { status: BiteStatus; missing: string[] } => {
    const def = BITE.find((b) => b.key === key)!;
    if (key === 'taste' && layerState(j, p, 'style') === 'not-needed') return { status: 'not-needed', missing: [] };
    const missing = def.layers.filter((l) => layerState(j, p, l) !== 'filled');
    if (missing.length) return { status: 'needs-attention', missing };
    return { status: p.bite[key] ?? 'not-yet-checked', missing: [] };
  };
}

export default function BiteReview({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const { progress, update } = useApp();
  const p = progress(journey);
  const statusOf = useBiteStatus(journey);

  const focusPart = (key: BiteKey) => {
    const el = document.getElementById(`bite-${key}`);
    el?.scrollIntoView({ block: 'start' });
    el?.querySelector<HTMLElement>('h2')?.focus();
  };

  return (
    <div className="step-page">
      <PageTitle eyebrow={`${j.burgerName} · BITE`} lead={REVIEW_SCREEN_COPY.biteIntro}>
        Take a test bite
      </PageTitle>

      <ol className="bite-summary" aria-label="BITE at a glance">
        {BITE.map((b) => {
          const s = statusOf(b.key).status;
          return (
            <li key={b.key}>
              <button type="button" className="bite-summary__item" onClick={() => focusPart(b.key)}>
                <span className="bite-letter" aria-hidden="true">
                  {b.letter}
                </span>
                <span className="bite-summary__name">{b.name}</span>
                <StatusPill tone={TONE[s]}>{BITE_STATUS_LABEL[s]}</StatusPill>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="bite-parts">
        {BITE.map((b, i) => {
          const c = j.bite[b.key];
          const { status, missing } = statusOf(b.key);
          const next = BITE[i + 1];
          return (
            <section key={b.key} id={`bite-${b.key}`} className="bite-part" aria-labelledby={`bite-${b.key}-title`}>
              <div className="bite-part__head">
                <span className="bite-letter bite-letter--large" aria-hidden="true">
                  {b.letter}
                </span>
                <div>
                  <h2 id={`bite-${b.key}-title`} className="bite-part__title" tabIndex={-1}>
                    {b.name}
                  </h2>
                  <p className="bite-part__question">{c.question}</p>
                </div>
                <StatusPill tone={TONE[status]}>{BITE_STATUS_LABEL[status]}</StatusPill>
              </div>

              <ModeText text={c.explanation} />

              <div className="bite-part__answers">
                <p className="mini-title">Your layers</p>
                <ul className="bite-answers">
                  {b.layers.map((l) => {
                    const st = layerState(j, p, l);
                    const text = p.layers[l].text.trim();
                    return (
                      <li key={l}>
                        <a href={journeyHash(journey, 'build', l)} className="bite-answers__link">
                          {label(l)}
                        </a>{' '}
                        {st === 'filled' ? (
                          <q className="bite-answers__text">{text.length > 180 ? `${text.slice(0, 180)}…` : text}</q>
                        ) : st === 'not-needed' ? (
                          <span>Not needed: “{p.layers[l].reason.trim()}”</span>
                        ) : (
                          <StatusPill tone="attention">Empty</StatusPill>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bite-part__lookfor">
                <p className="mini-title">Look for</p>
                <ul className="ticks">
                  {c.lookFor.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="compare compare--bite">
                <div className="compare__col compare__col--better">
                  <p className="compare__label">✓ Passing example</p>
                  <p>{c.passingExample}</p>
                </div>
                <div className="compare__col compare__col--weak">
                  <p className="compare__label">! Needs attention</p>
                  <p>{c.needsAttentionExample}</p>
                </div>
              </div>

              <div className="bite-part__result" role="status">
                {status === 'needs-attention' && (
                  <p>
                    <strong>{c.stateCopy.needsAttention}</strong>
                    {missing.length > 0 && <> Missing: {missing.map(label).join(', ')}.</>} {c.correctiveAction}
                  </p>
                )}
                {status === 'clear' && <p>{c.stateCopy.clear}</p>}
                {status === 'not-needed' && c.stateCopy.notNeeded && <p>{fill(c.stateCopy.notNeeded, { reason: p.layers.style.reason.trim() })}</p>}
                {status === 'not-yet-checked' && <p>Read your layers against the “Look for” list, then choose below.</p>}
              </div>

              {missing.length === 0 && status !== 'not-needed' && (
                <fieldset className="segmented">
                  <legend>After reading your answers, how does {b.name} look?</legend>
                  {(['clear', 'needs-attention'] as const).map((v) => (
                    <label key={v} className="segmented__option">
                      <input
                        type="radio"
                        name={`bite-${journey}-${b.key}`}
                        checked={p.bite[b.key] === v}
                        onChange={() => update(journey, (q) => ({ ...q, bite: { ...q.bite, [b.key]: v } }))}
                      />
                      <span>{v === 'clear' ? 'It passes' : 'It needs attention'}</span>
                    </label>
                  ))}
                </fieldset>
              )}

              <div className="bite-part__actions">
                {(status === 'needs-attention' || status === 'not-yet-checked') &&
                  b.layers.map((l) => (
                    <a key={l} className="btn btn--ghost btn--small" href={journeyHash(journey, 'build', l)}>
                      Edit {label(l)}
                    </a>
                  ))}
                {next ? (
                  <button type="button" className="btn btn--small" onClick={() => focusPart(next.key)}>
                    Next: {next.letter} · {next.name}
                  </button>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="limits" aria-labelledby="bite-limits">
        <h2 id="bite-limits" className="mini-title">
          What BITE can and cannot tell you
        </h2>
        <ul className="bullets">
          {BITE_LIMITS.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p>{REVIEW_SCREEN_COPY.biteNext}</p>
      </aside>

      <NextStep journey={journey} from="bite" label="Continue to the responsible-AI review" />
    </div>
  );
}
