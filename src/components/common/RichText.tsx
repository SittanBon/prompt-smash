/**
 * Minimal renderer for the small Markdown subset used in approved example
 * outputs: paragraphs, **bold**, `code`, "- " lists, pipe tables and fenced
 * code. Content is rendered as React text, never as HTML.
 */
import type { ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    out.push(t.startsWith('**') ? <strong key={i++}>{t.slice(2, -2)}</strong> : <code key={i++}>{t.slice(1, -1)}</code>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (line: string) => line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export default function RichText({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={k++} className="rich__code" tabIndex={0}>
          <code>{body.join('\n')}</code>
        </pre>,
      );
    } else if (line.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const [head, , ...body] = rows;
      blocks.push(
        <div key={k++} className="rich__table-wrap" tabIndex={0} role="region" aria-label="Example table (scrolls sideways)">
          <table className="rich__table">
            <thead>
              <tr>{cells(head).map((c, n) => <th key={n} scope="col">{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, n) => (
                <tr key={n}>{cells(r).map((c, m) => <td key={m}>{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (/^\s*- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) items.push(lines[i++].replace(/^\s*- /, ''));
      blocks.push(
        <ul key={k++} className="rich__list">
          {items.map((it, n) => <li key={n}>{inline(it)}</li>)}
        </ul>,
      );
    } else if (line.trim() === '') {
      i++;
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('|') && !lines[i].startsWith('```') && !/^\s*- /.test(lines[i]))
        para.push(lines[i++]);
      blocks.push(<p key={k++}>{inline(para.join(' '))}</p>);
    }
  }
  return <div className={`rich ${className}`}>{blocks}</div>;
}
