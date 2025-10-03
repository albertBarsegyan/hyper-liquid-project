import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Coins,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { useWalletContext } from '@/modules/wallet';
import { formatEther } from 'ethers';

interface TokenBalance {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  price?: number;
  value?: number;
  change24h?: number;
}

const TokenPortfolio: React.FC = () => {
  const { account, isConnected, getProvider } = useWalletContext();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common ERC-20 tokens on HyperEVM (you can expand this list)
  const commonTokens = [
    {
      address: '0x0000000000000000000000000000000000000000',
      name: 'HYPE',
      symbol: 'HYPE',
      decimals: 18,
    },
  ];

  const getTokenBalance = async (tokenAddress: string): Promise<string> => {
    const provider = getProvider();
    if (!provider || !account) return '0';

    try {
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        // Native token balance
        const balance = await provider.getBalance(account);
        return balance.toString();
      } else {
        // ERC-20 token balance
        const balanceABI = '0x70a08231'; // balanceOf(address)
        const data = balanceABI + account.slice(2).padStart(64, '0');
        const result = await provider.call({ to: tokenAddress, data });
        return result || '0';
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
  };

  const fetchTokenBalances = useCallback(async () => {
    if (!account || !isConnected) return;

    setLoading(true);
    setError(null);

    try {
      const tokenBalances: TokenBalance[] = [];

      for (const token of commonTokens) {
        const balance = await getTokenBalance(token.address);
        const balanceFormatted = formatEther(balance);
        const balanceNum = parseFloat(balanceFormatted);

        // Only include tokens with non-zero balance
        if (balanceNum > 0) {
          tokenBalances.push({
            address: token.address,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            balance: balance,
            balanceFormatted: balanceFormatted,
          });
        }
      }

      setTokens(tokenBalances);
    } catch (err) {
      console.error('Error fetching token balances:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch token balances'
      );
    } finally {
      setLoading(false);
    }
  }, [account, commonTokens, getTokenBalance, isConnected]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openExplorer = (address: string) => {
    window.open(`https://www.hyperscan.com/token/${address}`, '_blank');
  };

  useEffect(() => {
    fetchTokenBalances();
  }, []);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="mr-2 h-5 w-5" />
            Token Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to view your token portfolio.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Coins className="mr-2 h-5 w-5" />
            Token Portfolio
          </CardTitle>
          <Button onClick={fetchTokenBalances} disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && tokens.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading token balances...</span>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8">
            <Coins className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No tokens found in your wallet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tokens will appear here once you receive them
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {parseFloat(token.balanceFormatted).toFixed(6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {token.symbol}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(token.address)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {token.address !==
                    '0x0000000000000000000000000000000000000000' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openExplorer(token.address)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tokens.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total Tokens</span>
              <span>{tokens.length}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenPortfolio;
