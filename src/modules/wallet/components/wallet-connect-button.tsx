import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWalletContext } from '../hooks/wallet-context';
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

const WalletConnectButton: React.FC = () => {
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
      window.open(`https://www.hyperscan.com/address/${account}`, '_blank');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      disconnect();
    }
  };

  if (isConnecting) {
    return (
      <Button
        disabled
        className="w-full sm:w-auto"
        style={{
          backgroundColor: '#97fce4',
          color: '#0e1e27',
          opacity: 0.7,
        }}
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex flex-col space-y-2">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <XCircle className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Wallet Info */}
        <div
          className="flex items-center space-x-2 p-3 border rounded-lg"
          style={{
            backgroundColor: '#021e17',
            borderColor: '#97fce4',
            color: '#97fce4',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span
                className="font-medium text-sm"
                style={{ color: '#97fce4' }}
              >
                {formatAddress(account!)}
              </span>
              <Badge
                className="text-xs"
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
              className="flex items-center space-x-2 text-xs"
              style={{ color: '#97fce4', opacity: 0.7 }}
            >
              <span>{isMetaMask ? 'MetaMask' : 'Wallet'}</span>
              <span>•</span>
              <span>{isCorrectNetwork ? 'HyperEVM' : `Chain ${chainId}`}</span>
              {balance && (
                <>
                  <span>•</span>
                  <span>
                    {balance} {isCorrectNetwork ? 'HYPE' : 'ETH'}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {!isCorrectNetwork && (
              <Button
                variant="outline"
                size="sm"
                onClick={switchToHyperEVM}
                className="h-8 px-2"
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
              className="h-8 w-8 p-0"
              style={{ color: '#97fce4' }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account!)}
              className="h-8 w-8 p-0"
              style={{ color: '#97fce4' }}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={openExplorer}
              className="h-8 w-8 p-0"
              style={{ color: '#97fce4' }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="h-8 px-2"
              style={{
                color: '#ff6b6b',
                backgroundColor: 'transparent',
              }}
              title="Disconnect wallet"
            >
              <XCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Disconnect</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={connect}
        className="w-full sm:w-auto"
        style={{
          backgroundColor: '#97fce4',
          color: '#0e1e27',
          border: 'none',
        }}
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect to HyperEVM
      </Button>

      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
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
