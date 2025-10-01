import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HYPER_EVM_CONFIG, useWalletContext } from '../modules/wallet';
import {
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const {
    isConnected,
    account,
    chainId,
    balance,
    isMetaMask,
    isCorrectNetwork,
    error,
    refreshBalance,
    clearError,
    disconnect,
  } = useWalletContext();
  console.log('account', account);
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-gray-600" />
            </div>
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Please connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isCorrectNetwork ? 'default' : 'destructive'}>
                {isCorrectNetwork ? 'Connected' : 'Wrong Network'}
              </Badge>
              <Button variant="outline" size="sm" onClick={refreshBalance}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You're connected to the wrong network. Please switch to HyperEVM
              for full functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wallet Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Information
                </CardTitle>
                <CardDescription>
                  Your connected wallet details and network status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="font-mono text-lg">
                      {formatAddress(account!)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(account!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={openExplorer}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Network</p>
                    <p className="text-lg font-semibold">
                      {isCorrectNetwork ? 'HyperEVM' : `Chain ${chainId}`}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">
                      Wallet Type
                    </p>
                    <p className="text-lg font-semibold">
                      {isMetaMask ? 'MetaMask' : 'Other'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Balance</CardTitle>
                <CardDescription>
                  Your current balance on the connected network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {balance} {isCorrectNetwork ? 'HYPE' : 'ETH'}
                  </div>
                  <p className="text-gray-600">Available Balance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isCorrectNetwork ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  )}
                  Network Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Chain ID</span>
                    <span className="font-mono">{chainId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge
                      variant={isCorrectNetwork ? 'default' : 'destructive'}
                    >
                      {isCorrectNetwork ? 'Connected' : 'Wrong Network'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Wallet</span>
                    <Badge variant="secondary">
                      {isMetaMask ? 'MetaMask' : 'Other'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={refreshBalance}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Balance
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={openExplorer}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(account!)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleDisconnect}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </CardContent>
            </Card>

            {/* Network Info */}
            <Card>
              <CardHeader>
                <CardTitle>HyperEVM Network</CardTitle>
                <CardDescription>Network configuration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chain ID</span>
                  <span className="font-mono">
                    {HYPER_EVM_CONFIG.nativeCurrency.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Currency</span>
                  <span>{HYPER_EVM_CONFIG.nativeCurrency.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Explorer</span>
                  <a
                    href={HYPER_EVM_CONFIG.blockExplorerUrls?.[0] ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Hyperscan
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
