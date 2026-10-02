import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@app/App';
import '@styles/globals.css';


import { ErrorBoundary } from '@shared/components/ui/ErrorBoundary';

// Hydrate saved smartboard font preference
try {
  const savedFont = localStorage.getItem('treadcode_app_font') || 'inter';
  document.documentElement.setAttribute('data-app-font', savedFont);

  let ecoMotion = localStorage.getItem('smartboard_eco_motion');
  if (ecoMotion === null) {
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    if (typeof mem === 'number' && mem <= 2) {
      ecoMotion = 'true';
      localStorage.setItem('smartboard_eco_motion', 'true');
    } else {
      ecoMotion = 'false';
    }
  }
  document.documentElement.setAttribute('data-eco-motion', ecoMotion);
} catch {
  // localStorage might be unavailable in sandboxed environments
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary fallbackMessage="The Programming Visualizer encountered a critical error.">
      <App />
    </ErrorBoundary>
  </StrictMode>
);
