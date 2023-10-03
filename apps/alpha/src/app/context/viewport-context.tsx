import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const viewportContext = createContext({
  width: 0,
  height: 0,
});

const ViewportProvider = (props: { children: ReactNode }) => {
  // 顺带监听下高度，备用
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {props.children}
    </viewportContext.Provider>
  );
};

/**
 * @description 获得窗口的大小
 * @return {{number,number}} {width,height} {宽度,高度}
 */

const useViewport = () => {
  const { width, height } = useContext(viewportContext);
  return [width, height];
};

export { ViewportProvider, useViewport };
