import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Typewriter } from '@/modules/shared/components/typewriter';
import { BrandIcon } from '@/modules/shared/components/icons/brand.tsx';
import { Link, useNavigate as useNav, useSearchParams } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { Carousel } from '@/components/ui/carousel';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import { useAlert } from '@/modules/shared/contexts/alert-context.tsx';

import bg1 from '@/assets/images/bg-1.jpg';
import bg2 from '@/assets/images/bg-2.jpg';
import bg3 from '@/assets/images/bg-3.jpg';
import bg4 from '@/assets/images/bg-5.jpg';
import { toQueryString } from '@/modules/shared/utils/url.ts';

export const allowAlphaNumUnderscore = (value: string): string => {
  // Replace any character that is NOT a-z, A-Z, 0-9, or underscore
  return value.replace(/[^a-zA-Z0-9_]/g, '');
};

const SignUpPage: React.FC = () => {
  const navigate = useNav();

  const { signUp, isConnecting, error } = useWalletContext();
  const { showAlert } = useAlert();

  const [hashTag, setHashTag] = useState('');

  const [searchParams] = useSearchParams();

  const referredAddress = searchParams.get('referred') ?? undefined;

  const carouselImages = [bg1, bg2, bg3, bg4];

  const signUpButtonRef = useRef<HTMLButtonElement | null>(null);

  const isDisabled = !hashTag.trim() || isConnecting;

  const handleNativeSubmit = useCallback(async () => {
    if (isConnecting) return;

    const cleanedTag = hashTag.trim();
    if (!cleanedTag) {
      showAlert({ variant: 'error', message: 'Tag name is required' });
      return;
    }

    const isSignUp = await signUp({
      hashTag: cleanedTag,
      referrer: referredAddress,
    });

    if (isSignUp) {
      showAlert({ variant: 'success', message: 'Registration successful!' });
      navigate(innerRoutePath.getMain());
    } else if (!error) {
      showAlert({
        variant: 'error',
        message: 'Registration failed. Please try again.',
      });
    }
  }, [
    error,
    hashTag,
    isConnecting,
    navigate,
    referredAddress,
    showAlert,
    signUp,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = allowAlphaNumUnderscore(e.target.value);
    setHashTag(filtered);
  };

  useEffect(() => {
    if (!error) return;

    showAlert({ variant: 'error', message: error });
  }, [error, showAlert]);

  useEffect(() => {
    const buttonEl = signUpButtonRef.current;
    if (!buttonEl) return;

    const handleClick = () => {
      void handleNativeSubmit();
    };

    buttonEl.addEventListener('click', handleClick);

    return () => {
      buttonEl.removeEventListener('click', handleClick);
    };
  }, [handleNativeSubmit]);

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
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex gap-4">
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
                  disabled={isConnecting}
                  autoComplete="username webauthn"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      signUpButtonRef.current?.click();
                    }
                  }}
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

              <button
                type="button"
                ref={signUpButtonRef}
                disabled={isDisabled}
                className="h-12 text-responsive-base w-full"
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                }}
              >
                {isConnecting ? 'Creating...' : 'Sign up'}
              </button>
            </div>
            <div className="flex items-center  justify-center">
              <p>
                Do you have account?{' '}
                <Link
                  className="underline"
                  to={innerRoutePath.getMain(
                    toQueryString({ referred: referredAddress })
                  )}
                >
                  Sign in
                </Link>
              </p>
            </div>
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
