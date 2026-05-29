"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import SummaryCard from "@/components/SummaryCard";
import AddStock from "@/components/AddStock";
import PortfolioTable from "@/components/PortfolioTable";
import ChartModal from "@/components/ChartModal";
import MarketView from "@/components/MarketView";
import TickerBand from "@/components/TickerBand";
import Footer from "@/components/Footer";
import { StockRowData } from "@/components/StockRow";
import { getQuote, getProfile, Quote } from "@/lib/finnhub";
import { getHoldings, addHolding, removeHolding, Holding } from "@/lib/storage";
import { getAlerts, persistAlerts } from "@/lib/alerts";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TOP_50 } from "@/lib/market";
import { useLanguage } from "@/lib/LanguageContext";
import { tFmt } from "@/lib/i18n";

type Tab = "market" | "portfolio";

export default function Page() {
  const { s } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("market");
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});
  const [loadingSymbols, setLoadingSymbols] = useState<Set<string>>(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);
  const [marketQuotes, setMarketQuotes] = useState<Record<string, Quote>>({});
  const [loadingMarket, setLoadingMarket] = useState(true);

  // Otomatik yenileme countdown (saniye)
  const [countdown, setCountdown] = useState(60);
  const [refreshFlash, setRefreshFlash] = useState(false);

  // Fiyat alarmları
  const [alerts, setAlerts] = useState<Record<string, number>>({});
  const [alertBanners, setAlertBanners] = useState<{ symbol: string; price: number; target: number }[]>([]);

  // Stale closure önlemek için holdings ref
  const holdingsRef = useRef<Holding[]>([]);
  useEffect(() => { holdingsRef.current = holdings; }, [holdings]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchQuotes(symbols: string[]) {
    if (symbols.length === 0) {
      setIsInitialLoading(false);
      setIsRefreshing(false);
      return;
    }
    setLoadingSymbols(new Set(symbols));
    const results = await Promise.all(
      symbols.map(async (sym) => {
        try {
          const q = await getQuote(sym);
          return { sym, quote: q, error: null };
        } catch (err) {
          return { sym, quote: null, error: (err as Error).message };
        }
      })
    );
    const newQuotes: Record<string, Quote> = {};
    const newErrors: Record<string, string> = {};
    results.forEach(({ sym, quote, error }) => {
      if (quote) newQuotes[sym] = quote;
      if (error) newErrors[sym] = error;
    });
    setQuotes((prev) => ({ ...prev, ...newQuotes }));
    setQuoteErrors((prev) => ({ ...prev, ...newErrors }));
    setLoadingSymbols(new Set());
    setLastUpdated(new Date());
    setIsInitialLoading(false);
    setIsRefreshing(false);
  }

  // Piyasa verisi — sessiz (loadingMarket değiştirmez, mevcut veriyle merge eder)
  async function fetchMarketSilent() {
    const results = await Promise.all(
      TOP_50.map(async (s) => {
        try { return { symbol: s.symbol, q: await getQuote(s.symbol) }; }
        catch { return { symbol: s.symbol, q: null }; }
      })
    );
    const newQ: Record<string, Quote> = {};
    results.forEach(({ symbol, q }) => { if (q) newQ[symbol] = q; });
    setMarketQuotes((prev) => ({ ...prev, ...newQ }));
  }

  // İlk yükleme
  useEffect(() => {
    const saved = getHoldings();
    setHoldings(saved);
    fetchQuotes(saved.map((h) => h.symbol));

    async function fetchMarket() {
      const BATCH = 10;
      const acc: Record<string, Quote> = {};
      for (let i = 0; i < TOP_50.length; i += BATCH) {
        const slice = TOP_50.slice(i, i + BATCH);
        const results = await Promise.all(
          slice.map(async (s) => {
            try { return { symbol: s.symbol, q: await getQuote(s.symbol) }; }
            catch { return { symbol: s.symbol, q: null }; }
          })
        );
        results.forEach(({ symbol, q }) => { if (q) acc[symbol] = q; });
        setMarketQuotes({ ...acc });
        if (i === 0) setLoadingMarket(false);
        if (i + BATCH < TOP_50.length) await new Promise(r => setTimeout(r, 250));
      }
    }
    fetchMarket();
  }, []);

  // Alarm yükleme + bildirim izni
  useEffect(() => {
    setAlerts(getAlerts());
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Alarm kontrolü — quotes her güncellendiğinde
  useEffect(() => {
    if (Object.keys(quotes).length === 0) return;
    const triggered: { symbol: string; price: number; target: number }[] = [];

    setAlerts((prev) => {
      const next = { ...prev };
      Object.entries(prev).forEach(([symbol, target]) => {
        const q = quotes[symbol];
        if (q && q.c >= target) {
          triggered.push({ symbol, price: q.c, target });
          delete next[symbol];
        }
      });
      if (triggered.length > 0) persistAlerts(next);
      return next;
    });

    if (triggered.length > 0) {
      setAlertBanners((prev) => [...prev, ...triggered]);
      triggered.forEach(({ symbol, price, target }) => {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          new Notification(tFmt(s.alertNotifTitle, { sym: symbol }), {
            body: tFmt(s.alertNotifBody, { target: formatCurrency(target), price: formatCurrency(price) }),
          });
        }
      });
    }
  }, [quotes]);

  // Otomatik yenileme — her saniye countdown, 0'da refresh
  const autoRefreshRef = useRef<() => void>(() => {});
  autoRefreshRef.current = () => {
    const syms = holdingsRef.current.map((h) => h.symbol);
    if (syms.length > 0) fetchQuotes(syms);
    fetchMarketSilent();
    fetchMarketBreadth();
    setRefreshFlash(true);
    setTimeout(() => setRefreshFlash(false), 1500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setTimeout(() => autoRefreshRef.current(), 0);
          return 60;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSetAlert(symbol: string, price: number | null) {
    setAlerts((prev) => {
      const next = { ...prev };
      if (price === null) delete next[symbol];
      else next[symbol] = price;
      persistAlerts(next);
      return next;
    });
  }

  async function handleAdd(ticker: string, qty: number, buyPrice: number) {
    setIsAdding(true);
    try {
      const profile = await getProfile(ticker);
      const quote = await getQuote(ticker);
      addHolding({ symbol: ticker, name: profile.name, qty, buyPrice, addedAt: new Date().toISOString() });
      const updated = getHoldings();
      setHoldings(updated);
      setQuotes((prev) => ({ ...prev, [ticker]: quote }));
      setQuoteErrors((prev) => { const next = { ...prev }; delete next[ticker]; return next; });
    } finally {
      setIsAdding(false);
    }
  }

  async function handleAddFromMarket(symbol: string, name: string, qty: number, buyPrice: number) {
    const quote = await getQuote(symbol);
    addHolding({ symbol, name, qty, buyPrice, addedAt: new Date().toISOString() });
    const updated = getHoldings();
    setHoldings(updated);
    setQuotes((prev) => ({ ...prev, [symbol]: quote }));
    setQuoteErrors((prev) => { const next = { ...prev }; delete next[symbol]; return next; });
    showToast(tFmt(s.addedToPortfolio, { sym: symbol }));
  }

  function handleRemove(symbol: string) {
    removeHolding(symbol);
    setHoldings(getHoldings());
    setQuotes((prev) => { const next = { ...prev }; delete next[symbol]; return next; });
  }

  function handleRefresh() {
    setCountdown(60);
    setIsRefreshing(true);
    fetchMarketBreadth();
    fetchQuotes(holdings.map((h) => h.symbol)).catch(() => {
      showToast(s.fetchError);
      setIsRefreshing(false);
    });
  }

  const rows: StockRowData[] = holdings.map((h) => {
    const q = quotes[h.symbol];
    const isLoading = loadingSymbols.has(h.symbol);
    const error = quoteErrors[h.symbol];
    return {
      symbol: h.symbol,
      name: h.name,
      qty: h.qty,
      buyPrice: h.buyPrice,
      currentPrice: q?.c ?? 0,
      change: q?.d ?? 0,
      changePercent: q?.dp ?? 0,
      isLoading,
      error,
    };
  });

  const summary = useMemo(() => {
    let totalValue = 0;
    let dailyDelta = 0;
    let totalPnl = 0;
    let totalBuy = 0;
    holdings.forEach((h) => {
      const q = quotes[h.symbol];
      if (!q) return;
      totalValue += q.c * h.qty;
      dailyDelta += q.d * h.qty;
      totalPnl += (q.c - h.buyPrice) * h.qty;
      totalBuy += h.buyPrice * h.qty;
    });
    const dailyDeltaPct = totalValue > 0 ? (dailyDelta / (totalValue - dailyDelta)) * 100 : 0;
    const totalPnlPct = totalBuy > 0 ? (totalPnl / totalBuy) * 100 : 0;
    return { totalValue, dailyDelta, dailyDeltaPct, totalPnl, totalPnlPct };
  }, [holdings, quotes]);

  const portfolioSymbols = useMemo(() => new Set(holdings.map((h) => h.symbol)), [holdings]);

  const mergedMarketQuotes = useMemo(
    () => ({ ...quotes, ...marketQuotes }),
    [quotes, marketQuotes]
  );

  const [marketStats, setMarketStats] = useState<{
    gainers: number; losers: number; unchanged: number; total: number;
  } | null>(null);

  function fetchMarketBreadth() {
    fetch("/api/market-breadth")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !data.error && data.total > 0) setMarketStats(data);
      })
      .catch(() => {});
  }

  useEffect(() => {
    fetchMarketBreadth();
    const interval = setInterval(fetchMarketBreadth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <TickerBand quotes={marketQuotes} loading={loadingMarket} />
      <main className="max-w-5xl mx-auto px-6 py-8 md:px-12 md:py-12 flex flex-col gap-6 flex-1 w-full">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isLoading={isRefreshing}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          marketStats={marketStats}
          countdown={countdown}
          refreshFlash={refreshFlash}
        />

        {/* Alarm bildirimleri */}
        {alertBanners.length > 0 && (
          <div className="flex flex-col gap-2">
            {alertBanners.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ background: "var(--color-orange)", color: "#1a1a1a" }}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>🔔</span>
                  <span>{tFmt(s.alertBanner, { sym: b.symbol, target: formatCurrency(b.target), price: formatCurrency(b.price) })}</span>
                </div>
                <button
                  onClick={() => setAlertBanners((prev) => prev.filter((_, idx) => idx !== i))}
                  className="ml-4 opacity-70 hover:opacity-100 font-bold text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "market" && (
          <MarketView
            marketQuotes={mergedMarketQuotes}
            loadingMarket={loadingMarket}
            onAddToPortfolio={handleAddFromMarket}
            portfolioSymbols={portfolioSymbols}
            onGoToPortfolio={() => setActiveTab("portfolio")}
          />
        )}

        {activeTab === "portfolio" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard label={s.totalValue} value={formatCurrency(summary.totalValue)} />
              <SummaryCard
                label={s.dailyChange}
                value={formatCurrency(Math.abs(summary.dailyDelta))}
                delta={formatPercent(summary.dailyDeltaPct)}
                deltaPositive={summary.dailyDelta >= 0}
              />
              <SummaryCard
                label={s.totalPnl}
                value={formatCurrency(Math.abs(summary.totalPnl))}
                delta={formatPercent(summary.totalPnlPct)}
                deltaPositive={summary.totalPnl >= 0}
              />
            </div>
            <AddStock onAdd={handleAdd} isLoading={isAdding} />
            <PortfolioTable
              rows={rows}
              alerts={alerts}
              onSetAlert={handleSetAlert}
              onRemove={handleRemove}
              onSelect={(symbol, name) => setSelectedStock({ symbol, name })}
              isInitialLoading={isInitialLoading}
            />
          </>
        )}

        {selectedStock && (
          <ChartModal
            symbol={selectedStock.symbol}
            name={selectedStock.name}
            onClose={() => setSelectedStock(null)}
          />
        )}

        {toast && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-sm font-medium"
            style={{ background: "var(--color-bg-3)", color: "var(--color-text)", border: "1px solid var(--color-line)" }}
          >
            {toast}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
