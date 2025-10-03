export interface TransactionQueryParams {
  filter?: 'pending' | 'validated';
  type?:
    | 'token_transfer'
    | 'contract_creation'
    | 'contract_call'
    | 'coin_transfer'
    | 'token_creation';
  method?: 'approve' | 'transfer' | 'multicall' | 'mint' | 'commit';
  page?: number;
  limit?: number;
}

export interface TransactionResponse {
  items: TransactionItem[];
  next_page_params?: {
    block_number: number;
    index: number;
    items_count: number;
  };
}

export interface TransactionItem {
  priority_fee: string;
  raw_input: string;
  is_pending_update: boolean;
  result: 'success' | 'fail' | 'pending';
  hash: string;
  max_fee_per_gas: string;
  revert_reason: string | null;
  confirmation_duration: [number, number];
  transaction_burnt_fee: string;
  type: number;
  token_transfers_overflow: null | boolean;
  confirmations: number;
  position: number;
  max_priority_fee_per_gas: string;
  transaction_tag: string | null;
  created_contract: string | null;
  value: string;
  from: TransactionParty;
  gas_used: string;
  status: 'ok' | 'failed' | 'pending';
  to: TransactionParty;
  authorization_list: Authorization[];
  method: string;
  fee: TransactionFee;
  actions: TransactionAction[];
  gas_limit: string;
  gas_price: string;
  decoded_input: DecodedInput | null;
  token_transfers: TokenTransfer[] | null;
  base_fee_per_gas: string;
  timestamp: string; // ISO datetime
  nonce: number;
  historic_exchange_rate: number | null;
  transaction_types: (
    | 'contract_call'
    | 'token_transfer'
    | 'contract_creation'
    | 'coin_transfer'
    | 'token_creation'
  )[];
  exchange_rate: number | null;
  block_number: number;
  has_error_in_internal_transactions: boolean | null;
}

export interface TransactionParty {
  ens_domain_name: string | null;
  hash: string;
  implementations: string[];
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: Record<string, unknown> | null;
  name: string | null;
  private_tags: string[];
  proxy_type: string | null;
  public_tags: string[];
  reputation: 'ok' | 'scam' | 'suspicious';
  watchlist_names: string[];
}

export interface TransactionFee {
  type: 'actual' | 'estimated';
  value: string;
}

export interface Authorization {
  address?: string;
  type?: string;
}

export interface TransactionAction {
  type?: string;
  from?: string;
  to?: string;
  value?: string;
  method?: string;
}

export interface DecodedInput {
  method_call: string;
  method_id: string;
  parameters: {
    name: string;
    type: string;
    value: string | string[];
  }[];
}

export interface TokenTransfer {
  token_address: string;
  from: string;
  to: string;
  value: string;
  token_symbol?: string;
  token_decimals?: number;
}
