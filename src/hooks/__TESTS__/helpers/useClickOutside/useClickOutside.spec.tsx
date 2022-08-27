import React from 'react';

import {
  renderHook,
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TestUseClickOutside,
  TEST_USE_CLICK_OUTSIDE_BUTTON_TEXT,
} from 'hooks/__TESTS__/helpers/useClickOutside/TestUseClickOutside';
import {
  useClickOutside,
  TUseClickOutside,
  useClickOutsideNoCbErrText,
} from 'hooks/helpers/useClickOutside';
import { mockConsole } from 'tests/mocks/console';
import { TEST_PROPS } from 'tests/mocks/variables';
import { multilineToSingleLineLowerCased } from 'tests/utils/multilineToSingleLine';
import { originalEnv } from 'utils/env';


const USE_CLICK_OUTSIDE_TEST_PROPS: TUseClickOutside = {
  callback: jest.fn(),
  isWithKeyEsc: true,
  ref: TEST_PROPS.parentRef,
};

describe('hook "useClickOutside"', () => {
  it('shows an error: "No callback received"', () => {
    expect.assertions(1);
    const { consoleErrorMocked } = mockConsole();

    renderHook(() => useClickOutside({
      ...USE_CLICK_OUTSIDE_TEST_PROPS,
      callback: undefined,
    }));

    const consoleCallText = consoleErrorMocked.mock.calls[0][0];

    expect(multilineToSingleLineLowerCased(consoleCallText))
      .toContain(multilineToSingleLineLowerCased(useClickOutsideNoCbErrText));
  });

  it('fires the callback when catches "MouseEvent" outside of the target. NODE_ENV: \'test\'', () => {
    expect.assertions(4);
    const { consoleErrorMocked } = mockConsole();
    const stub = jest.fn();

    const Cmp = (
      <TestUseClickOutside
        propsUseClickOutside={
          {
            ...USE_CLICK_OUTSIDE_TEST_PROPS,
            callback: stub,
          }
        }
      />
    );

    const { rerender } = render(Cmp);

    jest.advanceTimersToNextTimer();

    let button = screen.getByText(TEST_USE_CLICK_OUTSIDE_BUTTON_TEXT);
    userEvent.click(button);

    expect(consoleErrorMocked).not.toHaveBeenCalled();
    expect(stub).toHaveBeenCalledTimes(1);

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
    };

    rerender(Cmp);

    jest.advanceTimersToNextTimer();

    button = screen.getByText(TEST_USE_CLICK_OUTSIDE_BUTTON_TEXT);
    userEvent.click(button);

    expect(consoleErrorMocked).not.toHaveBeenCalled();
    expect(stub).toHaveBeenCalledTimes(2);

    process.env = originalEnv;
  });

  it('fires the callback when catches the "KeyboardEvent" ["Esc"]', () => {
    expect.assertions(2);
    const { consoleErrorMocked } = mockConsole();
    const stub = jest.fn();

    render((
      <TestUseClickOutside
        propsUseClickOutside={
          {
            ...USE_CLICK_OUTSIDE_TEST_PROPS,
            callback: stub,
          }
        }
      />
    ));

    jest.advanceTimersToNextTimer();

    const button = screen.getByText(TEST_USE_CLICK_OUTSIDE_BUTTON_TEXT);
    fireEvent.keyUp(button, {
      code: 27,
      key: 'Escape', 
    });

    expect(consoleErrorMocked).not.toHaveBeenCalled();
    expect(stub).toHaveBeenCalledTimes(1);
  });
});
