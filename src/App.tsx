import { lazy, Suspense } from 'react';
import { FullScreenLoader } from '@/modules/shared/components/loader';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import TickerScroller from '@/components/ticker-scroller';

// Lazy load the main App component
const AppContent = lazy(() => import('./AppContent.tsx'));

function App() {
  const { loading } = useWalletContext();

  if (loading) return <FullScreenLoader />;

  return (
    <div className="flex flex-col h-screen">
      <TickerScroller />
      <div className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <FullScreenLoader
              variant="fullscreen"
              message="Loading application..."
            />
          }
        >
          <AppContent />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
