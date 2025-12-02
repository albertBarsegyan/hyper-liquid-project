import { lazy, Suspense } from 'react';
import { FullScreenLoader } from '@/modules/shared/components/loader';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import TickerScroller from '@/components/ticker-scroller';

const AppContent = lazy(() => import('./AppContent.tsx'));

function App() {
  const { loading, authUser } = useWalletContext();

  if (loading) return <FullScreenLoader />;

  return (
    <div className="flex flex-col h-screen">
      <TickerScroller authUser={authUser} />
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
