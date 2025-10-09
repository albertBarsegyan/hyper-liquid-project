# Wallet Connection Module

This module provides a complete wallet connection system for MetaMask with BNB network support.

## Features

- **MetaMask Integration**: Connect and disconnect from MetaMask wallet
- **BNB Support**: Automatic network detection and switching to BNB
- **Real-time Updates**: Listen to account and network changes
- **Balance Display**: Show wallet balance in native currency (BNB for BNB)
- **Error Handling**: Comprehensive error handling with user feedback
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Components

### WalletProvider
Context provider that manages wallet state and provides wallet functionality to child components.

### WalletButton
Interactive button component that handles wallet connection, disconnection, and network switching.

### WalletInfo
Information display component that shows wallet status, address, network, and balance.

## Usage

```tsx
import { WalletProvider, WalletButton, WalletInfo } from '@/modules/wallet';

function App() {
  return (
    <WalletProvider>
      <div>
        <WalletButton />
        <WalletInfo />
      </div>
    </WalletProvider>
  );
}
```

## Hooks

### useWallet
Custom hook that provides wallet state and methods:

```tsx
import { useWallet } from '@/modules/wallet';

function MyComponent() {
  const {
    isConnected,
    account,
    chainId,
    balance,
    connect,
    disconnect,
    switchToHyperEVM,
    refreshBalance
  } = useWallet();
  
  // Use wallet state and methods
}
```

## Network Configuration

The module includes pre-configured BNB network settings:

- **Chain ID**: 999
- **RPC URL**: https://rpc.hyperliquid.xyz/evm
- **Currency**: BNB
- **Explorer**: https://www.hyperscan.com/

## Error Handling

The module handles common errors:
- MetaMask not installed
- User rejection of connection
- Network switching failures
- RPC connection issues

## State Management

The wallet state includes:
- `isConnected`: Boolean indicating connection status
- `account`: Connected wallet address
- `chainId`: Current network chain ID
- `balance`: Wallet balance in native currency
- `isConnecting`: Loading state during connection
- `error`: Error message if any
