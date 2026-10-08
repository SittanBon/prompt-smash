/** Every shared chapter, rendered from sharedContent.ts. Pro text follows Simple text. */
import type { ReactNode } from 'react';
import type { SharedSection } from '../../data/sharedSchema';
import { sharedContent } from '../../data/sharedContent';
import { BITE, SAFETY_CHECKS, UNIVERSAL_LAYERS } from '../../data/framework';
import { JOURNEYS, JOURNEY_ORDER } from '../../app/registry';
import { chapterHash, journeyHash, type ChapterId } from '../../app/router';
import { useApp } from '../../app/state';
import { Disclosure, ModeText, PageTitle, ProOnly, StatusPill } from '../common/Common';
import { TechniqueLabCards } from '../journey/TechniquesView';
import { SaveControls } from '../journey/LivePrompt';
import './handbook.css';

const sc = sharedContent;

function Sections({ list }: { list: SharedSection[] }) {
  return (
    <>
      {list.map((s) => (
        <section key={s.heading} className="hb-section">
          <h2 className="hb-section__title">{s.heading}</h2>
          <ModeText text={s.body} />
        </section>
      ))}
    </>
  );
}

function Welcome() {
  const w = sc.welcome;
  return (
    <>
      <PageTitle eyebrow="Handbook" lead={w.lead}>
        {w.title}
      </PageTitle>
      <Sections list={w.sections} />
      <section className="hb-section">
        <h2 className="hb-section__title">{w.demo.heading}</h2>
        <div className="compare">
          <div className="compare__col compare__col--weak">
            <p className="compare__label">✕ Rough</p>
            <pre className="prompt-block">{w.demo.weak}</pre>
          </div>
          <div className="compare__col compare__col--better">
            <p className="compare__label">✓ Better</p>
            <pre className="prompt-block">{w.demo.better}</pre>
          </div>
        </div>
        <ul className="ticks">
          {w.demo.whatChanged.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      <section className="hb-section">
        <h2 className="hb-section__title">{w.selectHeading}</h2>
        <p>{w.selectHelp}</p>
        <ul className="hb-journeys">
          {w.selectorCards.map((c) => (
            <li key={c.journeyId}>
              <a href={journeyHash(c.journeyId)} className="hb-journeys__link">
                <strong>{c.burgerName}</strong> <span>{c.discipline}</span>
                <span className="hb-journeys__best">{c.bestForLine}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function BiteChapter() {
  const b = sc.bite;
  return (
    <>
      <PageTitle eyebrow="Handbook" lead={b.intro.simple}>
        {b.title}
      </PageTitle>
      <ProOnly>
        <p className="lead-pro">
          <span className="pro-add__tag">Pro</span> {b.intro.proAddition}
        </p>
      </ProOnly>
      <ol className="hb-bite">
        {BITE.map((x) => (
          <li key={x.key} className="hb-bite__item">
            <span className="bite-letter bite-letter--large" aria-hidden="true">
              {x.letter}
            </span>
            <div>
              <h2 className="hb-section__title">
                {x.name}: {x.question}
              </h2>
              <ModeText text={b.letters[x.key].explanation} />
              <p className="hb-example">
                <span className="mini-title">Example</span> {b.letters[x.key].tinyExample}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <Sections list={[b.passVersusAttention, b.tasteNotNeeded, b.notCorrectOrSafe, b.layerConnection]} />
      <p className="callout">
        Try BITE on your own prompt at the end of any journey, for example the{' '}
        <a href={journeyHash('hamburger', 'bite')}>Hamburger BITE review</a>.
      </p>
    </>
  );
}

function ResponsibleAiChapter() {
  const r = sc.responsibleAi;
  return (
    <>
      <PageTitle eyebrow="Handbook" lead={r.intro.simple}>
        {r.title}
      </PageTitle>
      <ProOnly>
        <p className="lead-pro">
          <span className="pro-add__tag">Pro</span> {r.intro.proAddition}
        </p>
      </ProOnly>
      <Sections list={[r.reviewStates]} />
      {SAFETY_CHECKS.map((s) => {
        const c = r.checks[s.key];
        return (
          <section key={s.key} className="hb-section hb-check">
            <h2 className="hb-section__title">
              {s.name}: {s.question}
            </h2>
            <p>{c.simpleDefinition}</p>
            <ProOnly>
              <p>
                <span className="pro-add__tag">Pro</span> {c.proExplanation}
              </p>
            </ProOnly>
            <dl className="safety__facts">
              <div>
                <dt>Warning signs</dt>
                <dd>
                  <ul className="bullets">
                    {c.warningSigns.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Corrective action</dt>
                <dd>{c.correctiveAction}</dd>
              </div>
            </dl>
            <div className="levels">
              <div className="levels__col">
                <p className="mini-title">In the prompt</p>
                <p>{c.promptLevelControl}</p>
              </div>
              <div className="levels__col">
                <p className="mini-title">In the workflow or system</p>
                <p>{c.workflowLevelControl}</p>
              </div>
            </div>
            <Disclosure summary="When is “Not relevant” a fair answer?">
              <p>{c.notRelevantWhen}</p>
              <p>
                <span className="mini-title">Example reason</span> {c.notRelevantExample}
              </p>
            </Disclosure>
          </section>
        );
      })}
      <Sections list={[r.promptVersusWorkflow, r.whyNotSwitchedOff]} />
      <p className="callout">{r.disclaimer}</p>
    </>
  );
}

function CaseStudy() {
  const cs = sc.caseStudy;
  return (
    <>
      <PageTitle eyebrow="Case study" lead={cs.subtitle}>
        {cs.title}
      </PageTitle>
      <p className="callout callout--notice">
        <StatusPill tone="info">Instructional reconstruction</StatusPill> {cs.reconstructionNotice}
      </p>
      <ol className="hb-steps">
        {cs.steps.map((s) => (
          <li key={s.heading} className="hb-steps__item">
            <h2 className="hb-section__title">{s.heading}</h2>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <section className="hb-section">
        <h2 className="hb-section__title">The prompt structure, reconstructed</h2>
        <p className="illustrative">
          <strong>{cs.promptReconstruction.label}.</strong> {cs.promptReconstruction.note}
        </p>
        <dl className="layer-notes layer-notes--pre">
          {UNIVERSAL_LAYERS.map((l) => (
            <div key={l.key}>
              <dt>{l.label}</dt>
              <dd>{cs.promptReconstruction.layers[l.key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="levels levels--case">
        <section className="levels__col">
          <h2 className="hb-section__title">Implemented in the project</h2>
          <ul className="ticks">
            {cs.implementedInProject.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="levels__col">
          <h2 className="hb-section__title">{cs.futureAgenticControls.heading}</h2>
          <p className="illustrative">Not implemented in the project. These are proposals for a future agentic workflow.</p>
          <ul className="bullets">
            {cs.futureAgenticControls.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
      <p className="callout">{cs.attribution}</p>
    </>
  );
}

function Glossary() {
  const { mode } = useApp();
  return (
    <>
      <PageTitle eyebrow="Handbook" lead="Plain-language definitions of the terms used in this handbook.">
        Glossary
      </PageTitle>
      <dl className="glossary">
        {sc.glossary.map((g) => (
          <div key={g.term} className="glossary__item">
            <dt>{g.term}</dt>
            <dd>
              {g.simple}
              {mode === 'pro' && (
                <>
                  {' '}
                  <span className="pro-add">
                    <span className="pro-add__tag">Pro</span> {g.pro}
                  </span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function Info({ page, extra }: { page: typeof sc.about; extra?: ReactNode }) {
  return (
    <>
      <PageTitle eyebrow="Handbook" lead={page.intro}>
        {page.title}
      </PageTitle>
      <Sections list={page.sections} />
      {extra}
    </>
  );
}

function Accessibility() {
  const a = sc.accessibility;
  const allBuilt = a.features.every((f) => f.implemented);
  return (
    <>
      <PageTitle eyebrow="Handbook" lead={a.intro}>
        {a.title}
      </PageTitle>
      {!allBuilt && <p className="callout">{a.plannedNote}</p>}
      <dl className="glossary">
        {a.features.map((f) => (
          <div key={f.name} className="glossary__item">
            <dt>{f.name}</dt>
            <dd>
              {f.implemented ? f.current : f.planned}
              {!f.implemented && (
                <>
                  {' '}
                  <StatusPill tone="neutral">Planned</StatusPill>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {a.contact && <p className="callout">{a.contact}</p>}
    </>
  );
}

function Disclaimer() {
  const d = sc.disclaimer;
  return (
    <>
      <PageTitle eyebrow="Handbook">{d.title}</PageTitle>
      <ul className="bullets bullets--large">
        {d.points.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </>
  );
}

function TechniqueLabChapter() {
  return (
    <>
      <PageTitle eyebrow="Handbook" lead="All eight techniques from the Crispy Chicken Burger — Prompt Engineering journey, with examples from its customer-feedback project.">
        Technique Lab
      </PageTitle>
      <TechniqueLabCards />
      <p className="callout">
        See the techniques used and tested in context in the <a href={journeyHash('crispy-chicken', 'techniques')}>Crispy Chicken journey</a>.
      </p>
    </>
  );
}

export default function SharedHandbook({ chapter }: { chapter: ChapterId }) {
  return (
    <div className="handbook">
      <article className="handbook__body">
        {chapter === 'welcome' && <Welcome />}
        {chapter === 'technique-lab' && <TechniqueLabChapter />}
        {chapter === 'bite' && <BiteChapter />}
        {chapter === 'responsible-ai' && <ResponsibleAiChapter />}
        {chapter === 'case-study' && <CaseStudy />}
        {chapter === 'glossary' && <Glossary />}
        {chapter === 'about' && <Info page={sc.about} />}
        {chapter === 'privacy' && <Info page={sc.privacy} extra={<SaveControls />} />}
        {chapter === 'accessibility' && <Accessibility />}
        {chapter === 'disclaimer' && <Disclaimer />}
      </article>
      <nav className="handbook__next" aria-label="Start a journey">
        <p className="mini-title">Start a journey</p>
        <ul className="chips chips--links">
          {JOURNEY_ORDER.map((id) => (
            <li key={id}>
              <a href={journeyHash(id)}>{JOURNEYS[id].burgerName}</a>
            </li>
          ))}
        </ul>
        <p>
          <a href={chapterHash('glossary')}>Glossary</a>
        </p>
      </nav>
    </div>
  );
}
