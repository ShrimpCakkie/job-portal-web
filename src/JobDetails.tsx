import { useState, type ReactNode } from 'react';
import { setActivity, useActivities } from './activity';
import type { Job } from './jobs';
import { boardHref, type BoardView } from './navigation';
import { Asset, Avatar, Dialog, JobIdentity, JobMeta, JobTags } from './ui';

function DetailPanel({ title, icon, children }: { title: string; icon?: string; children: ReactNode }) {
  return (
    <section className="detail-panel">
      <h2>
        {icon && <span className="detail-panel__icon"><Asset name={icon} /></span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function JobDetails({ job, view }: { job: Job; view: BoardView }) {
  const activity = useActivities()[job.id];
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const saved = activity === 'saved';
  const applied = activity === 'applied';
  const discarded = activity === 'discarded';

  return (
    <div className="screen details-screen">
      <header className="top-line details-heading">
        <a className="details-heading__back" href={boardHref(view)} aria-label="Back to jobs"><Asset name="arrow-left.svg" /></a>
        <h1>Job Details</h1>
        <Avatar />
      </header>
      <div className="details-layout">
        <div className="details-overview">
          <div className={`job-summary job-summary--${job.brand}`}>
            <div className="job-summary__body">
              <JobIdentity job={job} />
              <JobTags job={job} dark={job.brand === 'spotify'} />
            </div>
            <JobMeta job={job} />
          </div>
          <div className="detail-actions">
            {job.closed ? (
              <p className="detail-actions__notice">Applications closed</p>
            ) : discarded ? (
              <button className="button button--primary" onClick={() => {
                setActivity(job.id, '');
                setFeedback('Job restored to Discover.');
              }}>Restore to Discover</button>
            ) : (
              <>
                <button className="button button--white" disabled={applied} aria-pressed={saved} onClick={() => {
                  setActivity(job.id, saved ? '' : 'saved');
                  setFeedback(saved ? 'Job removed from Saved.' : 'Job saved.');
                }}>{saved ? 'Saved' : 'Save'}</button>
                <button className="button button--primary" disabled={applied} onClick={() => setApplicationOpen(true)}>
                  {applied ? 'Applied' : 'Apply Now'} {!applied && <Asset name="arrow-right.svg" />}
                </button>
              </>
            )}
          </div>
          <span className="sr-only" role="status">{feedback}</span>
        </div>
        <div className="details-panels">
          <DetailPanel title="Job Description" icon="description.svg">
            <p>{job.description}</p>
          </DetailPanel>
          <DetailPanel title="Skills & Requirements" icon="requirements.svg">
            <ul>{job.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}</ul>
          </DetailPanel>
          <DetailPanel title="Your Role" icon="role.svg"><p>{job.role}</p></DetailPanel>
          <DetailPanel title="Benefits"><p>{job.benefits}</p></DetailPanel>
          {!job.closed && !applied && !discarded && (
            <button className="hide-job" onClick={() => {
              setActivity(job.id, 'discarded');
              setFeedback('Job moved to Discarded.');
              window.scrollTo({ top: 0 });
            }}>Hide from Discover</button>
          )}
        </div>
      </div>
      {applicationOpen && (
        <Dialog title="Record application" onClose={() => setApplicationOpen(false)}>
          <p>Record a demo application for {job.title} at {job.company} in this browser.</p>
          <form method="dialog" onSubmit={event => {
            const submitter = (event.nativeEvent as SubmitEvent).submitter;
            if (submitter?.getAttribute('value') !== 'confirm') return;
            setActivity(job.id, 'applied');
            setFeedback('Application recorded.');
          }}>
            <div className="dialog__actions">
              <button type="submit" value="cancel" className="button button--secondary">Cancel</button>
              <button type="submit" value="confirm" className="button button--primary">Confirm application</button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
