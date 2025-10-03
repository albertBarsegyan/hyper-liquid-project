import React from 'react';

import { WalletConnectButton } from '@/modules/wallet';
import { Typewriter } from '@/modules/shared/components/typewriter';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';
import { Link } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';

const LandingPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-between"
      style={{ backgroundColor: '#0e1e27' }}
    >
      <div className="flex flex-col min-h-screen items-start justify-between flex-1 p-20">
        <Link to={innerRoutePath.getMain()}>
          <BrandIcon size={100} />
        </Link>
        <div className="flex flex-col gap-4 ">
          <p className="text-6xl uppercase">happy to see you there</p>
          <Typewriter
            className="text-2xl capitalize opacity-80"
            text="connect your wallet and start earn crypto today"
          />
        </div>

        <div>
          <WalletConnectButton />
        </div>
      </div>
      <div className="flex-1 p-6"> </div>
    </div>
  );
};

export default LandingPage;
