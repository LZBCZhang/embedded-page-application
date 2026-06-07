import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.scss';
import './i18n';

async function prepare() {
  // MSW is skipped when VITE_MOCK_ENABLED=false — set that in .env.local
  // alongside VITE_API_BASE_URL= (empty) and DEV_API_TARGET=https://... to
  // route requests through the Vite proxy to a real local backend instead.
  if (import.meta.env.DEV && import.meta.env.VITE_MOCK_ENABLED !== 'false') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
