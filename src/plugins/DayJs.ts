// main library
import dayjs from "dayjs";

// plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import german from "./i18n/locales/de.json";
import english from "./i18n/locales/en.json";
import czech from "./i18n/locales/cz.json";
import romanian from "./i18n/locales/ro.json";
import portuguese from "./i18n/locales/pt_br.json";

// extend dayjs with plugins
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale("en", {
  relativeTime: english.relativeTime,
});

dayjs.updateLocale("de", {
  relativeTime: german.relativeTime,
});

dayjs.updateLocale("cz", {
  relativeTime: czech.relativeTime,
});

dayjs.updateLocale("ro", {
  relativeTime: romanian.relativeTime,
});

dayjs.updateLocale("pt", {
  relativeTime: portuguese.relativeTime,
});

// send it back (for use in other files)
export default dayjs;
