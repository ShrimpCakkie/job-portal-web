import { StrictMode, useEffect, useLayoutEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { JobBoard } from './JobBoard';
import { JobDetails } from './JobDetails';
import { Login } from './Login';
import { jobs } from './jobs';
import { boardHref, initialView, useRoute } from './navigation';
import './theme.css';
import './styles.css';
import './login.css';

function App() {
  const route = useRoute();
  const job = route.screen === 'details' ? jobs.find(entry => entry.id === route.jobId) : undefined;
  const screen = route.screen === 'details' && !job ? 'missing' : route.screen;
  const isLogin = screen === 'onboarding';
  const title = job ? `${job.title} at ${job.company} | Job Portal` : screen === 'board' ? 'Find Jobs | Job Portal' : 'Job Portal';
  const screenKey = job?.id ?? screen;
  const previousScreen = useRef(screenKey);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = isLogin ? '交大团团' : title;
    document.documentElement.lang = isLogin ? 'zh-Hans' : 'en';
  }, [isLogin, title]);

  useLayoutEffect(() => {
    if (previousScreen.current === screenKey) return;
    previousScreen.current = screenKey;
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [screenKey]);

  return (
    <main ref={main} tabIndex={-1}>
      {isLogin && <Login />}
      {route.screen === 'board' && <JobBoard view={route.view} />}
      {route.screen === 'details' && job && <JobDetails key={job.id} job={job} view={route.view} />}
      {screen === 'missing' && (
        <div className="screen missing-screen">
          <h1>Job not found</h1>
          <a className="button button--primary" href={boardHref(initialView)}>Find Jobs</a>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
