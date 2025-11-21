import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/modules/shared/hooks/use-debounce.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { AlertTriangle, ArrowUpRight, Loader2, Send } from 'lucide-react';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context';
import { usersService } from '@/modules/users/services/service';
import { useUsers } from '@/modules/users/hooks/use-users';
import { useAlert } from '@/modules/shared/contexts/alert-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '@/modules/wallet/hooks/wallet.tsx';

const SendPage: React.FC = () => {
  const { authUser } = useWalletContext();
  const { showAlert } = useAlert();

  const queryClient = useQueryClient();

  const [selectedHashTag, setSelectedHashTag] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [amountError, setAmountError] = useState<string>('');

  const searchTerm = useDebounce(selectedHashTag, 300);

  // Fetch users using useQuery hook
  const {
    data: usersData,
    isLoading: isSearching,
    error: usersError,
  } = useUsers(
    {
      hashTag: searchTerm,
      limit: 20,
    },
    Boolean(searchTerm)
  );

  // Transform users data to combobox options
  const userOptions = useMemo(() => {
    if (!usersData?.users) return [];

    return usersData.users.map(user => ({
      value: user.hashTag,
      label: user.hashTag,
      description: user.walletAddress
        ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
        : undefined,
    }));
  }, [usersData?.users]);

  // Show error alert if users fetch fails
  useEffect(() => {
    if (usersError) {
      showAlert({
        variant: 'error',
        message: 'Failed to search users',
      });
    }
  }, [usersError, showAlert]);

  // Get available coins from authUser
  const availableCoins = useMemo(
    () => authUser?.coins ?? [],
    [authUser?.coins]
  );

  // Validate amount
  useEffect(() => {
    if (!amount || !selectedCoin) {
      setAmountError('');
      return;
    }

    const coin = availableCoins.find(c => c.name === selectedCoin);
    if (!coin) {
      setAmountError('');
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(coin.amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setAmountError('Amount must be greater than 0');
    } else if (amountNum > balanceNum) {
      setAmountError(
        `Insufficient balance. You have ${coin.amount} ${coin.name}`
      );
    } else {
      setAmountError('');
    }
  }, [amount, selectedCoin, availableCoins]);

  const handleSend = useCallback(async () => {
    if (!selectedHashTag) {
      showAlert({
        variant: 'error',
        message: 'Please select a recipient',
      });
      return;
    }

    if (!selectedCoin) {
      showAlert({
        variant: 'error',
        message: 'Please select a coin',
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showAlert({
        variant: 'error',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (amountError) {
      showAlert({
        variant: 'error',
        message: amountError,
      });
      return;
    }

    setIsSending(true);
    try {
      await usersService.sendCoins({
        toHashTag: selectedHashTag,
        coinName: selectedCoin,
        amount,
        memo: memo.trim() || undefined,
      });

      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.auth.profile,
      });

      showAlert({
        variant: 'success',
        message: `Successfully sent ${amount} ${selectedCoin} to ${selectedHashTag}`,
      });

      // Reset form
      setSelectedHashTag('');
      setSelectedCoin('');
      setAmount('');
      setMemo('');
    } catch (error) {
      console.error('Failed to send coins:', error);
      showAlert({
        variant: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to send coins',
      });
    } finally {
      setIsSending(false);
    }
  }, [selectedHashTag, selectedCoin, amount, memo, amountError, showAlert]);

  const coinOptions = availableCoins.map(coin => ({
    value: coin.name,
    label: `${coin.name} (Balance: ${coin.amount})`,
  }));

  const hasError = Boolean(amountError);
  const canSend =
    selectedHashTag &&
    selectedCoin &&
    amount &&
    !hasError &&
    !isSending &&
    parseFloat(amount) > 0;

  return (
    <div className="container-responsive py-responsive min-h-full">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-responsive-3xl font-bold mb-2"
            style={{ color: '#97fce4' }}
          >
            Send Tokens
          </h1>
          <p
            className="text-responsive-base"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            Send tokens to any user by their hashtag
          </p>
        </div>

        <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
          <CardHeader>
            <CardTitle
              className="flex items-center text-responsive-lg"
              style={{ color: '#97fce4' }}
            >
              <Send className="mr-2 h-5 w-5" />
              Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Network Warning */}
            <Alert
              variant="destructive"
              className="border-red-500 bg-red-500/10"
            >
              <AlertTriangle className="h-4 w-4" style={{ color: '#ef4444' }} />
              <AlertDescription style={{ color: '#ef4444' }}>
                <strong>Warning:</strong> You can only send tokens on the BNB
                network. If you send coins to addresses on other networks, you
                may lose your tokens permanently. We do not have an agreement to
                return tokens sent to incorrect networks.
              </AlertDescription>
            </Alert>

            {/* Recipient Hashtag Search */}
            <div>
              <label
                className="block text-responsive-sm font-medium mb-2"
                style={{ color: '#97fce4' }}
              >
                Recipient Hashtag
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedHashTag}
                  onChange={e => setSelectedHashTag(e.target.value)}
                  placeholder="Type hashtag to search (min 2 characters)..."
                  className="w-full p-3 border rounded-lg text-responsive-sm pr-10"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      style={{ color: '#97fce4' }}
                    />
                  </div>
                )}
              </div>
              {userOptions.length > 0 && searchTerm.length >= 2 && (
                <div className="mt-2">
                  <Combobox
                    options={userOptions}
                    value={selectedHashTag}
                    onValueChange={setSelectedHashTag}
                    placeholder="Select a user from results..."
                    searchPlaceholder="Filter results..."
                    emptyMessage="No users found"
                  />
                </div>
              )}
              {searchTerm.length >= 2 &&
                !isSearching &&
                userOptions.length === 0 && (
                  <p
                    className="mt-1 text-xs"
                    style={{ color: '#97fce4', opacity: 0.7 }}
                  >
                    No users found with that hashtag
                  </p>
                )}
            </div>

            {/* Coin Selection */}
            <div>
              <label
                className="block text-responsive-sm font-medium mb-2"
                style={{ color: '#97fce4' }}
              >
                Select Coin
              </label>
              {coinOptions.length === 0 ? (
                <div
                  className="w-full p-3 border rounded-lg text-responsive-sm"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                    opacity: 0.5,
                  }}
                >
                  No coins available
                </div>
              ) : (
                <Combobox
                  options={coinOptions}
                  value={selectedCoin}
                  onValueChange={setSelectedCoin}
                  placeholder="Select a coin..."
                  emptyMessage="No coins available"
                />
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label
                className="block text-responsive-sm font-medium mb-2"
                style={{ color: '#97fce4' }}
              >
                Amount
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.0"
                  className={cn(
                    'w-full p-3 border rounded-lg text-responsive-sm',
                    hasError && 'border-red-500'
                  )}
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: hasError ? '#ef4444' : '#97fce4',
                    color: hasError ? '#ef4444' : '#97fce4',
                  }}
                />
                {hasError && (
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {amountError}
                  </p>
                )}
                {selectedCoin && !hasError && amount && (
                  <p
                    className="text-xs"
                    style={{ color: '#97fce4', opacity: 0.7 }}
                  >
                    Available:{' '}
                    {availableCoins.find(c => c.name === selectedCoin)?.amount}{' '}
                    {selectedCoin}
                  </p>
                )}
              </div>
            </div>

            {/* Memo Field (Optional) */}
            <div>
              <label
                className="block text-responsive-sm font-medium mb-2"
                style={{ color: '#97fce4' }}
              >
                Memo (Optional)
              </label>
              <textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="Add a note (optional)..."
                rows={3}
                className="w-full p-3 border rounded-lg text-responsive-sm resize-none"
                style={{
                  backgroundColor: '#0e1e27',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                }}
              />
            </div>

            {/* Send Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                onClick={handleSend}
                disabled={!canSend}
                className="w-full sm:w-auto"
                style={{
                  backgroundColor: canSend ? '#97fce4' : '#97fce4',
                  color: canSend ? '#0e1e27' : '#0e1e27',
                  border: 'none',
                  opacity: canSend ? 1 : 0.5,
                  cursor: canSend ? 'pointer' : 'not-allowed',
                }}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Send Transaction
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendPage;
