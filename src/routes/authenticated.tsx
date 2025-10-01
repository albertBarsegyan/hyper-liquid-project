import { createBrowserRouter, Navigate } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import DashboardPage from '../pages/dashboard.tsx';

export const authenticatedRoutes = createBrowserRouter([
  {
    path: innerRoutePath.getMain(),
    element: <DashboardPage />,
  },
  {
    path: innerRoutePath.getAll(),
    element: <Navigate to={innerRoutePath.getMain()} />,
  },
]);
