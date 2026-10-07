import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';

const root = createRoot(document.getElementById('root')!);
if (import.meta.env.DEV && location.search.includes('gs-preview')) {
  import('./styles/global.css').then(() => import('./dev/Preview')).then(({ default: P }) => { document.getElementById('pl')?.remove(); document.body.classList.remove('is-loading'); root.render(<P />); });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
