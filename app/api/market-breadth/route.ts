import { NextResponse } from "next/server";

// S&P 500'ün en büyük 50 hissesi — piyasa nabzı için iyi bir örnek
const MARKET_SAMPLE = [
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "BRK.B", "JPM", "V",
  "LLY",  "AVGO", "MA",   "UNH",  "XOM",   "JNJ",  "HD",   "PG",    "ABBV","MRK",
  "CVX",  "KO",   "PEP",  "BAC",  "ADBE",  "CRM",  "MCD",  "CSCO",  "WMT", "TXN",
  "NFLX", "DIS",  "TMO",  "ABT",  "PM",    "GE",   "NEE",  "VZ",    "COST","ACN",
  "MDT",  "HON",  "IBM",  "UNP",  "RTX",   "LOW",  "INTC", "AMGN",  "SBUX","AXP",
];

export async function GET() {
  const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "API key yok" }, { status: 503 });
  }

  const results = await Promise.all(
    MARKET_SAMPLE.map(async (sym) => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${key}`,
          { next: { revalidate: 300 } } // 5 dk server-side cache
        );
        if (!res.ok) return null;
        const data = await res.json();
        return typeof data.dp === "number" && data.c > 0 ? data.dp : null;
      } catch {
        return null;
      }
    })
  );

  const valid = results.filter((dp): dp is number => dp !== null);
  if (valid.length === 0) {
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 502 });
  }

  return NextResponse.json({
    gainers:   valid.filter((dp) => dp > 0).length,
    losers:    valid.filter((dp) => dp < 0).length,
    unchanged: valid.filter((dp) => dp === 0).length,
    total:     valid.length,
  });
}
