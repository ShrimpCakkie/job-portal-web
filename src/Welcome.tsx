import type { CSSProperties } from 'react';
import { Asset } from './ui';
import { boardHref, initialView } from './navigation';

type Brand = {
  name: string;
  logo: string;
  x: number;
  y: number;
  angle: number;
  size?: number;
  color?: string;
};

// Centers and rotations of the decorative brand badges in the mobile design.
const brands: readonly Brand[] = [
  { name: 'Netflix', logo: 'netflix-hero.svg', x: 48.6, y: 424.8, angle: -7.16, size: 23.336 },
  { name: 'Amazon', logo: 'amazon-hero.svg', x: 232.3, y: 434.1, angle: 6.19 },
  { name: 'Spotify', logo: 'spotify-hero.svg', x: 387.3, y: 398.3, angle: -57.29, color: '#00d95f' },
  { name: 'LinkedIn', logo: 'linkedin-hero.svg', x: 265.6, y: 340.5, angle: 35.5 },
  { name: 'Bank of America', logo: 'bank-of-america-hero.svg', x: 79.9, y: 342.8, angle: 7.55 },
  { name: 'Google', logo: 'google-hero.svg', x: 81.6, y: 254.9, angle: -6.32, size: 22 },
  { name: 'Swiggy', logo: 'swiggy-hero.svg', x: 260.6, y: 248.6, angle: 10.69, color: '#fc8019' },
  { name: 'Uber', logo: 'uber-hero.svg', x: 375.8, y: 291.5, angle: -48.15, size: 16.331 },
  { name: 'J.P. Morgan', logo: 'jp-morgan.png', x: 337.9, y: 204.4, angle: 9.86, size: 12.827 },
  { name: 'PepsiCo', logo: 'pepsi-hero.svg', x: 192.4, y: 177.6, angle: -3.46, size: 16.22 },
  { name: 'Apple', logo: 'apple-hero.svg', x: 34.7, y: 174.6, angle: -21.34, size: 21.248, color: '#fff' },
  { name: 'Goldman Sachs', logo: 'goldman-sachs.png', x: 237.6, y: 113.2, angle: 4.43 },
  { name: 'Tesla', logo: 'tesla-hero.svg', x: 391.2, y: 108, angle: -82.61, color: '#e82127' },
  { name: 'Meta', logo: 'meta.png', x: 289.1, y: 45.2, angle: 8.45 },
  { name: 'Airbnb', logo: 'airbnb-hero.svg', x: 126.3, y: 41, angle: -7.09, size: 20.653, color: '#ff5a5f' },
  { name: 'Microsoft', logo: 'microsoft-hero.svg', x: 40.4, y: 109.1, angle: -14.01, size: 12.082 },
];

export function Welcome() {
  return (
    <div className="welcome-screen">
      <div className="welcome-copy">
        <h1>Your search for the next dream job is over <span className="rocket">🚀</span></h1>
        <a className="button button--primary welcome-button" href={boardHref(initialView)}>
          Start Searching <Asset name="arrow-right.svg" />
        </a>
      </div>
      <div className="brand-art" aria-hidden="true">
        {brands.map(brand => {
          const badgeClass = brand.logo.split('.')[0];
          const style = {
            left: brand.x,
            top: brand.y,
            '--badge-rotation': `${brand.angle}deg`,
            '--badge-color': brand.color,
            fontSize: brand.size,
          } as CSSProperties;

          return (
            <span className={`brand-badge brand-badge--${badgeClass}`} style={style} key={brand.name}>
              <span className="brand-badge__logo">
                <span className="brand-badge__image"><Asset name={brand.logo} /></span>
              </span>
              {brand.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
