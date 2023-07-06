import moment from "moment";

export const timeFromNowShort = (time: string): string => {
  moment.locale("en", {
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

  return moment(time).utc(true).fromNow(true);
};

export const getCakeDay = (time: string): string => {
  const start = moment(time);
  const current = moment();
  const age = current.year() - start.year();
  const next = start.clone().add(age, "years");
  const formatted = next.format("Do MMMM YYYY");

  return formatted;
};
