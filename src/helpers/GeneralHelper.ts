/**
 * Some general helper functions
 */

interface IDebounceOptions {
  leading?: boolean; // Fire once to start?
}

/**
 * Debounce
 * func: The function to to call after the predetermined elapse time
 * delay: miliseconds to delay the call
 */
export const debounce = (
  func: Function,
  delay = 200,
  { leading }: IDebounceOptions = {}
) => {
  let timerId;

  return (...args) => {
    if (!timerId && leading) func(...args);
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };
};
