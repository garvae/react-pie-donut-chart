import {
  renderHook,
  waitFor,
  act,
} from '@testing-library/react';
import { useChartStates } from 'hooks/useChartStates';

describe('hook "useChartStates"', () => {
  describe('"animationSpeed" state', () => {
    it('updates inside the "useLayoutEffect"', async () => {
      expect.hasAssertions();

      const animationSpeed1 = 111;
      const animationSpeed2 = 222;

      const {
        rerender,
        result,
      } = renderHook(props => useChartStates(props), { initialProps: { animationSpeed: animationSpeed1 } });

      await waitFor(() => {
        const { animationDuration } = result.current;
        expect(animationDuration).toBe(animationSpeed1);
      });

      rerender({ animationSpeed: animationSpeed2 });

      await waitFor(() => {
        const { animationDuration } = result.current;
        expect(animationDuration).toBe(animationSpeed2);
      });
    });

    it('updates with the setter', async () => {
      expect.hasAssertions();

      const animationSpeed1 = 111;
      const animationSpeed2 = 222;

      const { result } = renderHook(props => useChartStates(props), { initialProps: { animationSpeed: animationSpeed1 } });

      await waitFor(() => {
        const { animationDuration } = result.current;
        expect(animationDuration).toBe(animationSpeed1);
      });

      act(() => {
        result.current.setAnimationDuration(animationSpeed2);
      });

      await waitFor(() => {
        const { animationDuration } = result.current;
        expect(animationDuration).toBe(animationSpeed2);
      });
    });
  });
});
