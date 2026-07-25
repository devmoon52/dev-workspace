import { useRef, useEffect } from "react";

const useAsyncDelay = () => {
  const timerRef = useRef(null);

  const delay = (time, callback) => {
    return new Promise((resolve) => {
      timerRef.current = setTimeout(() => {
        callback();
        resolve();
      }, time);
    });
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return delay;
};

export default useAsyncDelay;
