/**
 * Generates unique ID string
 * @function { (complexity?: number) => string } generateUniqueID
 * @param { number } complexity - complexity of the generated ID string
 * @return { string } unique id
 *
 * @example
 * ```
 * const id = generateUniqueID() // 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX'
 * const idLite = generateUniqueID(2) // 'XXXX-XXXX'
 * ```
 */
export const generateUniqueID = (complexity = 8) => {

  const cmplxt = typeof complexity === 'number' && complexity > 0 ? complexity : 8;

  const chr4 = () => Math.random()
    .toString(16)
    .slice(-4);

  const newIdArr = Array(cmplxt)
    .fill(null)
    .map(chr4);

  if (newIdArr.length === 1) {
    return newIdArr[0];
  }

  return newIdArr.join('-');
};
