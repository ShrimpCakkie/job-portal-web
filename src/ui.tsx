import { useEffect, useRef, type ReactNode } from 'react';
import type { Job } from './jobs';

export function Asset({ name, className, size }: { name: string; className?: string; size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}assets/${name}`}
      alt=""
      className={className}
      width={size}
      height={size}
      draggable={false}
    />
  );
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

export function JobTags({ job, dark = false }: { job: Job; dark?: boolean }) {
  const tone = dark ? 'dark' : 'light';
  const facts = [
    ['location', job.location],
    ['experience', job.experience],
    ['schedule', job.schedule],
  ];

  return (
    <ul className={`job-tags${dark ? ' job-tags--dark' : ''}`} aria-label="Job information">
      {facts.map(([icon, text]) => (
        <li key={icon}><Asset name={`${icon}-${tone}.svg`} />{text}</li>
      ))}
    </ul>
  );
}

export function JobMeta({ job, light = false }: { job: Job; light?: boolean }) {
  return (
    <div className={`job-meta${light ? ' job-meta--light' : ''}`}>
      <span className="job-meta__posted">
        <Asset name={light ? 'history-light.svg' : 'history.svg'} />{job.posted}
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
