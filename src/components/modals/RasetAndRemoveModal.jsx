import { X } from "lucide-react";
import { motion } from "motion/react";

const RasetAndRemoveModal = ({ children, onClose }) => {
  return (
    <motion.div
      onClick={onClose && onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-1/2 left-1/2 -translate-1/2 z-7777 inset-0 bg-black/20 h-full w-full flex items-center justify-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white relative px-4 py-2.5 rounded-md max-w-md w-[90%]"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-1 top-1 cursor-pointer text-gray-600 hover:text-black"
          >
            <X aria-hidden="true" />
          </button>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

export default RasetAndRemoveModal;
