// main library
import dayjs from "dayjs";

// plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import de_DE from "@src/locale/langs/de.json";
import en_US from "@src/locale/langs/en.json";
import cs_CZ from "@src/locale/langs/cz.json";
import ro_RO from "@src/locale/langs/ro.json";
import pt_BR from "@src/locale/langs/pt_br.json";

// dayjs locales
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/cs";
import "dayjs/locale/ro";
import "dayjs/locale/pt";

// extend dayjs with plugins
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(localizedFormat);

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
