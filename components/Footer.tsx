"use client";

import { useEffect, useState } from "react";
import Brand from "@/components/Brand";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { s } = useLanguage();
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer
      className="mt-auto border-t"
      style={{ borderColor: "var(--color-line)", background: "var(--color-bg-3)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div className="shrink-0">
          <Brand size="sm" animate={false} />
          <p className="text-xs mt-0.5 ml-0.5" style={{ color: "var(--color-text-3)" }}>
            {s.tagline}
          </p>
        </div>

        <p
          className="text-xs leading-relaxed max-w-md"
          style={{ color: "var(--color-text-3)" }}
        >
          {s.disclaimer}
        </p>

        <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-green)" }}
            />
            <span className="text-xs font-mono" style={{ color: "var(--color-text-3)" }}>
              {s.liveData}
            </span>
          </div>
          <p className="text-xs font-mono" style={{ color: "var(--color-text-3)" }}>
            {year}
          </p>
        </div>

      </div>

      <div
        className="border-t px-6 md:px-12 py-2"
        style={{ borderColor: "var(--color-line)" }}
      >
        <p className="text-xs text-center" style={{ color: "var(--color-text-3)" }}>
          {s.disclaimerBottom}
        </p>
      </div>
    </footer>
  );
}
