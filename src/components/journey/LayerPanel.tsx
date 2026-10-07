import { useEffect, useId, useRef, useState } from 'react';
import type { JourneyId, LayerKey } from '../../data/schema';
import { LAYER_STATUS_LABEL, UNIVERSAL_LAYERS } from '../../data/framework';
import { ASSEMBLY_MICROCOPY } from '../../data/promptAssembly';
import { sharedContent } from '../../data/sharedContent';
import { JOURNEYS, JOURNEY_HINTS } from '../../app/registry';
import { journeyHash, navigate } from '../../app/router';
import { layerState, useApp } from '../../app/state';
import { fill } from '../../app/promptFiles';
import { ConfirmDialog, Disclosure, ModeText, StatusPill, ProOnly, type Tone } from '../common/Common';

const STATUS_TONE: Record<string, Tone> = { required: 'attention', recommended: 'info', optional: 'neutral' };
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** What Next does on this layer. Shared by the panel and the mobile bar. */
export function useLayerNavigation(journey: JourneyId, key: LayerKey) {
  const j = JOURNEYS[journey];
  const { progress, updateLayer, announce } = useApp();
  const idx = UNIVERSAL_LAYERS.findIndex((l) => l.key === key);
  const layer = j.layers[idx];
  const u = UNIVERSAL_LAYERS[idx];
  const p = progress(journey);
  const draft = p.layers[key];
  const st = layerState(j, p, key);
  const nextKey = UNIVERSAL_LAYERS[idx + 1]?.key;
  const prevKey = UNIVERSAL_LAYERS[idx - 1]?.key;
  const nextHash = nextKey ? journeyHash(journey, 'build', nextKey) : journeyHash(journey, 'techniques');
  const prevHash = prevKey ? journeyHash(journey, 'build', prevKey) : journeyHash(journey, 'overview');

  /** Returns an error message if the learner must fix something first. */
  const goNext = (): string | null => {
    if (layer.status === 'required' && st !== 'filled') {
      return key === 'goal' ? ASSEMBLY_MICROCOPY.missingGoal : ASSEMBLY_MICROCOPY.missingTask;
    }
    if (draft.notNeeded && !draft.reason.trim()) return ASSEMBLY_MICROCOPY.notNeededReasonMissing;
    if (st === 'filled') {
      if (draft.skipped) updateLayer(journey, key, { skipped: false });
      announce(fill(ASSEMBLY_MICROCOPY.layerCompleted, { ingredient: layer.ingredientName, layer: u.label }));
    } else if (st === 'not-needed') {
      announce(fill(ASSEMBLY_MICROCOPY.styleNotNeeded, { reason: draft.reason.trim() }));
    } else {
      updateLayer(journey, key, { skipped: true });
      announce(fill(ASSEMBLY_MICROCOPY.recommendedSkipped, { layer: u.label }));
    }
    navigate(nextHash);
    return null;
  };

  const empty = st === 'empty' || st === 'skipped';
  const skipping = empty && layer.status !== 'required';
  const nextLabel = !nextKey ? (skipping ? 'Skip to Techniques' : 'Next: Techniques') : skipping ? 'Skip for now' : 'Next layer';

  return { goNext, nextLabel, prevHash, prevLabel: prevKey ? 'Previous' : 'Overview', idx };
}

export default function LayerPanel({ journey, layerKey, showNav }: { journey: JourneyId; layerKey: LayerKey; showNav: boolean }) {
  const j = JOURNEYS[journey];
  const { progress, updateLayer, announce } = useApp();
  const idx = UNIVERSAL_LAYERS.findIndex((l) => l.key === layerKey);
  const layer = j.layers[idx];
  const u = UNIVERSAL_LAYERS[idx];
  const p = progress(journey);
  const draft = p.layers[layerKey];
  const st = layerState(j, p, layerKey);
  const nav = useLayerNavigation(journey, layerKey);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const uid = useId();
  const ids = {
    answer: `${uid}-answer`,
    question: `${uid}-question`,
    hint: `${uid}-hint`,
    error: `${uid}-error`,
    reason: `${uid}-reason`,
    reasonHint: `${uid}-reason-hint`,
  };

  // Each layer starts without an old error.
  useEffect(() => setError(null), [layerKey, journey]);

  const onNext = () => {
    const e = nav.goNext();
    setError(e);
    if (e) (draft.notNeeded ? reasonRef : answerRef).current?.focus();
  };

  // The mobile bar's Next button runs the same logic here, so errors appear by the field.
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;
  useEffect(() => {
    const run = () => onNextRef.current();
    window.addEventListener(layerErrorEvent, run);
    return () => window.removeEventListener(layerErrorEvent, run);
  }, []);

  const tooShort = st === 'filled' && words(draft.text) < 4;
  const hint =
    st === 'filled'
      ? layer.states.complete
      : st === 'not-needed'
        ? fill(layer.states.notNeeded ?? '', { reason: draft.reason.trim() })
        : layer.states.empty;
  const exampleReason = j.bite.taste.notNeeded?.exampleReason;
  const hints = JOURNEY_HINTS[journey];
  const mc = j.journeyMicrocopy ?? {};
  const warnings = (hints?.warnings ?? []).filter((w) => w.layers.includes(layerKey) && !draft.notNeeded && w.pattern.test(draft.text));
  const layerHints = (hints?.layerHints[layerKey] ?? []).map((k) => mc[k]).filter(Boolean);

  return (
    <article className="layer-panel" aria-labelledby={`${uid}-title`}>
      <header className="layer-panel__head">
        <p className="layer-panel__eyebrow">
          <span className="layer-panel__num" aria-hidden="true">
            {idx + 1}
          </span>
          Layer {idx + 1} of 7 · <span className="layer-panel__ingredient">{layer.ingredientName}</span>
        </p>
        <h1 id={`${uid}-title`} className="layer-panel__title" tabIndex={-1} data-route-focus>
          {u.label}
        </h1>
        <div className="layer-panel__status">
          <StatusPill tone={STATUS_TONE[layer.status]}>{LAYER_STATUS_LABEL[layer.status]}</StatusPill>
          <span className="layer-panel__metaphor">{layer.metaphorLink}</span>
        </div>
        {layer.statusNote && <p className="layer-panel__status-note">{layer.statusNote}</p>}
      </header>

      <section className="definition" aria-label="Definition">
        <p className="definition__universal">{layer.simple.definition}</p>
        <p className="definition__domain">
          <span className="definition__domain-tag">{j.discipline}</span> {layer.simple.domainClause}
        </p>
        {layer.simple.jargonExplained && (
          <dl className="jargon">
            {layer.simple.jargonExplained.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>{t.plain}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <div className="answer">
        <p className="answer__question" id={ids.question}>
          {layer.simple.learnerQuestion}
        </p>

        {!draft.notNeeded && (
          <>
            <label className="answer__label" htmlFor={ids.answer}>
              {layer.answerField.label}
              {layer.answerField.question !== layer.simple.learnerQuestion && (
                <span className="answer__label-sub">{layer.answerField.question}</span>
              )}
            </label>
            <textarea
              ref={answerRef}
              id={ids.answer}
              className="answer__field"
              rows={layerKey === 'requirements' || layerKey === 'rules' ? 7 : 5}
              placeholder={layer.answerField.placeholder}
              value={draft.text}
              aria-describedby={`${ids.question} ${ids.hint}${error ? ` ${ids.error}` : ''}`}
              aria-invalid={error ? true : undefined}
              aria-required={layer.status === 'required' || undefined}
              onChange={(e) => {
                updateLayer(journey, layerKey, { text: e.target.value, ...(e.target.value.trim() ? { skipped: false } : {}) });
                if (error && e.target.value.trim()) setError(null);
              }}
            />
          </>
        )}

        {layer.status === 'optional' && (
          <div className="not-needed">
            <label className="check">
              <input
                type="checkbox"
                checked={draft.notNeeded}
                onChange={(e) => {
                  updateLayer(journey, layerKey, { notNeeded: e.target.checked, skipped: false });
                  setError(null);
                  if (e.target.checked) window.setTimeout(() => reasonRef.current?.focus(), 0);
                }}
              />
              <span>
                Mark this layer <strong>{sharedContent.globalMicrocopy.notNeeded}</strong>
              </span>
            </label>
            {draft.notNeeded && (
              <div className="not-needed__reason">
                <label className="answer__label" htmlFor={ids.reason}>
                  Why is it not needed? (required)
                </label>
                <textarea
                  ref={reasonRef}
                  id={ids.reason}
                  className="answer__field"
                  rows={2}
                  value={draft.reason}
                  placeholder={exampleReason ? `For example: ${exampleReason}` : undefined}
                  aria-describedby={`${ids.reasonHint}${error ? ` ${ids.error}` : ''}`}
                  aria-invalid={error ? true : undefined}
                  aria-required
                  onChange={(e) => {
                    updateLayer(journey, layerKey, { reason: e.target.value });
                    if (error && e.target.value.trim()) setError(null);
                  }}
                />
                <p id={ids.reasonHint} className="answer__hint">
                  Your answer is kept but left out of the prompt while this layer is Not needed. The reason stays here and is not copied.
                </p>
              </div>
            )}
          </div>
        )}

        <p id={ids.hint} className={`answer__hint answer__hint--${st}`}>
          <StatusPill tone={st === 'filled' ? 'ok' : st === 'not-needed' ? 'muted' : layer.status === 'required' ? 'attention' : 'neutral'}>
            {st === 'filled' ? 'Added' : st === 'not-needed' ? 'Not needed' : st === 'skipped' ? 'Skipped' : 'Empty'}
          </StatusPill>{' '}
          {hint}
        </p>
        {tooShort && (
          <p className="answer__hint answer__hint--warn">
            {ASSEMBLY_MICROCOPY.incompleteAnswer} {layer.states.warning}
          </p>
        )}
        {warnings.map((w) => (
          <p key={w.key} className="answer__hint answer__hint--warn">
            <StatusPill tone="attention">Check</StatusPill> {mc[w.key]}
          </p>
        ))}
        {error && (
          <p id={ids.error} className="answer__error" role="alert">
            <StatusPill tone="attention">Needs attention</StatusPill> {error}
          </p>
        )}

        <div className="answer__tools">
          <Disclosure summary="See a complete example answer" className="answer__example">
            <p className="illustrative">Example for this journey’s project. Write your own, or start from this one.</p>
            <pre className="prompt-block">{layer.answerField.exampleAnswer}</pre>
            <button
              type="button"
              className="btn btn--small"
              onClick={() => {
                updateLayer(journey, layerKey, { text: layer.answerField.exampleAnswer, notNeeded: false, skipped: false });
                setError(null);
                announce(fill(ASSEMBLY_MICROCOPY.layerEdited, { layer: u.label }));
                answerRef.current?.focus();
              }}
            >
              Use this example as my answer
            </button>
          </Disclosure>
          {(draft.text || draft.notNeeded || draft.reason || draft.skipped) && (
            <button type="button" className="btn btn--small btn--quiet" onClick={() => setConfirmClear(true)}>
              Clear this layer
            </button>
          )}
        </div>
      </div>

      <div className="tips">
        {layerHints.map((h) => (
          <div key={h} className="tip tip--journey">
            <p className="tip__label">{j.discipline} tip</p>
            <p>{h}</p>
          </div>
        ))}
        <div className="tip">
          <p className="tip__label">Tiny example</p>
          <p>{layer.simple.example}</p>
        </div>
        <div className="tip">
          <p className="tip__label">Practical tip</p>
          <p>{layer.simple.tip}</p>
        </div>
      </div>

      <div className="explain">
        <div className="explain__item">
          <h2 className="explain__title">Why it matters</h2>
          <ModeText text={layer.whyItMatters} />
        </div>
        <div className="explain__item">
          <h2 className="explain__title">Common mistake</h2>
          <ModeText text={layer.commonMistake} />
        </div>
        <div className="explain__item">
          <h2 className="explain__title">If you leave it out</h2>
          <ModeText text={layer.omissionEffect} />
        </div>
      </div>

      <Disclosure summary={`Learn more: ${layer.learnMore.title}`}>
        <p>{layer.learnMore.body}</p>
      </Disclosure>

      <ProOnly>
        <Disclosure summary={<>Pro notes: {layer.pro.professionalTerm}</>} className="disclosure--pro">
          <dl className="pro-notes">
            <div>
              <dt>Why it works</dt>
              <dd>{layer.pro.whyItWorks}</dd>
            </div>
            <div>
              <dt>Trade-off</dt>
              <dd>{layer.pro.tradeOff}</dd>
            </div>
            <div>
              <dt>Advanced options</dt>
              <dd>
                <ul className="bullets">
                  {layer.pro.advancedOptions.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>At work</dt>
              <dd>{layer.pro.workplaceApplication}</dd>
            </div>
            {layer.pro.governanceNote && (
              <div>
                <dt>Verification, safety or governance</dt>
                <dd>{layer.pro.governanceNote}</dd>
              </div>
            )}
          </dl>
        </Disclosure>
      </ProOnly>

      {showNav && (
        <nav className="layer-nav" aria-label="Layer navigation">
          <a className="btn btn--ghost" href={nav.prevHash}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13 8H4M7.5 4l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {nav.prevLabel}
          </a>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            {nav.nextLabel}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}

      <ConfirmDialog
        open={confirmClear}
        title={`Clear ${u.label}?`}
        body={<p>Your answer for this layer will be removed. Other layers stay as they are.</p>}
        confirmLabel="Clear this layer"
        cancelLabel="Keep it"
        onConfirm={() => {
          updateLayer(journey, layerKey, { text: '', notNeeded: false, reason: '', skipped: false });
          announce(fill(ASSEMBLY_MICROCOPY.layerRemoved, { layer: u.label }));
        }}
        onClose={() => setConfirmClear(false)}
      />
    </article>
  );
}

/** Lets the mobile bar trigger the same Next behaviour and show errors in the panel. */
export const layerErrorEvent = 'prompt-smash:layer-next';
