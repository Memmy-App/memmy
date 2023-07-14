import dayjs from "dayjs";

/**
 * calculate relative time according to set locale
 * @param time
 *
 * todo: Setting the relative time for locales should be done only once or updated when the language is changed
 */
export const timeFromNowShort = (time: string): string =>
  dayjs(time).utc(true).fromNow(true);

export const getCakeDay = (time: string): string => {
  const start = dayjs(time);
  const current = dayjs();
  const age = current.year() - start.year();
  const next = start.clone().add(age, "years");
  return next.format("Do MMMM YYYY");
};
