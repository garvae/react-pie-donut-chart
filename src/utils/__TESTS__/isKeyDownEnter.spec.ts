import React from 'react';

import { isKeyDownEnter } from 'utils/isKeyDownEnter';

describe('function "isKeyDownEnter"', () => {
  it('validly checks for keystrokes', () => {
    expect.hasAssertions();

    const checksTruthy = [
      isKeyDownEnter({ code: 'Enter' } as React.KeyboardEvent),
      isKeyDownEnter({ key: 'Enter' } as React.KeyboardEvent),
      isKeyDownEnter({ code: '13' } as React.KeyboardEvent),
      isKeyDownEnter({ key: '13' } as React.KeyboardEvent),
      isKeyDownEnter({ code: 13 } as unknown as React.KeyboardEvent),
      isKeyDownEnter({ key: 13 } as unknown as React.KeyboardEvent),
    ];

    const checksFalsy = [
      isKeyDownEnter({ code: 'Space' } as React.KeyboardEvent),
      isKeyDownEnter({ key: 'Space' } as React.KeyboardEvent),
      isKeyDownEnter({ code: '32' } as React.KeyboardEvent),
      isKeyDownEnter({ key: '32' } as React.KeyboardEvent),
      isKeyDownEnter({ code: 32 } as unknown as React.KeyboardEvent),
      isKeyDownEnter({ key: 32 } as unknown as React.KeyboardEvent),
    ];

    const assertions = checksTruthy.length + checksFalsy.length;
    expect.assertions(assertions);

    checksTruthy.forEach(check => expect(check).toBeTruthy());
    checksFalsy.forEach(check => expect(check).not.toBeTruthy());
  });
});
