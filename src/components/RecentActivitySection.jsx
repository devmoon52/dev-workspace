import { motion, useInView } from "motion/react";
import { History } from "lucide-react";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { useState, useRef, useEffect } from "react";

import Collaboration from "./Collaboration";
import Approved from "./Approved";
import CurrentProject from "./CurrentProject";

const RecentActivitySection = () => {
  const { x, ref, isDraggable, constraints } = useHorizontalDrag();
  const [recentIndex, setRecentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const cardRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isMobile) return;

    const unsubscribe = x.on("change", (latest) => {
      const cardWidth = cardRef.current.offsetWidth;

      const index = Math.round(Math.abs(latest) / cardWidth);
      setRecentIndex(index);
    });

    return () => unsubscribe();
  }, [x, isMobile]);

  useEffect(() => {
    function handler() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 200);
    }
    handler();

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section className="space-y-2">
      <div className="sm:hidden text-lg font-semibold flex items-center gap-1.5">
        <History aria-hidden="true" className="shrink-0" strokeWidth={2.4} />
        <h2 className="whitespace-nowrap">Recent Activity</h2>
      </div>

      <motion.div
        ref={ref}
        drag={isDraggable ? "x" : false}
        style={{
          x: x,
        }}
        dragConstraints={{
          left: -constraints,
          right: 0,
        }}
        className={`flex gap-4 ${isDraggable && "cursor-grab active:cursor-grabbing"}`}
      >
        <Collaboration reference={cardRef} />
        <Approved />
        <CurrentProject />
      </motion.div>

      <div className="flex sm:hidden items-center justify-center mt-4 gap-2">
        {[1, 2, 3].map((_, i) => {
          return (
            <div
              key={i + 1}
              className={`h-2.5 w-2.5 ${recentIndex === i ? "bg-gray-700" : "bg-gray-600/50"} rounded-full`}
            ></div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivitySection;
