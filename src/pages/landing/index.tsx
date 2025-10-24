import React from 'react';

import { Typewriter } from '@/modules/shared/components/typewriter';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';
import { Link } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { Carousel } from '@/components/ui/carousel';

import bg1 from '@/assets/images/bg-1.jpg';
import bg2 from '@/assets/images/bg-2.jpg';
import bg3 from '@/assets/images/bg-3.jpg';
import bg4 from '@/assets/images/bg-5.jpg';
import WalletConnectButton from '@/modules/wallet/components/wallet-connect-button.tsx';

const LandingPage: React.FC = () => {
  const carouselImages = [bg1, bg2, bg3, bg4];

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{ backgroundColor: '#0e1e27' }}
    >
      {/* Content Section */}
      <div className="h-screen z-10 flex flex-col lg:flex-row lg:justify-between lg:flex-1">
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

        <div className=" flex flex-col items-start justify-between flex-1 p-responsive">
          {/* Header */}
          <div className="w-full">
            <Link to={innerRoutePath.getMain()}>
              <div>
                <BrandIcon size={80} />
              </div>
            </Link>

            <div>
              <p className="ml-[16px]">powered by Canton</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <div className="flex flex-col gap-4">
              <h1
                className="text-responsive-3xl sm:text-responsive-4xl lg:text-6xl capitalise font-bold leading-tight"
                style={{ color: '#97fce4' }}
              >
                Decentralized low-latency liquidity powered by physical data
                center network on Canton.
              </h1>
              <div className="text-responsive-lg sm:text-responsive-xl lg:text-2xl">
                <Typewriter
                  className="capitalize text-[14px] lg:text-[18px] opacity-80"
                  text="Connect your wallet to join Genesis Campaign."
                />
              </div>
            </div>
          </div>

          {/* Wallet Connect Section */}
          <div className="w-full max-w-md">
            <WalletConnectButton />
          </div>
        </div>

        {/* Right side carousel - Desktop */}
      </div>

      {/* Mobile/Tablet carousel - Below content */}
      <div className="lg:hidden flex-1">
        <div className="w-full absolute top-0 left-0 h-screen">
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
