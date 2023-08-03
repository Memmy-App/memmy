// main library
import dayjs from "dayjs";

// plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import de_DE from "./i18n/locales/de_DE.json";
import en_US from "./i18n/locales/en_US.json";
import cs_CZ from "./i18n/locales/cs_CZ.json";
import ro_RO from "./i18n/locales/ro_RO.json";
import pt_BR from "./i18n/locales/pt_BR.json";

// extend dayjs with plugins
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale("en", {
  relativeTime: en_US.relativeTime,
});

dayjs.updateLocale("de", {
  relativeTime: de_DE.relativeTime,
});

dayjs.updateLocale("cz", {
  relativeTime: cs_CZ.relativeTime,
});

dayjs.updateLocale("ro", {
  relativeTime: ro_RO.relativeTime,
});

dayjs.updateLocale("pt", {
  relativeTime: pt_BR.relativeTime,
});

// send it back (for use in other files)
export default dayjs;
