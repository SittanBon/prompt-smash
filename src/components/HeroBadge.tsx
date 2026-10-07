import { heroContent } from '../data/content';
import './HeroBadge.css';

export default function HeroBadge() {
  const [top, bottom] = heroContent.badge;
  return (
    <p className="hero-badge">
      <span className="hero-badge__top">{top}</span>
      <span className="visually-hidden">, </span>
      <span className="hero-badge__rule" aria-hidden="true" />
      <span className="hero-badge__bottom">{bottom}</span>
    </p>
  );
}
