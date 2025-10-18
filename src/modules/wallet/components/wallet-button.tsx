import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';

const WalletButton: React.FC = () => {
  const [searchParams] = useSearchParams();

  const referredAddress = searchParams.get('referred') ?? undefined;

  const {
    isConnected,
    accountAddress,
    balanceState,
    isConnecting,
    error,
    connect,
    disconnect,
    refreshBalance,
    clearError,
  } = useWalletContext();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-not-allowed"
        >
          Connecting...
        </button>
        {error && (
          <div className="text-red-500 text-sm flex items-center gap-2">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-400"
              title="Clear error"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="font-medium">{formatAddress(accountAddress!)}</div>

            {balanceState && (
              <div className="text-gray-500">
                {balanceState?.balance} {balanceState?.symbol}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {/*{!isCorrectNetwork && (*/}
            {/*  <button*/}
            {/*    onClick={switchToHyperEVM}*/}
            {/*    className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"*/}
            {/*  >*/}
            {/*    Switch to BNB*/}
            {/*  </button>*/}
            {/*)}*/}

            <button
              onClick={refreshBalance}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Refresh
            </button>

            <button
              onClick={disconnect}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm flex items-center gap-2">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-400"
              title="Clear error"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => connect(referredAddress)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Connect Wallet
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default WalletButton;
