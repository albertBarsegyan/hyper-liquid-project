import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useWalletContext } from '@/modules/wallet';
import { useSearchParams } from 'react-router-dom';

const WalletConnectButton: React.FC = () => {
  const [searchParams] = useSearchParams();

  const referredAddress = searchParams.get('referred');

  const {
    isConnected,
    account,
    chainId,
    balance,
    isConnecting,
    error,
    isMetaMask,
    isCorrectNetwork,
    connect,
    disconnect,
    switchToHyperEVM,
    refreshBalance,
    clearError,
    // Unified authentication state
    isAuthenticated,
    authError,
  } = useWalletContext();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openExplorer = () => {
    if (account) {
      window.open(`https://bscscan.com/address/${account}`, '_blank');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      disconnect(); // This now handles both wallet and auth cleanup
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

        {/* Wallet Info */}
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
                {formatAddress(account!)}
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
              <span>{isMetaMask ? 'MetaMask' : 'Wallet'}</span>
              <span>•</span>
              <span>{isCorrectNetwork ? 'BNB' : `Chain ${chainId}`}</span>
              {balance && (
                <>
                  <span>•</span>
                  <span>
                    {balance} {isCorrectNetwork ? 'BNB' : 'ETH'}
                  </span>
                </>
              )}
              <span>•</span>
              <span style={{ color: isAuthenticated ? '#97fce4' : '#ff6b6b' }}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isCorrectNetwork && (
              <Button
                variant="outline"
                size="sm"
                onClick={switchToHyperEVM}
                className="h-9 px-3 text-responsive-xs"
                style={{
                  borderColor: '#97fce4',
                  color: '#97fce4',
                  backgroundColor: 'transparent',
                }}
              >
                Switch
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={refreshBalance}
              className="h-9 w-9 p-0 touch-target"
              style={{ color: '#97fce4' }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account!)}
              className="h-9 w-9 p-0 touch-target"
              style={{ color: '#97fce4' }}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={openExplorer}
              className="h-9 w-9 p-0 touch-target"
              style={{ color: '#97fce4' }}
            >
              <ExternalLink className="h-4 w-4" />
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
              title="Disconnect wallet"
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
      <Button
        onClick={() => connect(referredAddress)}
        className="w-full sm:w-auto h-12 text-responsive-base"
        style={{
          backgroundColor: '#97fce4',
          color: '#0e1e27',
          border: 'none',
        }}
      >
        <Wallet className="mr-2 h-5 w-5" />
        Connect & Authenticate
      </Button>

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
    </div>
  );
};

export default WalletConnectButton;
