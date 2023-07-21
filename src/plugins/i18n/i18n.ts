import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./locales/en.json";
import german from "./locales/de.json";
import brazilian_portuguese from "./locales/pt_br.json";
import romanian from "./locales/ro.json";
import languageDetector from "./languageDetector";

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: english,
      },
      de: {
        translation: german,
      },
      ptbr: {
        translation: brazilian_portuguese,
      },
      ro: {
        translation: romanian,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    compatibilityJSON: "v3",
  });

export default i18n;
