import React from 'react';
import { WalletInfo } from '@/modules/wallet';

const Home: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            HyperEVM Wallet Connection
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your MetaMask wallet to interact with the HyperEVM network.
            This demo shows how to connect, switch networks, and display wallet
            information.
          </p>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Connect to MetaMask wallet</li>
              <li>• Automatic HyperEVM network detection</li>
              <li>• Switch to HyperEVM network with one click</li>
              <li>• Display wallet address and balance</li>
              <li>• Real-time connection status updates</li>
              <li>• Error handling and user feedback</li>
            </ul>
          </div>
        </div>

        <div>
          <WalletInfo />

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              HyperEVM Network Details
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div>
                <strong>Chain ID:</strong> 999
              </div>
              <div>
                <strong>RPC URL:</strong> https://rpc.hyperliquid.xyz/evm
              </div>
              <div>
                <strong>Currency:</strong> HYPE
              </div>
              <div>
                <strong>Explorer:</strong> https://www.hyperscan.com/
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
