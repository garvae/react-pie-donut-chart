import { RefObject } from 'react';


export const containerRefMocked = (size: number) => ({ current: {
  clientHeight: size,
  clientWidth: size,
  offsetHeight: size,
  offsetWidth: size,
} } as RefObject<HTMLElement>);
