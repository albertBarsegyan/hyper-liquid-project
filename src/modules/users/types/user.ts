export interface UserResponseDto {
  id: string;
  hashTag: string;
  walletAddress: string | null; // example: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  points: number;
  currentChallenge: ChallengeDto | null;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  coins: CoinDto[];
}

export interface ChallengeDto {
  // fill based on your backend shape
  id: string;
  name: string;
  // ...
}

export interface CoinDto {
  // fill based on your backend shape
  symbol: string;
  amount: number;
  // ...
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsersPaginatedResponse {
  users: UserResponseDto[];
  pagination: PaginationMetaDto;
}

export interface SendCoinRequest {
  toHashTag: string;
  coinName: string;
  amount: string; // string because backend receives it as string (e.g. "10.5")
  memo?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  hashTag?: string;
  minPoints?: number;
  maxPoints?: number;
  createdAfter?: string; // ISO date string
  createdBefore?: string; // ISO date string
  sortBy?: 'createdAt' | 'updatedAt' | 'points' | 'hashTag';
  sortOrder?: 'asc' | 'desc';
}
