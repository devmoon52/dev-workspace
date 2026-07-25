import { ClipboardCheck } from "lucide-react";
import { motion } from "motion/react";

const CopyToast = () => {
  return (
    <motion.div
      initial={{
        y: 15,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      //   transition={{ duration: 0.4 }}
      exit={{ y: 15, opacity: 0 }}
      className="fixed md:right-4 md:bottom-3 md:translate-x-0 right-1/2 bottom-2 translate-x-1/2 z-9999 text-white bg-black/70 backdrop-blur-sm px-5 w-56 py-3 rounded-md shadow flex items-center gap-1"
    >
      <ClipboardCheck />
      <p>Copied to clipboard</p>
    </motion.div>
  );
};

export default CopyToast;
