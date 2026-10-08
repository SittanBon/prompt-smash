import { useState } from 'react';
import type { JourneyId } from '../../data/schema';
import { BITE, BITE_LIMITS, SAFETY_CHECKS, SAFETY_REVIEW_STATE_LABEL, UNIVERSAL_LAYERS } from '../../data/framework';
import { ASSEMBLY_MICROCOPY } from '../../data/promptAssembly';
import { sharedContent } from '../../data/sharedContent';
import { JOURNEYS } from '../../app/registry';
import { chapterHash, journeyHash, navigate } from '../../app/router';
import { assembled, layerState, useApp } from '../../app/state';
import { fill } from '../../app/promptFiles';
import { ConfirmDialog, Disclosure, ModeText, PageTitle, StatusPill } from '../common/Common';
import { BITE_STATUS_LABEL, useBiteStatus } from './BiteReview';
import { safetyStatus } from './ResponsibleAIReview';
import { PromptActions, PromptPreview, SaveControls } from './LivePrompt';

export default function CompletionSummary({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const { progress, resetJourney, announce } = useApp();
  const p = progress(journey);
  const a = assembled(j, p);
  const biteStatus = useBiteStatus(journey);
  const [status, setStatus] = useState('');
  const [confirm, setConfirm] = useState(false);
  const mc = sharedContent.globalMicrocopy;
  const cs = j.completionSummary;

  const done = UNIVERSAL_LAYERS.filter((l) => ['filled', 'not-needed'].includes(layerState(j, p, l.key)));
  const skipped = UNIVERSAL_LAYERS.filter((l) => l.status === 'recommended' && layerState(j, p, l.key) !== 'filled');
  const safetyOpen = SAFETY_CHECKS.filter((s) => ['needs-attention', 'not-yet-reviewed'].includes(safetyStatus(p, s.key).state));
  const exDone = j.exercises.filter((x) => ['correct', 'self-checked', 'answer-shown'].includes(p.exercises[x.id]?.status ?? '')).length;
  const ready = a.missingRequired.length === 0;
  const next = j.nextJourney ? JOURNEYS[j.nextJourney] : null;

  return (
    <div className="step-page finish">
      <PageTitle eyebrow={`${j.burgerName} · Finish`} lead={ready ? mc.journeyCompleted : ASSEMBLY_MICROCOPY.copyBlocked}>
        {ready ? cs.headline : 'Almost there'}
      </PageTitle>

      <div className="finish__grid">
        <section className="card" aria-labelledby="fin-layers">
          <h2 id="fin-layers" className="card__title">
            Layers
          </h2>
          <p className="finish__big">{done.length} of 7 done</p>
          {a.missingRequired.length > 0 && (
            <p>
              <StatusPill tone="attention">Required</StatusPill> Still empty: {a.missingRequired.map((k) => UNIVERSAL_LAYERS.find((l) => l.key === k)!.label).join(', ')}
            </p>
          )}
          {skipped.length > 0 ? (
            <p>
              Recommended layers skipped:{' '}
              {skipped.map((l, i) => (
                <span key={l.key}>
                  {i > 0 && ', '}
                  <a href={journeyHash(journey, 'build', l.key)}>{l.label}</a>
                </span>
              ))}
            </p>
          ) : (
            <p>No recommended layers skipped.</p>
          )}
        </section>

        <section className="card" aria-labelledby="fin-bite">
          <h2 id="fin-bite" className="card__title">
            BITE
          </h2>
          <ul className="status-list">
            {BITE.map((b) => {
              const s = biteStatus(b.key).status;
              return (
                <li key={b.key}>
                  <span>
                    {b.letter} · {b.name}
                  </span>
                  <StatusPill tone={s === 'clear' ? 'ok' : s === 'needs-attention' ? 'attention' : s === 'not-needed' ? 'muted' : 'neutral'}>{BITE_STATUS_LABEL[s]}</StatusPill>
                </li>
              );
            })}
          </ul>
          <a href={journeyHash(journey, 'bite')}>Open BITE</a>
        </section>

        <section className="card" aria-labelledby="fin-safety">
          <h2 id="fin-safety" className="card__title">
            Responsible-AI review
          </h2>
          <p className="finish__big">{safetyOpen.length === 0 ? 'All five reviewed' : `${safetyOpen.length} of 5 still need attention`}</p>
          {safetyOpen.length > 0 && (
            <ul className="status-list">
              {safetyOpen.map((s) => {
                const st = safetyStatus(p, s.key);
                return (
                  <li key={s.key}>
                    <span>{s.name}</span>
                    <StatusPill tone={st.state === 'needs-attention' ? 'attention' : 'neutral'}>{st.reasonMissing ? 'Reason needed' : SAFETY_REVIEW_STATE_LABEL[st.state]}</StatusPill>
                  </li>
                );
              })}
            </ul>
          )}
          <a href={journeyHash(journey, 'safety')}>Open the review</a>
        </section>

        <section className="card" aria-labelledby="fin-ex">
          <h2 id="fin-ex" className="card__title">
            Practice
          </h2>
          <p className="finish__big">
            {exDone} of {j.exercises.length} exercises
          </p>
          <p>Exercises are optional.</p>
          <a href={journeyHash(journey, 'practice')}>Open the exercises</a>
        </section>
      </div>

      <section className="finish__prompt" aria-labelledby="fin-prompt">
        <h2 id="fin-prompt" className="section-title">
          Your final prompt
        </h2>
        <PromptPreview journey={journey} />
        <PromptActions journey={journey} onStatus={setStatus} />
        <p role="status" className="live__status">
          {status}
        </p>
        <div className="finish__edit">
          <p className="mini-title">Edit a layer</p>
          <ul className="chips chips--links">
            {UNIVERSAL_LAYERS.map((l) => (
              <li key={l.key}>
                <a href={journeyHash(journey, 'build', l.key)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card" aria-labelledby="fin-limits">
        <h2 id="fin-limits" className="card__title">
          Remaining limitations
        </h2>
        <ul className="bullets">
          {BITE_LIMITS.slice(1).map((x) => (
            <li key={x}>{x}</li>
          ))}
          {j.workedExample.limitationsAndReview.slice(0, 3).map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="fin-recap">
        <h2 id="fin-recap" className="card__title">
          What you practised
        </h2>
        <ul className="ticks">
          {cs.recap.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <ModeText text={cs.takeaway} className="finish__takeaway" />
      </section>

      <section className="card" aria-labelledby="fin-transfer">
        <h2 id="fin-transfer" className="card__title">
          {j.workedExample.variation.title}
        </h2>
        <p>{j.workedExample.variation.scenario}</p>
        <Disclosure summary="See all seven layers for this task">
          <dl className="layer-notes layer-notes--pre">
            {UNIVERSAL_LAYERS.map((l) => (
              <div key={l.key}>
                <dt>{l.label}</dt>
                <dd>{j.workedExample.variation.answers[l.key]}</dd>
              </div>
            ))}
          </dl>
        </Disclosure>
      </section>

      {/* Forward learning comes first; starting over is the last, quieter action. */}
      <div className="finish__actions">
        {next ? (
          <a className="btn btn--primary" href={journeyHash(next.id)}>
            {fill(mc.continueToNextBurger, { burger: next.burgerName })}
          </a>
        ) : (
          <>
            <a className="btn btn--ghost" href="#/">
              {mc.chooseBurger}
            </a>
            <a className="btn btn--primary" href={chapterHash('case-study')}>
              {cs.actions.find((x) => /case study/i.test(x)) ?? 'See the case study'}
            </a>
          </>
        )}
        <button type="button" className="btn btn--ghost" onClick={() => setConfirm(true)}>
          {mc.buildAnotherPrompt}
        </button>
      </div>
      <p className="finish__pitch">{cs.nextJourneyPitch}</p>

      <SaveControls />

      <ConfirmDialog
        open={confirm}
        title="Build another prompt?"
        body={<p>{ASSEMBLY_MICROCOPY.resetConfirm} Download or copy this prompt first if you want to keep it.</p>}
        confirmLabel={ASSEMBLY_MICROCOPY.resetConfirmAction}
        cancelLabel={ASSEMBLY_MICROCOPY.resetCancelAction}
        onConfirm={() => {
          resetJourney(journey);
          announce('All seven layers cleared.');
          navigate(journeyHash(journey, 'build', 'goal'));
        }}
        onClose={() => setConfirm(false)}
      />
    </div>
  );
}
