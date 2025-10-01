import React from 'react';
import { HYPER_EVM_CONFIG, useWalletContext } from '@/modules/wallet';

const WalletInfo: React.FC = () => {
  const {
    isConnected,
    account,
    chainId,
    balance,
    isMetaMask,
    isCorrectNetwork,
    error,
  } = useWalletContext();

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Wallet Status</h3>
        <p className="text-gray-600">Not connected</p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  const isHyperEVM = String(chainId) === HYPER_EVM_CONFIG.chainId;
  const statusColor = isCorrectNetwork ? 'green' : 'orange';
  const statusText = isCorrectNetwork ? 'Connected' : 'Wrong Network';

  return (
    <div
      className={`p-4 bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-lg font-semibold text-${statusColor}-800`}>
          Wallet {statusText}
        </h3>
        <div
          className={`px-2 py-1 rounded text-xs font-medium ${
            isCorrectNetwork
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {isMetaMask ? 'MetaMask' : 'Wallet'}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Address:</span>{' '}
          <span className="font-mono">{account}</span>
        </div>
        <div>
          <span className="font-medium">Network:</span>{' '}
          <span
            className={isCorrectNetwork ? 'text-green-600' : 'text-orange-600'}
          >
            {isHyperEVM ? 'HyperEVM Mainnet' : `Chain ${chainId}`}
          </span>
        </div>
        <div>
          <span className="font-medium">Balance:</span>{' '}
          <span>
            {balance} {isHyperEVM ? 'HYPE' : 'ETH'}
          </span>
        </div>
        <div>
          <span className="font-medium">Chain ID:</span> <span>{chainId}</span>
        </div>
        {!isCorrectNetwork && (
          <div className="mt-3 p-2 bg-orange-100 border border-orange-200 rounded text-orange-700 text-xs">
            ⚠️ Please switch to HyperEVM network for full functionality
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;
