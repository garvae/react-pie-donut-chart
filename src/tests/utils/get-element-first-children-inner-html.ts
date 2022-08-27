
type TGetElementFirstChildrenInnerHtml = {
  element: HTMLElement;
};

/**
 * Returns inner HTML of the first children of the passed HTMLElement
 * @function { (props: TGetElementFirstChildrenInnerHtml) => string } getElementFirstChildrenInnerHtml
 * @param { TGetElementFirstChildrenInnerHtml } props
 */
export const getElementFirstChildrenInnerHtml = (props: TGetElementFirstChildrenInnerHtml): string => {

  const { element } = props;

  if (!element) {
    throw new Error('"getElementFirstChildrenInnerHtml" error: Element not passed');
  }

  const textEl = Array.from(element.children)[0] as HTMLDivElement;

  if (!textEl) {
    throw new Error('"getElementFirstChildrenInnerHtml" error: Children doesn\'t exists');
  }

  return textEl.innerHTML;
};
