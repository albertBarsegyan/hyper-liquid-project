import { createBrowserRouter, Navigate } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import AuthenticatedLayout from '../components/authenticated-layout';
import DashboardPage from '../pages/dashboard';
import TransactionHistoryPage from '../pages/transaction-history/index.tsx';
import SendPage from '../pages/send/index.tsx';
import ExplorePage from '../pages/explore/index.tsx';
import RewardsPage from '../pages/rewards/index.tsx';

export const authenticatedRoutes = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticatedLayout />,
    children: [
      {
        path: innerRoutePath.getMain(),
        element: <DashboardPage />,
      },
      {
        path: innerRoutePath.getTransactionHistory(),
        element: <TransactionHistoryPage />,
      },
      {
        path: '/send',
        element: <SendPage />,
      },
      {
        path: '/rewards',
        element: <RewardsPage />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
      },
      {
        path: innerRoutePath.getAll(),
        element: <Navigate to={innerRoutePath.getMain()} />,
      },
    ],
  },
]);
