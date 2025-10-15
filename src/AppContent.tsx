import { RouterProvider } from 'react-router-dom';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import { authenticatedRoutes } from '@/routes/authenticated.tsx';
import { guestRoutes } from '@/routes/guest.tsx';

function AppContent() {
  const { authUser, accountAddress } = useWalletContext();

  return (
    <RouterProvider
      router={authUser && accountAddress ? authenticatedRoutes : guestRoutes}
    />
  );
}

export default AppContent;
