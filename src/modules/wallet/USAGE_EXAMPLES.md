# Wallet Module - Usage Examples

Complete examples demonstrating the wallet module capabilities.

## Basic Connection

```tsx
import { useWalletContext } from '@/modules/wallet';

function ConnectWallet() {
  const { isConnected, account, connect, disconnect } = useWalletContext();

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect()}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

## Display Balance

```tsx
import { useWalletContext, formatAddress } from '@/modules/wallet';

function WalletBalance() {
  const { account, balance, isConnected } = useWalletContext();

  if (!isConnected) return <p>Please connect your wallet</p>;

  return (
    <div>
      <h3>Wallet Info</h3>
      <p>Address: {formatAddress(account || '')}</p>
      <p>Balance: {balance} BNB</p>
    </div>
  );
}
```

## Network Switching

```tsx
import { useWalletContext } from '@/modules/wallet';

function NetworkSwitch() {
  const { isCorrectNetwork, switchToHyperEVM } = useWalletContext();

  if (isCorrectNetwork) {
    return <p>✅ Connected to BSC</p>;
  }

  return (
    <div>
      <p>⚠️ Wrong network detected</p>
      <button onClick={switchToHyperEVM}>
        Switch to BSC
      </button>
    </div>
  );
}
```

## Send Transaction

```tsx
import { useWalletContext } from '@/modules/wallet';
import { parseEther } from 'ethers';
import { useState } from 'react';

function SendTransaction() {
  const { getProvider, isConnected } = useWalletContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSend = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      const provider = getProvider();
      if (!provider) throw new Error('No provider');

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });

      setTxHash(tx.hash);
      await tx.wait();
      alert('Transaction confirmed!');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        placeholder="Amount (BNB)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {txHash && <p>TX Hash: {txHash}</p>}
    </div>
  );
}
```

## Authentication Flow

```tsx
import { useWalletContext } from '@/modules/wallet';
import { useEffect } from 'react';

function AuthenticatedApp() {
  const {
    isAuthenticated,
    authUser,
    connect,
    loading,
  } = useWalletContext();

  useEffect(() => {
    // Auto-connect if previously authenticated
    if (!loading && !isAuthenticated) {
      // Optionally show connect prompt
    }
  }, [loading, isAuthenticated]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Please sign in</h1>
        <button onClick={() => connect()}>
          Connect & Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {authUser?.address}</h1>
      {/* Your authenticated app */}
    </div>
  );
}
```

## Error Handling

```tsx
import { useWalletContext, getWalletErrorMessage } from '@/modules/wallet';
import { useEffect } from 'react';

function ErrorHandler() {
  const { error, clearError } = useWalletContext();

  useEffect(() => {
    if (error) {
      // Show error notification
      console.error('Wallet error:', error);
      
      // Clear error after showing
      setTimeout(() => clearError(), 5000);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="error-banner">
      <p>{error}</p>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## Balance Refresh

```tsx
import { useWalletContext } from '@/modules/wallet';
import { useEffect } from 'react';

function AutoRefreshBalance() {
  const { refreshBalance, isConnected } = useWalletContext();

  // Refresh balance every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      refreshBalance();
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, refreshBalance]);

  return (
    <button onClick={refreshBalance}>
      🔄 Refresh Balance
    </button>
  );
}
```

## Using Utilities

```tsx
import {
  formatAddress,
  formatBalance,
  formatUSD,
  getExplorerUrl,
  getTxExplorerUrl,
  isValidAddress,
} from '@/modules/wallet';

function UtilityExamples() {
  const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const balance = '1500000000000000000'; // 1.5 BNB in wei
  const txHash = '0x123...';

  return (
    <div>
      {/* Format address */}
      <p>Short: {formatAddress(address)}</p>
      
      {/* Format balance */}
      <p>Balance: {formatBalance(balance)} BNB</p>
      
      {/* Format USD */}
      <p>Value: {formatUSD(1234.56)}</p>
      
      {/* Explorer links */}
      <a href={getExplorerUrl(address, 56)} target="_blank">
        View on BscScan
      </a>
      <a href={getTxExplorerUrl(txHash, 56)} target="_blank">
        View Transaction
      </a>
      
      {/* Validation */}
      {isValidAddress(address) && <p>✅ Valid address</p>}
    </div>
  );
}
```

## Conditional Rendering

```tsx
import { useWalletContext } from '@/modules/wallet';

function ConditionalContent() {
  const {
    isConnected,
    isCorrectNetwork,
    isConnecting,
    loading,
  } = useWalletContext();

  // Loading state
  if (loading || isConnecting) {
    return <div>Connecting wallet...</div>;
  }

  // Not connected
  if (!isConnected) {
    return <ConnectPrompt />;
  }

  // Wrong network
  if (!isCorrectNetwork) {
    return <WrongNetworkWarning />;
  }

  // All good
  return <YourApp />;
}
```

## With Referral System

```tsx
import { useWalletContext } from '@/modules/wallet';
import { useSearchParams } from 'react-router-dom';

function ReferralConnect() {
  const { connect } = useWalletContext();
  const [searchParams] = useSearchParams();

  const handleConnect = async () => {
    const referrerAddress = searchParams.get('ref');
    await connect(referrerAddress);
  };

  return (
    <button onClick={handleConnect}>
      Connect Wallet
    </button>
  );
}
```

## Complete Dashboard Example

```tsx
import { useWalletContext, formatAddress, formatUSD } from '@/modules/wallet';
import { useEffect, useState } from 'react';

function WalletDashboard() {
  const {
    isConnected,
    account,
    balance,
    isCorrectNetwork,
    connect,
    disconnect,
    switchToHyperEVM,
    refreshBalance,
    authUser,
    isAuthenticated,
  } = useWalletContext();

  const [bnbPrice, setBnbPrice] = useState(0);

  // Fetch BNB price (example)
  useEffect(() => {
    // Fetch from API
    setBnbPrice(300); // Mock price
  }, []);

  if (!isConnected) {
    return (
      <div className="dashboard">
        <h1>Wallet Dashboard</h1>
        <button onClick={() => connect()}>
          Connect Wallet
        </button>
      </div>
    );
  }

  const balanceUSD = parseFloat(balance || '0') * bnbPrice;

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Wallet Dashboard</h1>
        <button onClick={disconnect}>Disconnect</button>
      </div>

      <div className="wallet-info">
        <div className="card">
          <h3>Address</h3>
          <p>{formatAddress(account || '')}</p>
          <p className="full">{account}</p>
        </div>

        <div className="card">
          <h3>Balance</h3>
          <p className="large">{balance} BNB</p>
          <p className="usd">{formatUSD(balanceUSD)}</p>
          <button onClick={refreshBalance}>Refresh</button>
        </div>

        <div className="card">
          <h3>Network</h3>
          {isCorrectNetwork ? (
            <p className="success">✅ BSC Mainnet</p>
          ) : (
            <>
              <p className="warning">⚠️ Wrong Network</p>
              <button onClick={switchToHyperEVM}>
                Switch to BSC
              </button>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="card">
            <h3>Authentication</h3>
            <p className="success">✅ Authenticated</p>
            {authUser && (
              <pre>{JSON.stringify(authUser, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Testing Example

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useWalletContext } from '@/modules/wallet';

describe('Wallet Hook', () => {
  it('should connect wallet', async () => {
    const { result } = renderHook(() => useWalletContext());

    expect(result.current.isConnected).toBe(false);

    await result.current.connect();

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });
});
```

## Best Practices

1. **Always check `isConnected`** before accessing wallet data
2. **Handle errors gracefully** with `error` and `clearError`
3. **Check `isCorrectNetwork`** before transactions
4. **Use loading states** (`loading`, `isConnecting`)
5. **Refresh balance** after transactions
6. **Clear errors** after showing to users
7. **Validate addresses** before sending transactions
8. **Use utilities** for formatting and validation
9. **Handle edge cases** (no provider, rejected requests, etc.)
10. **Test thoroughly** with different wallets and networks

