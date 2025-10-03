import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  RefreshCw,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Calendar,
  Filter,
  ExternalLink,
  Clock,
  Hash,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context';
import TokenPortfolio from '@/modules/wallet/components/token-portfolio';
import { useTransactions } from '@/modules/transactions/hooks/transactions.tsx';

import type {
  TransactionItem,
  TransactionQueryParams,
} from '@/modules/transactions/types';

const defaultFilters: TransactionQueryParams = {
  filter: 'validated',
  type: 'contract_creation',
  method: 'approve',
};

export default function TransactionHistoryPage() {
  const { account, isConnected } = useWalletContext();
  const [filters, setFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'validated', label: 'Validated' },
  ];

  const typeOptions = [
    { value: 'token_transfer', label: 'Token Transfer' },
    { value: 'contract_creation', label: 'Contract Creation' },
    { value: 'contract_call', label: 'Contract Call' },
    { value: 'coin_transfer', label: 'Coin Transfer' },
    { value: 'token_creation', label: 'Token Creation' },
  ];

  const methodOptions = [
    { value: 'approve', label: 'Approve' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'multicall', label: 'Multicall' },
    { value: 'mint', label: 'Mint' },
    { value: 'commit', label: 'Commit' },
  ];

  const { data, error, isFetching, isLoading, refetch } = useTransactions(
    filters,
    Boolean(account) && isConnected
  );

  const items = data?.items ?? [];
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter(tx => {
      const inHash = tx.hash.toLowerCase().includes(query);
      const inFrom = tx.from.hash.toLowerCase().includes(query);
      const inTo = tx.to.hash.toLowerCase().includes(query);
      const inMethod = (tx.method ?? '').toLowerCase().includes(query);
      const inTypes = (tx.transaction_types ?? [])
        .join(' ')
        .toLowerCase()
        .includes(query);
      const inToken = (tx.token_transfers ?? []).some(t =>
        (t.token_symbol ?? '').toLowerCase().includes(query)
      );
      return inHash || inFrom || inTo || inMethod || inTypes || inToken;
    });
  }, [items, searchQuery]);

  const formatValue = (value: string, decimals: number = 18) => {
    const num = parseFloat(value) / Math.pow(10, decimals);
    return num.toFixed(6);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatGasPrice = (gasPrice: string) => {
    const gwei = parseFloat(gasPrice) / 1e9;
    return `${gwei.toFixed(2)} Gwei`;
  };

  const formatFee = (fee: string) => {
    const eth = parseFloat(fee) / 1e18;
    return `${eth.toFixed(6)} ETH`;
  };

  const getTransactionTypeIcon = (types: string[]) => {
    if (types.includes('coin_transfer'))
      return <ArrowUpRight className="h-4 w-4" />;
    if (types.includes('token_transfer'))
      return <ArrowDownLeft className="h-4 w-4" />;
    if (types.includes('contract_call')) return <Hash className="h-4 w-4" />;
    if (types.includes('contract_creation'))
      return <Shield className="h-4 w-4" />;
    return <ArrowUpRight className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string, result: string) => {
    if (status === 'ok' && result === 'success') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'failed' || result === 'fail') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (result === 'pending') {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-500" />;
  };

  const getTransactionDirection = (tx: TransactionItem) => {
    if (!account) return 'unknown';
    return tx.from.hash.toLowerCase() === account.toLowerCase() ? 'out' : 'in';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openExplorer = (hash: string) => {
    window.open(`https://hyperscan.com/tx/${hash}`, '_blank');
  };

  const refresh = () => {
    void refetch();
  };

  const handleFilterChange = (
    filterType: keyof TransactionQueryParams,
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  // Extract nested ternary logic into variables for better readability
  const isLoadingState = (
    <div className="text-center py-8">
      <Loader2
        className="h-8 w-8 animate-spin mx-auto mb-4"
        style={{ color: '#97fce4' }}
      />
      <p style={{ color: '#97fce4', opacity: 0.8 }}>Loading transactions...</p>
    </div>
  );

  const noTransactionsState = (
    <p className="text-center py-4" style={{ color: '#97fce4', opacity: 0.8 }}>
      No transactions found
    </p>
  );

  const noSearchResultsState = (
    <p className="text-center py-4" style={{ color: '#97fce4', opacity: 0.8 }}>
      No transactions match your search
    </p>
  );

  const renderTransactionsList = () => {
    if (filteredItems.length === 0) {
      return noSearchResultsState;
    }

    return filteredItems.map((tx: TransactionItem) => {
      const direction = getTransactionDirection(tx);
      const isOutgoing = direction === 'out';

      return (
        <Card
          key={tx.hash}
          className="transition-all hover:shadow-lg"
          style={{
            backgroundColor: '#0e1e27',
            borderColor: '#97fce4',
            borderWidth: '1px',
          }}
        >
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#97fce4',
                    opacity: 0.2,
                  }}
                >
                  {getTransactionTypeIcon(tx.transaction_types)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold" style={{ color: '#97fce4' }}>
                      {isOutgoing ? 'Sent' : 'Received'}
                    </h3>
                    {getStatusIcon(tx.status, tx.result)}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: '#97fce4', opacity: 0.7 }}
                  >
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  style={{
                    backgroundColor: tx.status === 'ok' ? '#97fce4' : '#ff6b6b',
                    color: tx.status === 'ok' ? '#0e1e27' : '#ffffff',
                  }}
                >
                  {tx.status === 'ok' ? 'Success' : 'Failed'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(tx.hash)}
                  style={{ color: '#97fce4' }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openExplorer(tx.hash)}
                  style={{ color: '#97fce4' }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  {isOutgoing ? 'To' : 'From'}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm" style={{ color: '#97fce4' }}>
                    {formatAddress(isOutgoing ? tx.to.hash : tx.from.hash)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(isOutgoing ? tx.to.hash : tx.from.hash)
                    }
                    className="h-6 w-6 p-0"
                    style={{ color: '#97fce4' }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Value
                </p>
                <p className="font-semibold" style={{ color: '#97fce4' }}>
                  {formatValue(tx.value)} ETH
                </p>
              </div>
            </div>

            {/* Gas Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Gas Used
                </p>
                <p className="text-sm" style={{ color: '#97fce4' }}>
                  {parseInt(tx.gas_used).toLocaleString()}
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Gas Price
                </p>
                <p className="text-sm" style={{ color: '#97fce4' }}>
                  {formatGasPrice(tx.gas_price)}
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Transaction Fee
                </p>
                <p className="text-sm" style={{ color: '#97fce4' }}>
                  {formatFee(tx.fee.value)}
                </p>
              </div>
            </div>

            {/* Transaction Types and Additional Info */}
            <div className="flex flex-wrap items-center gap-2">
              {tx.transaction_types.map((type, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: '#97fce4',
                    opacity: 0.3,
                    color: '#0e1e27',
                  }}
                >
                  {type.replace('_', ' ')}
                </Badge>
              ))}

              {tx.confirmations > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: '#97fce4',
                    opacity: 0.3,
                    color: '#0e1e27',
                  }}
                >
                  {tx.confirmations} confirmations
                </Badge>
              )}

              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: '#97fce4',
                  opacity: 0.3,
                  color: '#0e1e27',
                }}
              >
                Block #{tx.block_number}
              </Badge>
            </div>

            {/* Method and Contract Info */}
            {tx.method && tx.method !== '0x00000000' && (
              <div
                className="mt-3 pt-3 border-t"
                style={{ borderColor: '#97fce4', opacity: 0.3 }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Method
                </p>
                <p className="font-mono text-sm" style={{ color: '#97fce4' }}>
                  {tx.method}
                </p>
              </div>
            )}

            {/* Token Transfers */}
            {tx.token_transfers && tx.token_transfers.length > 0 && (
              <div
                className="mt-3 pt-3 border-t"
                style={{ borderColor: '#97fce4', opacity: 0.3 }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Token Transfers
                </p>
                <div className="space-y-1">
                  {tx.token_transfers.map((transfer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span style={{ color: '#97fce4', opacity: 0.8 }}>
                        {transfer.token_symbol ?? 'Token'}
                      </span>
                      <span style={{ color: '#97fce4' }}>
                        {formatValue(
                          transfer.value,
                          transfer.token_decimals ?? 18
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    });
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-6 py-8 min-h-full flex items-center justify-center">
        <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
          <CardContent className="p-8 text-center">
            <AlertTriangle
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: '#97fce4' }}
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: '#97fce4' }}
            >
              Wallet Not Connected
            </h2>
            <p style={{ color: '#97fce4', opacity: 0.8 }}>
              Please connect your wallet to view transaction history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#97fce4' }}>
            Transaction History
          </h1>
          <p
            className="text-muted-foreground"
            style={{ color: '#97fce4', opacity: 0.8 }}
          >
            View your recent transactions and token transfers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={refresh}
            disabled={isFetching}
            style={{
              backgroundColor: '#97fce4',
              color: '#0e1e27',
              border: 'none',
            }}
          >
            {isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {Boolean(error.message) && 'Failed to fetch transactions'}
          </AlertDescription>
        </Alert>
      )}
      <TokenPortfolio />

      <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
        <CardHeader>
          <CardTitle className="flex items-center" style={{ color: '#97fce4' }}>
            <Filter className="mr-2 h-5 w-5" />
            Filter Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{ color: '#97fce4' }}
              >
                Status
              </label>
              <select
                value={filters.filter}
                onChange={e => handleFilterChange('filter', e.target.value)}
                className="w-full p-2 border rounded-md"
                style={{
                  backgroundColor: '#0e1e27',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                }}
              >
                {filterOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{ backgroundColor: '#0e1e27' }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{ color: '#97fce4' }}
              >
                Type
              </label>
              <select
                value={filters.type}
                onChange={e => handleFilterChange('type', e.target.value)}
                className="w-full p-2 border rounded-md"
                style={{
                  backgroundColor: '#0e1e27',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                }}
              >
                {typeOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{ backgroundColor: '#0e1e27' }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Method Filter */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{ color: '#97fce4' }}
              >
                Method
              </label>
              <select
                value={filters.method}
                onChange={e => handleFilterChange('method', e.target.value)}
                className="w-full p-2 border rounded-md"
                style={{
                  backgroundColor: '#0e1e27',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                }}
              >
                {methodOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{ backgroundColor: '#0e1e27' }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              style={{
                borderColor: '#97fce4',
                color: '#97fce4',
                backgroundColor: 'transparent',
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-8">
        <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
          <CardHeader className="flex flex-col gap-4">
            <CardTitle
              className="flex items-center"
              style={{ color: '#97fce4' }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <div className="relative w-full">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hash, address, method, type, token"
                className="pl-9 pr-3 py-2 text-xl rounded-md border w-full"
                style={{
                  backgroundColor: '#0e1e27',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                  minWidth: '280px',
                }}
              />
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: '#97fce4', opacity: 0.7 }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              if (isLoading) return isLoadingState;
              if (items.length === 0) return noTransactionsState;
              return (
                <div className="space-y-4">{renderTransactionsList()}</div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
