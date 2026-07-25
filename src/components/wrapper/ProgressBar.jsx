import nProgress from "nprogress";
import { useEffect } from "react";

const ProgressBar = ({ children }) => {
  useEffect(() => {
    nProgress.done();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    return () => {
      nProgress.start();
    };
  }, []);

  return children;
};

export default ProgressBar;
