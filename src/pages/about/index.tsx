import React from 'react';
import { CHAIN_CONFIG } from '@/modules/wallet';

const About: React.FC = () => {
  return (
    <div className="container-responsive py-responsive">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-responsive-3xl font-bold mb-6"
          style={{ color: '#97fce4' }}
        >
          About This Project
        </h1>

        <div
          className="rounded-lg shadow p-responsive mb-6"
          style={{
            backgroundColor: '#021e17',
            borderColor: '#97fce4',
            border: '1px solid',
          }}
        >
          <h2
            className="text-responsive-xl font-semibold mb-4"
            style={{ color: '#97fce4' }}
          >
            Project Overview
          </h2>
          <p
            className="text-responsive-base mb-4"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            This is a React-based cryptocurrency test project that demonstrates
            MetaMask wallet integration with the BNB network. The project
            showcases modern web3 development practices and provides a
            foundation for building decentralized applications.
          </p>

          <h3
            className="text-responsive-lg font-semibold mb-3"
            style={{ color: '#97fce4' }}
          >
            Technologies Used
          </h3>
          <ul
            className="list-disc list-inside space-y-2"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            <li>React 19 with TypeScript</li>
            <li>Vite for fast development and building</li>
            <li>React Router for client-side routing</li>
            <li>MetaMask wallet integration</li>
            <li>BNB network support</li>
            <li>ESLint and Prettier for code quality</li>
            <li>Custom CSS with utility classes</li>
          </ul>
        </div>

        <div
          className="rounded-lg p-responsive"
          style={{
            backgroundColor: '#021e17',
            borderColor: '#97fce4',
            border: '1px solid',
            opacity: 0.8,
          }}
        >
          <h2
            className="text-responsive-xl font-semibold mb-4"
            style={{ color: '#97fce4' }}
          >
            BNB Network
          </h2>
          <p
            className="text-responsive-base mb-4"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            BNB is a high-performance Ethereum Virtual Machine compatible
            blockchain that offers fast transaction processing and low fees.
            It's designed for DeFi applications and provides a seamless
            development experience for Ethereum developers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-responsive-sm">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#97fce4' }}>
                Key Features
              </h4>
              <ul
                className="space-y-1"
                style={{ color: '#97fce4', opacity: 0.8 }}
              >
                <li>• EVM compatible</li>
                <li>• Fast block times</li>
                <li>• Low transaction fees</li>
                <li>• High throughput</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#97fce4' }}>
                Network Specs
              </h4>
              <ul
                className="space-y-1"
                style={{ color: '#97fce4', opacity: 0.8 }}
              >
                <li>• Chain ID: {CHAIN_CONFIG.chainId}</li>
                <li>• Currency: {CHAIN_CONFIG.nativeCurrency.name}</li>
                <li>• RPC: {CHAIN_CONFIG.rpcUrls[0]}</li>
                <li>• Explorer: {CHAIN_CONFIG.blockExplorerUrls?.[0] ?? ''}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
