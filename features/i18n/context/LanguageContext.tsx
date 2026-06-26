"use client";

import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import T, { type Lang } from "../translations";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof T.ar | typeof T.en;
  dir: "rtl" | "ltr";
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  lang:    "ar",
  setLang: () => {},
  t:       T.ar as typeof T.ar | typeof T.en,
  dir:     "rtl",
  isRTL:   true,
});

const STORAGE_KEY = "lafif_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  // Sync html element attributes whenever lang changes
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir  = dir;
  }, [lang]);

  function setLang(l: Lang) {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }

  const isRTL = lang === "ar";
  const dir   = isRTL ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang], dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
