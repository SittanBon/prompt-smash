import { sharedContent } from '../data/sharedContent';
import { JOURNEYS, JOURNEY_ORDER } from '../app/registry';
import { journeyHash } from '../app/router';
import './SiteFooter.css';

export default function SiteFooter() {
  const f = sharedContent.footerAndErrors.footer;
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav aria-label="Journeys" className="site-footer__col">
          <p className="site-footer__title">Journeys</p>
          <ul>
            {JOURNEY_ORDER.map((id) => (
              <li key={id}>
                <a href={journeyHash(id)}>
                  {JOURNEYS[id].burgerName} — {JOURNEYS[id].discipline}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Handbook" className="site-footer__col">
          <p className="site-footer__title">Handbook</p>
          <ul className="site-footer__links">
            <li>
              <a href="#/welcome">Welcome</a>
            </li>
            {f.navigation.map((n) => (
              <li key={n.route}>
                <a href={n.route}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-footer__col site-footer__about">
          <p className="site-footer__brand">Prompt Smash!</p>
          <p>{f.disclaimerNote}</p>
          <p>{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
