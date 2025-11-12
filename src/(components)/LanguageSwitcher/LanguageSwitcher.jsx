"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "cs" ? "en" : "cs")}
      className="bg-dark text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors duration-300 border-2 border-primary"
    >
      {locale === "cs" ? "Switch to English" : "Přepnout do češtiny"}
    </button>
  );
}
