"use client";

import { formatTime } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import Brand from "@/components/Brand";
import LanguageToggle from "@/components/LanguageToggle";

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
}

export default function Header({ lastUpdated, onRefresh, isLoading, activeTab, onTabChange, marketStats }: HeaderProps) {
  const { s } = useLanguage();
  return (
    <div>
      {/* Üst bar */}
      <div className="flex items-center justify-between py-3 md:py-5">
        <Brand size="lg" />
        <div className="flex items-center gap-1.5 md:gap-2">
          {activeTab === "portfolio" && (
            <>
              {lastUpdated && (
                <span className="hidden md:inline text-sm" style={{ color: "var(--color-text-2)" }}>
                  {s.lastUpdated} {formatTime(lastUpdated)}
                </span>
              )}
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-md text-sm font-medium border transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--color-line)", color: "var(--color-text-2)", background: "var(--color-bg-3)" }}
              >
                <span className={isLoading ? "animate-spin" : ""}>↻</span>
                <span className="hidden md:inline">{s.refresh}</span>
              </button>
            </>
          )}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-col border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="flex items-center justify-between">
          <div className="flex">
            {(["market", "portfolio"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className="px-4 md:px-5 py-2.5 text-sm font-medium transition-colors relative"
                style={{ color: activeTab === tab ? "var(--color-orange)" : "var(--color-text-2)" }}
              >
                {tab === "market" ? s.tabMarket : s.tabPortfolio}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "var(--color-orange)" }} />
                )}
              </button>
            ))}
          </div>

          {/* Market stats — masaüstünde tab barın yanında */}
          {marketStats && marketStats.total > 0 && (
            <div className="hidden sm:flex items-center gap-3 md:gap-5 pb-2.5 pr-1">
              <StatBadge label={s.gainers} value={marketStats.gainers} color="var(--color-green)" />
              <StatBadge label={s.losers} value={marketStats.losers} color="var(--color-red)" />
              {marketStats.unchanged > 0 && (
                <StatBadge label={s.unchanged} value={marketStats.unchanged} color="var(--color-text-3)" />
              )}
            </div>
          )}
        </div>

        {/* Market stats — mobilde tab barın altında ayrı satır */}
        {marketStats && marketStats.total > 0 && (
          <div className="flex sm:hidden items-center gap-4 px-1 pb-2">
            <StatBadge label={s.gainers} value={marketStats.gainers} color="var(--color-green)" />
            <StatBadge label={s.losers} value={marketStats.losers} color="var(--color-red)" />
            {marketStats.unchanged > 0 && (
              <StatBadge label={s.unchanged} value={marketStats.unchanged} color="var(--color-text-3)" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
      <span className="text-xs md:text-sm font-bold" style={{ color, fontFamily: "var(--font-mono)" }}>
        {value}
      </span>
    </div>
  );
}
