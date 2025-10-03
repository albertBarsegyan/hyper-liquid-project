import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { innerRoutePath } from '@/modules/shared/utils/route';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context';
import { Home, Send, RotateCcw, Globe, User } from 'lucide-react';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, isConnected } = useWalletContext();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: innerRoutePath.getMain(),
    },
    {
      id: 'send',
      label: 'Send',
      icon: Send,
      path: '/send',
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: RotateCcw,
      path: innerRoutePath.getTransactionHistory(),
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Globe,
      path: '/explore',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`h-screen w-64 flex flex-col gradient-card ${className}`}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#97fce4' }}>
        <div className="flex items-center space-x-2">
          <Link to={innerRoutePath.getMain()}>
            <BrandIcon />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start h-12 px-4"
              onClick={() => navigate(item.path)}
              style={{
                backgroundColor: active ? '#021e17' : 'transparent',
                color: '#97fce4',
                border: active ? '1px solid #97fce4' : 'none',
              }}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Account Section */}
      <div className="p-4 border-t" style={{ borderColor: '#97fce4' }}>
        <Button
          className="w-full h-12 px-4 rounded-lg"
          style={{
            backgroundColor: '#021e17',
            border: '1px solid #97fce4',
            color: '#97fce4',
          }}
        >
          <User className="h-5 w-5 mr-3" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Account</span>
            {isConnected && account && (
              <span className="text-xs opacity-70">
                {formatAddress(account)}
              </span>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
