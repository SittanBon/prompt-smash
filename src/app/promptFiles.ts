/** Copy and download, entirely in the browser. Nothing is uploaded. */
import type { AssembledPrompt } from '../data/promptAssembly';
import type { JourneyId } from '../data/schema';

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Markdown keeps the same sections, with each label as a heading. */
export function toMarkdown(p: AssembledPrompt): string {
  return p.sections.map((s) => `## ${s.label}\n\n${s.body}`).join('\n\n') + '\n';
}

export function promptFilename(journey: JourneyId, ext: 'txt' | 'md') {
  return `prompt-smash-${journey}-prompt.${ext}`;
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Fills {{placeholders}}. A learner's reason sits inside “…”., so its own final full stop is dropped. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (m, k: string) => {
    const v = values[k];
    if (v === undefined) return m;
    return k === 'reason' ? v.trim().replace(/[.!]+$/, '') : v;
  });
