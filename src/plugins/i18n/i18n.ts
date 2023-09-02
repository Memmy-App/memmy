import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { writeToLog } from "@src/helpers/LogHelper";
import languageDetector from "./languageDetector";
import en_US from "./locales/en_US.json";
import de_DE from "./locales/de_DE.json";
import pt_BR from "./locales/pt_BR.json";
import cs_CZ from "./locales/cs_CZ.json";
import ro_RO from "./locales/ro_RO.json";

type SupportedLocale = "en" | "de" | "pt" | "ro" | "cs";

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "en-US": {
        translation: en_US,
      },
      "de-DE": {
        translation: de_DE,
      },
      "pt-BR": {
        translation: pt_BR,
      },
      "ro-RO": {
        translation: ro_RO,
      },
      "cs-CZ": {
        translation: cs_CZ,
      },
    },
    fallbackLng: (code) => {
      const fallbacks = ["en-US"];

      if (!code) return fallbacks;

      const [locale] = code.split("-") as [SupportedLocale, string];

      switch (locale) {
        case "en":
          // already covered
          break;
        case "de":
          fallbacks.push("de-DE");
          break;
        case "pt":
          fallbacks.push("pt-BR");
          break;
        case "ro":
          fallbacks.push("ro-RO");
          break;
        case "cs":
          fallbacks.push("cs-CZ");
          break;
        default:
          writeToLog(`Language "${code}" is not yet supported!`);
          break;
      }

      return fallbacks.reverse();
    },
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    compatibilityJSON: "v3",
  });

export default i18n;
