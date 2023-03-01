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
 * @param {TResizeListener} props
 * @function useResizeListener (hook)
 */
export const startResizeListener = (props: TResizeListener): void => {

  const {
    cb,
    node,
  } = props;

  /**
   * Custom mutation calls subscription
   */
  const observer = new MutationObserver(processResizeMutation);

  if (node?.nodeName) {
    observer.observe(node, {
      attributeFilter: [ 'style' ],
      attributeOldValue: true,
      attributes: true,
    });

    node.addEventListener('resize', cb);
  }
};
