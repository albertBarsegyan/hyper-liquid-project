import React, { lazy, Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { FullScreenLoader } from '@/modules/shared/components/loader';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import { PointsRenderer } from '@/modules/shared/components/points-renderer';

// Lazy load Sidebar component
const Sidebar = lazy(() => import('./sidebar'));

const AuthenticatedLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authUser } = useWalletContext();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen gradient-primary">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 lg:hidden"
        style={{
          backgroundColor: '#021e17',
          border: '1px solid #97fce4',
          color: '#97fce4',
        }}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      <Suspense
        fallback={
          <FullScreenLoader variant="normal" message="Loading sidebar..." />
        }
      >
        <Sidebar
          isMobile={true}
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
      </Suspense>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <Outlet />
      </main>

      <PointsRenderer points={authUser?.points} />
    </div>
  );
};

export default AuthenticatedLayout;
