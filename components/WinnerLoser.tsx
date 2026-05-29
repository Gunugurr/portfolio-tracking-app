import { Quote } from "@/lib/finnhub";
import { TOP_50 } from "@/lib/market";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface Props {
  marketQuotes: Record<string, Quote>;
  loading: boolean;
}

function Card({
  symbol,
  quote,
  type,
}: {
  symbol: string;
  quote: Quote;
  type: "winner" | "loser";
}) {
  const isWinner = type === "winner";
  const color = isWinner ? "var(--color-green)" : "var(--color-red)";
  const icon = isWinner ? "🚀" : "🔻";
  const label = isWinner ? "Günün Yıldızı" : "Günün Kaybedeni";
  const fullName = TOP_50.find((s) => s.symbol === symbol)?.description ?? symbol;
  const name = fullName.length > 22 ? fullName.slice(0, 20) + "…" : fullName;

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3"
      style={{
        background: "var(--color-bg-2)",
        border: `1px solid color-mix(in srgb, ${isWinner ? "#00C07A" : "#FF4545"} 30%, transparent)`,
        boxShadow: `0 0 24px color-mix(in srgb, ${isWinner ? "#00C07A" : "#FF4545"} 8%, transparent)`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span>{icon}</span>
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-3)" }}
        >
          {label}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div
            className="font-mono font-bold text-lg leading-none"
            style={{ color: "var(--color-orange)" }}
          >
            {symbol}
          </div>
          <div
            className="text-xs mt-1 truncate"
            style={{ color: "var(--color-text-3)", maxWidth: 160 }}
          >
            {name}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div
            className="font-mono font-semibold text-sm"
            style={{ color: "var(--color-text)" }}
          >
            {formatCurrency(quote.c)}
          </div>
          <div className="font-mono font-bold text-base" style={{ color }}>
            {formatPercent(quote.dp)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WinnerLoser({ marketQuotes, loading }: Props) {
  if (loading) return null;

  const entries = Object.entries(marketQuotes).filter(([, q]) => q.c > 0 && q.dp !== 0);
  if (entries.length < 2) return null;

  const sorted = [...entries].sort((a, b) => b[1].dp - a[1].dp);
  const [winnerSym, winnerQ] = sorted[0];
  const [loserSym, loserQ] = sorted[sorted.length - 1];

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card symbol={winnerSym} quote={winnerQ} type="winner" />
      <Card symbol={loserSym} quote={loserQ} type="loser" />
    </div>
  );
}
