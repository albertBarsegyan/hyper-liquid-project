import React from 'react';

import { WalletConnectButton } from '@/modules/wallet';
import { Typewriter } from '@/modules/shared/components/typewriter';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';
import { Link } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { Carousel } from '@/components/ui/carousel';

// Import background images
import bg1 from '@/assets/images/bg-1.jpg';
import bg2 from '@/assets/images/bg-2.jpg';
import bg3 from '@/assets/images/bg-3.jpg';
import bg4 from '@/assets/images/bg-4.jpg';

const LandingPage: React.FC = () => {
  const carouselImages = [bg1, bg2, bg3, bg4];

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row [align-items:normal] lg:justify-between"
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
              className="text-responsive-3xl sm:text-responsive-4xl lg:text-6xl capitalise font-bold leading-tight"
              style={{ color: '#97fce4' }}
            >
              Decentralized RWA liquidity on HyperEVM
            </h1>
            <div className="text-responsive-lg sm:text-responsive-xl lg:text-2xl">
              <Typewriter
                className="capitalize opacity-80"
                text="Connect your wallet and start to earn CC."
              />
            </div>
          </div>
        </div>

        {/* Wallet Connect Section */}
        <div className="w-full max-w-md">
          <WalletConnectButton />
        </div>
      </div>

      {/* Right side carousel */}
      <div className="hidden lg:flex flex-1 p-6">
        <div className="w-full h-full">
          <Carousel
            images={carouselImages}
            autoPlay={true}
            interval={4000}
            className="h-full shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
