import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const element = document.querySelector(hash);

    if (element) {
      element.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;
