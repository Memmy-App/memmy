import dayjs from "dayjs";

export const getCakeDay = (time: string): string => {
  const start = dayjs(time);
  const current = dayjs();
  const age = current.year() - start.year();
  const next = start.clone().add(age, "years");
  return next.format("ll");
};
