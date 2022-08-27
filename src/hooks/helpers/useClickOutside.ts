import {
  useEffect,
  RefObject,
} from 'react';

import { consoleError } from 'utils/console';
import { isTest } from 'utils/env';

export type TOptional<T> = T | null | undefined;
export type TUseClickOutsideCallback = (e: MouseEvent | KeyboardEvent) => void;

const useClickOutsideDefaultErrText = 'Error while processing "useClickOutside" hook:';
export const useClickOutsideNoCbErrText = 'No callback received';

/**
 * Describes properties for the "useClickOutside" hook
 * @typedef { Object } TUseClickOutside
 *
 * @property { TOptional<TUseClickOutsideCallback> } callback     - callback when click outside or the "escape" key press will be fired
 * @property { boolean }                             isWithKeyEsc - defines if 'escape' key fires callback
 * @property { RefObject<Element> }                  ref          - target element ref
 */
export type TUseClickOutside = {
  callback: TOptional<TUseClickOutsideCallback>;
  isWithKeyEsc?: boolean;
  ref: RefObject<Element>;
};

/**
 * Hook to listen for clicks outside the target component or the "escape" key press
 * @function useClickOutside (hook)
 * @param {TUseClickOutside} props
 *
 * @example
 * ```
 *  const elementRef = useRef<HTMLElement>(null);
 *  const handleClickOutside = () => {
 *     // some actions
 *  };
 *
 *  useClickOutside({
 *    callback: handleClickOutside,
 *    ref: elementRef,
 *    isWithKeyEsc: true,
 *  });
 * ```
 */
export const useClickOutside = (props: TUseClickOutside) => {

  const {
    callback,
    isWithKeyEsc,
    ref,
  } = props;

  useEffect(() => {
    if (!callback) {
      if (isTest()) {
        consoleError(`
        ${useClickOutsideDefaultErrText}
        ${useClickOutsideNoCbErrText}
      `);
      }

      return undefined;
    }

    const handleClick = (e: MouseEvent) => {
      const element = ref.current;
      const target = e.target as Node;

      let composedPath: (() => EventTarget[]) | undefined = e.composedPath;
      let composedPathArr: EventTarget[];

      /**
       * This is workaround.
       * I didn't find a way to mock MouseEvent.composedPath.
       * I tried running "fireEvent.click(button, {composedPath: undefined})" but that didn't work.
       *
       * If you are reading this, and you know how to solve this - please contact me =)
       */
      try {
        if (isTest()) {
          composedPath = undefined;
        }

        composedPathArr = composedPath?.() || [];
      } catch {
        composedPathArr = [];
      }

      if (
        element &&
        element !== target &&
        (composedPath
          ? !composedPathArr.includes(element)
          : !element.contains(target))
      ) {
        callback(e);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') {
        callback(e);
      }
    };

    let active = true;

    setTimeout(() => {
      if (active) {
        window.addEventListener('click', handleClick);

        if (isWithKeyEsc) {
          window.addEventListener('keyup', handleKeyUp);
        }
      }
    }, 0);

    return () => {
      active = false;
      window.removeEventListener('click', handleClick);

      if (isWithKeyEsc) {
        window.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [
    ref,
    callback,
    isWithKeyEsc,
  ]);
};
