/**
 * The five responsible-AI checks. There is no on/off switch: each check is
 * reviewed as Needs attention, Action added or Not relevant (with a reason).
 * Nothing is added to the learner's prompt automatically.
 */
import { useId, useState } from 'react';
import type { JourneyId, SafetyCheckKey } from '../../data/schema';
import { REVIEW_DISCLAIMER, REVIEW_SCREEN_COPY, SAFETY_CHECKS, SAFETY_REVIEW_STATE_LABEL } from '../../data/framework';
import { ASSEMBLY_MICROCOPY } from '../../data/promptAssembly';
import { JOURNEYS } from '../../app/registry';
import { journeyHash } from '../../app/router';
import { useApp, type SafetyChoice, type JourneyProgress } from '../../app/state';
import { fill } from '../../app/promptFiles';
import { Disclosure, ModeText, PageTitle, StatusPill, type Tone } from '../common/Common';
import { NextStep } from './JourneyPage';

const TONE: Record<string, Tone> = { 'not-yet-reviewed': 'neutral', 'needs-attention': 'attention', 'action-added': 'ok', 'not-relevant': 'muted' };

/** Effective state: "Not relevant" without a reason still needs attention. */
export function safetyStatus(p: JourneyProgress, key: SafetyCheckKey): { state: keyof typeof SAFETY_REVIEW_STATE_LABEL; reasonMissing: boolean } {
  const r = p.safety[key];
  if (!r) return { state: 'not-yet-reviewed', reasonMissing: false };
  if (r.state === 'not-relevant' && !r.note.trim()) return { state: 'needs-attention', reasonMissing: true };
  return { state: r.state, reasonMissing: false };
}

function SafetyCheckPanel({ journey, k }: { journey: JourneyId; k: SafetyCheckKey }) {
  const j = JOURNEYS[journey];
  const c = j.responsibleAi[k];
  const def = SAFETY_CHECKS.find((s) => s.key === k)!;
  const { progress, update, updateLayer, announce } = useApp();
  const p = progress(journey);
  const rec = p.safety[k];
  const { state, reasonMissing } = safetyStatus(p, k);
  const uid = useId();
  const [boundary, setBoundary] = useState(c.promptVsWorkflow.promptInstruction);
  const [added, setAdded] = useState('');

  const set = (patch: Partial<{ state: SafetyChoice; note: string }>) =>
    update(journey, (q) => ({
      ...q,
      safety: { ...q.safety, [k]: { state: q.safety[k]?.state ?? 'needs-attention', note: q.safety[k]?.note ?? '', ...patch } },
    }));

  return (
    <section className="safety" id={`safety-${k}`} aria-labelledby={`${uid}-title`}>
      <div className="safety__head">
        <div>
          <h2 id={`${uid}-title`} className="safety__title">
            {def.name}
          </h2>
          <p className="safety__question">{def.question}</p>
        </div>
        <StatusPill tone={TONE[state]}>{reasonMissing ? 'Reason needed' : SAFETY_REVIEW_STATE_LABEL[state]}</StatusPill>
      </div>

      <ModeText text={c.explanation} />

      <dl className="safety__facts">
        <div>
          <dt>Example for this burger</dt>
          <dd>{c.burgerExample}</dd>
        </div>
        <div>
          <dt>Warning sign</dt>
          <dd>{c.warningSign}</dd>
        </div>
        <div>
          <dt>Corrective action</dt>
          <dd>{c.correctiveAction}</dd>
        </div>
      </dl>

      <div className="levels">
        <div className="levels__col">
          <p className="mini-title">In the prompt</p>
          <p>{c.promptVsWorkflow.promptInstruction}</p>
        </div>
        <div className="levels__col">
          <p className="mini-title">In the workflow or system</p>
          <p>{c.promptVsWorkflow.workflowControl}</p>
        </div>
      </div>

      <fieldset className="segmented">
        <legend>Your review of {def.name}</legend>
        {(['needs-attention', 'action-added', 'not-relevant'] as const).map((v) => (
          <label key={v} className="segmented__option">
            <input type="radio" name={`${uid}-state`} checked={rec?.state === v} onChange={() => set({ state: v })} />
            <span>{SAFETY_REVIEW_STATE_LABEL[v]}</span>
          </label>
        ))}
      </fieldset>

      {rec?.state === 'not-relevant' && (
        <div className="safety__note">
          <label htmlFor={`${uid}-note`} className="answer__label">
            Why is it not relevant? (required)
          </label>
          <textarea
            id={`${uid}-note`}
            className="answer__field"
            rows={2}
            value={rec.note}
            placeholder={`For example: ${c.notRelevantExampleReason}`}
            aria-invalid={reasonMissing || undefined}
            aria-describedby={`${uid}-note-msg`}
            onChange={(e) => set({ note: e.target.value })}
          />
          <p id={`${uid}-note-msg`} className={reasonMissing ? 'answer__error' : 'answer__hint'}>
            {reasonMissing ? 'Add a short reason why this check is not relevant here.' : fill(c.stateCopy.notRelevant, { reason: rec.note.trim() })}
          </p>
        </div>
      )}

      {rec?.state === 'action-added' && (
        <div className="safety__note">
          <label htmlFor={`${uid}-note`} className="answer__label">
            What did you add or plan? (optional)
          </label>
          <textarea id={`${uid}-note`} className="answer__field" rows={2} value={rec.note} onChange={(e) => set({ note: e.target.value })} />
          <p className="answer__hint">{c.stateCopy.actionAdded}</p>
        </div>
      )}

      {rec?.state === 'needs-attention' && <p className="answer__hint">{c.stateCopy.needsAttention}</p>}

      <Disclosure summary="Optional: add a boundary to your prompt">
        <p>
          Nothing is added automatically. If a prompt-level boundary helps here, edit it and add it to your Rules and Boundaries yourself.
          Workflow controls cannot be added by a prompt.
        </p>
        <label htmlFor={`${uid}-boundary`} className="answer__label">
          Boundary to add
        </label>
        <textarea id={`${uid}-boundary`} className="answer__field" rows={3} value={boundary} onChange={(e) => setBoundary(e.target.value)} />
        <div className="bite-part__actions">
          <button
            type="button"
            className="btn btn--small"
            onClick={() => {
              const line = boundary.trim();
              if (!line) return;
              const cur = p.layers.rules.text.trim();
              if (cur.includes(line)) {
                setAdded('Already in Rules and Boundaries.');
                return;
              }
              updateLayer(journey, 'rules', { text: cur ? `${cur}\n- ${line}` : `- ${line}`, skipped: false });
              const msg = fill(ASSEMBLY_MICROCOPY.layerEdited, { layer: 'Rules and Boundaries' });
              setAdded(msg);
              announce(msg);
            }}
          >
            Add to Rules and Boundaries
          </button>
          <a className="btn btn--ghost btn--small" href={journeyHash(journey, 'build', 'rules')}>
            Open Rules and Boundaries
          </a>
        </div>
        <p role="status" className="answer__hint">
          {added}
        </p>
      </Disclosure>
    </section>
  );
}

export default function ResponsibleAIReview({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const p = progress(journey);
  return (
    <div className="step-page">
      <PageTitle eyebrow={`${j.burgerName} · Responsible AI`} lead={REVIEW_SCREEN_COPY.reviewIntro}>
        What could still go wrong?
      </PageTitle>
      <p className="callout">
        <StatusPill tone="info">Always on</StatusPill> The five checks cannot be switched off. {REVIEW_DISCLAIMER}
      </p>

      <ol className="safety-summary" aria-label="Five checks at a glance">
        {SAFETY_CHECKS.map((s) => {
          const st = safetyStatus(p, s.key);
          return (
            <li key={s.key}>
              <span className="safety-summary__name">{s.name}</span>
              <StatusPill tone={TONE[st.state]}>{st.reasonMissing ? 'Reason needed' : SAFETY_REVIEW_STATE_LABEL[st.state]}</StatusPill>
            </li>
          );
        })}
      </ol>

      {SAFETY_CHECKS.map((s) => (
        <SafetyCheckPanel key={s.key} journey={journey} k={s.key} />
      ))}

      <NextStep journey={journey} from="safety" />
    </div>
  );
}
