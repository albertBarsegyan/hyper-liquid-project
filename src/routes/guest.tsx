import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { FullScreenLoader } from '@/modules/shared/components/loader';

// Lazy load page components
const LandingPage = lazy(() => import('@/pages/landing'));
const DocsPage = lazy(() => import('@/pages/docs'));

export const guestRoutes = createBrowserRouter([
  {
    path: innerRoutePath.getMain(),
    element: (
      <Suspense fallback={<FullScreenLoader variant="fullscreen" message="Loading home page..." />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: innerRoutePath.getDocs(),
    element: (
      <Suspense fallback={<FullScreenLoader variant="fullscreen" message="Loading documentation..." />}>
        <DocsPage />
      </Suspense>
    ),
  },
  {
    path: innerRoutePath.getAll(),
    element: <Navigate to={innerRoutePath.getMain()} />,
  },
]);
