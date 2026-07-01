import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ result: [] });

  const key = process.env.FINNHUB_API_KEY;
  if (!key) return NextResponse.json({ error: "API key eksik" }, { status: 503 });

  const res = await fetch(
    `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${key}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return NextResponse.json({ error: `Finnhub: ${res.status}` }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}
