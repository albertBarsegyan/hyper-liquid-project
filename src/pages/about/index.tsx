import React from 'react';
import { HYPER_EVM_CONFIG } from '@/modules/wallet';

const About: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About This Project
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Overview
          </h2>
          <p className="text-gray-600 mb-4">
            This is a React-based cryptocurrency test project that demonstrates
            MetaMask wallet integration with the HyperEVM network. The project
            showcases modern web3 development practices and provides a
            foundation for building decentralized applications.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Technologies Used
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>React 19 with TypeScript</li>
            <li>Vite for fast development and building</li>
            <li>React Router for client-side routing</li>
            <li>MetaMask wallet integration</li>
            <li>HyperEVM network support</li>
            <li>ESLint and Prettier for code quality</li>
            <li>Custom CSS with utility classes</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            HyperEVM Network
          </h2>
          <p className="text-blue-700 mb-4">
            HyperEVM is a high-performance Ethereum Virtual Machine compatible
            blockchain that offers fast transaction processing and low fees.
            It's designed for DeFi applications and provides a seamless
            development experience for Ethereum developers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Key Features</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• EVM compatible</li>
                <li>• Fast block times</li>
                <li>• Low transaction fees</li>
                <li>• High throughput</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Network Specs
              </h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Chain ID: {HYPER_EVM_CONFIG.chainId}</li>
                <li>• Currency: {HYPER_EVM_CONFIG.nativeCurrency.name}</li>
                <li>• RPC: {HYPER_EVM_CONFIG.rpcUrls[0]}</li>
                <li>
                  • Explorer: {HYPER_EVM_CONFIG.blockExplorerUrls?.[0] ?? ''}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
