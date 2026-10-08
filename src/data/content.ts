// Fixed hero and teaser copy, as approved in Numbered Prompts 2–3.
export const heroContent = {
  brand: 'Prompt Smash!',
  display: 'PROMPT SMASH!',
  headline: 'Build better prompts, layer by layer.',
  supporting: 'A good prompt is like a good burger. Every layer has a job.',
  primaryCta: 'Start building',
  /** Restore as a link to the BITE chapter once that chapter exists (see SITE_MAP.md). */
  secondaryCta: 'See how BITE works',
  /** Interim, non-interactive stand-in for secondaryCta. */
  biteNote: {
    lead: 'Final check:',
    name: 'BITE',
    expansion: 'Brief · Information · Taste · Expected result',
  },
  badge: ['7 LAYERS', '1 BETTER PROMPT'],
} as const;

export const teaserContent = {
  headline: 'Your prompt. Seven useful layers.',
  supporting: 'Scroll to open the burger, understand each ingredient and build your prompt.',
} as const;

/** Home-page download of the Prompting Menu PDF (public/downloads). */
export const takeAwayContent = {
  eyebrow: 'Take-away menu',
  headline: 'Keep the complete prompting menu',
  description:
    'Explore the seven-layer method, 24 practical prompting techniques, examples, Pro Tips and responsible-AI checks in one illustrated reference.',
  cta: 'Download the PDF',
  ctaContext: 'Prompt Smash! — The Prompting Menu',
  meta: 'English · 45 pages · PDF',
  file: 'downloads/prompt-smash-prompting-menu.pdf',
} as const;
