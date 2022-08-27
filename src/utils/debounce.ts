/**
 * Debounce passed callback
 * @function { (cb: (...args: T) => void, wait: number): (...args: T) => void } debounce
 *
 * @typeParam T - Type of params passed to the callback arguments
 * @param { string } cb - callback to debounce
 * @param { number } wait - debounce time
 *
 * @return debounce passed callback;
 *
 * @example
 * ```
 * const debouncedFunction = debounce(() => {
 *    // some code to debounce
 * }, 50);
 * ```
 */
export const debounce = <T extends unknown[], U>(cb: (...args: T) => PromiseLike<U> | U, wait: number) => {
  let timer: NodeJS.Timeout;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise(resolve => {
      timer = setTimeout(() => resolve(cb(...args)), wait);
    });
  };
};


export type TDebounceFunction = ReturnType<typeof debounce>;
