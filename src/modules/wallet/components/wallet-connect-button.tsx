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
      <Button disabled className="w-full sm:w-auto">
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
        <div className="flex items-center space-x-2 p-3 bg-card border rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">
                {formatAddress(account!)}
              </span>
              <Badge
                variant={isCorrectNetwork ? 'default' : 'destructive'}
                className="text-xs"
              >
                {isCorrectNetwork ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {isCorrectNetwork ? 'Connected' : 'Wrong Network'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
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
              >
                Switch
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={refreshBalance}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account!)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={openExplorer}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
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
      <Button onClick={connect} className="w-full sm:w-auto">
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
