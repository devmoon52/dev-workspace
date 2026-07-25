import { memo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const BodyFrame = ({ children, isExpand }) => {
  const { pathname, hash } = useLocation();
  const bodyRef = useRef(null);

  function setStyle() {
    if (isExpand) {
      return "md:pl-8 pl-4";
    } else {
      return "md:pl-4 pl-0";
    }
  }

  useEffect(() => {
    if (hash) return;

    bodyRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return (
    <main
      ref={bodyRef}
      className={`grow h-full overflow-y-auto pr-1 sm:pr-4 ${setStyle()}`}
    >
      <section className="overflow-x-hidden min-h-full w-full">
        {children}
      </section>
    </main>
  );
};

export default memo(BodyFrame);
