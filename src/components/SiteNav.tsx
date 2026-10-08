import { useEffect, useId, useRef, useState } from 'react';
import type { JourneyId, LearningMode } from '../data/schema';
import { sharedContent } from '../data/sharedContent';
import { JOURNEYS } from '../app/registry';
import { chapterHash, journeyHash, type ChapterId } from '../app/router';
import { useApp } from '../app/state';
import './SiteNav.css';

export type { LearningMode };

/** Approved primary logo (owner-supplied, used unaltered). BASE_URL keeps the path valid under a GitHub Pages sub-path. */
const LOGO_SRC = `${import.meta.env.BASE_URL}assets/brand/prompt-smash-logo-primary.png`;

const modes: { id: LearningMode; label: string }[] = [
  { id: 'simple', label: 'Simple' },
  { id: 'pro', label: 'Pro' },
];

export const HANDBOOK_LINKS: { chapter: ChapterId; label: string }[] = [
  { chapter: 'welcome', label: 'Welcome' },
  ...sharedContent.footerAndErrors.footer.navigation.map((n) => ({ chapter: n.route.replace('#/', '') as ChapterId, label: n.label })),
];

export function ModeToggle() {
  const { mode, setMode, announce } = useApp();
  const mc = sharedContent.globalMicrocopy;
  return (
    <div className="mode-toggle" role="group" aria-label="Learning mode">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          className="mode-toggle__option"
          aria-pressed={mode === m.id}
          onClick={() => {
            if (mode === m.id) return;
            setMode(m.id);
            announce(m.id === 'pro' ? mc.proSelected : mc.simpleSelected);
          }}
        >
          {mode === m.id && (
            <svg className="mode-toggle__check" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {m.label}
        </button>
      ))}
    </div>
  );
}

function HandbookMenu({ current }: { current?: ChapterId }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // Close when the route changes (a link was followed).
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  return (
    <div className="handbook-menu">
      <button
        ref={button}
        type="button"
        className="handbook-menu__button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        Handbook
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div ref={panel} id={id} className="handbook-menu__panel" hidden={!open}>
        <nav aria-label="Handbook chapters">
          <ul>
            {HANDBOOK_LINKS.map((l) => (
              <li key={l.chapter}>
                <a href={chapterHash(l.chapter)} aria-current={current === l.chapter ? 'page' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default function SiteNav({ journey, chapter }: { journey: JourneyId; chapter?: ChapterId }) {
  const j = JOURNEYS[journey];
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        {/* The image alone names the link, so the brand is announced once. */}
        <a className="site-nav__brand" href="#/">
          <span className="site-nav__logo">
            <img src={LOGO_SRC} alt="Prompt Smash!" width={1774} height={887} decoding="async" />
          </span>
          <span className="visually-hidden">, home</span>
        </a>

        <div className="site-nav__middle">
          <a className="site-nav__journey" href={journeyHash(journey)}>
            <span className="site-nav__journey-label">Journey</span>
            <span className="site-nav__journey-value">
              {j.burgerName.replace(/ Burger$/, '')} <span aria-hidden="true">/</span>
              <span className="visually-hidden">:</span> {j.discipline}
            </span>
          </a>
          <HandbookMenu current={chapter} />
        </div>

        <ModeToggle />
      </div>
    </header>
  );
}
