// main library
import dayjs from "dayjs";

// plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import german from "./i18n/locales/german.json";
import english from "./i18n/locales/english.json";

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

// send it back (for use in other files)
export default dayjs;
