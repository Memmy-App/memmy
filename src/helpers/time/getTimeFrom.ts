import dayjs from 'dayjs';

export const getTimeFrom = (timestamp?: string): string => {
  const res = dayjs(timestamp ?? 0)
    .utc(true)
    .fromNow(true);

  return res;
};
