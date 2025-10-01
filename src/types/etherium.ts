export interface AddEthereumChainParameter {
  chainId: string; // 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // Usually 2-6 characters
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored by MetaMask, but part of the spec
}
