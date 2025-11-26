import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';

import {
  AlertTriangle,
  ArrowDownUp,
  CheckCircle,
  Copy,
  Loader2,
  Wallet,
  XCircle,
} from 'lucide-react';
import { toQueryString } from '@/modules/shared/utils/url.ts';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import { formatNumber } from '@/modules/shared/utils/number.ts';
import { usersService } from '@/modules/users/services/service';
import { useAlert } from '@/modules/shared/contexts/alert-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '@/modules/wallet/hooks/wallet.tsx';
import type { ConvertBnbDto } from '@/modules/users/types/user';

const generateReferralCode = (tagName: string): string => {
  return window.location.origin + toQueryString({ referred: tagName });
};

const DashboardPage: React.FC = () => {
  const {
    isConnected,
    authUser,
    balanceState,
    isCorrectNetwork,
    error,
    clearError,
    disconnect,
  } = useWalletContext();

  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const token = authUser?.coins[0];

  // BNB to Dliqd conversion
  const DLIQD_TO_BNB_RATE = 0.0005; // 1 Dliqd = 0.0005 BNB
  const [bnbAmount, setBnbAmount] = useState<string>('');
  const [dliqdAmountInput, setDliqdAmountInput] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'bnb' | 'dliqd' | null>(null);

  // Calculate Dliqd from BNB
  const calculatedDliqd = useMemo(() => {
    if (!bnbAmount || isNaN(parseFloat(bnbAmount))) return 0;
    return parseFloat(bnbAmount) / DLIQD_TO_BNB_RATE;
  }, [bnbAmount]);

  // Calculate BNB from Dliqd
  const calculatedBnb = useMemo(() => {
    if (!dliqdAmountInput || isNaN(parseFloat(dliqdAmountInput))) return 0;
    return parseFloat(dliqdAmountInput) * DLIQD_TO_BNB_RATE;
  }, [dliqdAmountInput]);

  // Quick action handlers
  const quickActionAmounts = [5, 10, 50, 100];

  const handleQuickAction = (dliqdAmount: number) => {
    const bnbNeeded = dliqdAmount * DLIQD_TO_BNB_RATE;
    setBnbAmount(bnbNeeded.toFixed(6));
    setDliqdAmountInput(dliqdAmount.toString());
    setLastChanged('dliqd');
  };

  // Validation function to allow only numbers and decimal point
  const validateNumericInput = (value: string): string => {
    // Allow empty string
    if (value === '') return '';

    // Remove any non-numeric characters except decimal point
    let sanitized = value.replace(/[^\d.]/g, '');

    // Ensure only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Prevent multiple leading zeros (but allow 0.xxx)
    if (sanitized.startsWith('00') && !sanitized.startsWith('0.')) {
      sanitized = sanitized.replace(/^0+/, '0');
    }

    return sanitized;
  };

  const handleBnbChange = (value: string) => {
    const sanitized = validateNumericInput(value);
    setBnbAmount(sanitized);
    setLastChanged('bnb');
    // Calculate and update Dliqd amount when user types in BNB
    if (
      sanitized &&
      !isNaN(parseFloat(sanitized)) &&
      parseFloat(sanitized) > 0
    ) {
      const calculated = parseFloat(sanitized) / DLIQD_TO_BNB_RATE;
      setDliqdAmountInput(calculated.toFixed(2));
    } else {
      setDliqdAmountInput('');
    }
  };

  const handleDliqdChange = (value: string) => {
    const sanitized = validateNumericInput(value);
    setDliqdAmountInput(sanitized);
    setLastChanged('dliqd');
    // Calculate and update BNB amount when user types in Dliqd
    if (
      sanitized &&
      !isNaN(parseFloat(sanitized)) &&
      parseFloat(sanitized) > 0
    ) {
      const calculated = parseFloat(sanitized) * DLIQD_TO_BNB_RATE;
      setBnbAmount(calculated.toFixed(6));
    } else {
      setBnbAmount('');
    }
  };

  // Check if we have a valid amount for conversion
  const hasValidAmount =
    (lastChanged === 'bnb' &&
      bnbAmount &&
      !isNaN(parseFloat(bnbAmount)) &&
      parseFloat(bnbAmount) > 0) ||
    (lastChanged === 'dliqd' &&
      dliqdAmountInput &&
      !isNaN(parseFloat(dliqdAmountInput)) &&
      parseFloat(dliqdAmountInput) > 0);

  // Get BNB balance
  const bnbBalance = balanceState?.balance
    ? parseFloat(balanceState.balance)
    : 0;

  // Calculate required BNB based on which input was used
  const requiredBnb = useMemo(() => {
    if (lastChanged === 'bnb' && bnbAmount && !isNaN(parseFloat(bnbAmount))) {
      return parseFloat(bnbAmount);
    }
    if (
      lastChanged === 'dliqd' &&
      dliqdAmountInput &&
      !isNaN(parseFloat(dliqdAmountInput))
    ) {
      return calculatedBnb;
    }
    return 0;
  }, [lastChanged, bnbAmount, dliqdAmountInput, calculatedBnb]);

  // Check if user has sufficient BNB balance
  const hasSufficientBalance = requiredBnb > 0 && bnbBalance >= requiredBnb;
  const insufficientBalance = Boolean(hasValidAmount && !hasSufficientBalance);

  // Convert BNB mutation
  const convertBnbMutation = useMutation({
    mutationFn: (data: ConvertBnbDto) => usersService.convertBnb(data),
    onSuccess: async data => {
      // Invalidate queries to refresh balance
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.auth.profile,
      });
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.auth.balance(authUser?.walletAddress),
      });

      const bnbToConvert =
        lastChanged === 'bnb' ? bnbAmount : calculatedBnb.toFixed(6);

      showAlert({
        variant: 'success',
        message: `Successfully converted ${bnbToConvert} BNB to ${data.dliqdAmount} Dliqd`,
      });

      // Reset form
      setBnbAmount('');
      setDliqdAmountInput('');
      setLastChanged(null);
    },
    onError: (error: Error) => {
      console.error('Failed to convert BNB:', error);
      showAlert({
        variant: 'error',
        message: error.message,
      });
    },
  });

  // Address formatting removed to avoid exposing wallet address

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Explorer disabled to avoid exposing wallet address

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to sign out.')) {
      disconnect();
    }
  };

  const onClickConvert = () => {
    if (!hasValidAmount || insufficientBalance) return;

    const bnbToConvert =
      lastChanged === 'bnb' ? bnbAmount : calculatedBnb.toFixed(6);

    convertBnbMutation.mutate({
      bnbAmount: bnbToConvert,
    });
  };

  const referralCodeLink = generateReferralCode(authUser?.hashTag ?? '');

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
                Account Information
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
                    #{authUser?.hashTag ?? 'anonymous'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(`#${authUser?.hashTag ?? ''}`)
                    }
                    style={{
                      borderColor: '#97fce4',
                      color: '#97fce4',
                      backgroundColor: 'transparent',
                    }}
                    title="Copy hashtag"
                  >
                    <Copy className="h-4 w-4" />
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
                    Supported Network
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: '#97fce4' }}
                  >
                    BNB and multi-chain (coming soon)
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
                    Wallet Ecosystem
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: '#97fce4' }}
                  >
                    Canton Network
                  </p>
                </div>
              </div>

              {authUser?.hashTag && (
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
                    <Button
                      variant="link"
                      onClick={() => copyToClipboard(referralCodeLink)}
                      className="text-lg font-semibold underline hover:underline"
                      style={{ color: '#97fce4' }}
                    >
                      {authUser?.hashTag}
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(referralCodeLink)}
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
              )}
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
                  {formatNumber(balanceState?.balance) ?? '0'}{' '}
                  {balanceState?.symbol}
                </div>
                <p style={{ color: '#97fce4', opacity: 0.8 }}>
                  Available Balance
                </p>
              </div>

              <div className="text-center p-6">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#97fce4' }}
                >
                  {formatNumber(token?.amount) ?? '0'} {token?.name}
                </div>
                <p style={{ color: '#97fce4', opacity: 0.8 }}>
                  Available Balance
                </p>
              </div>
            </CardContent>
          </Card>

          {/* BNB to Dliqd Conversion Card */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle
                className="flex items-center"
                style={{ color: '#97fce4' }}
              >
                <ArrowDownUp className="h-5 w-5 mr-2" />
                Convert BNB to Dliqd
              </CardTitle>
              <p style={{ color: '#97fce4', opacity: 0.8 }}>
                1 Dliqd = {DLIQD_TO_BNB_RATE} BNB
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Action Buttons */}
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Quick Buy
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickActionAmounts.map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(amount)}
                      style={{
                        borderColor: '#97fce4',
                        color: '#97fce4',
                        backgroundColor: 'transparent',
                      }}
                      className="hover:bg-opacity-20"
                    >
                      {amount} Dliqd
                    </Button>
                  ))}
                </div>
              </div>

              {/* BNB Input */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#97fce4' }}
                >
                  BNB Amount
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={bnbAmount}
                  onChange={e => handleBnbChange(e.target.value)}
                  onPaste={e => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const sanitized = validateNumericInput(pastedText);
                    handleBnbChange(sanitized);
                  }}
                  onKeyDown={e => {
                    // Allow: backspace, delete, tab, escape, enter, decimal point
                    const allowedKeys = [
                      'Backspace',
                      'Delete',
                      'Tab',
                      'Escape',
                      'Enter',
                      '.',
                      'NumpadDecimal',
                    ];
                    const allowedWithCtrl = ['a', 'c', 'v', 'x'];
                    const navigationKeys = [
                      'Home',
                      'End',
                      'ArrowLeft',
                      'ArrowRight',
                      'ArrowUp',
                      'ArrowDown',
                    ];

                    if (
                      allowedKeys.includes(e.key) ||
                      (e.ctrlKey &&
                        allowedWithCtrl.includes(e.key.toLowerCase())) ||
                      navigationKeys.includes(e.key)
                    ) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="0.0"
                  className="w-full p-3 border rounded-lg text-responsive-sm"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
              </div>

              {/* Dliqd Input */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#97fce4' }}
                >
                  Dliqd Amount
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={dliqdAmountInput}
                  onChange={e => handleDliqdChange(e.target.value)}
                  onPaste={e => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const sanitized = validateNumericInput(pastedText);
                    handleDliqdChange(sanitized);
                  }}
                  onKeyDown={e => {
                    // Allow: backspace, delete, tab, escape, enter, decimal point
                    const allowedKeys = [
                      'Backspace',
                      'Delete',
                      'Tab',
                      'Escape',
                      'Enter',
                      '.',
                      'NumpadDecimal',
                    ];
                    const allowedWithCtrl = ['a', 'c', 'v', 'x'];
                    const navigationKeys = [
                      'Home',
                      'End',
                      'ArrowLeft',
                      'ArrowRight',
                      'ArrowUp',
                      'ArrowDown',
                    ];

                    if (
                      allowedKeys.includes(e.key) ||
                      (e.ctrlKey &&
                        allowedWithCtrl.includes(e.key.toLowerCase())) ||
                      navigationKeys.includes(e.key)
                    ) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="0.0"
                  className="w-full p-3 border rounded-lg text-responsive-sm"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
              </div>

              {/* Conversion Result */}
              {hasValidAmount && (
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: '#97fce4', opacity: 0.8 }}
                        >
                          You will receive
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: '#97fce4' }}
                        >
                          {lastChanged === 'bnb'
                            ? calculatedDliqd.toLocaleString('en-US', {
                                maximumFractionDigits: 2,
                              })
                            : parseFloat(dliqdAmountInput).toLocaleString(
                                'en-US',
                                {
                                  maximumFractionDigits: 2,
                                }
                              )}{' '}
                          Dliqd
                        </p>
                      </div>
                      <ArrowDownUp
                        className="h-6 w-6"
                        style={{ color: '#97fce4', opacity: 0.5 }}
                      />
                    </div>
                    {lastChanged === 'dliqd' && (
                      <div
                        className="pt-2 border-t"
                        style={{ borderColor: '#97fce4', opacity: 0.3 }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: '#97fce4', opacity: 0.8 }}
                        >
                          Required BNB: {calculatedBnb.toFixed(6)} BNB
                        </p>
                      </div>
                    )}
                    {lastChanged === 'bnb' && (
                      <div
                        className="pt-2 border-t"
                        style={{ borderColor: '#97fce4', opacity: 0.3 }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: '#97fce4', opacity: 0.8 }}
                        >
                          You pay: {parseFloat(bnbAmount).toFixed(6)} BNB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Insufficient Balance Error */}
              {insufficientBalance && (
                <Alert
                  variant="destructive"
                  className="border-red-500 bg-red-500/10"
                >
                  <AlertTriangle
                    className="h-4 w-4"
                    style={{ color: '#ef4444' }}
                  />
                  <AlertDescription style={{ color: '#ef4444' }}>
                    Insufficient BNB balance. You have {bnbBalance.toFixed(6)}{' '}
                    BNB, but need {requiredBnb.toFixed(6)} BNB.
                  </AlertDescription>
                </Alert>
              )}

              {/* Convert Button */}
              <Button
                size="lg"
                className="w-full"
                disabled={
                  !hasValidAmount ||
                  insufficientBalance ||
                  convertBnbMutation.isPending
                }
                onClick={onClickConvert}
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                  opacity:
                    !hasValidAmount ||
                    insufficientBalance ||
                    convertBnbMutation.isPending
                      ? 0.5
                      : 1,
                  cursor:
                    !hasValidAmount ||
                    insufficientBalance ||
                    convertBnbMutation.isPending
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {convertBnbMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert to Dliqd'
                )}
              </Button>
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
                onClick={() => copyToClipboard(`#${authUser?.hashTag ?? ''}`)}
                style={{
                  borderColor: '#97fce4',
                  color: '#97fce4',
                  backgroundColor: 'transparent',
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Hashtag
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
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
