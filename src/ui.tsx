import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { Job } from './jobs';

function assetUrl(name: string) {
  return `${import.meta.env.BASE_URL}assets/${name}`;
}

export function Asset({ name, alt = '', className, size }: { name: string; alt?: string; className?: string; size?: number }) {
  return (
    <img
      src={assetUrl(name)}
      alt={alt}
      className={className}
      width={size}
      height={size}
      draggable={false}
    />
  );
}

const iconDimensions = {
  'arrow-left.svg': [24, 24],
  'arrow-right.svg': [24, 24],
  'card-divider.svg': [350, 1],
  'description.svg': [24, 24],
  'experience-light.svg': [16, 16],
  'filter.svg': [20, 20],
  'history-light.svg': [16, 16],
  'location-light.svg': [16, 16],
  'requirements.svg': [24, 24],
  'role.svg': [24, 24],
  'schedule-light.svg': [16, 16],
  'search.svg': [20, 20],
  'view.svg': [16, 16],
} as const;

export type IconName = keyof typeof iconDimensions;

export function Icon({ name }: { name: IconName }) {
  const [width, height] = iconDimensions[name];
  const source = new URL(assetUrl(name), document.baseURI).href;
  const style = { width, height, '--icon-source': `url("${source}")` } as CSSProperties;

  return <span className="icon" style={style} aria-hidden="true" />;
}

export function Avatar() {
  return <Asset name="avatar.png" className="avatar" size={32} />;
}

export function JobIdentity({ job, titleId }: { job: Job; titleId?: string }) {
  return (
    <div className="job-identity">
      <span className="job-identity__logo"><Asset name={`${job.brand}.svg`} /></span>
      <div className="job-identity__copy">
        <h2 id={titleId}>{job.title}</h2>
        <p>{job.company}</p>
      </div>
    </div>
  );
}

export function JobTags({ job }: { job: Job }) {
  const facts = [
    ['location-light.svg', job.location],
    ['experience-light.svg', job.experience],
    ['schedule-light.svg', job.schedule],
  ] as const;

  return (
    <ul className="job-tags" aria-label="Job information">
      {facts.map(([icon, text]) => (
        <li key={icon}><Icon name={icon} />{text}</li>
      ))}
    </ul>
  );
}

export function JobMeta({ job, surface = 'inverse' }: { job: Job; surface?: 'inverse' | 'light' }) {
  return (
    <div className={`job-meta job-meta--${surface}`}>
      <span className="job-meta__posted">
        <Icon name="history-light.svg" />{job.posted}
      </span>
      <strong>{job.salary}</strong>
    </div>
  );
}

export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog className="dialog" aria-labelledby="dialog-heading" ref={dialog} onClose={onClose}>
      <h2 id="dialog-heading">{title}</h2>
      {children}
    </dialog>
  );
}
