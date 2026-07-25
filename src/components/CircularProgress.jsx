import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { animate } from "motion";
import { useSelector } from "react-redux";

const CircularProgress = ({ onPause, onPlay }) => {
  const { system } = useSelector((state) => state.settings);
  const { loopDuration } = system.projectMonitor;

  const progress = useMotionValue(100);
  const [isPaused, setIsPaused] = useState(false);
  const controlRef = useRef(null);

  useEffect(() => {
    controlRef.current = animate(progress, 0, {
      duration: loopDuration,
      ease: "linear",
    });

    return () => controlRef.current.stop();
  }, []);

  useEffect(() => {
    if (isPaused) {
      controlRef.current.pause();
    } else {
      controlRef.current.play();
    }
  }, [isPaused]);

  const bg = useTransform(progress, (v) => {
    return `conic-gradient(
      #216350 ${v}%,
      #e5e7eb ${v}%
    )`;
  });

  function handleBtnClick() {
    if (isPaused) {
      onPlay();
      setIsPaused(false);
    } else {
      onPause();
      setIsPaused(true);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="@xl:block hidden">{isPaused ? "Play":"Pause"}</span>
      <motion.div
        style={{
          background: bg,
        }}
        className="w-10 transition-all duration-300 h-10 flex justify-center items-center rounded-full"
      >
        <button
          onClick={handleBtnClick}
          className="border bg-white h-9 w-9 rounded-full flex items-center justify-center border-gray-300 cursor-pointer"
        >
          {isPaused ? (
            <Play size={18} strokeWidth={1.4} />
          ) : (
            <Pause size={18} strokeWidth={1.4} />
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default CircularProgress;
