import dayjs from "dayjs";

export const timeFromNowShort = (time: string): string => {
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "1s",
      ss: "%ss",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1m",
      MM: "%dM",
      y: "1y",
      yy: "%dY",
    },
  });

  return dayjs(time).utc(true).fromNow(true);
};

export const getCakeDay = (time: string): string => {
  const start = dayjs(time);
  const current = dayjs();
  const age = current.year() - start.year();
  const next = start.clone().add(age, "years");
  return next.format("Do MMMM YYYY");
};
