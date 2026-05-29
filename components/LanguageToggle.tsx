"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Lang } from "@/lib/i18n";

const FLAGS: Record<Lang, string> = {
  TR: "🇹🇷",
  EN: "🇺🇸",
  ES: "🇪🇸",
  RU: "🇷🇺",
};

const NAMES: Record<Lang, string> = {
  TR: "Türkçe",
  EN: "English",
  ES: "Español",
  RU: "Русский",
};

const LANGS: Lang[] = ["TR", "EN", "ES", "RU"];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
        style={{
          background: "var(--color-bg-3)",
          border: "1px solid var(--color-line)",
          color: "var(--color-text-2)",
        }}
      >
        <span className="text-sm leading-none">{FLAGS[lang]}</span>
        <span className="font-mono">{lang}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "var(--color-text-3)" }}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 rounded-lg overflow-hidden z-50 shadow-xl"
          style={{
            background: "var(--color-bg-2)",
            border: "1px solid var(--color-line)",
            minWidth: 140,
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
              style={{
                background: lang === l
                  ? "color-mix(in srgb, var(--color-orange) 10%, transparent)"
                  : "transparent",
                color: lang === l ? "var(--color-orange)" : "var(--color-text-2)",
                borderLeft: lang === l ? "2px solid var(--color-orange)" : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (lang !== l) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-3)";
              }}
              onMouseLeave={(e) => {
                if (lang !== l) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <span className="text-xl leading-none">{FLAGS[l]}</span>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="text-xs font-mono font-bold">{l}</span>
                <span className="text-xs" style={{ color: "var(--color-text-3)", fontSize: 10 }}>{NAMES[l]}</span>
              </div>
              {lang === l && (
                <span className="ml-auto text-xs" style={{ color: "var(--color-orange)" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
