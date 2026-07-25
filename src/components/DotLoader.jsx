import { motion } from "motion/react";

const DotLoader = ({ size = "md", isBright = false }) => {
  function onSize() {
    if (size === "sm") {
      return "w-2 h-2";
    } else if (size === "md") {
      return "w-3 h-3";
    } else {
      return "w-5 h-5";
    }
  }
  function spaceX() {
    if (size === "sm") {
      return "gap-1";
    } else if (size === "md") {
      return "gap-2";
    } else {
      return "gap-3";
    }
  }

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {},
      }}
      initial="hidden"
      animate="visible"
      className={`flex items-center justify-center ${spaceX()} h-full`}
    >
      {[0, 1, 2].map((_, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: {
              scale: 0.4,
              opacity: 0.3,
            },
            visible: {
              scale: [0.4, 1, 0.4],
              opacity: [0.3, 1, 0.3],
              transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              },
            },
          }}
          className={`${onSize()} ${isBright ? "bg-[#ebebeb]" : "bg-[#215B63]"} rounded-full`}
        />
      ))}
    </motion.div>
  );
};

export default DotLoader;
