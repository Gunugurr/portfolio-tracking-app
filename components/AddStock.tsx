"use client";

import { useEffect, useRef, useState } from "react";
import { searchSymbol, SearchResult } from "@/lib/finnhub";

interface AddStockProps {
  onAdd: (ticker: string, qty: number, buyPrice: number) => Promise<void>;
  isLoading: boolean;
}

export default function AddStock({ onAdd, isLoading }: AddStockProps) {
  const [ticker, setTicker] = useState("");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklayınca dropdown kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleTickerChange(value: string) {
    const upper = value.toUpperCase();
    setTicker(upper);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!upper.trim()) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchSymbol(upper);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }

  function selectSuggestion(result: SearchResult) {
    setTicker(result.symbol);
    setSuggestions([]);
    setShowDropdown(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShowDropdown(false);

    const sym = ticker.trim().toUpperCase();
    const qtyNum = parseInt(qty, 10);
    const priceNum = parseFloat(buyPrice);

    if (!sym) {
      setError("Ticker boş olamaz.");
      return;
    }
    if (!qtyNum || qtyNum <= 0) {
      setError("Adet 0'dan büyük olmalı.");
      return;
    }
    if (!priceNum || priceNum <= 0) {
      setError("Alış fiyatı 0'dan büyük olmalı.");
      return;
    }

    try {
      await onAdd(sym, qtyNum, priceNum);
      setTicker("");
      setQty("");
      setBuyPrice("");
      setSuggestions([]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const inputClass =
    "px-3 py-2 rounded-md border text-sm font-mono outline-none transition-colors focus:ring-2 focus:ring-orange-500/40";
  const inputStyle = {
    background: "var(--color-bg-3)",
    borderColor: "var(--color-line)",
    color: "var(--color-text)",
  };

  return (
    <div
      className="rounded-lg border p-5"
      style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)" }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Ticker input + dropdown */}
        <div ref={wrapperRef} className="relative md:w-48">
          <input
            type="text"
            placeholder="Ticker ara... (AAPL)"
            value={ticker}
            onChange={(e) => handleTickerChange(e.target.value)}
            onFocus={() => ticker && setShowDropdown(true)}
            className={`${inputClass} w-full uppercase`}
            style={inputStyle}
            autoComplete="off"
          />

          {showDropdown && (ticker.length > 0) && (
            <div
              className="absolute z-50 top-full mt-1 left-0 w-72 rounded-md border overflow-hidden shadow-lg"
              style={{ background: "var(--color-bg-3)", borderColor: "var(--color-line)" }}
            >
              {searching ? (
                <div className="px-3 py-2 text-xs" style={{ color: "var(--color-text-3)" }}>
                  Aranıyor...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-3 py-2 text-xs" style={{ color: "var(--color-text-3)" }}>
                  Sonuç bulunamadı.
                </div>
              ) : (
                suggestions.map((s) => (
                  <button
                    key={s.symbol}
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/[0.04] transition-colors"
                  >
                    <span
                      className="font-mono font-bold text-xs w-14 shrink-0"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {s.symbol}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--color-text-2)" }}
                    >
                      {s.description}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <input
          type="number"
          placeholder="Adet"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          min={1}
          className={`${inputClass} md:w-24`}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Alış fiyatı"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          min={0.01}
          step={0.01}
          className={`${inputClass} md:w-36`}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 rounded-md text-sm font-bold transition-opacity disabled:opacity-40"
          style={{ background: "var(--color-accent)", color: "#fff" }}
        >
          {isLoading ? "Ekleniyor..." : "+ EKLE"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm" style={{ color: "var(--color-red)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
