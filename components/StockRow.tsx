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
  onRemove: (symbol: string) => void;
  onSelect: (symbol: string, name: string) => void;
}

export const GRID = "grid grid-cols-[160px_110px_110px_70px_110px_110px_32px] items-center gap-3";

export default function StockRow({ data, onRemove, onSelect }: StockRowProps) {
  const { symbol, name, qty, buyPrice, currentPrice, change, changePercent, isLoading, error } = data;

  const position = qty * currentPrice;
  const pnl = (currentPrice - buyPrice) * qty;
  const pnlPositive = pnl >= 0;
  const changePositive = change >= 0;

  return (
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
            <FlashNumber
              value={currentPrice}
              className="font-mono text-sm"
              style={{ color: "var(--color-text)" }}
            >
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
      <span className="font-mono text-sm" style={{ color: "var(--color-text-2)" }}>
        {qty}
      </span>

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
  );
}
