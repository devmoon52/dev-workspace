import { useState, useRef, useEffect } from "react";
import { useMotionValue } from "motion/react";

function calculateConstraints(ref, fn1, fn2) {
  const clientWidth = ref.current.clientWidth;
  const scrollWidth = ref.current.scrollWidth;

  fn1(scrollWidth > clientWidth);
  fn2(scrollWidth - clientWidth);
}

const useHorizontalDrag = () => {
  const [constraints, setConstraints] = useState(0);
  const [isDraggable, setIsDraggable] = useState(false);

  const ref = useRef(null);
  const timer = useRef(null);
  const observerTime = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    function update() {
      clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        calculateConstraints(ref, setIsDraggable, setConstraints);
      }, 200);
    }

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    // Need a debounce logic here.
    const observer = new ResizeObserver(() => {
      clearTimeout(observerTime.current);

      observerTime.current = setTimeout(() => {
        calculateConstraints(ref, setIsDraggable, setConstraints);
        x.set(0);
      }, 150);
    });

    observer.observe(ref.current);

    return () => {
      clearTimeout(observerTime.current);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isDraggable) {
      x.set(0);
    }
  }, [isDraggable]);

  return { ref, x, isDraggable, constraints };
};

export { useHorizontalDrag };
