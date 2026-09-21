import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@app/App';
import '@styles/globals.css';
import '@vscode/codicons/dist/codicon.css';

import { ErrorBoundary } from '@shared/components/ui/ErrorBoundary';

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
