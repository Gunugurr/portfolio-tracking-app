const BASE = "https://finnhub.io/api/v1";

function getKey(): string {
  const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_FINNHUB_API_KEY tanımlı değil. .env.local dosyasını kontrol et.");
  return key;
}

export interface Quote {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp
}

export interface Profile {
  name: string;
  ticker: string;
  logo: string;
  currency: string;
  finnhubIndustry: string;
}

async function request<T>(path: string): Promise<T> {
  const url = `${BASE}${path}&token=${getKey()}`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.");
  }

  if (res.status === 401) throw new Error("API key geçersiz. .env.local dosyasını kontrol et.");
  if (res.status === 429) throw new Error("Rate limit aşıldı. Bir dakika bekle.");
  if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

  return res.json() as Promise<T>;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const data = await request<Quote>(`/quote?symbol=${encodeURIComponent(symbol)}`);
  if (!data.c || data.c === 0) {
    throw new Error(`"${symbol}" bulunamadı veya geçersiz ticker.`);
  }
  return data;
}

export async function getProfile(symbol: string): Promise<Profile> {
  const data = await request<Profile>(`/stock/profile2?symbol=${encodeURIComponent(symbol)}`);
  if (!data.name) {
    throw new Error(`"${symbol}" için şirket bilgisi bulunamadı. Geçersiz ticker olabilir.`);
  }
  return data;
}

export interface SearchResult {
  symbol: string;
  description: string;
  type: string;
}

export async function searchSymbol(query: string): Promise<SearchResult[]> {
  if (!query) return [];
  const data = await request<{ count: number; result: SearchResult[] }>(
    `/search?q=${encodeURIComponent(query)}`
  );
  return (data.result ?? []).filter((r) => r.type === "Common Stock").slice(0, 8);
}
