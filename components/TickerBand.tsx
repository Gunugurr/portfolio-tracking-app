"use client";

import { useRef, useEffect } from "react";
import { Quote } from "@/lib/finnhub";
import { TOP_50 } from "@/lib/market";

interface TickerBandProps {
  quotes: Record<string, Quote>;
  loading: boolean;
}

const TICKER_ORDER = [
  "AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA","JPM","V","NFLX",
  "LLY","AVGO","BRK.B","COST","UNH","XOM","JNJ","MA","PG","HD",
];

const PX_PER_SEC = 60;

export default function TickerBand({ quotes, loading }: TickerBandProps) {
  const trackRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // scroll position (always ≤ 0)
  const xRef         = useRef(0);
  const rafRef       = useRef<number | null>(null);
  const lastTimeRef  = useRef<number | null>(null);

  // interaction
  const isDragging   = useRef(false);
  const isHovering   = useRef(false);
  const ptrStartX    = useRef(0);
  const xAtDragStart = useRef(0);
  const resumeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = TICKER_ORDER
    .map((sym) => ({ symbol: sym, quote: quotes[sym] }))
    .filter((item) => item.quote != null);

  // ── animation helpers ──────────────────────────────────────────────────

  function halfWidth() {
    return (trackRef.current?.scrollWidth ?? 0) / 2;
  }

  function applyX(x: number) {
    if (trackRef.current) trackRef.current.style.transform = `translateX(${x}px)`;
  }

  // keep x inside [−hw, 0] loop
  function loopX(x: number): number {
    const hw = halfWidth();
    if (hw <= 0) return x;
    let v = x % (-hw);
    if (v > 0) v -= hw;
    return v;
  }

  function tick(time: number) {
    if (lastTimeRef.current === null) lastTimeRef.current = time;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = time;
    xRef.current = loopX(xRef.current - PX_PER_SEC * dt);
    applyX(xRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  function startAnim() {
    if (rafRef.current !== null) return;
    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopAnim() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  useEffect(() => {
    if (items.length === 0) return;
    startAnim();
    return stopAnim;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // ── event handlers ─────────────────────────────────────────────────────

  function onMouseEnter() {
    isHovering.current = true;
    if (!isDragging.current) {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      stopAnim();
    }
  }

  function onMouseLeave() {
    isHovering.current = false;
    if (!isDragging.current) {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      startAnim();
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    stopAnim();
    isDragging.current = true;
    ptrStartX.current    = e.clientX;
    xAtDragStart.current = xRef.current;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const hw    = halfWidth();
    const delta = e.clientX - ptrStartX.current;
    // clamp so no empty space shows
    const raw   = xAtDragStart.current + delta;
    xRef.current = Math.max(-hw, Math.min(0, raw));
    applyX(xRef.current);
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    isDragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = "grab";

    if (isHovering.current) {
      // mouse still over — stay frozen, resume when mouse leaves
    } else {
      resumeTimer.current = setTimeout(() => {
        if (!isDragging.current) startAnim();
      }, 1500);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────

  if (loading || items.length === 0) {
    return (
      <div
        className="h-9 border-b flex items-center overflow-hidden"
        style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)" }}
      >
        <div className="flex gap-8 px-6 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded"
              style={{ width: `${60 + (i % 3) * 20}px`, background: "var(--color-bg-3)" }}
            />
          ))}
        </div>
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div
      ref={containerRef}
      className="h-9 border-b overflow-hidden relative select-none"
      style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)", cursor: "grab" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to right, var(--color-bg-2), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to left, var(--color-bg-2), transparent)" }} />

      <div
        ref={trackRef}
        className="ticker-track flex items-center h-full"
        style={{ touchAction: "none" }}
      >
        {doubled.map((item, i) => {
          const q        = item.quote!;
          const positive = q.dp >= 0;
          const color    = positive ? "var(--color-green)" : "var(--color-red)";
          const arrow    = positive ? "▲" : "▼";
          const nameFull = TOP_50.find((s) => s.symbol === item.symbol)?.description ?? item.symbol;
          const name     = nameFull.split(" ")[0];

          return (
            <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 px-5 shrink-0">
              <span className="text-xs font-bold tracking-wide"
                    style={{ color: "var(--color-orange)", fontFamily: "var(--font-mono)" }}>
                {item.symbol}
              </span>
              <span className="text-xs hidden sm:inline" style={{ color: "var(--color-text-3)" }}>
                {name}
              </span>
              <span className="text-xs font-semibold"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}>
                ${q.c.toFixed(2)}
              </span>
              <span className="text-xs font-bold"
                    style={{ color, fontFamily: "var(--font-mono)" }}>
                {arrow} {positive ? "+" : ""}{q.dp.toFixed(2)}%
              </span>
              <span className="text-xs ml-2" style={{ color: "var(--color-line)" }}>|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
