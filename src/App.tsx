import { useState } from 'react';
import SiteNav, { type LearningMode } from './components/SiteNav';
import Hero from './components/Hero';
import JourneyTeaser from './components/JourneyTeaser';

export default function App() {
  const [mode, setMode] = useState<LearningMode>('simple');

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav mode={mode} onModeChange={setMode} />
      <main id="main">
        <Hero />
        <JourneyTeaser />
      </main>
    </>
  );
}
