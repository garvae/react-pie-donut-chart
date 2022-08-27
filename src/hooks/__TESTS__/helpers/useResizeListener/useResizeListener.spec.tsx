import React from 'react';

import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestUseResizeListener } from 'hooks/__TESTS__/helpers/useResizeListener/TestUseResizeListener';


describe('hook "useResizeListener"', () => {
  describe('function "startResizeListener"', () => {
    it('fires when the provided node changes its size', async () => {
      expect.hasAssertions();

      render(<TestUseResizeListener />);

      const div = screen.getByRole('button');

      expect(div).toHaveTextContent('0');

      userEvent.click(div);

      await waitFor(() => {
        expect(div).toHaveTextContent('1');
      });
    });
  });
});

