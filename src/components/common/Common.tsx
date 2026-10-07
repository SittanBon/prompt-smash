/** Small shared building blocks used by journeys and handbook chapters. */
import { useEffect, useId, useRef, type ReactNode } from 'react';
import type { ModeText as ModeTextData } from '../../data/schema';
import { useApp } from '../../app/state';

/** Simple text always; the Pro addition follows it in Pro mode, never instead of it. */
export function ModeText({ text, as: Tag = 'p', className }: { text: ModeTextData; as?: 'p' | 'div'; className?: string }) {
  const { mode } = useApp();
  return (
    <Tag className={className}>
      {text.simple}
      {mode === 'pro' && (
        <>
          {' '}
          <span className="pro-add">
            <span className="pro-add__tag">Pro</span> {text.proAddition}
          </span>
        </>
      )}
    </Tag>
  );
}

/** Pro-only block. Renders nothing in Simple mode. */
export function ProOnly({ children }: { children: ReactNode }) {
  const { mode } = useApp();
  return mode === 'pro' ? <>{children}</> : null;
}

export type Tone = 'ok' | 'attention' | 'neutral' | 'muted' | 'info';

const ICON: Record<Tone, ReactNode> = {
  ok: <path d="M3 8.5 6.5 12 13 4.5" />,
  attention: <path d="M8 3.5v5.5M8 12.2v.3" />,
  neutral: <circle cx="8" cy="8" r="3" />,
  muted: <path d="M4 8h8" />,
  info: <path d="M8 7v5M8 4.2v.3" />,
};

/** A status label that never relies on colour alone: always a word and an icon. */
export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`pill pill--${tone}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {ICON[tone]}
      </svg>
      {children}
    </span>
  );
}

/** Progressive disclosure built on <details>, so it works with keyboard and without script. */
export function Disclosure({
  summary,
  children,
  className = '',
  defaultOpen = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}) {
  return (
    <details className={`disclosure ${className}`} open={defaultOpen || undefined}>
      <summary className="disclosure__summary">
        <span>{summary}</span>
        <svg className="disclosure__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="disclosure__body">{children}</div>
    </details>
  );
}

/**
 * Modal confirmation on the native <dialog>: focus stays inside, Escape
 * closes it, and focus returns to the control that opened it.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="confirm"
      aria-labelledby={titleId}
      onClose={() => {
        onClose();
        opener.current?.focus?.();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="confirm__inner">
        <h2 id={titleId} className="confirm__title">
          {title}
        </h2>
        <div className="confirm__body">{body}</div>
        <div className="confirm__actions">
          <button type="button" className="btn btn--ghost" onClick={() => ref.current?.close()} autoFocus>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              onConfirm();
              ref.current?.close();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

/** Page heading that receives focus after navigation. */
export function PageTitle({ children, eyebrow, lead }: { children: ReactNode; eyebrow?: ReactNode; lead?: ReactNode }) {
  return (
    <header className="page-title">
      {eyebrow && <p className="page-title__eyebrow">{eyebrow}</p>}
      <h1 className="page-title__heading" tabIndex={-1} data-route-focus>
        {children}
      </h1>
      {lead && <p className="page-title__lead">{lead}</p>}
    </header>
  );
}

export function Arrow({ dir = 'right' }: { dir?: 'right' | 'left' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={dir === 'right' ? 'M3 8h9M8.5 4l4 4-4 4' : 'M13 8H4M7.5 4l-4 4 4 4'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
