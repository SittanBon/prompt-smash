/**
 * Live prompt built by the approved assembler. The preview is deliberately
 * not a live region (typing would flood screen readers); action results use a
 * polite status message instead.
 */
import { useId, useState } from 'react';
import type { JourneyId, LayerKey } from '../../data/schema';
import { ASSEMBLY_MICROCOPY } from '../../data/promptAssembly';
import { UNIVERSAL_LAYERS } from '../../data/framework';
import { sharedContent } from '../../data/sharedContent';
import { JOURNEYS } from '../../app/registry';
import { journeyHash } from '../../app/router';
import { assembled, useApp } from '../../app/state';
import { copyText, downloadFile, fill, promptFilename, toMarkdown } from '../../app/promptFiles';
import { ConfirmDialog, StatusPill } from '../common/Common';

const label = (k: LayerKey) => UNIVERSAL_LAYERS.find((l) => l.key === k)!.label;

export function PromptActions({ journey, onStatus }: { journey: JourneyId; onStatus: (m: string) => void }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const a = assembled(j, progress(journey));
  const blocked = a.missingRequired.length > 0;
  const mc = sharedContent.globalMicrocopy;

  const guard = (fn: () => void) => () => {
    if (blocked) onStatus(ASSEMBLY_MICROCOPY.copyBlocked);
    else fn();
  };
  const download = (ext: 'txt' | 'md') =>
    guard(() => {
      const name = promptFilename(journey, ext);
      downloadFile(name, ext === 'md' ? toMarkdown(a) : a.text + '\n', ext === 'md' ? 'text/markdown' : 'text/plain');
      onStatus(fill(ASSEMBLY_MICROCOPY.promptDownloaded, { filename: name }));
    });

  return (
    <div className="prompt-actions">
      <button
        type="button"
        className="btn btn--primary"
        aria-disabled={blocked || undefined}
        onClick={guard(async () => onStatus((await copyText(a.text)) ? ASSEMBLY_MICROCOPY.promptCopied : mc.copyFailed))}
      >
        Copy prompt
      </button>
      <button type="button" className="btn btn--ghost" aria-disabled={blocked || undefined} onClick={download('txt')}>
        Download .txt
      </button>
      <button type="button" className="btn btn--ghost" aria-disabled={blocked || undefined} onClick={download('md')}>
        Download .md
      </button>
    </div>
  );
}

export function PromptPreview({ journey, active }: { journey: JourneyId; active?: LayerKey }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const a = assembled(j, progress(journey));
  return (
    <div className="live__preview" tabIndex={0} role="region" aria-label="Prompt preview">
      {a.sections.length === 0 ? (
        <p className="live__empty">{ASSEMBLY_MICROCOPY.previewEmpty}</p>
      ) : (
        a.sections.map((s) => (
          <div key={s.key} className="live__section" data-active={s.key === active || undefined}>
            {s.key === active && <span className="visually-hidden">Current layer: </span>}
            <span className="live__label">{s.label}:</span>
            {'\n'}
            {s.body}
          </div>
        ))
      )}
    </div>
  );
}

export function SaveControls() {
  const { storageStatus, saveNow, clearAllSaved, announce } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState('');
  const mc = sharedContent.globalMicrocopy;
  return (
    <div className="save">
      <p className="save__state">
        {storageStatus === 'available' ? (
          <StatusPill tone="ok">Saving in this browser</StatusPill>
        ) : (
          <StatusPill tone="attention">Not saved</StatusPill>
        )}
      </p>
      <p className="save__note">
        {storageStatus === 'available'
          ? `${ASSEMBLY_MICROCOPY.localStorageNote} This website does not send your prompt anywhere.`
          : mc.localSaveFailed}
      </p>
      <div className="save__actions">
        <button
          type="button"
          className="btn btn--small"
          onClick={() => {
            const ok = saveNow();
            setMsg(ok ? ASSEMBLY_MICROCOPY.localSaved : mc.localSaveFailed);
          }}
        >
          Save now
        </button>
        <button type="button" className="btn btn--small btn--quiet" onClick={() => setConfirm(true)}>
          {mc.clearSavedWork}
        </button>
      </div>
      <p className="save__msg" role="status">
        {msg}
      </p>
      <ConfirmDialog
        open={confirm}
        title="Clear all saved work?"
        body={<p>This removes every journey’s answers, reviews and exercise progress from this browser. It cannot be undone. Download anything you want to keep first.</p>}
        confirmLabel={mc.clearSavedWork}
        cancelLabel="Keep my work"
        onConfirm={() => {
          clearAllSaved();
          setMsg(ASSEMBLY_MICROCOPY.localCleared);
          announce(ASSEMBLY_MICROCOPY.localCleared);
        }}
        onClose={() => setConfirm(false)}
      />
    </div>
  );
}

export default function LivePrompt({ journey, active, headingLevel = 2 }: { journey: JourneyId; active?: LayerKey; headingLevel?: 2 | 3 }) {
  const j = JOURNEYS[journey];
  const { progress, resetJourney, announce } = useApp();
  const p = progress(journey);
  const a = assembled(j, p);
  const [status, setStatus] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const titleId = useId();
  const H = `h${headingLevel}` as const;
  const count = a.includedLayers.length + a.notNeeded.length;

  return (
    <section className="live" aria-labelledby={titleId}>
      <div className="live__head">
        <H id={titleId} className="live__title">
          Your prompt
        </H>
        <p className="live__count">{count} of 7 layers done</p>
      </div>

      <PromptPreview journey={journey} active={active} />

      {(a.missingRequired.length > 0 || a.skipped.length > 0 || a.notNeeded.length > 0) && (
        <ul className="live__notes">
          {a.missingRequired.map((k) => (
            <li key={k}>
              <StatusPill tone="attention">Required</StatusPill>{' '}
              <a href={journeyHash(journey, 'build', k)}>{k === 'goal' ? ASSEMBLY_MICROCOPY.missingGoal : ASSEMBLY_MICROCOPY.missingTask}</a>
            </li>
          ))}
          {a.notNeeded.map((k) => (
            <li key={k}>
              <StatusPill tone="muted">Not needed</StatusPill>{' '}
              {fill(ASSEMBLY_MICROCOPY.styleNotNeeded, { reason: p.layers[k].reason.trim() })}
            </li>
          ))}
          {a.skipped.length > 0 && (
            <li>
              <StatusPill tone="neutral">Not in prompt</StatusPill> {a.skipped.map(label).join(', ')}
            </li>
          )}
        </ul>
      )}

      <PromptActions journey={journey} onStatus={setStatus} />
      <button type="button" className="btn btn--small btn--quiet live__reset" onClick={() => setConfirmReset(true)}>
        Reset this prompt
      </button>
      <p className="live__status" role="status">
        {status}
      </p>

      <SaveControls />

      <ConfirmDialog
        open={confirmReset}
        title="Start again?"
        body={<p>{ASSEMBLY_MICROCOPY.resetConfirm} Your other burgers are not affected.</p>}
        confirmLabel={ASSEMBLY_MICROCOPY.resetConfirmAction}
        cancelLabel={ASSEMBLY_MICROCOPY.resetCancelAction}
        onConfirm={() => {
          resetJourney(journey);
          setStatus('All seven layers cleared.');
          announce('All seven layers cleared.');
        }}
        onClose={() => setConfirmReset(false)}
      />
    </section>
  );
}
