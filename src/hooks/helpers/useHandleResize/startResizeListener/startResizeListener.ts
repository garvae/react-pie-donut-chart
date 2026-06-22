/**
 * Custom node event name
 */
import { processResizeMutation } from 'hooks/helpers/useHandleResize/startResizeListener/processResizeMutation';

/**
 * Describes props for the 'startResizeListener' function returned by 'useResizeListener' hook
 * @typedef { Object } TResizeListener
 *
 * @property { (event: Event) => void } cb - callback when custom 'resize' event is fired
 * @property { HTMLElement } node - The node to which you want to add a custom event
 */
type TResizeListener = {
  cb: (event: Event) => void;
  node: Node | null;
};

/**
 * Inspired by: https://stackoverflow.com/a/46555778/14140292
 *
 * Only creates a MutationObserver (and attaches the custom 'resize' event
 * listener) when there is an actual node to observe — a fixed "size" prop (no
 * "parentRef" node) should never spin up an observer that has nothing to do.
 *
 * Returns a cleanup function so the caller can disconnect the observer and
 * remove the listener (e.g. on unmount, or before re-creating them when
 * "node"/"cb" change) instead of leaking a new observer/listener pair on
 * every call.
 *
 * @param {TResizeListener} props
 * @function useResizeListener (hook)
 * @returns {(() => void) | undefined} cleanup function, or undefined when no node was observed
 */
export const startResizeListener = (props: TResizeListener): (() => void) | undefined => {
  const { cb, node } = props;

  if (!node?.nodeName) {
    return undefined;
  }

  /**
   * Custom mutation calls subscription
   */
  const observer = new MutationObserver(processResizeMutation);

  observer.observe(node, {
    attributeFilter: ['style'],
    attributeOldValue: true,
    attributes: true
  });

  node.addEventListener('resize', cb);

  return () => {
    observer.disconnect();
    node.removeEventListener('resize', cb);
  };
};
