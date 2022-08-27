
import {
  TResizeHandler,
  resizeHandler,
} from 'hooks/helpers/useHandleResize/resizeHandler';
import { TEST_PROPS } from 'tests/mocks/variables';

const RESIZE_HANDLER_MOCK: TResizeHandler = {
  maxSize: TEST_PROPS.maxSize,
  minSize: TEST_PROPS.minSize,
  parentRef: TEST_PROPS.parentRef,
  size: TEST_PROPS.size,
  updateSize: () => undefined,
};

type TGetPropsWithChangedOffsetParams = {
  offsetHeight: number,
  offsetWidth: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stub: jest.Mock<any, any>,
};

const getPropsWithChangedOffsetParams = (props: TGetPropsWithChangedOffsetParams): TResizeHandler => ({
  ...RESIZE_HANDLER_MOCK,
  parentRef: {
    ...RESIZE_HANDLER_MOCK.parentRef,
    current: {
      ...RESIZE_HANDLER_MOCK.parentRef?.current,
      ...props,
    } as HTMLElement,
  },
  updateSize: props.stub,
});

describe('function "resizeHandler"', () => {
  it('callback does not fire if at least one of the [parentRef] parameters is invalid', () => {
    expect.assertions(2);

    const stub = jest.fn();

    resizeHandler(getPropsWithChangedOffsetParams({
      offsetHeight: 10,
      // @ts-ignore
      offsetWidth: '1234',
      stub,
    }));

    expect(stub).not.toHaveBeenCalled();

    resizeHandler(getPropsWithChangedOffsetParams({
      // @ts-ignore
      offsetHeight: '1234',
      offsetWidth: 10,
      stub,
    }));

    expect(stub).not.toHaveBeenCalled();
  });

  it('fires a callback with size=minSize if the [minSize] attribute is specified and both parameters of the [parentRef.current] attribute are negative and not equal', () => {
    expect.assertions(1);

    const stub = jest.fn();

    resizeHandler(getPropsWithChangedOffsetParams({
      offsetHeight: -1,
      offsetWidth: -2,
      stub,
    }));

    expect(stub).toHaveBeenCalledWith(RESIZE_HANDLER_MOCK.minSize);
  });

  it('fires a callback with size=minSize if the [minSize] attribute is specified and the calculated size is positive and less than the [minSize] attribute', () => {
    expect.assertions(2);

    const stub = jest.fn();

    resizeHandler(getPropsWithChangedOffsetParams({
      offsetHeight: 2,
      offsetWidth: 3,
      stub,
    }));

    resizeHandler(getPropsWithChangedOffsetParams({
      offsetHeight: 3,
      offsetWidth: 2,
      stub,
    }));

    expect(stub).toHaveBeenNthCalledWith(1, RESIZE_HANDLER_MOCK.minSize);
    expect(stub).toHaveBeenNthCalledWith(2, RESIZE_HANDLER_MOCK.minSize);
  });

  it('fires a callback with size=maxSize if the [maxSize] property is provided and the calculated size is positive and greater than the [maxSize] property', () => {
    expect.assertions(1);

    const stub = jest.fn();
    const maxSize = RESIZE_HANDLER_MOCK.maxSize as number;

    resizeHandler({
      ...getPropsWithChangedOffsetParams({
        offsetHeight: maxSize + 1,
        offsetWidth: maxSize + 1,
        stub,
      }),
      minSize: undefined,
    });

    expect(stub).toHaveBeenCalledWith(maxSize);
  });

  it('fires a callback with size = 0 if the [minSize] prop is not specified and both of the [parentRef.current] props are negative', () => {
    expect.assertions(1);

    const stub = jest.fn();

    resizeHandler({
      ...getPropsWithChangedOffsetParams({
        offsetHeight: -1,
        offsetWidth: -2,
        stub,
      }),
      minSize: undefined,
    });

    expect(stub).toHaveBeenCalledWith(0);
  });

  it('fires a callback with a size equal to the smallest positive value of the [parentRef.current] prop parameters that are not equal', () => {
    expect.assertions(2);

    const stub = jest.fn();
    const minSize = RESIZE_HANDLER_MOCK.minSize as number;
    const smallestParam = minSize + 1;

    resizeHandler({
      ...getPropsWithChangedOffsetParams({
        offsetHeight: smallestParam,
        offsetWidth: -10,
        stub,
      }),
      maxSize: undefined,
    });

    const anotherSmallestParam = minSize + 2;

    resizeHandler({
      ...getPropsWithChangedOffsetParams({
        offsetHeight: -10,
        offsetWidth: anotherSmallestParam,
        stub,
      }),
      maxSize: undefined,
    });

    expect(stub).toHaveBeenNthCalledWith(1, smallestParam);
    expect(stub).toHaveBeenNthCalledWith(2, anotherSmallestParam);
  });
});
