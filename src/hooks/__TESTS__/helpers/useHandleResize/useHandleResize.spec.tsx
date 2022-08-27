import {
  renderHook,
  waitFor,
} from '@testing-library/react';
import {
  useHandleResize,
  TUseHandleResize,
} from 'hooks/helpers/useHandleResize/useHandleResize';
import { TEST_PROPS } from 'tests/mocks/variables';
import { originalEnv } from 'utils/env';

const TEST_USE_HANDLE_RESIZE_PROPS: TUseHandleResize = {
  animationDuration: TEST_PROPS.animationSpeed,
  maxSize: TEST_PROPS.maxSize,
  minSize: TEST_PROPS.minSize,
  parentRef: TEST_PROPS.parentRef,
  resizeReRenderDebounceTime: TEST_PROPS.resizeReRenderDebounceTime,
  setAnimationDuration: jest.fn(),
  size: TEST_PROPS.size,
};

describe('hook "useHandleResize"', () => {
  /**
   * Necessary to enable "updateSizeDebounced"
   */
  process.env = {
    ...originalEnv,
    NODE_ENV: 'production',
  };

  describe('function "updateSizeDebounced"', () => {
    it('fires during chart initialization', async () => {
      expect.hasAssertions();

      const { result } = renderHook(() => useHandleResize({
        ...TEST_USE_HANDLE_RESIZE_PROPS,
        maxSize: undefined,
        minSize: undefined,
        size: undefined,
      }));

      await waitFor(() => {
        const { size } = result.current;

        expect(size).toBe(TEST_USE_HANDLE_RESIZE_PROPS.parentRef?.current?.offsetWidth);
      });
    });
  });

  process.env = originalEnv;
});
