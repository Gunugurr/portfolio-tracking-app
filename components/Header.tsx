import { formatTime } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import Brand from "@/components/Brand";

type Tab = "market" | "portfolio";

interface MarketStats {
  gainers: number;
  losers: number;
  unchanged: number;
  total: number;
}

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  marketStats: MarketStats | null;
  countdown: number;
}

export default function Header({ lastUpdated, onRefresh, isLoading, activeTab, onTabChange, marketStats, countdown }: HeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between py-5">
        <Brand size="lg" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tabular-nums" style={{ color: "var(--color-text-3)" }}>
            ↻ {countdown}s
          </span>
          {activeTab === "portfolio" && (
            <>
              {lastUpdated && (
                <span className="text-sm" style={{ color: "var(--color-text-2)" }}>
                  Son güncelleme: {formatTime(lastUpdated)}
                </span>
              )}
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors disabled:opacity-40"
                style={{
                  borderColor: "var(--color-line)",
                  color: "var(--color-text-2)",
                  background: "var(--color-bg-3)",
                }}
              >
                <span className={isLoading ? "animate-spin" : ""}>↻</span>
                Yenile
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>

      <div className="flex items-center justify-between border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="flex">
          {(["market", "portfolio"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="px-5 py-2.5 text-sm font-medium transition-colors relative"
              style={{
                color: activeTab === tab ? "var(--color-orange)" : "var(--color-text-2)",
              }}
            >
              {tab === "market" ? "Piyasa" : "Portföyüm"}
              {activeTab === tab && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--color-orange)" }}
                />
              )}
            </button>
          ))}
        </div>

        {marketStats && marketStats.total > 0 && (
          <div className="flex items-center gap-5 pb-2.5 pr-1" title={`S&P 50 büyük hisse özeti (${marketStats.total} hisse)`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--color-green)" }} />
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>
                Artanlar
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)" }}>
                {marketStats.gainers}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--color-red)" }} />
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>
                Azalanlar
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--color-red)", fontFamily: "var(--font-mono)" }}>
                {marketStats.losers}
              </span>
            </div>
            {marketStats.unchanged > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--color-text-3)" }} />
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>
                  Sabit
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>
                  {marketStats.unchanged}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
