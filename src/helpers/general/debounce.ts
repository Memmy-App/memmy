interface IDebounceOptions {
  leading?: boolean;
}

/**
 * Debounce
 * func: The function to to call after the predetermined elapse time
 * delay: miliseconds to delay the call
 */
export const debounce = (
  func: (...args: any) => any,
  delay = 200,
  { leading }: IDebounceOptions = {}
): any => {
  let timerId: any;

  return (...args: any[]) => {
    if (!timerId && leading) func(...args);
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };
};
