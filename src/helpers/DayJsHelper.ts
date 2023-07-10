// main library
import dayjs from "dayjs";

// plugins
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

// extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

// send it back (for use in other files)
export default dayjs;
