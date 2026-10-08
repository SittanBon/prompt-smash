import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { sharedContent } from './data/sharedContent';
import { UNIVERSAL_LAYERS } from './data/framework';
import { AppProvider, useApp } from './app/state';
import { JOURNEYS, stepsFor } from './app/registry';
import { journeyHash, routeKey, useRoute, type Route } from './app/router';
import SiteNav, { HANDBOOK_LINKS } from './components/SiteNav';
import Home from './components/HomeTour';
import JourneySelector from './components/JourneySelector';
import JourneyPage from './components/journey/JourneyPage';
import SharedHandbook from './components/handbook/SharedHandbook';
import SiteFooter from './components/SiteFooter';
import { PageTitle } from './components/common/Common';
import './components/common/common.css';

function pageTitle(r: Route): string {
  const site = 'Prompt Smash!';
  if (r.name === 'journey') {
    const j = JOURNEYS[r.journey];
    const step =
      r.view === 'build'
        ? UNIVERSAL_LAYERS.find((l) => l.key === r.layer)!.label
        : (stepsFor(j).find((s) => s.view === r.view)?.label ?? '');
    return `${step} — ${j.burgerName} · ${site}`;
  }
  if (r.name === 'chapter') return `${HANDBOOK_LINKS.find((l) => l.chapter === r.chapter)?.label ?? ''} · ${site}`;
  if (r.name === 'home') return site;
  return `Link not found · ${site}`;
}

function ErrorState({ heading, body, action, href }: { heading: string; body: string; action: string; href: string }) {
  return (
    <div className="error-state">
      <PageTitle eyebrow={sharedContent.globalMicrocopy.invalidSharedLink}>{heading}</PageTitle>
      <p>{body}</p>
      <p>
        <a className="btn btn--primary" href={href}>
          {action}
        </a>
      </p>
    </div>
  );
}

function Shell() {
  const route = useRoute();
  const { lastJourney, setLastJourney, announcement } = useApp();
  const routeJourney = route.name === 'journey' || route.name === 'invalid-layer' ? route.journey : null;
  const navJourney = routeJourney ?? lastJourney;
  const e = sharedContent.footerAndErrors;

  useEffect(() => {
    if (route.name === 'journey') setLastJourney(route.journey);
  }, [route, setLastJourney]);

  // After navigation: new title, top of page, focus on the new heading.
  const key = routeKey(route);
  // Remembers the previous page, so the first render (and React's development
  // double-run of effects) never moves focus.
  const prevKey = useRef(key);
  useEffect(() => {
    document.title = pageTitle(route);
    if (prevKey.current === key) return;
    prevKey.current = key;
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('[data-route-focus]')?.focus({ preventScroll: true });
  }, [key]);

  const skip = (ev: MouseEvent) => {
    ev.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  };

  return (
    <>
      <a className="skip-link" href="#main" onClick={skip}>
        Skip to content
      </a>
      <SiteNav journey={navJourney} chapter={route.name === 'chapter' ? route.chapter : undefined} />
      <main id="main" tabIndex={-1} className={`main main--${route.name}`}>
        {route.name === 'home' && (
          <>
            <Home />
            <JourneySelector />
          </>
        )}
        {route.name === 'journey' && (
          <JourneyPage journey={route.journey} view={route.view} layer={route.view === 'build' ? route.layer : undefined} />
        )}
        {route.name === 'chapter' && <SharedHandbook chapter={route.chapter} />}
        {route.name === 'invalid-journey' && <ErrorState {...e.invalidJourney} href="#/" />}
        {route.name === 'invalid-layer' && <ErrorState {...e.invalidLayer} href={journeyHash(route.journey, 'build', 'goal')} />}
        {route.name === 'not-found' && <ErrorState {...e.notFound} href="#/" />}
      </main>
      <SiteFooter />
      <div className="visually-hidden" role="status" aria-live="polite">
        <span key={announcement.id}>{announcement.text}</span>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
