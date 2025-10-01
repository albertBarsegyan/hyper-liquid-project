import { RouterProvider } from 'react-router-dom';

import { useWalletContext } from '@/modules/wallet';
import { authenticatedRoutes } from '@/routes/authenticated.tsx';
import { guestRoutes } from '@/routes/guest.tsx';

function App() {
  const { isConnected } = useWalletContext();

  return (
    <RouterProvider router={isConnected ? authenticatedRoutes : guestRoutes} />
  );
}

export default App;
