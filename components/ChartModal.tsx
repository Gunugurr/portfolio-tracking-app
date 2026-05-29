"use client";

import { useEffect, useRef, useState } from "react";

interface ChartModalProps {
  symbol: string;
  name: string;
  onClose: () => void;
}

const MIN_W = 400;
const MIN_H = 300;
const DEFAULT_W = 720;
const DEFAULT_H = 500;

export default function ChartModal({ symbol, name, onClose }: ChartModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Başlangıç pozisyonu: ekran ortası
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPos({
      x: Math.max(0, (window.innerWidth - DEFAULT_W) / 2),
      y: Math.max(0, (window.innerHeight - DEFAULT_H) / 2),
    });
  }, []);
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });

  // Drag state
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  // Resize state
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  // ESC ile kapat
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // TradingView widget inject
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    containerRef.current.appendChild(widgetDiv);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `NASDAQ:${symbol}`,
      interval: "D",
      timezone: "Europe/Istanbul",
      theme: isLight ? "light" : "dark",
      style: "1",
      locale: "tr",
      backgroundColor: isLight ? "#F6F8FA" : "#161B22",
      gridColor: isLight ? "rgba(208,215,222,0.8)" : "rgba(33,38,45,0.8)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
    });
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol]);

  // --- Drag ---
  function onDragStart(e: React.MouseEvent) {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };

    function onMove(ev: MouseEvent) {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(0, dragRef.current.startPosX + dx),
        y: Math.max(0, dragRef.current.startPosY + dy),
      });
    }
    function onUp() {
      dragRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  // --- Resize ---
  function onResizeStart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };

    function onMove(ev: MouseEvent) {
      if (!resizeRef.current) return;
      const dw = ev.clientX - resizeRef.current.startX;
      const dh = ev.clientY - resizeRef.current.startY;
      setSize({
        w: Math.max(MIN_W, resizeRef.current.startW + dw),
        h: Math.max(MIN_H, resizeRef.current.startH + dh),
      });
    }
    function onUp() {
      resizeRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  return (
    <div
      ref={modalRef}
      className="fixed z-50 flex flex-col rounded-lg border overflow-hidden shadow-2xl"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        background: "var(--color-bg-2)",
        borderColor: "var(--color-line)",
        minWidth: MIN_W,
        minHeight: MIN_H,
      }}
    >
      {/* Başlık — sürükleme alanı */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0 select-none"
        style={{ borderColor: "var(--color-line)", cursor: "grab" }}
        onMouseDown={onDragStart}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-sm" style={{ color: "var(--color-accent)" }}>
            {symbol}
          </span>
          <span className="text-sm" style={{ color: "var(--color-text-2)" }}>
            {name}
          </span>
          <span className="text-xs ml-2 hidden sm:inline" style={{ color: "var(--color-text-3)" }}>
            · sürükle / köşeden boyutlandır
          </span>
        </div>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="px-2 py-1 rounded text-sm transition-colors hover:bg-white/[0.05]"
          style={{ color: "var(--color-text-3)" }}
        >
          ✕
        </button>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="tradingview-widget-container flex-1 w-full overflow-hidden" />

      {/* Resize tutacağı — sağ alt köşe */}
      <div
        onMouseDown={onResizeStart}
        className="absolute bottom-0 right-0 w-5 h-5 flex items-end justify-end pr-1 pb-1"
        style={{ cursor: "se-resize" }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 9 L9 2 M5 9 L9 5 M9 9 L9 9" stroke="var(--color-text-3)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
