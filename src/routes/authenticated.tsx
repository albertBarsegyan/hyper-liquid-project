import { createBrowserRouter, Navigate } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import AuthenticatedLayout from '../components/authenticated-layout';
import DashboardPage from '../pages/dashboard';
import TransactionHistoryPage from '../pages/transaction-history/index.tsx';
import SendPage from '../pages/send/index.tsx';
import ExplorePage from '../pages/explore/index.tsx';
import RewardsPage from '../pages/rewards/index.tsx';
import ActivityPage from '../pages/activity/index.tsx';
import DocsPage from '@/pages/docs';

export const authenticatedRoutes = createBrowserRouter([
  {
    path: innerRoutePath.getMain(),
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
        path: innerRoutePath.getSend(),
        element: <SendPage />,
      },
      {
        path: innerRoutePath.getRewards(),
        element: <RewardsPage />,
      },
      {
        path: innerRoutePath.getDocs(),
        element: <DocsPage />,
      },
      {
        path: innerRoutePath.getExplore(),
        element: <ExplorePage />,
      },
      {
        path: innerRoutePath.getActivity(),
        element: <ActivityPage />,
      },
      {
        path: innerRoutePath.getAll(),
        element: <Navigate to={innerRoutePath.getMain()} />,
      },
    ],
  },
]);
