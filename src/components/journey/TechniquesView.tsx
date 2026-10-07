import type { JourneyId, TechniqueCard, TechniqueRef } from '../../data/schema';
import { crispyChicken } from '../../data/journeys/crispyChicken';
import { JOURNEYS } from '../../app/registry';
import { chapterHash, journeyHash } from '../../app/router';
import { Disclosure, ModeText, PageTitle, ProOnly } from '../common/Common';
import { NextStep } from './JourneyPage';

export function BridgeCard({ t }: { t: TechniqueRef }) {
  return (
    <li className="tcard">
      <h3 className="tcard__name">{t.name}</h3>
      <p className="tcard__def">{t.definition}</p>
      <dl className="tcard__facts">
        <div>
          <dt>Use it when</dt>
          <dd>
            <ModeText text={t.whenToUse} as="div" />
          </dd>
        </div>
        <div>
          <dt>Example</dt>
          <dd>{t.burgerExample}</dd>
        </div>
        <div>
          <dt>Limitation</dt>
          <dd>{t.limitation}</dd>
        </div>
      </dl>
    </li>
  );
}

export function LabCard({ t, n }: { t: TechniqueCard; n: number }) {
  return (
    <li className="tcard tcard--lab" id={`technique-${t.id}`}>
      <p className="tcard__num" aria-hidden="true">
        {String(n).padStart(2, '0')}
      </p>
      <h3 className="tcard__name">{t.name}</h3>
      <p className="tcard__def">
        {t.definition}
        <ProOnly>
          {' '}
          <span className="pro-add">
            <span className="pro-add__tag">Pro</span> {t.definitionProAddition}
          </span>
        </ProOnly>
      </p>
      <Disclosure summary={<>More detail<span className="visually-hidden">: {t.name}</span></>}>
        <dl className="tcard__facts">
          <div>
            <dt>Use it when</dt>
            <dd>
              <ModeText text={t.whenToUse} as="div" />
            </dd>
          </div>
          <div>
            <dt>Example</dt>
            <dd>{t.burgerExample}</dd>
          </div>
          <div>
            <dt>Limitation</dt>
            <dd>{t.limitation}</dd>
          </div>
          <div>
            <dt>Cost and effort</dt>
            <dd>{t.costOrEffort}</dd>
          </div>
          <div>
            <dt>Not needed when</dt>
            <dd>{t.notNeededWhen}</dd>
          </div>
          <div>
            <dt>In the Crispy Chicken project</dt>
            <dd>{t.anchorLink}</dd>
          </div>
          {t.steps && (
            <div>
              <dt>Steps</dt>
              <dd>
                <ol className="steps-list">
                  {t.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </dd>
            </div>
          )}
        </dl>
      </Disclosure>
    </li>
  );
}

/** The complete eight-card Technique Lab (content lives in the Crispy Chicken pack). */
export function TechniqueLabCards() {
  const lab = crispyChicken.techniqueLab!;
  return (
    <section className="lab" aria-labelledby="lab-title">
      <h2 id="lab-title" className="section-title">
        Technique Lab
      </h2>
      <ModeText text={lab.intro} className="lab__intro" />
      <p className="lab__principle">
        <strong>{lab.principle}</strong>
      </p>
      <ol className="tgrid tgrid--lab">
        {lab.techniques.map((t, i) => (
          <LabCard key={t.id} t={t} n={i + 1} />
        ))}
      </ol>
    </section>
  );
}

export default function TechniquesView({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const b = j.techniqueBridge;
  const isLab = Boolean(j.techniqueLab);
  return (
    <div className="step-page">
      <PageTitle eyebrow={`${j.burgerName} · Techniques`} lead={b.intro}>
        {isLab ? 'Choose the smallest technique that works' : 'Ways to get more from your prompt'}
      </PageTitle>

      <section aria-labelledby="bridge-title">
        <h2 id="bridge-title" className="section-title">
          {isLab ? 'Three to try first' : 'Recommended for this burger'}
        </h2>
        <ul className="tgrid">
          {b.techniques.map((t) => (
            <BridgeCard key={t.id} t={t} />
          ))}
        </ul>
      </section>

      {isLab ? (
        <TechniqueLabCards />
      ) : (
        <p className="callout">
          {b.deeperLearning}{' '}
          <a href={chapterHash('technique-lab')}>Open the full Technique Lab</a>
          {journey !== 'crispy-chicken' && (
            <>
              {' '}
              or <a href={journeyHash('crispy-chicken')}>start the Crispy Chicken journey</a>
            </>
          )}
          .
        </p>
      )}

      <NextStep journey={journey} from="techniques" label={j.evaluation ? undefined : b.continueLabel} />
    </div>
  );
}
