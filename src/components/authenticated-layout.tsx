import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="flex h-screen gradient-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
