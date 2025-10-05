import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from './sidebar';

const AuthenticatedLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <Sidebar
        isMobile={true}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
