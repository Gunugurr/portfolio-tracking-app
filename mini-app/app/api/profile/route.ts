import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "symbol gerekli" }, { status: 400 });

  const key = process.env.FINNHUB_API_KEY;
  if (!key) return NextResponse.json({ error: "API key eksik" }, { status: 503 });

  const res = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${key}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return NextResponse.json({ error: `Finnhub: ${res.status}` }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}
