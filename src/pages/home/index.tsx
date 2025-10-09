import React from 'react';
import { WalletInfo } from '@/modules/wallet';

const Home: React.FC = () => {
  return (
    <div className="container-responsive py-responsive">
      <div className="grid-responsive-2 gap-6">
        <div>
          <h2
            className="text-responsive-2xl font-bold mb-4"
            style={{ color: '#97fce4' }}
          >
            BNB Wallet Connection
          </h2>
          <p
            className="text-responsive-base mb-6"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            Connect your MetaMask wallet to interact with the BNB network. This
            demo shows how to connect, switch networks, and display wallet
            information.
          </p>

          <div
            className="p-responsive rounded-lg shadow"
            style={{
              backgroundColor: '#021e17',
              borderColor: '#97fce4',
              border: '1px solid',
            }}
          >
            <h3
              className="text-responsive-lg font-semibold mb-4"
              style={{ color: '#97fce4' }}
            >
              Features
            </h3>
            <ul
              className="space-y-2"
              style={{ color: '#97fce4', opacity: 0.8 }}
            >
              <li>• Connect to MetaMask wallet</li>
              <li>• Automatic BNB network detection</li>
              <li>• Switch to BNB network with one click</li>
              <li>• Display wallet address and balance</li>
              <li>• Real-time connection status updates</li>
              <li>• Error handling and user feedback</li>
            </ul>
          </div>
        </div>

        <div>
          <WalletInfo />

          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: '#021e17',
              borderColor: '#97fce4',
              border: '1px solid',
              opacity: 0.8,
            }}
          >
            <h3
              className="text-responsive-lg font-semibold mb-2"
              style={{ color: '#97fce4' }}
            >
              BNB Network Details
            </h3>
            <div
              className="text-responsive-sm space-y-1"
              style={{ color: '#97fce4', opacity: 0.8 }}
            >
              <div>
                <strong>Chain ID:</strong> 999
              </div>
              <div>
                <strong>Currency:</strong> BNB
              </div>
              <div>
                <strong>Explorer:</strong> https://bscscan.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
