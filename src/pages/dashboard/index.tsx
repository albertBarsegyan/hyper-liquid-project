import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { CHAIN_CONFIG, useWalletContext } from '@/modules/wallet';

import {
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Wallet,
  XCircle,
} from 'lucide-react';
import { toQueryString } from '@/modules/shared/utils/url.ts';

const generateReferralCode = (address: string): string => {
  return window.location.origin + toQueryString({ referred: address });
};

const DashboardPage: React.FC = () => {
  const {
    isConnected,
    accountAddress,
    chainId,
    balanceState,
    isCorrectNetwork,
    error,
    refreshBalance,
    clearError,
    walletInfo,
    disconnect,
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
    if (accountAddress) {
      window.open(`https://bscscan.com/address/${accountAddress}`, '_blank');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      disconnect();
    }
  };

  if (!isConnected) {
    return (
      <div
        className="flex items-center justify-center h-full px-4"
        style={{ backgroundColor: '#0e1e27' }}
      >
        <Card
          className="w-full max-w-md "
          style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}
        >
          <CardHeader className="text-center">
            <div
              className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: '#97fce4', opacity: 0.2 }}
            >
              <Wallet className="h-6 w-6" style={{ color: '#97fce4' }} />
            </div>
            <CardTitle style={{ color: '#97fce4' }}>
              Wallet Not Connected
            </CardTitle>
            <p style={{ color: '#97fce4', opacity: 0.8 }}>
              Please connect your wallet to access the dashboard
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <p
              className="text-sm mb-4"
              style={{ color: '#97fce4', opacity: 0.8 }}
            >
              Connect your MetaMask wallet to view your account information and
              manage your assets.
            </p>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-responsive py-responsive">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <XCircle className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Network Warning */}
      {!isCorrectNetwork && (
        <Alert
          className="mb-6"
          style={{
            borderColor: '#ff6b6b',
          }}
        >
          <AlertTriangle className="h-4 w-4" style={{ color: '#ff6b6b' }} />
          <AlertDescription style={{ color: '#ff6b6b' }}>
            You're connected to the wrong network. Please switch to BNB for full
            functionality.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle
                className="flex items-center"
                style={{ color: '#97fce4' }}
              >
                <Wallet className="h-5 w-5 mr-2" />
                Wallet Information
              </CardTitle>
              <p style={{ color: '#97fce4', opacity: 0.8 }}>
                Your connected wallet details and network status
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: '#0e1e27' }}
              >
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Address
                  </p>
                  <p className="font-mono text-lg" style={{ color: '#97fce4' }}>
                    {formatAddress(accountAddress!)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(accountAddress!)}
                    style={{
                      borderColor: '#97fce4',
                      color: '#97fce4',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openExplorer}
                    style={{
                      borderColor: '#97fce4',
                      color: '#97fce4',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#0e1e27' }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Network
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: '#97fce4' }}
                  >
                    {isCorrectNetwork ? 'BNB' : `Chain ${chainId}`}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#0e1e27' }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Wallet Type
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: '#97fce4' }}
                  >
                    {walletInfo?.name}
                  </p>
                </div>
              </div>

              <div
                className="flex w-full items-center justify-between gap-4 p-4 rounded-lg"
                style={{ backgroundColor: '#0e1e27' }}
              >
                <div className=" w-full">
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Referral Code
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: '#97fce4' }}
                  >
                    {formatAddress(accountAddress!)}
                  </p>
                </div>

                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(generateReferralCode(accountAddress!))
                    }
                    style={{
                      borderColor: '#97fce4',
                      color: '#97fce4',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Card */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#97fce4' }}>
                Account Balance
              </CardTitle>
              <p style={{ color: '#97fce4', opacity: 0.8 }}>
                Your current balance on the connected network
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#97fce4' }}
                >
                  {balanceState?.balance} {balanceState?.symbol}
                </div>
                <p style={{ color: '#97fce4', opacity: 0.8 }}>
                  Available Balance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Network Status */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle
                className="flex items-center"
                style={{ color: '#97fce4' }}
              >
                {isCorrectNetwork ? (
                  <CheckCircle
                    className="h-5 w-5 mr-2"
                    style={{ color: '#97fce4' }}
                  />
                ) : (
                  <XCircle
                    className="h-5 w-5 mr-2"
                    style={{ color: '#ff6b6b' }}
                  />
                )}
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Chain ID
                  </span>
                  <span className="font-mono" style={{ color: '#97fce4' }}>
                    {chainId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Status
                  </span>
                  <Badge
                    style={{
                      backgroundColor: isCorrectNetwork ? '#97fce4' : '#ff6b6b',
                      color: isCorrectNetwork ? '#0e1e27' : '#ffffff',
                    }}
                  >
                    {isCorrectNetwork ? 'Connected' : 'Wrong Network'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: '#97fce4', opacity: 0.8 }}
                  >
                    Wallet
                  </span>
                  <Badge
                    style={{
                      backgroundColor: '#97fce4',
                      opacity: 0.3,
                      color: '#0e1e27',
                    }}
                  >
                    {walletInfo?.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#97fce4' }}>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={refreshBalance}
                style={{
                  borderColor: '#97fce4',
                  color: '#97fce4',
                  backgroundColor: 'transparent',
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Balance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={openExplorer}
                style={{
                  borderColor: '#97fce4',
                  color: '#97fce4',
                  backgroundColor: 'transparent',
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => copyToClipboard(accountAddress!)}
                style={{
                  borderColor: '#97fce4',
                  color: '#97fce4',
                  backgroundColor: 'transparent',
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </Button>
              <Button
                className="w-full justify-start"
                onClick={handleDisconnect}
                style={{
                  backgroundColor: '#ff6b6b',
                  color: '#ffffff',
                  border: 'none',
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Network Info */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#97fce4' }}>BNB Network</CardTitle>
              <p style={{ color: '#97fce4', opacity: 0.8 }}>
                Network configuration details
              </p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#97fce4', opacity: 0.8 }}>Chain ID</span>
                <span className="font-mono" style={{ color: '#97fce4' }}>
                  {CHAIN_CONFIG.chainId}
                </span>
              </div>

              <div className="flex justify-between">
                <span style={{ color: '#97fce4', opacity: 0.8 }}>Currency</span>
                <span style={{ color: '#97fce4' }}>
                  {CHAIN_CONFIG.nativeCurrency.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span style={{ color: '#97fce4', opacity: 0.8 }}>Explorer</span>
                <a
                  href={CHAIN_CONFIG.blockExplorerUrls?.[0] ?? ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: '#97fce4' }}
                >
                  Bscscan
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
