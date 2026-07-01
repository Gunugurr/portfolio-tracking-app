"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

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
  const { s } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!isMobile) {
      setPos({
        x: Math.max(0, (window.innerWidth - DEFAULT_W) / 2),
        y: Math.max(0, (window.innerHeight - DEFAULT_H) / 2),
      });
    }
  }, [isMobile]);

  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });

  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

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
    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, [symbol]);

  function onDragStart(e: React.MouseEvent) {
    if (isMobile) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: pos.x, startPosY: pos.y };
    function onMove(ev: MouseEvent) {
      if (!dragRef.current) return;
      setPos({
        x: Math.max(0, dragRef.current.startPosX + ev.clientX - dragRef.current.startX),
        y: Math.max(0, dragRef.current.startPosY + ev.clientY - dragRef.current.startY),
      });
    }
    function onUp() { dragRef.current = null; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function onResizeStart(e: React.MouseEvent) {
    if (isMobile) return;
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };
    function onMove(ev: MouseEvent) {
      if (!resizeRef.current) return;
      setSize({
        w: Math.max(MIN_W, resizeRef.current.startW + ev.clientX - resizeRef.current.startX),
        h: Math.max(MIN_H, resizeRef.current.startH + ev.clientY - resizeRef.current.startY),
      });
    }
    function onUp() { resizeRef.current = null; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  const modalStyle = isMobile
    ? { left: 0, top: 0, width: "100dvw", height: "100dvh" }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, minWidth: MIN_W, minHeight: MIN_H };

  return (
    <div
      className={`fixed z-50 flex flex-col border overflow-hidden shadow-2xl ${isMobile ? "rounded-none" : "rounded-lg"}`}
      style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)", ...modalStyle }}
    >
      {/* Başlık */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b shrink-0 select-none"
        style={{ borderColor: "var(--color-line)", cursor: isMobile ? "default" : "grab" }}
        onMouseDown={isMobile ? undefined : onDragStart}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono font-bold text-sm shrink-0" style={{ color: "var(--color-accent)" }}>{symbol}</span>
          <span className="text-sm truncate" style={{ color: "var(--color-text-2)" }}>{name}</span>
          {!isMobile && (
            <span className="text-xs ml-2 hidden sm:inline" style={{ color: "var(--color-text-3)" }}>
              {s.dragHint}
            </span>
          )}
        </div>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="px-2.5 py-1.5 rounded text-sm transition-colors hover:bg-white/[0.05] shrink-0"
          style={{ color: "var(--color-text-3)" }}
        >
          ✕
        </button>
      </div>

      <div ref={containerRef} className="tradingview-widget-container flex-1 w-full overflow-hidden" />

      {!isMobile && (
        <div onMouseDown={onResizeStart}
          className="absolute bottom-0 right-0 w-5 h-5 flex items-end justify-end pr-1 pb-1"
          style={{ cursor: "se-resize" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 9 L9 2 M5 9 L9 5 M9 9 L9 9" stroke="var(--color-text-3)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
