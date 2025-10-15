import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { FullScreenLoader } from '@/modules/shared/components/loader';

import { QueryProvider } from '@/providers/QueryProvider.tsx';
import { WalletProvider } from '@/modules/wallet/providers/wallet.tsx';

// Lazy load the main App component
const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <WalletProvider>
        <Suspense fallback={<FullScreenLoader variant="fullscreen" message="Loading application..." />}>
          <App />
        </Suspense>
      </WalletProvider>
    </QueryProvider>
  </StrictMode>
);
