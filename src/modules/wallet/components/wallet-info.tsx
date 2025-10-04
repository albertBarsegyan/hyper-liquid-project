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
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: '#021e17', borderColor: '#97fce4', border: '1px solid' }}
      >
        <h3 className="text-responsive-lg font-semibold mb-2" style={{ color: '#97fce4' }}>
          Wallet Status
        </h3>
        <p style={{ color: '#97fce4', opacity: 0.8 }}>Not connected</p>
        {error && (
          <div 
            className="mt-2 p-2 rounded text-responsive-sm"
            style={{ 
              backgroundColor: '#ff6b6b', 
              opacity: 0.1, 
              borderColor: '#ff6b6b', 
              border: '1px solid',
              color: '#ff6b6b'
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  const isHyperEVM = String(chainId) === HYPER_EVM_CONFIG.chainId;
  const statusColor = isCorrectNetwork ? '#97fce4' : '#ff6b6b';
  const statusText = isCorrectNetwork ? 'Connected' : 'Wrong Network';

  return (
    <div
      className="p-4 rounded-lg"
      style={{ 
        backgroundColor: '#021e17', 
        borderColor: statusColor, 
        border: '1px solid',
        opacity: isCorrectNetwork ? 1 : 0.8
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <h3 className="text-responsive-lg font-semibold" style={{ color: statusColor }}>
          Wallet {statusText}
        </h3>
        <div
          className="px-2 py-1 rounded text-responsive-xs font-medium"
          style={{
            backgroundColor: statusColor,
            opacity: 0.2,
            color: isCorrectNetwork ? '#0e1e27' : '#ffffff'
          }}
        >
          {isMetaMask ? 'MetaMask' : 'Wallet'}
        </div>
      </div>

      <div className="space-y-2 text-responsive-sm">
        <div className="break-all">
          <span className="font-medium" style={{ color: '#97fce4' }}>Address:</span>{' '}
          <span className="font-mono" style={{ color: '#97fce4', opacity: 0.8 }}>
            {account}
          </span>
        </div>
        <div>
          <span className="font-medium" style={{ color: '#97fce4' }}>Network:</span>{' '}
          <span style={{ color: statusColor }}>
            {isHyperEVM ? 'HyperEVM Mainnet' : `Chain ${chainId}`}
          </span>
        </div>
        <div>
          <span className="font-medium" style={{ color: '#97fce4' }}>Balance:</span>{' '}
          <span style={{ color: '#97fce4', opacity: 0.8 }}>
            {balance} {isHyperEVM ? 'HYPE' : 'ETH'}
          </span>
        </div>
        <div>
          <span className="font-medium" style={{ color: '#97fce4' }}>Chain ID:</span>{' '}
          <span style={{ color: '#97fce4', opacity: 0.8 }}>{chainId}</span>
        </div>
        {!isCorrectNetwork && (
          <div 
            className="mt-3 p-2 rounded text-responsive-xs"
            style={{ 
              backgroundColor: '#ff6b6b', 
              opacity: 0.1, 
              borderColor: '#ff6b6b', 
              border: '1px solid',
              color: '#ff6b6b'
            }}
          >
            ⚠️ Please switch to HyperEVM network for full functionality
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;
