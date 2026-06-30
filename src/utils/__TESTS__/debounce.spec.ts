import { waitFor } from '@testing-library/react';
import { TEST_PROPS } from 'tests/mocks/variables';
import { debounce } from 'utils/debounce';

describe('function "debounce"', () => {
  it('fires once in the provided time period', async () => {
    expect.hasAssertions();

    const stub = jest.fn();
    const debounced = debounce(stub, TEST_PROPS.resizeReRenderDebounceTime);
    debounced();
    expect(stub).not.toHaveBeenCalled();

    jest.advanceTimersByTime(TEST_PROPS.resizeReRenderDebounceTime / 2);
    debounced();
    expect(stub).not.toHaveBeenCalled();

    jest.advanceTimersByTime(TEST_PROPS.resizeReRenderDebounceTime / 2);
    expect(stub).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(stub).toHaveBeenCalledTimes(1);
    });
  });

  it('cancels a pending callback', () => {
    expect.assertions(1);

    const stub = jest.fn();
    const debounced = debounce(stub, TEST_PROPS.resizeReRenderDebounceTime);

    debounced();
    debounced.cancel();

    jest.advanceTimersByTime(TEST_PROPS.resizeReRenderDebounceTime);

    expect(stub).not.toHaveBeenCalled();
  });
});
