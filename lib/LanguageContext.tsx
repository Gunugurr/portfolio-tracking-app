"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, Strings, translations } from "./i18n";

const STORAGE_KEY = "portfoy_lang";
const VALID_LANGS: Lang[] = ["TR", "EN", "ES", "RU"];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  s: Strings;
}

const LangContext = createContext<LangCtx>({
  lang: "TR",
  setLang: () => {},
  s: translations["TR"],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("TR");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && VALID_LANGS.includes(saved)) setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, s: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LangContext);
}
