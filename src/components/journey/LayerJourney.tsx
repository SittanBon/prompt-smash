import { useEffect, useRef, useState } from 'react';
import type { JourneyId, LayerKey } from '../../data/schema';
import { UNIVERSAL_LAYERS } from '../../data/framework';
import { JOURNEYS, LAYER_KEYS } from '../../app/registry';
import { journeyHash, navigate } from '../../app/router';
import { assembled, layerState, useApp } from '../../app/state';
import { DESKTOP_QUERY, useMediaQuery } from '../../app/useMediaQuery';
import BurgerVisual from '../BurgerVisual';
import LayerProgress from './LayerProgress';
import LayerPanel, { layerErrorEvent, useLayerNavigation } from './LayerPanel';
import LivePrompt from './LivePrompt';

/** The seven-layer builder: burger and progress, the layer panel, and the live prompt. */
export default function LayerJourney({ journey, layerKey }: { journey: JourneyId; layerKey: LayerKey }) {
  const j = JOURNEYS[journey];
  const { progress, update } = useApp();
  const p = progress(journey);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const idx = UNIVERSAL_LAYERS.findIndex((l) => l.key === layerKey);
  const states = Object.fromEntries(LAYER_KEYS.map((k) => [k, layerState(j, p, k)]));

  // Remember where the learner is, so "Continue" returns here.
  useEffect(() => {
    if (p.currentLayer !== layerKey) update(journey, (q) => ({ ...q, currentLayer: layerKey }));
  }, [journey, layerKey, p.currentLayer, update]);

  const burger = (variant: 'builder' | 'compact') => (
    <BurgerVisual
      journey={journey}
      variant={variant}
      activeLayer={layerKey}
      states={states}
      onSelectLayer={(k) => navigate(journeyHash(journey, 'build', k))}
    />
  );

  return (
    <div className={`builder${desktop ? ' builder--desktop' : ' builder--mobile'}`}>
      {desktop ? (
        <aside className="builder__side" aria-label="Your burger">
          <div className="builder__burger">{burger('builder')}</div>
          <p className="builder__now">
            <span className="builder__now-label">Now stacking</span> {idx + 1} · {j.layers[idx].ingredientName}
          </p>
          <LayerProgress journey={journey} active={layerKey} orientation="vertical" />
        </aside>
      ) : (
        <div className="builder__top">
          <div className="builder__burger builder__burger--compact">{burger('compact')}</div>
          <div className="builder__top-progress">
            <p className="builder__now">
              <span className="builder__now-label">Layer {idx + 1} of 7</span> {j.layers[idx].ingredientName}
            </p>
            <LayerProgress journey={journey} active={layerKey} orientation="horizontal" />
          </div>
        </div>
      )}

      <div className="builder__panel">
        <LayerPanel key={`${journey}-${layerKey}`} journey={journey} layerKey={layerKey} showNav={desktop} />
      </div>

      {desktop ? (
        <aside className="builder__prompt" aria-label="Live prompt">
          <LivePrompt journey={journey} active={layerKey} />
        </aside>
      ) : (
        <MobilePromptSheet journey={journey} layerKey={layerKey} />
      )}
    </div>
  );
}

/**
 * Small screens: a fixed bar with Previous, the prompt sheet and Next. The
 * sheet is a modal <dialog>: Escape, the close button or the backdrop close
 * it, and focus returns to the button that opened it.
 */
function MobilePromptSheet({ journey, layerKey }: { journey: JourneyId; layerKey: LayerKey }) {
  const j = JOURNEYS[journey];
  const { progress } = useApp();
  const a = assembled(j, progress(journey));
  const nav = useLayerNavigation(journey, layerKey);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const followedLink = useRef(false);
  const [open, setOpen] = useState(false);
  const count = a.includedLayers.length + a.notNeeded.length;

  const show = () => {
    dialog.current?.showModal();
    setOpen(true);
  };

  return (
    <>
      <div className="sheet-bar">
        <a className="sheet-bar__nav" href={nav.prevHash}>
          <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13 8H4M7.5 4l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{nav.prevLabel}</span>
        </a>
        <button ref={opener} type="button" className="sheet-bar__open" aria-haspopup="dialog" aria-expanded={open} onClick={show}>
          <span className="sheet-bar__title">View prompt</span>
          <span className="sheet-bar__count">{count} of 7 layers</span>
        </button>
        <button type="button" className="sheet-bar__nav sheet-bar__nav--next" onClick={() => window.dispatchEvent(new Event(layerErrorEvent))}>
          <span>{nav.nextLabel.startsWith('Skip') ? 'Skip' : 'Next'}</span>
          <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {nav.nextLabel.endsWith('Techniques') && <span className="visually-hidden"> to Techniques</span>}
        </button>
      </div>

      <dialog
        ref={dialog}
        className="sheet"
        aria-labelledby="sheet-title"
        onClose={() => {
          setOpen(false);
          if (followedLink.current) {
            // A link inside the sheet was followed: focus the page heading, not the bar.
            followedLink.current = false;
            window.setTimeout(() => document.querySelector<HTMLElement>('[data-route-focus]')?.focus(), 0);
          } else opener.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
          if ((e.target as HTMLElement).closest('a')) {
            followedLink.current = true;
            dialog.current?.close();
          }
        }}
      >
        <div className="sheet__inner">
          <div className="sheet__head">
            <p id="sheet-title" className="sheet__title">
              Live prompt · {j.burgerName}
            </p>
            <button type="button" className="sheet__close" onClick={() => dialog.current?.close()}>
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Close
            </button>
          </div>
          {open && <LivePrompt journey={journey} active={layerKey} />}
        </div>
      </dialog>
    </>
  );
}
