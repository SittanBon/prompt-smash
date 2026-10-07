/** Crispy Chicken's evaluation plan: criteria, test cases and the version history. */
import type { IterationStep, JourneyContent, JourneyId } from '../../data/schema';
import { CHECK_TYPE_LABEL, EVALUATION_MICROCOPY, EVALUATION_SCALE, UNIVERSAL_LAYERS } from '../../data/framework';
import { assemblePrompt, type PromptAnswers } from '../../data/promptAssembly';
import { JOURNEYS } from '../../app/registry';
import { Disclosure, PageTitle, ProOnly } from '../common/Common';
import { NextStep } from './JourneyPage';

const label = (k: string) => UNIVERSAL_LAYERS.find((l) => l.key === k)?.label ?? k;

/** Rebuilds a version's prompt with the real assembler (same rule as the content scripts). */
function versionPrompt(j: JourneyContent, it: IterationStep): string {
  if (it.promptText) return it.promptText;
  const answers: PromptAnswers = {};
  for (const l of j.layers) {
    const o = it.layerOverrides?.[l.key];
    answers[l.key] = o === null ? { state: 'empty' } : { state: 'filled', text: o ?? l.answerField.exampleAnswer };
  }
  return assemblePrompt(j.layers, answers).text;
}

export default function TestingView({ journey }: { journey: JourneyId }) {
  const j = JOURNEYS[journey];
  const ev = j.evaluation;
  if (!ev) return null;
  return (
    <div className="step-page">
      <PageTitle eyebrow={`${j.burgerName} · Test and improve`} lead={ev.intro.simple}>
        Test before you trust
      </PageTitle>
      <ProOnly>
        <p className="lead-pro">
          <span className="pro-add__tag">Pro</span> {ev.intro.proAddition}
        </p>
      </ProOnly>

      <p className="callout">
        {EVALUATION_MICROCOPY.noCriteria} {EVALUATION_MICROCOPY.changeOneThing}
      </p>

      <section aria-labelledby="criteria-title">
        <h2 id="criteria-title" className="section-title">
          What “good” means: {ev.criteria.length} criteria
        </h2>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Evaluation criteria (scrolls sideways)">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Criterion</th>
                <th scope="col">What it checks</th>
                <th scope="col">Meets when</th>
                <th scope="col">How it is checked</th>
              </tr>
            </thead>
            <tbody>
              {ev.criteria.map((c) => (
                <tr key={c.id}>
                  <th scope="row">{c.name}</th>
                  <td>{c.description}</td>
                  <td>{c.passSignal}</td>
                  <td>{CHECK_TYPE_LABEL[c.checkType]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="sub-title">Rating scale</h3>
        <dl className="layer-notes">
          {EVALUATION_SCALE.map((s) => (
            <div key={s.key}>
              <dt>{s.label}</dt>
              <dd>{s.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="cases-title">
        <h2 id="cases-title" className="section-title">
          {ev.testCases.length} test cases, realistic and awkward
        </h2>
        <ul className="case-list">
          {ev.testCases.map((t) => (
            <li key={t.id}>
              <Disclosure
                summary={
                  <>
                    <span className="case-list__id">{t.id}</span> {t.scenario}
                  </>
                }
              >
                <dl className="layer-notes">
                  <div>
                    <dt>Input</dt>
                    <dd>{t.input}</dd>
                  </div>
                  <div>
                    <dt>What to check</dt>
                    <dd>{t.whatToCheck}</dd>
                  </div>
                  <div>
                    <dt>Criteria</dt>
                    <dd>{t.criterionIds.map((id) => ev.criteria.find((c) => c.id === id)?.name ?? id).join(', ')}</dd>
                  </div>
                </dl>
              </Disclosure>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="versions-title">
        <h2 id="versions-title" className="section-title">
          Version history
        </h2>
        <p className="illustrative">{EVALUATION_MICROCOPY.illustrativeLabel}</p>
        <ol className="versions">
          {ev.iterations.map((it) => (
            <li key={it.version} className="version">
              <p className="version__tag">{it.version}</p>
              <div className="version__body">
                <p className="version__change">{it.promptChange}</p>
                {it.changedLayers.length > 0 && (
                  <p className="version__layers">Changed: {it.changedLayers.map(label).join(', ')}</p>
                )}
                <dl className="layer-notes">
                  <div>
                    <dt>Why</dt>
                    <dd>{it.why}</dd>
                  </div>
                  <div>
                    <dt>Failure addressed</dt>
                    <dd>{it.failureAddressed}</dd>
                  </div>
                  <div>
                    <dt>Illustrative result</dt>
                    <dd>
                      {it.illustrativeResult}{' '}
                      <em className="illustrative">
                        ({it.evidence === 'observed-in-illustrative-test' ? 'seen in an illustrative test run' : 'described, not run'})
                      </em>
                    </dd>
                  </div>
                  <div>
                    <dt>Still uncertain</dt>
                    <dd>{it.remainingUncertainty}</dd>
                  </div>
                </dl>
                <Disclosure summary={<>Show the {it.version} prompt</>}>
                  <pre className="prompt-block prompt-block--long" tabIndex={0}>
                    {versionPrompt(j, it)}
                  </pre>
                </Disclosure>
              </div>
            </li>
          ))}
        </ol>
        <p className="callout">{EVALUATION_MICROCOPY.oneRunReminder}</p>
      </section>

      <NextStep journey={journey} from="testing" label={j.techniqueBridge.continueLabel} />
    </div>
  );
}
