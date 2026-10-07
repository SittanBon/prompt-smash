/**
 * Exercises with deterministic checking only: chosen options, orders and
 * mappings are compared with the expected answer. Free-form tasks are never
 * scored; the learner checks their own work against the approved checklist.
 */
import { useEffect, useId, useRef, useState } from 'react';
import type { Exercise, JourneyId, LayerKey } from '../../data/schema';
import { UNIVERSAL_LAYERS } from '../../data/framework';
import { sharedContent } from '../../data/sharedContent';
import { crispyChicken } from '../../data/journeys/crispyChicken';
import { JOURNEYS } from '../../app/registry';
import { useApp, type ExerciseRecord } from '../../app/state';
import { PageTitle, ProOnly, StatusPill } from '../common/Common';
import { NextStep } from './JourneyPage';

const CATEGORY_NAMES: Record<string, string> = {
  ...Object.fromEntries(UNIVERSAL_LAYERS.map((l) => [l.key, l.label])),
  design: 'Prompt Design',
  engineering: 'Prompt Engineering',
  ...Object.fromEntries((crispyChicken.techniqueLab?.techniques ?? []).map((t) => [t.id, t.name])),
};
const layerOrder = (k: string) => {
  const i = UNIVERSAL_LAYERS.findIndex((l) => l.key === k);
  return i < 0 ? 99 : i;
};

/** For "spot the missing layer": the one universal layer whose label is absent from the material. */
function missingLayer(x: Exercise): LayerKey | null {
  const m = x.material ?? '';
  const missing = UNIVERSAL_LAYERS.filter((l) => !m.includes(`${l.label}:`));
  return missing.length === 1 ? missing[0].key : null;
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

function Feedback({ x, correct, showAnswer }: { x: Exercise; correct: boolean | null; showAnswer?: boolean }) {
  const mc = sharedContent.globalMicrocopy;
  if (correct === null) return null;
  return (
    <div className={`feedback feedback--${correct ? 'ok' : 'retry'}`}>
      <p className="feedback__state">
        <StatusPill tone={correct ? 'ok' : 'attention'}>{correct ? 'Correct' : 'Needs another look'}</StatusPill>{' '}
        {correct ? mc.exerciseCorrect : mc.exerciseNeedsAnotherLook}
      </p>
      {correct || showAnswer ? (
        <>
          <p>{x.feedback.explanation}</p>
          <p>{x.feedback.simple}</p>
          <ProOnly>
            <p>
              <span className="pro-add__tag">Pro</span> {x.feedback.proAddition}
            </p>
          </ProOnly>
        </>
      ) : (
        <p>
          <strong>Hint:</strong> {x.feedback.wrongAnswer}
        </p>
      )}
    </div>
  );
}

function ExercisePanel({ journey, x, n }: { journey: JourneyId; x: Exercise; n: number }) {
  const { progress, update } = useApp();
  const rec = progress(journey).exercises[x.id];
  const save = (r: ExerciseRecord) => update(journey, (p) => ({ ...p, exercises: { ...p.exercises, [x.id]: r } }));
  const uid = useId();
  const exp = x.expected;
  const [shown, setShown] = useState(rec?.status === 'answer-shown');

  // Local working answer, starting from any saved response.
  const [choice, setChoice] = useState<string[]>(Array.isArray(rec?.response) ? rec.response : []);
  const [mapping, setMapping] = useState<Record<string, string>>(
    rec?.response && typeof rec.response === 'object' && !Array.isArray(rec.response) ? rec.response : {},
  );
  const [order, setOrder] = useState<string[]>(
    Array.isArray(rec?.response) && exp.kind === 'order' ? rec.response : (x.options ?? []).map((o) => o.id),
  );
  const [text, setText] = useState(typeof rec?.response === 'string' ? rec.response : '');
  const [layerGuess, setLayerGuess] = useState(rec?.ticks?.[0]?.startsWith('layer:') ? rec.ticks[0].slice(6) : '');
  const [ticks, setTicks] = useState<string[]>(rec?.ticks?.filter((t) => !t.startsWith('layer:')) ?? []);
  const [checked, setChecked] = useState<boolean | null>(rec ? (rec.status === 'correct' ? true : rec.status === 'needs-another-look' || rec.status === 'answer-shown' ? false : null) : null);

  // Ordering: keep focus on the moved item's button and announce its new place.
  const [moved, setMoved] = useState<{ id: string; dir: 'up' | 'down' } | null>(null);
  const [moveMsg, setMoveMsg] = useState('');
  const moveRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (moved) moveRefs.current[`${moved.id}-${moved.dir}`]?.focus();
  }, [moved, order]);
  const move = (i: number, dir: 'up' | 'down') => {
    const j2 = dir === 'up' ? i - 1 : i + 1;
    if (j2 < 0 || j2 >= order.length) return;
    const o = [...order];
    [o[j2], o[i]] = [o[i], o[j2]];
    setOrder(o);
    setChecked(null);
    setMoved({ id: o[j2], dir });
    setMoveMsg(`Moved to position ${j2 + 1} of ${o.length}.`);
  };

  const optLabel = (id: string) => x.options?.find((o) => o.id === id)?.label ?? id;
  const status = rec?.status;

  const check = () => {
    let ok = false;
    let response: ExerciseRecord['response'];
    if (exp.kind === 'option') {
      ok = choice[0] === exp.optionId;
      response = choice;
    } else if (exp.kind === 'options') {
      ok = sameSet(choice, exp.optionIds);
      response = choice;
    } else if (exp.kind === 'mapping') {
      ok = Object.entries(exp.pairs).every(([k, v]) => mapping[k] === v);
      response = mapping;
    } else if (exp.kind === 'order') {
      ok = order.join() === exp.order.join();
      response = order;
    }
    setChecked(ok);
    save({ status: ok ? 'correct' : 'needs-another-look', response });
  };

  const missing = x.type === 'spot-the-missing-layer' ? missingLayer(x) : null;
  const rubric = exp.kind === 'rubric';
  const legendId = `${uid}-q`;

  return (
    <li className="exercise" id={`exercise-${x.id}`}>
      <div className="exercise__head">
        <p className="exercise__num">Exercise {n}</p>
        {status && (
          <StatusPill tone={status === 'correct' || status === 'self-checked' ? 'ok' : status === 'answer-shown' ? 'info' : 'attention'}>
            {status === 'correct' ? 'Correct' : status === 'self-checked' ? 'Checked against the list' : status === 'answer-shown' ? 'Answer shown' : 'Try again'}
          </StatusPill>
        )}
      </div>
      <h2 className="exercise__title">{x.title}</h2>
      <p className="exercise__question" id={legendId}>
        {x.question}
      </p>
      {x.material && (
        <pre className="prompt-block" tabIndex={0} aria-label="Material for this exercise">
          {x.material}
        </pre>
      )}

      {(exp.kind === 'option' || exp.kind === 'options') && (
        <fieldset className="choices" aria-describedby={legendId}>
          <legend className="visually-hidden">{exp.kind === 'option' ? 'Choose one answer' : 'Choose all that apply'}</legend>
          {x.options!.map((o) => (
            <label key={o.id} className="choice">
              <input
                type={exp.kind === 'option' ? 'radio' : 'checkbox'}
                name={`${uid}-choice`}
                checked={choice.includes(o.id)}
                onChange={(e) => {
                  setChecked(null);
                  setChoice(exp.kind === 'option' ? [o.id] : e.target.checked ? [...choice, o.id] : choice.filter((c) => c !== o.id));
                }}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </fieldset>
      )}

      {exp.kind === 'mapping' && (
        <div className="mapping">
          {x.options!.map((o) => {
            const cats = [...new Set(Object.values(exp.pairs))].sort((a, b) => layerOrder(a) - layerOrder(b));
            return (
              <div key={o.id} className="mapping__row">
                <label htmlFor={`${uid}-${o.id}`} className="mapping__item">
                  {o.label}
                </label>
                <select
                  id={`${uid}-${o.id}`}
                  value={mapping[o.id] ?? ''}
                  onChange={(e) => {
                    setChecked(null);
                    setMapping({ ...mapping, [o.id]: e.target.value });
                  }}
                >
                  <option value="">Choose…</option>
                  {cats.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_NAMES[c] ?? c}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {exp.kind === 'order' && (
        <ol className="ordering" aria-describedby={legendId}>
          {order.map((id, i) => (
            <li key={id} className="ordering__item">
              <span className="ordering__pos" aria-hidden="true">
                {i + 1}
              </span>
              <span className="ordering__label">{optLabel(id)}</span>
              <span className="ordering__moves">
                {(['up', 'down'] as const).map((dir) => {
                  const atEnd = dir === 'up' ? i === 0 : i === order.length - 1;
                  return (
                    <button
                      key={dir}
                      ref={(el) => {
                        moveRefs.current[`${id}-${dir}`] = el;
                      }}
                      type="button"
                      className="icon-btn"
                      aria-disabled={atEnd || undefined}
                      aria-label={`Move ${dir}: ${optLabel(id)}`}
                      onClick={() => move(i, dir)}
                    >
                      {dir === 'up' ? '↑' : '↓'}
                    </button>
                  );
                })}
              </span>
            </li>
          ))}
        </ol>
      )}
      {exp.kind === 'order' && (
        <p className="visually-hidden" role="status">
          {moveMsg}
        </p>
      )}

      {!rubric && (
        <div className="exercise__actions">
          <button type="button" className="btn btn--primary btn--small" onClick={check}>
            Check my answer
          </button>
          {checked === false && !shown && (
            <button
              type="button"
              className="btn btn--small btn--quiet"
              onClick={() => {
                setShown(true);
                save({ ...(rec ?? {}), status: 'answer-shown' });
              }}
            >
              Show the answer
            </button>
          )}
        </div>
      )}
      {!rubric && (
        <div role="status">
          <Feedback x={x} correct={checked} showAnswer={shown} />
          {shown && checked === false && (
            <p className="feedback__answer">
              <strong>Answer:</strong>{' '}
              {exp.kind === 'option'
                ? optLabel(exp.optionId)
                : exp.kind === 'options'
                  ? exp.optionIds.map(optLabel).join(' · ')
                  : exp.kind === 'order'
                    ? exp.order.map(optLabel).join(' → ')
                    : exp.kind === 'mapping'
                      ? Object.entries(exp.pairs).map(([k, v]) => `${optLabel(k)} → ${CATEGORY_NAMES[v] ?? v}`).join(' · ')
                      : ''}
            </p>
          )}
        </div>
      )}

      {rubric && (
        <div className="freeform">
          {missing && (
            <div className="freeform__layer">
              <label htmlFor={`${uid}-missing`} className="answer__label">
                Which layer is missing?
              </label>
              <select
                id={`${uid}-missing`}
                value={layerGuess}
                onChange={(e) => {
                  setLayerGuess(e.target.value);
                  save({ status: e.target.value === missing ? 'correct' : 'needs-another-look', response: text, ticks: [`layer:${e.target.value}`, ...ticks] });
                }}
              >
                <option value="">Choose a layer…</option>
                {UNIVERSAL_LAYERS.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.label}
                  </option>
                ))}
              </select>
              <div role="status">
                {layerGuess && (
                  <p className="feedback__state">
                    {layerGuess === missing ? (
                      <>
                        <StatusPill tone="ok">Correct</StatusPill> {x.feedback.simple}
                      </>
                    ) : (
                      <>
                        <StatusPill tone="attention">Needs another look</StatusPill> {x.feedback.wrongAnswer}
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}
          <label htmlFor={`${uid}-text`} className="answer__label">
            Your answer
          </label>
          <textarea
            id={`${uid}-text`}
            className="answer__field"
            rows={x.type === 'free-text' ? 8 : 5}
            value={text}
            aria-describedby={legendId}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => text && save({ ...(rec ?? { status: 'needs-another-look' }), status: rec?.status ?? 'needs-another-look', response: text, ticks: [...(layerGuess ? [`layer:${layerGuess}`] : []), ...ticks] })}
          />
          <fieldset className="checklist">
            <legend>Check your answer against this list</legend>
            <p className="checklist__note">There is no single right answer and nothing is scored. Tick each point your answer covers.</p>
            {exp.criteria.map((c) => (
              <label key={c} className="choice">
                <input
                  type="checkbox"
                  checked={ticks.includes(c)}
                  onChange={(e) => {
                    const t = e.target.checked ? [...ticks, c] : ticks.filter((q) => q !== c);
                    setTicks(t);
                    save({
                      status: t.length === exp.criteria.length ? 'self-checked' : (rec?.status === 'self-checked' ? 'needs-another-look' : rec?.status ?? 'needs-another-look'),
                      response: text,
                      ticks: [...(layerGuess ? [`layer:${layerGuess}`] : []), ...t],
                    });
                  }}
                />
                <span>{c}</span>
              </label>
            ))}
          </fieldset>
          <p role="status" className="checklist__progress">
            {ticks.length} of {exp.criteria.length} points covered.
            {ticks.length === exp.criteria.length && ` ${x.feedback.simple}`}
          </p>
          {ticks.length < exp.criteria.length && ticks.length > 0 && <p className="answer__hint">{x.feedback.wrongAnswer}</p>}
          <details className="disclosure">
            <summary className="disclosure__summary">
              <span>See a model answer and explanation</span>
            </summary>
            <div className="disclosure__body">
              <p>{x.feedback.explanation}</p>
              <ProOnly>
                <p>
                  <span className="pro-add__tag">Pro</span> {x.feedback.proAddition}
                </p>
              </ProOnly>
              {x.modelAnswer && (
                <>
                  <p className="illustrative">One good answer, not the only one:</p>
                  <pre className="prompt-block">{x.modelAnswer}</pre>
                </>
              )}
            </div>
          </details>
        </div>
      )}
    </li>
  );
}

export default function ExercisesView({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const recs = progress(journey).exercises;
  const done = j.exercises.filter((x) => ['correct', 'self-checked', 'answer-shown'].includes(recs[x.id]?.status ?? '')).length;
  return (
    <div className="step-page">
      <PageTitle
        eyebrow={`${j.burgerName} · Practise`}
        lead="Optional practice. Answers are checked by fixed rules in your browser, never by an AI. You can finish the journey without doing every exercise."
      >
        Practise what you built
      </PageTitle>
      <p className="progress-note">
        <StatusPill tone="info">
          {done} of {j.exercises.length} exercises done
        </StatusPill>
      </p>
      <ol className="exercises">
        {j.exercises.map((x, i) => (
          <ExercisePanel key={x.id} journey={journey} x={x} n={i + 1} />
        ))}
      </ol>
      <NextStep journey={journey} from="practice" />
    </div>
  );
}
