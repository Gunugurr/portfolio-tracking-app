"use client";

import { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import FlashNumber from "@/components/FlashNumber";

export interface StockRowData {
  symbol: string;
  name: string;
  qty: number;
  buyPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  isLoading: boolean;
  error?: string;
}

interface StockRowProps {
  data: StockRowData;
  alertTarget?: number;
  onSetAlert: (symbol: string, price: number | null) => void;
  onRemove: (symbol: string) => void;
  onSelect: (symbol: string, name: string) => void;
}

export const GRID =
  "grid grid-cols-[160px_110px_110px_70px_110px_110px_56px_32px] items-center gap-3";

function BellIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function StockRow({ data, alertTarget, onSetAlert, onRemove, onSelect }: StockRowProps) {
  const { symbol, name, qty, buyPrice, currentPrice, change, changePercent, isLoading, error } = data;

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertInput, setAlertInput] = useState("");

  const position = qty * currentPrice;
  const pnl = (currentPrice - buyPrice) * qty;
  const pnlPositive = pnl >= 0;
  const changePositive = change >= 0;

  function openAlertModal(e: React.MouseEvent) {
    e.stopPropagation();
    setAlertInput(alertTarget?.toFixed(2) ?? (currentPrice > 0 ? currentPrice.toFixed(2) : ""));
    setShowAlertModal(true);
  }

  function saveAlert() {
    const p = parseFloat(alertInput);
    if (p > 0) {
      onSetAlert(symbol, p);
      setShowAlertModal(false);
    }
  }

  return (
    <>
      <div
        className={`${GRID} px-4 py-3.5 border-b group transition-colors hover:bg-white/[0.04] last:border-b-0 cursor-pointer`}
        style={{ borderColor: "var(--color-line)" }}
        onClick={() => onSelect(symbol, name)}
      >
        {/* Hisse */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-bold text-sm shrink-0" style={{ color: "var(--color-accent)" }}>
            {symbol}
          </span>
          <span className="text-sm truncate" style={{ color: "var(--color-text-2)" }}>
            {name}
          </span>
        </div>

        {/* Alış fiyatı */}
        <span className="font-mono text-sm" style={{ color: "var(--color-text-2)" }}>
          {formatCurrency(buyPrice)}
        </span>

        {/* Anlık fiyat + günlük % */}
        <div className="flex flex-col gap-0.5">
          {isLoading ? (
            <div className="h-4 w-20 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          ) : error ? (
            <span className="text-xs" style={{ color: "var(--color-red)" }}>Hata</span>
          ) : (
            <>
              <FlashNumber value={currentPrice} className="font-mono text-sm" style={{ color: "var(--color-text)" }}>
                {formatCurrency(currentPrice)}
              </FlashNumber>
              <FlashNumber
                value={changePercent}
                className="font-mono text-xs"
                style={{ color: changePositive ? "var(--color-green)" : "var(--color-red)" }}
              >
                {`${formatPercent(changePercent)} bugün`}
              </FlashNumber>
            </>
          )}
        </div>

        {/* Adet */}
        <span className="font-mono text-sm" style={{ color: "var(--color-text-2)" }}>{qty}</span>

        {/* Pozisyon */}
        <span className="font-mono text-sm text-right" style={{ color: "var(--color-text)" }}>
          {isLoading || error ? "—" : formatCurrency(position)}
        </span>

        {/* P&L */}
        <div className="flex flex-col items-end gap-0.5">
          {isLoading || error ? (
            <span style={{ color: "var(--color-text-3)" }}>—</span>
          ) : (
            <>
              <span className="font-mono text-sm" style={{ color: pnlPositive ? "var(--color-green)" : "var(--color-red)" }}>
                {pnlPositive ? "+" : ""}{formatCurrency(pnl)}
              </span>
              <span className="font-mono text-xs" style={{ color: pnlPositive ? "var(--color-green)" : "var(--color-red)" }}>
                {formatPercent(((currentPrice - buyPrice) / buyPrice) * 100)}
              </span>
            </>
          )}
        </div>

        {/* Alarm */}
        <button
          onClick={openAlertModal}
          className={`w-full flex justify-center items-center transition-opacity py-1 rounded ${alertTarget ? "" : "opacity-0 group-hover:opacity-100"}`}
          style={{ color: alertTarget ? "var(--color-orange)" : "var(--color-text-3)" }}
          title={alertTarget ? `Alarm: ${formatCurrency(alertTarget)}` : "Fiyat alarmı ekle"}
        >
          <BellIcon active={!!alertTarget} />
        </button>

        {/* Sil */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(symbol); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity px-1 py-1 rounded text-xs justify-self-center"
          style={{ color: "var(--color-text-3)" }}
          title="Sil"
        >
          ✕
        </button>
      </div>

      {/* Alarm Modal */}
      {showAlertModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowAlertModal(false)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-xs flex flex-col gap-4"
            style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2 font-semibold text-base" style={{ color: "var(--color-text)" }}>
                <BellIcon active={!!alertTarget} />
                <span>{symbol} Fiyat Alarmı</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-3)" }}>
                Fiyat bu seviyeye ulaştığında bildirim gönderilir.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-text-2)" }}>
                Hedef Fiyat ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={alertInput}
                onChange={(e) => setAlertInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveAlert()}
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{
                  background: "var(--color-bg-3)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-text)",
                }}
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 py-2 rounded-md text-sm font-medium"
                style={{ background: "var(--color-bg-3)", color: "var(--color-text-2)", border: "1px solid var(--color-line)" }}
              >
                İptal
              </button>
              {alertTarget && (
                <button
                  onClick={() => { onSetAlert(symbol, null); setShowAlertModal(false); }}
                  className="py-2 px-3 rounded-md text-sm font-medium"
                  style={{ color: "var(--color-red)", border: "1px solid var(--color-red)", background: "transparent" }}
                >
                  Kaldır
                </button>
              )}
              <button
                onClick={saveAlert}
                disabled={!alertInput || parseFloat(alertInput) <= 0}
                className="flex-1 py-2 rounded-md text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--color-orange)", color: "#1a1a1a" }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
