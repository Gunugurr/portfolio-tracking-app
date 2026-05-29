const KEY = "portfoy_holdings";

export interface Holding {
  symbol: string;
  name: string;
  qty: number;
  buyPrice: number;
  addedAt: string;
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getHoldings(): Holding[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Holding[]) : [];
  } catch {
    return [];
  }
}

export function setHoldings(holdings: Holding[]): void {
  if (!isClient()) return;
  localStorage.setItem(KEY, JSON.stringify(holdings));
}

export function addHolding(h: Holding): void {
  const holdings = getHoldings();
  const idx = holdings.findIndex((x) => x.symbol === h.symbol);
  if (idx !== -1) {
    holdings[idx] = { ...holdings[idx], qty: h.qty, buyPrice: h.buyPrice };
  } else {
    holdings.push(h);
  }
  setHoldings(holdings);
}

export function removeHolding(symbol: string): void {
  const holdings = getHoldings().filter((h) => h.symbol !== symbol);
  setHoldings(holdings);
}

export function updateHolding(symbol: string, partial: Partial<Holding>): void {
  const holdings = getHoldings();
  const idx = holdings.findIndex((h) => h.symbol === symbol);
  if (idx !== -1) {
    holdings[idx] = { ...holdings[idx], ...partial };
    setHoldings(holdings);
  }
}
