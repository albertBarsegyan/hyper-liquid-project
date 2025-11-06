// Polyfills must be imported first
import '@/polyfills/text-encoder';

import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { FullScreenLoader } from '@/modules/shared/components/loader';

import { QueryProvider } from '@/providers/QueryProvider.tsx';
import { WalletProvider } from '@/modules/wallet/providers/wallet.tsx';
import ErrorBoundary from '@/components/error-boundary';

const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <WalletProvider>
          <Suspense
            fallback={
              <FullScreenLoader
                variant="fullscreen"
                message="Loading application..."
              />
            }
          >
            <App />
          </Suspense>
        </WalletProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>
);
