import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { FullScreenLoader } from '@/modules/shared/components/loader';

// Lazy load page components
const LandingPage = lazy(() => import('@/pages/landing'));
const DocsPage = lazy(() => import('@/pages/docs'));
const SignUpPage = lazy(() => import('@/pages/sign-up'));

export const guestRoutes = createBrowserRouter([
  {
    path: innerRoutePath.getMain(),
    element: (
      <Suspense
        fallback={
          <FullScreenLoader
            variant="fullscreen"
            message="Loading home page..."
          />
        }
      >
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: innerRoutePath.getDocs(),
    element: (
      <Suspense
        fallback={
          <FullScreenLoader
            variant="fullscreen"
            message="Loading documentation..."
          />
        }
      >
        <DocsPage />
      </Suspense>
    ),
  },
  {
    path: innerRoutePath.getSignUp(),
    element: (
      <Suspense
        fallback={
          <FullScreenLoader
            variant="fullscreen"
            message="Loading sign up page..."
          />
        }
      >
        <SignUpPage />
      </Suspense>
    ),
  },
  {
    path: innerRoutePath.getAll(),
    element: <Navigate to={innerRoutePath.getMain()} />,
  },
]);
