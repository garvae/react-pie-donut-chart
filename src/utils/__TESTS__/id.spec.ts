
import { generateUniqueID } from 'utils/id';

describe('function "id"', () => {
  it('returns the [id] with the default complexity', () => {
    expect.assertions(1);

    const id = generateUniqueID();

    expect(id.split('-')).toHaveLength(8);
  });

  it('returns [id] with the provided valid complexity', () => {
    expect.assertions(1);

    const id = generateUniqueID(1);

    expect(id).toHaveLength(4);
  });

  it('returns [id] with the 8-level complexity when the invalid "complexity" arg is provided', () => {
    expect.assertions(1);

    // @ts-ignore
    const id = generateUniqueID('abc');

    expect(id.split('-')).toHaveLength(8);
  });
});
