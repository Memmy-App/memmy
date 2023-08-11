import dayjs from "dayjs";

export const timeFromNowShort = (time: string): string =>
  dayjs(time).utc(true).fromNow(true);
