import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import AuthenticatedLayout from '../components/authenticated-layout';
import { FullScreenLoader } from '@/modules/shared/components/loader';

// Lazy load page components
const DashboardPage = lazy(() => import('../pages/dashboard'));
const SendPage = lazy(() => import('../pages/send/index.tsx'));
const ExplorePage = lazy(() => import('../pages/explore/index.tsx'));
const RewardsPage = lazy(() => import('../pages/rewards/index.tsx'));
const ActivityPage = lazy(() => import('../pages/activity/index.tsx'));
const DocsPage = lazy(() => import('@/pages/docs'));

export const authenticatedRoutes = createBrowserRouter([
  {
    path: innerRoutePath.getMain(),
    element: <AuthenticatedLayout />,
    children: [
      {
        path: innerRoutePath.getMain(),
        element: (
          <Suspense fallback={<FullScreenLoader variant="normal" message="Loading dashboard..." />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: innerRoutePath.getSend(),
        element: (
          <Suspense fallback={<FullScreenLoader variant="normal" message="Loading send page..." />}>
            <SendPage />
          </Suspense>
        ),
      },
      {
        path: innerRoutePath.getRewards(),
        element: (
          <Suspense fallback={<FullScreenLoader variant="normal" message="Loading rewards..." />}>
            <RewardsPage />
          </Suspense>
        ),
      },
      {
        path: innerRoutePath.getDocs(),
        element: (
          <Suspense fallback={<FullScreenLoader variant="normal" message="Loading documentation..." />}>
            <DocsPage />
          </Suspense>
        ),
      },
      {
        path: innerRoutePath.getExplore(),
        element: (
          <Suspense fallback={<FullScreenLoader variant="normal" message="Loading explore..." />}>
            <ExplorePage />
          </Suspense>
        ),
      },
      {
        path: innerRoutePath.getActivity(),
        element: (
          <Suspense fallback={<FullScreenLoader variant="normal" message="Loading activity..." />}>
            <ActivityPage />
          </Suspense>
        ),
      },
      {
        path: innerRoutePath.getAll(),
        element: <Navigate to={innerRoutePath.getMain()} />,
      },
    ],
  },
]);
