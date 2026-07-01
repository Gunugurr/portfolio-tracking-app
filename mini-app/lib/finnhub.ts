export interface Quote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface Profile {
  name: string;
  ticker: string;
  logo: string;
  currency: string;
  finnhubIndustry: string;
}

export interface SearchResult {
  symbol: string;
  description: string;
  type: string;
}

async function request<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path);
  } catch {
    throw new Error("Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.");
  }

  if (res.status === 503) throw new Error("API key eksik. Sunucu yapılandırmasını kontrol et.");
  if (res.status === 429) throw new Error("Rate limit aşıldı. Bir dakika bekle.");
  if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

  return res.json() as Promise<T>;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const data = await request<Quote>(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
  if (!data.c || data.c === 0) {
    throw new Error(`"${symbol}" bulunamadı veya geçersiz ticker.`);
  }
  return data;
}

export async function getProfile(symbol: string): Promise<Profile> {
  const data = await request<Profile>(`/api/profile?symbol=${encodeURIComponent(symbol)}`);
  if (!data.name) {
    throw new Error(`"${symbol}" için şirket bilgisi bulunamadı. Geçersiz ticker olabilir.`);
  }
  return data;
}

export async function searchSymbol(query: string): Promise<SearchResult[]> {
  if (!query) return [];
  const data = await request<{ count: number; result: SearchResult[] }>(
    `/api/search?q=${encodeURIComponent(query)}`
  );
  return (data.result ?? []).filter((r) => r.type === "Common Stock").slice(0, 8);
}
