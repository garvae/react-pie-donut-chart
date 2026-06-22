import { renderHook, waitFor } from '@testing-library/react';
import { TUseHandleResize, useHandleResize } from 'hooks/helpers/useHandleResize/useHandleResize';
import { RefObject } from 'react';
import { TEST_PROPS } from 'tests/mocks/variables';
import { originalEnv } from 'utils/env';

const TEST_USE_HANDLE_RESIZE_PROPS: TUseHandleResize = {
  animationDuration: TEST_PROPS.animationSpeed,
  maxSize: TEST_PROPS.maxSize,
  minSize: TEST_PROPS.minSize,
  parentRef: TEST_PROPS.parentRef,
  resizeReRenderDebounceTime: TEST_PROPS.resizeReRenderDebounceTime,
  setAnimationDuration: jest.fn(),
  size: TEST_PROPS.size
};

describe('hook "useHandleResize"', () => {
  /**
   * Necessary to enable "updateSizeDebounced"
   */
  process.env = {
    ...originalEnv,
    NODE_ENV: 'production'
  };

  describe('function "updateSizeDebounced"', () => {
    it('fires during chart initialization', async () => {
      expect.hasAssertions();

      const { result } = renderHook(() =>
        useHandleResize({
          ...TEST_USE_HANDLE_RESIZE_PROPS,
          maxSize: undefined,
          minSize: undefined,
          size: undefined
        })
      );

      await waitFor(() => {
        const { size } = result.current;

        expect(size).toBe(TEST_USE_HANDLE_RESIZE_PROPS.parentRef?.current?.offsetWidth);
      });
    });
  });

  process.env = originalEnv;

  describe('resize observer cleanup', () => {
    let observeMock: jest.Mock;
    let disconnectMock: jest.Mock;
    let MutationObserverMock: jest.Mock;
    let originalMutationObserver: typeof MutationObserver;

    beforeEach(() => {
      observeMock = jest.fn();
      disconnectMock = jest.fn();
      originalMutationObserver = global.MutationObserver;

      MutationObserverMock = jest.fn().mockImplementation(() => ({
        disconnect: disconnectMock,
        observe: observeMock
      }));

      global.MutationObserver = MutationObserverMock;
    });

    afterEach(() => {
      global.MutationObserver = originalMutationObserver;
    });

    it('observes the "parentRef" node when one is provided', () => {
      expect.assertions(1);

      const node = document.createElement('div');
      const parentRef = { current: node } as RefObject<HTMLElement>;

      renderHook(() =>
        useHandleResize({
          ...TEST_USE_HANDLE_RESIZE_PROPS,
          parentRef,
          size: undefined
        })
      );

      expect(observeMock).toHaveBeenCalledWith(node, expect.any(Object));
    });

    it('disconnects every observer it ever created by the time of unmount (no leaked observers)', () => {
      expect.assertions(2);

      const node = document.createElement('div');
      const parentRef = { current: node } as RefObject<HTMLElement>;

      const { unmount } = renderHook(() =>
        useHandleResize({
          ...TEST_USE_HANDLE_RESIZE_PROPS,
          parentRef,
          size: undefined
        })
      );

      unmount();

      /**
       * The effect may legitimately re-run during the hook's lifecycle (e.g.
       * once "size" settles from its initial 0 value, "handleResize" gets a
       * new identity). Each re-run must clean up its own previous observer,
       * so by the time of unmount every observer that was ever constructed
       * must have been disconnected exactly once — none leaked.
       */
      expect(MutationObserverMock.mock.calls.length).toBeGreaterThan(0);
      expect(disconnectMock.mock.calls.length).toBe(MutationObserverMock.mock.calls.length);
    });

    it('does not create an observer when a fixed "size" prop is used (no parentRef node)', () => {
      expect.assertions(1);

      const parentRef = { current: null } as RefObject<HTMLElement>;

      renderHook(() =>
        useHandleResize({
          ...TEST_USE_HANDLE_RESIZE_PROPS,
          parentRef,
          size: 200
        })
      );

      expect(MutationObserverMock).not.toHaveBeenCalled();
    });
  });
});
