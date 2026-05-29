"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["TR", "EN", "ES", "RU"];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className="flex items-center rounded-md overflow-hidden"
      style={{ border: "1px solid var(--color-line)" }}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-2.5 py-1 text-xs font-mono font-semibold transition-colors"
          style={{
            background: lang === l ? "var(--color-orange)" : "var(--color-bg-3)",
            color: lang === l ? "#1a1a1a" : "var(--color-text-3)",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
