import { consoleError } from 'utils/console';
import { isTest } from 'utils/env';


const processResizeMutationDefaultErrText = 'Error while processing "processResizeMutation" function:';
export const processResizeMutationNoMutationsErrText = 'No mutations received';
export const processResizeMutationElNotFoundErrText = 'Node element is not found in the received mutation';
export const processResizeMutationElInvalidErrText = `
Received mutation has invalid Node element.
Node element has invalid "clientWidth" or "clientHeight" param (or both)
`;
export const processResizeMutationNoChangesErrText = 'Received mutation has no changes';

export const CUSTOM_NODE_EVENT_NAME_RESIZE = 'resize';

/**
 * Mutations calls subscription processing
 * @param {MutationRecord[]} mutations
 */
export const processResizeMutation = (mutations: MutationRecord[]) => {
  if (!mutations?.length || (mutations && !Array.isArray(mutations))) {
    if (isTest()) {
      consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationNoMutationsErrText}
      `);
    }

    return;
  }

  const el = mutations[0].target;

  if (!el) {
    if (isTest()) {
      consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationElNotFoundErrText}
      `);
    }
    return;
  }

  const w = (el as HTMLElement).clientWidth as number | undefined;
  const h = (el as HTMLElement).clientHeight as number | undefined;

  if (typeof w !== 'number' || typeof h !== 'number') {
    if (isTest()) {
      consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationElInvalidErrText}
      `);
    }

    return;
  }

  const isChange = mutations
    .find(m => {
      if (!m.oldValue) {
        return true;
      }

      const oldValue = String(m.oldValue);

      const isWidthChanged = !oldValue.includes(`width: ${w}px`);
      const isHeightChanged = !oldValue.includes(`height: ${h}px`);

      return isWidthChanged || isHeightChanged;
    });

  if (!isChange) {
    if (isTest()) {
      consoleError(`
        ${processResizeMutationDefaultErrText}
        ${processResizeMutationNoChangesErrText}
      `);
    }

    return;
  }

  const event = new CustomEvent(CUSTOM_NODE_EVENT_NAME_RESIZE, { detail: {
    height: h,
    width: w,
  } });
  el.dispatchEvent?.(event);
};
