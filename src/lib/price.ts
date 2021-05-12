import Binance from 'binance-api-node';

export async function getSymbolPrice(symbol: string): Promise<string> {
  const client = Binance({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });
  const prices = await client.prices({
    symbol,
  });

  const currency = symbol.includes('USDT') ? '$' : 'sats';

  return `${Number(prices[symbol])} ${currency}`;
}
