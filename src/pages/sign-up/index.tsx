import React, { useState } from 'react';
import { Typewriter } from '@/modules/shared/components/typewriter';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';
import { Link } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { Carousel } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import { useNavigate as useNav, useSearchParams } from 'react-router-dom';

import bg1 from '@/assets/images/bg-1.jpg';
import bg2 from '@/assets/images/bg-2.jpg';
import bg3 from '@/assets/images/bg-3.jpg';
import bg4 from '@/assets/images/bg-5.jpg';

export const allowAlphaNumUnderscore = (value: string): string => {
  // Replace any character that is NOT a-z, A-Z, 0-9, or underscore
  return value.replace(/[^a-zA-Z0-9_]/g, '');
};

const SignUpPage: React.FC = () => {
  const navigate = useNav();
  const [searchParams] = useSearchParams();
  const referredByTagName = searchParams.get('referred') ?? undefined;
  
  const { signUp, isConnecting, authError } = useWalletContext();
  
  const carouselImages = [bg1, bg2, bg3, bg4];
  const [hashTag, setHashTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signUp({ hashTag, referrer: referredByTagName });
      // Navigate to dashboard or home
      navigate(innerRoutePath.getMain());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('Registration error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = allowAlphaNumUnderscore(e.target.value);
    setHashTag(filtered);
  };

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

        <div className="flex flex-col items-start justify-between flex-1 p-responsive">
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
                  text="Create your unique tag and join the community."
                />
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="text-responsive-base font-medium"
                  style={{ color: '#97fce4' }}
                >
                  #
                </div>
                <input
                  type="text"
                  value={hashTag}
                  onChange={handleChange}
                  placeholder="hashtag"
                  className="flex-1 px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: '#021e17',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                  autoFocus
                />
              </div>

              {(error || authError) && (
                <div
                  className="px-4 py-3 rounded-lg text-responsive-sm"
                  style={{
                    backgroundColor: '#021e17',
                    borderColor: '#ff6b6b',
                    border: '1px solid',
                    color: '#ff6b6b',
                  }}
                >
                  {error || authError}
                </div>
              )}

              <Button
                type="submit"
                disabled={!hashTag.trim() || isConnecting}
                className="h-12 text-responsive-base w-full"
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                }}
              >
                {isConnecting ? 'Creating...' : 'Submit'}
              </Button>
            </form>
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

export default SignUpPage;
