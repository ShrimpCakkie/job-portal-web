import { useSyncExternalStore } from 'react';

export const tabs = ['Discover', 'Saved', 'Applied', 'Closed', 'Discarded'] as const;
export type Tab = (typeof tabs)[number];

export type BoardView = {
  tab: Tab;
  query: string;
  location: string;
  schedule: string;
};

type Route =
  | { screen: 'onboarding' }
  | { screen: 'board'; view: BoardView }
  | { screen: 'details'; view: BoardView; jobId: string }
  | { screen: 'missing' };

export const initialView: BoardView = { tab: 'Discover', query: '', location: '', schedule: '' };

export function boardHref(view: BoardView, jobId?: string) {
  const params = new URLSearchParams();
  if (view.tab !== 'Discover') params.set('tab', view.tab.toLowerCase());
  if (view.query) params.set('q', view.query);
  if (view.location) params.set('location', view.location);
  if (view.schedule) params.set('type', view.schedule);

  const path = jobId ? `/jobs/${jobId}` : '/jobs';
  return params.size ? `#${path}?${params}` : `#${path}`;
}

export function replaceBoardView(view: BoardView) {
  const href = boardHref(view);
  if (window.location.hash === href) return;
  window.history.replaceState(window.history.state, '', href);
  window.dispatchEvent(new Event('hashchange'));
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function readHash() {
  return window.location.hash;
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, readHash);
  const [path, search] = hash.slice(1).split('?');
  if (path === '' || path === '/') return { screen: 'onboarding' };

  const params = new URLSearchParams(search);
  const view: BoardView = {
    tab: tabs.find(tab => tab.toLowerCase() === params.get('tab')) ?? 'Discover',
    query: params.get('q') ?? '',
    location: params.get('location') ?? '',
    schedule: params.get('type') ?? '',
  };
  if (path === '/jobs') return { screen: 'board', view };
  const jobId = /^\/jobs\/([a-z0-9-]+)$/.exec(path)?.[1];
  if (jobId) return { screen: 'details', view, jobId };
  return { screen: 'missing' };
}
