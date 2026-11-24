import { useEffect, useRef, useState } from 'react';
import { useActivities, type Activity } from './activity';
import { jobs, locations, schedules, type Job } from './jobs';
import { boardHref, replaceBoardView, tabs, type BoardView, type Tab } from './navigation';
import { Asset, Avatar, Dialog, JobIdentity, JobMeta, JobTags } from './ui';

const tabMessages: Record<Tab, string> = {
  Discover: 'There are no open jobs to show.',
  Saved: 'Jobs you save will appear here.',
  Applied: 'Your recorded applications will appear here.',
  Closed: 'There are no closed jobs to show.',
  Discarded: 'Jobs you hide from Discover will appear here.',
};

function isInTab(job: Job, activity: Activity, tab: Tab) {
  if (job.closed) return tab === 'Closed';
  if (tab === 'Discover') return activity !== 'discarded';
  return activity === tab.toLowerCase();
}

function StatusNavigation({ view }: { view: BoardView }) {
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const rail = navigation.current;
    const active = rail?.querySelector<HTMLElement>('[aria-current="page"]');
    if (rail && active) {
      const end = active.offsetLeft + active.offsetWidth + 12;
      rail.scrollLeft = Math.max(0, end - rail.clientWidth);
    }
  }, [view.tab]);

  return (
    <nav className="status-navigation" aria-label="Job status" ref={navigation}>
      <div className="status-navigation__rail">
        {tabs.map(tab => (
          <a href={boardHref({ ...view, tab })} aria-current={tab === view.tab ? 'page' : undefined} key={tab}>
            {tab}
          </a>
        ))}
      </div>
    </nav>
  );
}

function FilterDialog({ view, onClose }: { view: BoardView; onClose: () => void }) {
  const [location, setLocation] = useState(view.location);
  const [schedule, setSchedule] = useState(view.schedule);

  return (
    <Dialog title="Filter jobs" onClose={onClose}>
      <form method="dialog" onSubmit={event => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter;
        if (submitter?.getAttribute('value') === 'apply') replaceBoardView({ ...view, location, schedule });
      }}>
        <label className="field">
          Location
          <select value={location} onChange={event => setLocation(event.target.value)}>
            <option value="">Any location</option>
            {locations.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="field">
          Job type
          <select value={schedule} onChange={event => setSchedule(event.target.value)}>
            <option value="">Any type</option>
            {schedules.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <div className="dialog__actions">
          <button className="button button--secondary" type="submit" value="cancel">Cancel</button>
          <button className="button button--primary" type="submit" value="apply">Apply filters</button>
        </div>
      </form>
    </Dialog>
  );
}

function JobCard({ job, view }: { job: Job; view: BoardView }) {
  const href = boardHref(view, job.id);
  const dark = job.brand === 'spotify';
  const titleId = `title-${job.id}`;

  return (
    <article className={`job-card job-card--${job.brand}`} aria-labelledby={titleId}>
      <div className="job-card__body">
        <div className="job-card__art" aria-hidden="true"><Asset name={`card-${job.brand}.svg`} /></div>
        <JobIdentity job={job} titleId={titleId} />
        <a className="job-card__view" href={href} aria-label={`View ${job.title} at ${job.company}`}>
          View <Asset name="view.svg" />
        </a>
        <JobTags job={job} dark={dark} />
        <p className="job-card__preview">
          {job.preview}...<a href={href} aria-label={`Read more about ${job.title} at ${job.company}`}>Read More</a>
        </p>
      </div>
      {dark && <div className="job-card__divider"><Asset name="card-divider.svg" /></div>}
      <JobMeta job={job} light={dark} />
    </article>
  );
}

export function JobBoard({ view }: { view: BoardView }) {
  const activities = useActivities();
  const [filterOpen, setFilterOpen] = useState(false);
  const query = view.query.trim().toLowerCase();
  const hasFilters = Boolean(view.location || view.schedule);
  const results = jobs.filter(job => {
    if (!isInTab(job, activities[job.id], view.tab)) return false;
    if (view.location && job.location !== view.location) return false;
    if (view.schedule && job.schedule !== view.schedule) return false;
    return `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query);
  });

  return (
    <div className="screen board-screen">
      <header className="top-line board-greeting">
        <p>Hello Kabira <span className="wave">👋</span></p>
        <Avatar />
      </header>
      <h1 className="board-title">Find Jobs</h1>
      <StatusNavigation view={view} />
      <div className="job-search" role="search" aria-label="Find jobs">
        <label className="job-search__input">
          <Asset name="search.svg" />
          <span className="sr-only">Search for company or roles</span>
          <input
            type="search"
            placeholder="Search for company or roles..."
            value={view.query}
            onChange={event => replaceBoardView({ ...view, query: event.target.value })}
          />
        </label>
        <button
          className="job-search__filter"
          type="button"
          aria-label={hasFilters ? 'Filter jobs, filters active' : 'Filter jobs'}
          aria-haspopup="dialog"
          data-active={hasFilters}
          onClick={() => setFilterOpen(true)}
        >
          <Asset name="filter.svg" />
        </button>
      </div>
      <span className="sr-only" role="status">{results.length} {results.length === 1 ? 'job' : 'jobs'}</span>
      {results.length > 0 ? (
        <div className="jobs-grid">
          {results.map(job => <JobCard key={job.id} job={job} view={view} />)}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{query || hasFilters ? 'No matching jobs' : `No ${view.tab === 'Discover' ? 'open' : view.tab.toLowerCase()} jobs`}</h2>
          <p>{query || hasFilters ? 'Try a different search or change your filters.' : tabMessages[view.tab]}</p>
          {(query || hasFilters) && (
            <button className="button button--secondary" onClick={() => replaceBoardView({ ...view, query: '', location: '', schedule: '' })}>
              Clear search and filters
            </button>
          )}
        </div>
      )}
      {filterOpen && <FilterDialog view={view} onClose={() => setFilterOpen(false)} />}
    </div>
  );
}
