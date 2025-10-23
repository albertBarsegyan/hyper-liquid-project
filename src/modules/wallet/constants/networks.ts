// src/modules/wallet/networks/bsc.ts
export const bsc = {
  id: 56,
  name: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  testnet: false,
};

export const bscTestnet = {
  id: 97,
  name: 'BNB Chain Testnet',
  nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        'https://data-seed-prebsc-1-s1.binance.org:8545',
        'https://data-seed-prebsc-2-s1.binance.org:8545',
        'https://data-seed-prebsc-1-s2.binance.org:8545',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'BscScan Testnet', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
};
