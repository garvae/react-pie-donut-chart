import {
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { isTest } from 'utils/env';

/**
 * Describes value returned by "useIsMounted" hook
 * @typedef { () => boolean } TUseIsMountedReturn
 */
type TUseIsMountedReturn = () => boolean;

/**
 * Hook allows you to determine if the component is in the DOM or the component is already unmounted
 * @function useIsMounted (hook)
 * @return { TUseIsMountedReturn } - returns function that returns a boolean value
 */
export const useIsMounted = (): TUseIsMountedReturn => {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return useCallback(() => {
    /**
     * It's safer for tests. I think so =)
     */
    if (isTest()) {
      return true;
    }

    return ref.current;
  }, [ ref ]);
};
