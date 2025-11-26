/**
 * Service for fetching cryptocurrency prices
 */

export interface BnbPriceResponse {
  binancecoin: {
    usd: number;
  };
}

/**
 * Fetches the current BNB price in USD from CoinGecko API
 * @returns Promise resolving to the BNB price in USD
 */
export async function fetchBnbPrice(): Promise<number> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
  );
  const data = await res.json<BnbPriceResponse>();
  return data.binancecoin.usd;
}

