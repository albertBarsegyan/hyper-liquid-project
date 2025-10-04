import React from 'react';

import { WalletConnectButton } from '@/modules/wallet';
import { Typewriter } from '@/modules/shared/components/typewriter';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';
import { Link } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';

const LandingPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row lg:items-center justify-between"
      style={{ backgroundColor: '#0e1e27' }}
    >
      <div className="flex flex-col items-start justify-between flex-1 p-responsive">
        {/* Header */}
        <div className="w-full">
          <Link to={innerRoutePath.getMain()}>
            <div>
              <BrandIcon size={80} />
            </div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          <div className="flex flex-col gap-4">
            <h1
              className="text-responsive-3xl sm:text-responsive-4xl lg:text-6xl uppercase font-bold leading-tight"
              style={{ color: '#97fce4' }}
            >
              happy to see you there
            </h1>
            <div className="text-responsive-lg sm:text-responsive-xl lg:text-2xl">
              <Typewriter
                className="capitalize opacity-80"
                text="connect your wallet and start earn crypto today"
              />
            </div>
          </div>
        </div>

        {/* Wallet Connect Section */}
        <div className="w-full max-w-md">
          <WalletConnectButton />
        </div>
      </div>

      {/* Right side decorative space */}
      <div className="hidden lg:flex flex-1 p-6">
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-96 h-96 rounded-full opacity-10"
            style={{
              background:
                'radial-gradient(circle, #97fce4 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
