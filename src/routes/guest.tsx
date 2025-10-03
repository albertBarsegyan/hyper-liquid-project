import { createBrowserRouter, Navigate } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import LandingPage from '@/pages/landing';

export const guestRoutes = createBrowserRouter([
  {
    path: innerRoutePath.getMain(),
    element: <LandingPage />,
  },
  {
    path: innerRoutePath.getAll(),
    element: <Navigate to={innerRoutePath.getMain()} />,
  },
]);
