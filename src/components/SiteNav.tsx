import './SiteNav.css';

export type LearningMode = 'simple' | 'pro';

interface SiteNavProps {
  mode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
}

const modes: { id: LearningMode; label: string }[] = [
  { id: 'simple', label: 'Simple' },
  { id: 'pro', label: 'Pro' },
];

export default function SiteNav({ mode, onModeChange }: SiteNavProps) {
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#top" aria-label="Prompt Smash! — back to top">
          <span className="site-nav__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="site-nav__wordmark">Prompt Smash!</span>
        </a>

        {/* Informational only — styled as plain text so it does not read as a control. */}
        <p className="site-nav__journey">
          <span className="site-nav__journey-label">Journey</span>
          <span className="site-nav__journey-value">
            Hamburger <span aria-hidden="true">/</span>
            <span className="visually-hidden">:</span> Prompt Design
          </span>
        </p>

        <div className="mode-toggle" role="group" aria-label="Learning mode">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className="mode-toggle__option"
              aria-pressed={mode === m.id}
              onClick={() => onModeChange(m.id)}
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
      </div>
    </header>
  );
}
