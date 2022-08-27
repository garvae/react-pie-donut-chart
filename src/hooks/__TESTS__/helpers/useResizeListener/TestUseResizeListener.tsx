import React, {
  useState,
  useRef,
} from 'react';

import { startResizeListener } from 'hooks/helpers/useHandleResize/startResizeListener/startResizeListener';


export const TestUseResizeListener = () => {

  const [ clicksCount, setClicksCount ] = useState<number>(0);
  const [ cbCount, setCbCount ] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  const startResizeListenerCb = () => {
    setCbCount(cbCount + 1);
  };

  startResizeListener({
    cb: startResizeListenerCb,
    node: ref.current,
  });

  return (
    <div
      onClick={() => setClicksCount(clicksCount + 1)}
      ref={ref}
      role='button'
      style={
        {
          height: '200px',
          width: `${clicksCount * 2}px`, 
        }
      }
    >
      {cbCount}
    </div>
  );
};
