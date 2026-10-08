/**
 * Home page: the Hamburger opens layer by layer as the learner scrolls.
 *
 * Structure (one grid cell, three z-levels):
 *   .tour__flow   in normal flow: the real H1 and the intro, which scroll away;
 *   .tour__pin    sticky, one viewport tall: the burger, panel and seven dots;
 *   .tour__track  spacer that gives the sequence its scroll length.
 *
 * Scrolling never runs React: a requestAnimationFrame handler writes CSS
 * custom properties (--sep, --intro) from the section's real position, and
 * React only re-renders when the active layer changes. Geometry is measured
 * from the live layout, so no viewport size is assumed. Reduced motion gets a
 * static hero and a click-through layer explorer instead.
 */
import { useLayoutEffect, useRef, useState, type FocusEvent } from 'react';
import { heroContent } from '../data/content';
import { LAYER_STATUS_LABEL, UNIVERSAL_LAYERS } from '../data/framework';
import { JOURNEYS } from '../app/registry';
import { journeyHash } from '../app/router';
import { useApp } from '../app/state';
import { useMediaQuery } from '../app/useMediaQuery';
import BurgerVisual from './BurgerVisual';
import HeroBadge from './HeroBadge';
import Hero, { HOME_BURGER, HeroDisplay, HeroFooter } from './Hero';
import { Arrow, StatusPill, type Tone } from './common/Common';
import './HomeTour.css';

const J = JOURNEYS[HOME_BURGER];
/** Index after the seventh layer: the tour has resolved. */
const DONE = UNIVERSAL_LAYERS.length;
const STATUS_TONE: Record<string, Tone> = { required: 'attention', recommended: 'info', optional: 'neutral' };
const TOUR_TITLE = '7 layers, 1 better prompt';

const toChoose = () => document.getElementById('choose')?.scrollIntoView({ block: 'start' });
const activeKey = (i: number) => (i >= 0 && i < DONE ? UNIVERSAL_LAYERS[i].key : undefined);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function Home() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return reduced ? (
    <>
      <Hero />
      <LayerExplorer />
    </>
  ) : (
    <HeroTour />
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

/** One card per layer plus a closing card; only the active one is visible or reachable. */
function TourPanels({ active, level, onChoose }: { active: number; level: 'h2' | 'h3'; onChoose: () => void }) {
  const { mode } = useApp();
  const Heading = level;
  const shown = Math.max(0, active);
  return (
    <div className="tour-panel">
      {J.layers.map((layer, i) => {
        const u = UNIVERSAL_LAYERS[i];
        const on = i === shown;
        return (
          <article key={u.key} className="tour-panel__card" data-on={on || undefined} inert={!on} aria-hidden={on ? undefined : true}>
            <p className="tour-panel__eyebrow">
              Layer {u.order} of 7 · {layer.ingredientName}
            </p>
            <div className="tour-panel__head">
              <Heading className="tour-panel__title">{u.label}</Heading>
              <StatusPill tone={STATUS_TONE[u.status]}>{LAYER_STATUS_LABEL[u.status]}</StatusPill>
            </div>
            <p className="tour-panel__text">{layer.simple.definition}</p>
            <p className="tour-panel__metaphor">{layer.metaphorLink}</p>
            {mode === 'pro' && (
              <p className="tour-panel__pro">
                <span className="pro-add__tag">Pro</span> Professional term: {layer.pro.professionalTerm}
              </p>
            )}
            <a className="btn btn--primary" href={journeyHash(HOME_BURGER, 'build', u.key)}>
              Build this layer
              <span className="visually-hidden">
                : {u.label}, in the {J.burgerName} journey
              </span>
              <Arrow />
            </a>
          </article>
        );
      })}
      <article
        className="tour-panel__card tour-panel__card--done"
        data-on={shown === DONE || undefined}
        inert={shown !== DONE}
        aria-hidden={shown === DONE ? undefined : true}
      >
        <p className="tour-panel__eyebrow">All seven layers</p>
        <Heading className="tour-panel__title">{TOUR_TITLE}</Heading>
        <p className="tour-panel__text">{heroContent.supporting}</p>
        <div className="tour-panel__actions">
          <a className="btn btn--primary" href={journeyHash(HOME_BURGER)}>
            {heroContent.primaryCta}
            <span className="visually-hidden"> with the {J.burgerName}</span>
            <Arrow />
          </a>
          <button type="button" className="btn btn--ghost" onClick={onChoose}>
            Choose your burger
          </button>
        </div>
      </article>
    </div>
  );
}

/** Seven steps: a vertical dot rail on wide screens, a numbered row on small ones. */
function TourDots({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <nav className="tour-dots" aria-label="Burger layers">
      <ol className="tour-dots__list">
        {UNIVERSAL_LAYERS.map((u, i) => {
          const state = i === active ? 'current' : i < active ? 'passed' : 'upcoming';
          return (
            <li key={u.key}>
              <button
                type="button"
                className="tour-dots__btn"
                data-state={state}
                data-index={i}
                aria-current={state === 'current' ? 'step' : undefined}
                onClick={() => onSelect(i)}
              >
                <span className="tour-dots__mark" aria-hidden="true">
                  {state === 'passed' ? (
                    <svg viewBox="0 0 16 16">
                      <path d="M3.5 8.5 6.5 11.5 12.5 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    u.order
                  )}
                </span>
                <span className="tour-dots__label">{u.label}</span>
                <span className="visually-hidden">
                  : layer {u.order} of 7, {J.layers[i].ingredientName}
                  {state === 'passed' ? ', seen' : ''}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll tour                                                         */
/* ------------------------------------------------------------------ */

function HeroTour() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const nav = useRef({ toLayer: (_i: number) => {}, toEnd: () => {} });

  useLayoutEffect(() => {
    const el = root.current!;
    const q = (s: string) => el.querySelector<HTMLElement>(s)!;
    const flow = q('.tour__flow');
    const footer = q('.tour__flow .hero__footer');
    const pin = q('.tour__pin');
    const track = q('.tour__track');
    const box = q('.tour__burger');
    const slot = q('.tour__slot');
    const stack = q('.tour__burger .burger__stack');
    const ings = Array.from(stack.querySelectorAll<HTMLElement>('.burger__ing'));
    // Matches the CSS: side-by-side layout (with room for side labels) vs the stacked one
    const wide = window.matchMedia('(min-width: 64rem), (min-width: 48rem) and (orientation: landscape)');
    // Scroll positions (document px) where each phase starts
    const g = { sepStart: 0, sepEnd: 1, focusStart: 0, unit: 1, end: 0, vh: 1, footBottom: 0 };
    let current = -1;
    let raf = 0;

    /** Layout offset of a node inside an ancestor, ignoring transforms. */
    const within = (node: HTMLElement, anc: HTMLElement) => {
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = node;
      while (n && n !== anc) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };

    const measure = () => {
      const vh = pin.clientHeight;
      const sy = window.scrollY;
      const secTop = el.getBoundingClientRect().top + sy;
      g.vh = vh;
      g.footBottom = footer.getBoundingClientRect().bottom + sy;
      // Separation starts once the intro has mostly scrolled past
      g.sepStart = Math.max(secTop + 0.1 * vh, g.footBottom - 0.75 * vh);
      g.sepEnd = g.sepStart + 0.7 * vh;
      g.unit = Math.max(0.5 * vh, 280);
      g.focusStart = g.sepEnd - 0.2 * vh;
      g.end = g.focusStart + DONE * g.unit + 0.6 * vh;
      // The pin is released (and the next section rises) exactly at g.end
      const rowA = Math.max(flow.offsetHeight, vh);
      track.style.height = `${Math.max(0, Math.round(g.end + vh - secTop - rowA))}px`;

      // Fit the separated burger into the slot: a gentle enlargement where there is room
      const w = box.offsetWidth;
      const assembledH = stack.offsetHeight;
      const tops = ings.map((e) => e.offsetTop);
      const heights = ings.map((e, i) => e.offsetHeight * (i === ings.length - 1 ? 0.7 : 1)); // wrapper flattens
      const sum = heights.reduce((a, b) => a + b, 0);
      const sw = slot.offsetWidth;
      const sh = slot.offsetHeight;
      // Side labels need about 16rem beside the burger; where that would shrink the
      // burger, they are hidden (the panel already names the layer).
      const fullRoom = 14 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const labels = wide.matches && sw - fullRoom >= 0.95 * w * 1.1;
      const labelRoom = labels ? fullRoom : 0;
      el.dataset.labels = labels ? 'on' : 'off';
      const avail = sh * 0.94;
      // A visible but gentle enlargement: more where the slot allows it
      const target = wide.matches ? 1.18 : 1.08;
      const gap = Math.min(0.11 * w, Math.max(0.03 * w, (avail / target - sum) / 6));
      const sepH = sum + 6 * gap;
      const scale = Math.max(0.5, Math.min(target, avail / sepH, (sw - labelRoom) / (w * 1.1)));
      let y = (assembledH - sepH) / 2;
      ings.forEach((e, i) => {
        e.style.setProperty('--d', `${(y - tops[i]).toFixed(1)}px`);
        y += heights[i] + gap;
      });
      const b = within(box, pin);
      const s = within(slot, pin);
      el.style.setProperty('--dx', `${(s.x + (sw - labelRoom) / 2 - (b.x + w / 2)).toFixed(1)}px`);
      el.style.setProperty('--dy', `${(s.y + sh / 2 - (b.y + box.offsetHeight / 2)).toFixed(1)}px`);
      el.style.setProperty('--s', scale.toFixed(3));
      el.style.setProperty('--shadow-d', `${((sepH - assembledH) / 2).toFixed(1)}px`);
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const p = clamp01((y - g.sepStart) / (g.sepEnd - g.sepStart));
      const sep = p * p * (3 - 2 * p);
      const intro = clamp01((g.footBottom - y - 0.4 * g.vh) / (0.3 * g.vh));
      el.style.setProperty('--sep', sep.toFixed(4));
      el.style.setProperty('--intro', intro.toFixed(3));
      el.dataset.intro = intro < 0.02 ? 'hidden' : 'shown';
      el.dataset.phase = sep >= 0.6 ? 'tour' : 'opening';
      const a = y >= g.focusStart ? Math.min(DONE, Math.floor((y - g.focusStart) / g.unit)) : -1;
      if (a !== current) {
        current = a;
        setActive(a);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    nav.current.toLayer = (i) => window.scrollTo({ top: g.focusStart + (i + 0.5) * g.unit });
    nav.current.toEnd = () => window.scrollTo({ top: g.end - 0.3 * g.vh });

    measure();
    update();
    const ro = new ResizeObserver(remeasure);
    ro.observe(flow);
    ro.observe(slot);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    document.fonts?.ready.then(remeasure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
    };
  }, []);

  // Keyboard users who tab into the tour while the intro is showing are taken to that step.
  const onFocusIn = (e: FocusEvent<HTMLElement>) => {
    if (root.current?.dataset.phase === 'tour') return;
    const dot = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
    nav.current.toLayer(dot ? Number(dot.dataset.index) : 0);
  };

  return (
    <section ref={root} className="tour" id="top" aria-labelledby="hero-title" data-phase="opening">
      <div className="tour__flow">
        <div className="hero__stage">
          <HeroDisplay />
          {/* Reserves the burger's space so the intro sits exactly where it would without the pin */}
          <div className="hero__burger tour__placeholder" aria-hidden="true">
            <BurgerVisual journey={HOME_BURGER} variant="card" />
          </div>
        </div>
        <HeroFooter cueHint="to open the burger, layer by layer" onCue={() => nav.current.toLayer(0)} />
      </div>

      <div className="tour__pin">
        <div className="tour__stagebox">
          <div className="hero__stage">
            <HeroDisplay ghost />
            <div className="hero__burger tour__burger">
              <BurgerVisual journey={HOME_BURGER} variant="tour" activeLayer={activeKey(active)} />
              <div className="hero__badge">
                <HeroBadge />
              </div>
            </div>
          </div>
        </div>

        <div className="tour__layout" onFocus={onFocusIn}>
          <div className="tour__slot" />
          <TourDots active={active} onSelect={(i) => nav.current.toLayer(i)} />
          <div className="tour__side">
            <TourPanels active={active} level="h2" onChoose={toChoose} />
          </div>
          <button type="button" className="tour__skip" onClick={toChoose}>
            Skip to the burger choice
          </button>
        </div>
      </div>

      <div className="tour__track" aria-hidden="true" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced motion: a stable, separated burger and a step selector      */
/* ------------------------------------------------------------------ */

function LayerExplorer() {
  const [active, setActive] = useState(0);
  return (
    <section className="explorer" id="layers" aria-labelledby="explorer-title">
      <div className="explorer__inner">
        <h2 id="explorer-title" className="explorer__title">
          {TOUR_TITLE}
        </h2>
        <div className="explorer__grid">
          <div className="explorer__burger">
            <BurgerVisual journey={HOME_BURGER} variant="tour" className="burger--static" activeLayer={activeKey(active)} />
          </div>
          <TourDots active={active} onSelect={setActive} />
          <div className="tour__side">
            <TourPanels active={active} level="h3" onChoose={toChoose} />
          </div>
        </div>
      </div>
    </section>
  );
}
