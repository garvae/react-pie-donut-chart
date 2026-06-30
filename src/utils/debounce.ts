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
export type TDebounceFunction<T extends unknown[] = unknown[], U = unknown> = ((...args: T) => Promise<U>) & {
  cancel: () => void;
};

export const debounce = <T extends unknown[], U>(
  cb: (...args: T) => PromiseLike<U> | U,
  wait: number
): TDebounceFunction<T, U> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = ((...args: T): Promise<U> => {
    if (timer) {
      clearTimeout(timer);
    }

    return new Promise((resolve) => {
      timer = setTimeout(() => {
        timer = undefined;
        resolve(cb(...args));
      }, wait);
    });
  }) as TDebounceFunction<T, U>;

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
};
