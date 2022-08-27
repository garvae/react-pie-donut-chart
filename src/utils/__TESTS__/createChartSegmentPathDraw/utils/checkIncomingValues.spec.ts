import { mockConsole } from 'tests/mocks/console';
import {
  CHECK_INCOMING_VALUES_TEST_VALUES_VALID,
  CHECK_INCOMING_VALUES_TEST_VALUES_INVALID,
} from 'tests/mocks/variables';
import { checkIncomingValues } from 'utils/createChartSegmentPathDraw/_utils/checkIncomingValues';

describe('function "checkIncomingValues"', () => {
  it('returns a valid check when props are valid', () => {
    expect.assertions(2);
    const { consoleErrorMocked }  = mockConsole();

    const check = checkIncomingValues(CHECK_INCOMING_VALUES_TEST_VALUES_VALID);

    expect(check).toBeTruthy();
    expect(consoleErrorMocked).not.toHaveBeenCalled();
  });

  it('returns a valid fallback when incorrect params are passed', () => {
    expect.assertions(2);
    const { consoleErrorMocked }  = mockConsole();

    const check = checkIncomingValues(CHECK_INCOMING_VALUES_TEST_VALUES_INVALID);

    expect(check).not.toBeTruthy();
    expect(consoleErrorMocked).toHaveBeenCalledTimes(1);
  });
});
