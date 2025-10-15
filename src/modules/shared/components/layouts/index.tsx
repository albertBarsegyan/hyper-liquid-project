import React, { lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FullScreenLoader } from '@/modules/shared/components/loader';

// Lazy load wallet components
const WalletButton = lazy(() => import('@/modules/wallet/components/wallet-button.tsx'));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Crypto Test Project
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  About
                </Link>
              </nav>
            </div>

            <Suspense fallback={<FullScreenLoader variant="normal" message="Loading wallet..." />}>
              <WalletButton />
            </Suspense>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
