import { renderHook } from '@testing-library/react';
import { useIsMounted } from 'hooks/helpers/useIsMounted';
import { originalEnv } from 'utils/env';

describe('hook "useIsMounted"', () => {
  it('returns [true] when NODE_ENV="test"', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useIsMounted());
    const isMounted = result.current;

    expect(isMounted()).toBeTruthy();
  });

  it('returns true when mounted', () => {
    expect.assertions(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
    };

    const { result } = renderHook(() => useIsMounted());
    const isMounted = result.current;

    expect(isMounted()).toBeTruthy();
  });

  it('returns [false] when unmounted', () => {
    expect.assertions(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
    };

    const {
      result,
      unmount,
    } = renderHook(() => useIsMounted());

    unmount();
    const isMounted = result.current;

    expect(isMounted()).toBeFalsy();
  });

  process.env = originalEnv;
});
