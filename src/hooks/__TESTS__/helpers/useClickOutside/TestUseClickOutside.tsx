import React, { useRef } from 'react';

import {
  TUseClickOutside,
  useClickOutside,
} from 'hooks/helpers/useClickOutside';

export const TEST_USE_CLICK_OUTSIDE_TARGET_TEXT = 'Target';
export const TEST_USE_CLICK_OUTSIDE_BUTTON_TEXT = 'Button';

type TTestUseClickOutside = {
  propsUseClickOutside: Omit<TUseClickOutside, 'ref'>,
};

export const TestUseClickOutside = (props: TTestUseClickOutside) => {

  const { propsUseClickOutside } = props;

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ...propsUseClickOutside,
    ref,
  });

  return (
    <div>
      <div ref={ref}>{TEST_USE_CLICK_OUTSIDE_TARGET_TEXT}</div>

      <button>{TEST_USE_CLICK_OUTSIDE_BUTTON_TEXT}</button>
    </div>
  );
};
