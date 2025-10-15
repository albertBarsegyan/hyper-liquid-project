import { lazy, Suspense } from 'react';
import { FullScreenLoader } from '@/modules/shared/components/loader';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';

// Lazy load the main App component
const AppContent = lazy(() => import('./AppContent.tsx'));

function App() {
  const { loading } = useWalletContext();

  if (loading) return <FullScreenLoader />;

  return (
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
  );
}

export default App;
