"use client";

import { useState, useRef } from "react";
import { searchSymbol, getQuote, SearchResult, Quote } from "@/lib/finnhub";
import { formatCurrency, formatPercent } from "@/lib/utils";
import FlashNumber from "@/components/FlashNumber";
import { TOP_50 } from "@/lib/market";

const PAGE_SIZE = 10;
import ChartModal from "@/components/ChartModal";
import WinnerLoser from "@/components/WinnerLoser";

interface AddModal {
  symbol: string;
  name: string;
}

interface Props {
  marketQuotes: Record<string, Quote>;
  loadingMarket: boolean;
  onAddToPortfolio: (symbol: string, name: string, qty: number, buyPrice: number) => Promise<void>;
  portfolioSymbols: Set<string>;
  onGoToPortfolio: () => void;
}

export default function MarketView({ marketQuotes, loadingMarket, onAddToPortfolio, portfolioSymbols, onGoToPortfolio }: Props) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuotes, setSearchQuotes] = useState<Record<string, Quote>>({});
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSearchQuotes, setLoadingSearchQuotes] = useState<Set<string>>(new Set());
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [addQty, setAddQty] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);
  const [page, setPage] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleQueryChange(val: string) {
    setQuery(val);
    setPage(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSearchResults([]);
      setSearchQuotes({});
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await searchSymbol(val);
        setSearchResults(res);
        const syms = res.map((r) => r.symbol);
        setLoadingSearchQuotes(new Set(syms));
        const quoteResults = await Promise.all(
          syms.map(async (sym) => {
            try { return { sym, q: await getQuote(sym) }; }
            catch { return { sym, q: null }; }
          })
        );
        const newQ: Record<string, Quote> = {};
        quoteResults.forEach(({ sym, q }) => { if (q) newQ[sym] = q; });
        setSearchQuotes(newQ);
      } finally {
        setLoadingSearch(false);
        setLoadingSearchQuotes(new Set());
      }
    }, 500);
  }

  const isSearching = !!query.trim();
  const allRows = isSearching ? searchResults : TOP_50;
  const activeQuotes = isSearching ? searchQuotes : marketQuotes;
  const isLoadingRows = isSearching ? loadingSearch : loadingMarket;

  const totalPages = Math.ceil(allRows.length / PAGE_SIZE);
  const activeRows = isSearching
    ? allRows
    : allRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function openModal(r: SearchResult) {
    const currentPrice = activeQuotes[r.symbol]?.c;
    setAddModal({ symbol: r.symbol, name: r.description });
    setAddPrice(currentPrice ? currentPrice.toFixed(2) : "");
    setAddQty("1");
  }

  async function handleAdd() {
    if (!addModal) return;
    const qty = parseFloat(addQty);
    const price = parseFloat(addPrice);
    if (!qty || !price || qty <= 0 || price <= 0) return;
    setAdding(true);
    try {
      await onAddToPortfolio(addModal.symbol, addModal.name, qty, price);
      setAddModal(null);
      setAddQty("");
      setAddPrice("");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <WinnerLoser marketQuotes={marketQuotes} loading={loadingMarket} />
      {/* Arama */}
      <div className="relative">
        <input
          type="text"
          placeholder="Hisse ara... (örn. AAPL, Tesla)"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none"
          style={{
            background: "var(--color-bg-2)",
            border: "1px solid var(--color-line)",
            color: "var(--color-text)",
          }}
        />
        {loadingSearch && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: "var(--color-text-2)" }}>
            ↻
          </span>
        )}
      </div>

      {/* Tablo başlık + sayfalama */}
      {(!isLoadingRows || activeRows.length > 0) && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>
            {!isSearching
              ? `En Popüler 50 Hisse — Sayfa ${page + 1} / ${totalPages || 1}`
              : "Arama Sonuçları"}
          </span>

          {!isSearching && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-2.5 py-1 rounded text-xs font-medium transition-opacity disabled:opacity-30"
                style={{ background: "var(--color-bg-3)", color: "var(--color-text-2)", border: "1px solid var(--color-line)" }}
              >
                ←
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className="w-7 h-7 rounded text-xs font-semibold transition-colors"
                  style={{
                    background: page === i ? "var(--color-orange)" : "var(--color-bg-3)",
                    color: page === i ? "#1a1a1a" : "var(--color-text-2)",
                    border: page === i ? "none" : "1px solid var(--color-line)",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-2.5 py-1 rounded text-xs font-medium transition-opacity disabled:opacity-30"
                style={{ background: "var(--color-bg-3)", color: "var(--color-text-2)", border: "1px solid var(--color-line)" }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tablo */}
      {(isLoadingRows || activeRows.length > 0) && (
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--color-line)", height: 565 }}
        >
          <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 42 }} />
              <col style={{ width: 95 }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 95 }} />
              <col style={{ width: 155 }} />
            </colgroup>
            <thead>
              <tr style={{ background: "var(--color-bg-2)", borderBottom: "1px solid var(--color-line)" }}>
                <th className="text-center px-2 py-3 font-medium" style={{ color: "var(--color-text-3)" }}>#</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--color-text-2)" }}>Sembol</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--color-text-2)" }}>Şirket</th>
                <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--color-text-2)" }}>Fiyat</th>
                <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--color-text-2)" }}>Değişim</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: "var(--color-text-2)" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingRows
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i} style={{ height: 52, borderTop: i > 0 ? "1px solid var(--color-line)" : undefined, background: "var(--color-bg)" }}>
                      {[28, 60, 200, 80, 70, 100].map((w, j) => (
                        <td key={j} className="px-2">
                          <div className="rounded animate-pulse mx-auto" style={{ height: 14, width: w, background: "var(--color-bg-3)" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : activeRows.map((r, i) => {
                    const rank = isSearching ? i + 1 : page * PAGE_SIZE + i + 1;
                    const q = activeQuotes[r.symbol];
                    const isLoadingQ = loadingSearchQuotes.has(r.symbol);
                    const inPortfolio = portfolioSymbols.has(r.symbol);
                    const positive = (q?.dp ?? 0) >= 0;
                    return (
                      <tr
                        key={r.symbol}
                        onClick={() => setSelectedStock({ symbol: r.symbol, name: r.description })}
                        className="cursor-pointer transition-colors"
                        style={{ height: 52, borderTop: i > 0 ? "1px solid var(--color-line)" : undefined, background: "var(--color-bg)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg)")}
                      >
                        <td className="px-2 text-center font-mono text-xs" style={{ color: "var(--color-text-3)" }}>
                          {rank}
                        </td>
                        <td className="px-4 font-mono font-semibold" style={{ color: "var(--color-orange)" }}>
                          {r.symbol}
                        </td>
                        <td className="px-4 truncate" style={{ color: "var(--color-text)", maxWidth: 0 }}>
                          {r.description}
                        </td>
                        <td className="px-4 text-right font-mono" style={{ color: "var(--color-text)" }}>
                          {isLoadingQ ? (
                            <span className="animate-pulse" style={{ color: "var(--color-text-2)" }}>...</span>
                          ) : q ? (
                            <FlashNumber value={q.c} style={{ color: "var(--color-text)" }}>
                              {formatCurrency(q.c)}
                            </FlashNumber>
                          ) : (
                            <span style={{ color: "var(--color-text-2)" }}>-</span>
                          )}
                        </td>
                        <td className="px-4 text-right font-mono">
                          {isLoadingQ ? (
                            <span className="animate-pulse" style={{ color: "var(--color-text-2)" }}>...</span>
                          ) : q ? (
                            <FlashNumber
                              value={q.dp}
                              style={{ color: positive ? "var(--color-green)" : "var(--color-red)" }}
                            >
                              {formatPercent(q.dp)}
                            </FlashNumber>
                          ) : (
                            <span style={{ color: "var(--color-text-2)" }}>-</span>
                          )}
                        </td>
                        <td className="px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedStock({ symbol: r.symbol, name: r.description }); }}
                              className="px-2.5 py-1 rounded text-xs font-medium border transition-opacity hover:opacity-70"
                              style={{ color: "var(--color-text-2)", border: "1px solid var(--color-line)", background: "var(--color-bg-3)" }}
                            >
                              Grafik
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); if (inPortfolio) { onGoToPortfolio(); } else { openModal(r); } }}
                              className="px-2.5 py-1 rounded text-xs font-semibold transition-opacity hover:opacity-70 whitespace-nowrap"
                              style={{
                                background: inPortfolio ? "var(--color-bg-3)" : "var(--color-orange)",
                                color: inPortfolio ? "var(--color-orange)" : "#1a1a1a",
                                border: inPortfolio ? "1px solid var(--color-orange)" : "none",
                              }}
                            >
                              {inPortfolio ? "Portföyde ↗" : "Ekle"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoadingRows && query.trim() && searchResults.length === 0 && (
        <div className="text-center py-12 text-sm" style={{ color: "var(--color-text-2)" }}>
          &quot;{query}&quot; için sonuç bulunamadı.
        </div>
      )}

      {/* Ekle Modal */}
      {addModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setAddModal(null)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm flex flex-col gap-4"
            style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="font-semibold text-lg" style={{ color: "var(--color-text)" }}>{addModal.symbol}</div>
              <div className="text-sm" style={{ color: "var(--color-text-2)" }}>{addModal.name}</div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-text-2)" }}>Adet</label>
                <input
                  type="number" min="0.0001" step="any" value={addQty}
                  onChange={(e) => setAddQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-md text-sm outline-none"
                  style={{ background: "var(--color-bg-3)", border: "1px solid var(--color-line)", color: "var(--color-text)" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-text-2)" }}>Alış Fiyatı ($)</label>
                <input
                  type="number" min="0.0001" step="any" value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-md text-sm outline-none"
                  style={{ background: "var(--color-bg-3)", border: "1px solid var(--color-line)", color: "var(--color-text)" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAddModal(null)}
                className="flex-1 py-2 rounded-md text-sm font-medium"
                style={{ background: "var(--color-bg-3)", color: "var(--color-text-2)", border: "1px solid var(--color-line)" }}
              >
                İptal
              </button>
              <button
                onClick={handleAdd}
                disabled={adding || !addQty || !addPrice}
                className="flex-1 py-2 rounded-md text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--color-orange)", color: "#1a1a1a" }}
              >
                {adding ? "Ekleniyor..." : "Portföye Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grafik Modal */}
      {selectedStock && (
        <ChartModal
          symbol={selectedStock.symbol}
          name={selectedStock.name}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
