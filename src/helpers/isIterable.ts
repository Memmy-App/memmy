export const isIterable = <Type>(obj?: Type): obj is Type => {
  if (obj == null) return false;

  return typeof obj === 'object' && Symbol.iterator in obj;
};
