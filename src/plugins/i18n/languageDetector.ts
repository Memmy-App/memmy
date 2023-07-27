import * as Localization from "expo-localization";
import {LanguageDetectorModule} from "i18next";

// noinspection JSUnusedGlobalSymbols
const languageDetector: LanguageDetectorModule = {
  type: "languageDetector",
  detect: () => Localization.locale.split("-")[0],
  init: () => {},
  cacheUserLanguage: () => {},
};

export default languageDetector;
