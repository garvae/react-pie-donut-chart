import { isKeyDownSpace } from 'utils/isKeyDownSpace';

describe('function "isKeyDownSpace"', () => {
  it('returns [true] when e.code is "space" (case-insensitive)', () => {
    expect.assertions(2);

    // @ts-ignore
    expect(isKeyDownSpace({ code: 'Space' })).toBeTruthy();
    // @ts-ignore
    expect(isKeyDownSpace({ code: 'space' })).toBeTruthy();
  });

  it('returns [true] when e.key is " " (the Space character)', () => {
    expect.assertions(1);

    // @ts-ignore
    expect(isKeyDownSpace({ key: ' ' })).toBeTruthy();
  });

  it('returns [true] when e.key is "space" (case-insensitive, some older browsers)', () => {
    expect.assertions(2);

    // @ts-ignore
    expect(isKeyDownSpace({ key: 'space' })).toBeTruthy();
    // @ts-ignore
    expect(isKeyDownSpace({ key: 'Space' })).toBeTruthy();
  });

  it('returns [false] for Enter key', () => {
    expect.assertions(1);

    // @ts-ignore
    expect(isKeyDownSpace({ code: 'Enter', key: 'Enter' })).toBeFalsy();
  });

  it('returns [false] for unrelated key', () => {
    expect.assertions(1);

    // @ts-ignore
    expect(isKeyDownSpace({ code: 'KeyA', key: 'a' })).toBeFalsy();
  });

  it('returns [false] when event has no code or key', () => {
    expect.assertions(1);

    // @ts-ignore
    expect(isKeyDownSpace({})).toBeFalsy();
  });
});
