import { useSyncExternalStore } from 'react';
import { jobs } from './jobs';

export type Activity = 'saved' | 'applied' | 'discarded' | '';

const prefix = 'job-portal:activity:';
const activityEvent = 'job-portal:activity-change';
const sessionFallback = new Map<string, Activity>();

function getActivity(jobId: string): Activity {
  if (sessionFallback.has(jobId)) return sessionFallback.get(jobId) ?? '';
  try {
    const value = window.localStorage.getItem(prefix + jobId);
    if (value === 'saved' || value === 'applied' || value === 'discarded') return value;
  } catch {
    return '';
  }
  return '';
}

function getSnapshot() {
  return jobs.map(job => getActivity(job.id)).join(',');
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === null || event.key.startsWith(prefix)) onChange();
  }
  window.addEventListener(activityEvent, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(activityEvent, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useActivities() {
  const statuses = useSyncExternalStore(subscribe, getSnapshot).split(',') as Activity[];
  return Object.fromEntries(jobs.map((job, index) => [job.id, statuses[index]]));
}

export function setActivity(jobId: string, activity: Activity) {
  try {
    const key = prefix + jobId;
    if (activity) window.localStorage.setItem(key, activity);
    else window.localStorage.removeItem(key);
    sessionFallback.delete(jobId);
  } catch {
    sessionFallback.set(jobId, activity);
  }
  window.dispatchEvent(new Event(activityEvent));
}
