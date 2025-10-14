import { RouterProvider } from 'react-router-dom';

import { authenticatedRoutes } from '@/routes/authenticated.tsx';
import { guestRoutes } from '@/routes/guest.tsx';
import { FullScreenLoader } from '@/modules/shared/components/loader';

import { useWalletContext } from '@/modules/wallet';

function App() {
  const { authUser, loading } = useWalletContext();

  if (loading) return <FullScreenLoader />;

  return (
    <RouterProvider router={authUser ? authenticatedRoutes : guestRoutes} />
  );
}

export default App;
