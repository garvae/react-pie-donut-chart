import { startResizeListener } from 'hooks/helpers/useHandleResize/startResizeListener/startResizeListener';

describe('function "startResizeListener"', () => {
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

    // mocking the global MutationObserver constructor for this test, no real browser API needed
    global.MutationObserver = MutationObserverMock;
  });

  afterEach(() => {
    global.MutationObserver = originalMutationObserver;
  });

  it('does not create a MutationObserver when no valid node is provided (e.g. a fixed "size" prop, no parentRef)', () => {
    expect.assertions(2);

    const cleanup = startResizeListener({ cb: jest.fn(), node: null });

    expect(MutationObserverMock).not.toHaveBeenCalled();
    expect(cleanup).toBeUndefined();
  });

  it('creates and observes a MutationObserver when a valid node is provided', () => {
    expect.assertions(2);

    const node = document.createElement('div');

    startResizeListener({ cb: jest.fn(), node });

    expect(MutationObserverMock).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenCalledWith(node, {
      attributeFilter: ['style'],
      attributeOldValue: true,
      attributes: true
    });
  });

  it('attaches the callback as a "resize" event listener on the node', () => {
    expect.assertions(1);

    const node = document.createElement('div');
    const addEventListenerSpy = jest.spyOn(node, 'addEventListener');
    const cb = jest.fn();

    startResizeListener({ cb, node });

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', cb);
  });

  it('returns a cleanup function that disconnects the observer and removes the listener', () => {
    expect.assertions(2);

    const node = document.createElement('div');
    const removeEventListenerSpy = jest.spyOn(node, 'removeEventListener');
    const cb = jest.fn();

    const cleanup = startResizeListener({ cb, node });

    cleanup?.();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', cb);
  });

  it('does not attach a listener or return a cleanup function when the node has no "nodeName" (invalid node)', () => {
    expect.assertions(2);

    const cleanup = startResizeListener({
      cb: jest.fn(),
      // @ts-expect-error - simulating an invalid/non-Node value on purpose
      node: {}
    });

    expect(MutationObserverMock).not.toHaveBeenCalled();
    expect(cleanup).toBeUndefined();
  });
});
