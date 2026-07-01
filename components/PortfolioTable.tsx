"use client";

import { useLanguage } from "@/lib/LanguageContext";
import StockRow, { StockRowData, GRID } from "./StockRow";

interface PortfolioTableProps {
  rows: StockRowData[];
  alerts: Record<string, number>;
  onSetAlert: (symbol: string, price: number | null) => void;
  onRemove: (symbol: string) => void;
  onSelect: (symbol: string, name: string) => void;
  isInitialLoading: boolean;
}

function SkeletonRow() {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 border-b"
      style={{ borderColor: "var(--color-line)" }}
    >
      <div className="h-4 w-32 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="h-4 w-24 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="h-4 w-40 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

export default function PortfolioTable({ rows, alerts, onSetAlert, onRemove, onSelect, isInitialLoading }: PortfolioTableProps) {
  const { s } = useLanguage();

  if (isInitialLoading) {
    return (
      <div className="rounded-lg border overflow-hidden" style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)" }}>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center" style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)" }}>
        <p style={{ color: "var(--color-text-2)" }}>
          {s.emptyPortfolio}{" "}
          <span style={{ color: "var(--color-accent)" }}>AAPL</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)" }}>
      <div
        className={`hidden md:grid ${GRID} px-4 py-2 border-b`}
        style={{ borderColor: "var(--color-line)" }}
      >
        <span className="text-xs uppercase tracking-wider truncate" style={{ color: "var(--color-text-3)" }}>{s.colStock}</span>
        <span className="text-xs uppercase tracking-wider truncate" style={{ color: "var(--color-text-3)" }}>{s.colBuyPrice}</span>
        <span className="text-xs uppercase tracking-wider truncate" style={{ color: "var(--color-text-3)" }}>{s.colCurrentPrice}</span>
        <span className="text-xs uppercase tracking-wider truncate" style={{ color: "var(--color-text-3)" }}>{s.colQty}</span>
        <span className="text-xs uppercase tracking-wider text-right truncate" style={{ color: "var(--color-text-3)" }}>{s.colPosition}</span>
        <span className="text-xs uppercase tracking-wider text-right" style={{ color: "var(--color-text-3)" }}>P&L</span>
        <span className="text-xs text-center" style={{ color: "var(--color-text-3)" }}>🔔</span>
        <span />
      </div>

      {rows.map((row) => (
        <StockRow
          key={row.symbol}
          data={row}
          alertTarget={alerts[row.symbol]}
          onSetAlert={onSetAlert}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
