import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Loader2,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { toQueryString } from '@/modules/shared/utils/url.ts';

const WalletConnectButton: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = React.useState(false);
  const [tagName, setTagName] = React.useState('');

  const referredAddress = searchParams.get('referred') ?? undefined;

  const {
    isConnected,
    balanceState,
    isConnecting,
    error,
    isCorrectNetwork,
    signIn,
    disconnect,
    clearError,
    isAuthenticated,
    authError,
    authUser,
  } = useWalletContext();

  const handleSignIn = async () => {
    if (!tagName.trim()) {
      alert('Please enter your hashTag');
      return;
    }

    await signIn({ hashTag: tagName, referrer: referredAddress });
    setShowSignInModal(false);
  };

  // Address formatting removed to avoid exposing wallet address

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Explorer removed to avoid exposing wallet address

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      disconnect();
    }
  };

  if (isConnecting) {
    return (
      <Button
        disabled
        className="w-full sm:w-auto h-12 text-responsive-base"
        style={{
          backgroundColor: '#97fce4',
          color: '#0e1e27',
          opacity: 0.7,
        }}
      >
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Connecting & Authenticating...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex flex-col space-y-3">
        {/* Error Alert */}
        {(error ?? authError) && (
          <Alert variant="destructive" className="w-full">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-responsive-sm">{error ?? authError}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <XCircle className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div
          className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4 border rounded-lg"
          style={{
            backgroundColor: '#021e17',
            borderColor: '#97fce4',
            color: '#97fce4',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <span
                className="font-medium text-responsive-sm"
                style={{ color: '#97fce4' }}
              >
                #{authUser?.hashTag ?? 'anonymous'}
              </span>
              <Badge
                className="text-responsive-xs w-fit"
                style={{
                  backgroundColor: isCorrectNetwork ? '#97fce4' : '#ff6b6b',
                  color: isCorrectNetwork ? '#0e1e27' : '#ffffff',
                }}
              >
                {isCorrectNetwork ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {isCorrectNetwork ? 'Connected' : 'Wrong Network'}
              </Badge>
            </div>
            <div
              className="flex flex-wrap items-center gap-2 text-responsive-xs mt-2"
              style={{ color: '#97fce4', opacity: 0.7 }}
            >
              {balanceState && (
                <span>
                  {balanceState?.balance} {balanceState?.symbol}
                </span>
              )}
              <span>•</span>
              <span style={{ color: isAuthenticated ? '#97fce4' : '#ff6b6b' }}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/*{!isCorrectNetwork && (*/}
            {/*  <Button*/}
            {/*    variant="outline"*/}
            {/*    size="sm"*/}
            {/*    onClick={switchToHyperEVM}*/}
            {/*    className="h-9 px-3 text-responsive-xs"*/}
            {/*    style={{*/}
            {/*      borderColor: '#97fce4',*/}
            {/*      color: '#97fce4',*/}
            {/*      backgroundColor: 'transparent',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Switch*/}
            {/*  </Button>*/}
            {/*)}*/}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`#${authUser?.hashTag ?? ''}`)}
              className="h-9 w-9 p-0 touch-target"
              style={{ color: '#97fce4' }}
              title="Copy hashtag"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="h-9 px-3 text-responsive-xs"
              style={{
                color: '#ff6b6b',
                backgroundColor: 'transparent',
              }}
              title="Sign out"
            >
              <XCircle className="h-4 w-4 mr-1" />
              <span>Disconnect</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowSignInModal(true)}
          className="flex-1 h-12 text-responsive-base"
          style={{
            backgroundColor: '#97fce4',
            color: '#0e1e27',
            border: 'none',
          }}
        >
          <Wallet className="mr-2 h-5 w-5" />
          Sign In
        </Button>

        <Button
          onClick={() =>
            navigate(
              innerRoutePath.getSignUp(
                toQueryString({ referred: referredAddress })
              )
            )
          }
          className="flex-1 h-12 text-responsive-base"
          style={{
            backgroundColor: 'transparent',
            color: '#97fce4',
            border: '1px solid #97fce4',
          }}
        >
          <Wallet className="mr-2 h-5 w-5" />
          Sign Up
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-responsive-sm">{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <XCircle className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowSignInModal(false)}
        >
          <div
            className="bg-[#0e1e27] border border-[#97fce4] rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#97fce4' }}>
                Sign In
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowSignInModal(false)}
                style={{ color: '#97fce4' }}
              >
                <XCircle className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: '#97fce4' }}
                >
                  Hashtag
                </label>

                <div className="flex items-center justify-between gap-2">
                  <span>#</span>
                  <input
                    type="text"
                    value={tagName}
                    onChange={e => setTagName(e.target.value)}
                    placeholder="Your hashtag"
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{
                      backgroundColor: '#021e17',
                      borderColor: '#97fce4',
                      color: '#97fce4',
                    }}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') void handleSignIn();
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={handleSignIn}
                disabled={!tagName.trim() || isConnecting}
                className="h-12 text-responsive-base w-full"
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                }}
              >
                {isConnecting ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
