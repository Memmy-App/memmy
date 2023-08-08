import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en_US from "./langs/en.json";
import de_DE from "./langs/de.json";
import pt_BR from "./langs/pt_br.json";
import cs_CZ from "./langs/cz.json";
import ro_RO from "./langs/ro.json";
import languageDetector from "./languageDetector";

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en_US,
      },
      de: {
        translation: de_DE,
      },
      pt: {
        translation: pt_BR,
      },
      ro: {
        translation: ro_RO,
      },
      cz: {
        translation: cs_CZ,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    compatibilityJSON: "v3",
  });

export default i18n;
