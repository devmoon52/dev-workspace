import { CornerUpLeft, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeShortCut } from "../../redux/slice/modalSlice";

const ShortCutSuggetion = () => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(removeShortCut());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white shadow-md px-3 py-4 fixed max-w-sm w-[90%] rounded-sm md:bottom-6 bottom-2 md:right-4 right-1/2 translate-x-1/2 md:translate-x-0 z-9999 border border-gray-400"
    >
      <button
        onClick={() => closeModal()}
        className="absolute right-1 top-1 cursor-pointer"
      >
        <X />
      </button>
      <div className="flex items-center gap-1">
        <CornerUpLeft strokeWidth={2.6} />
        <h2 className="text-lg font-semibold">Go back</h2>
      </div>
      <kbd className="text-sm mt-2 inline-block">
        <span className="bg-gray-300 text-gray-700 px-3 py-1 inline-block rounded-sm">
          Shift
        </span>{" "}
        +{" "}
        <span className="bg-gray-300 text-gray-700 px-3 py-1 inline-block rounded-sm">
          Backspace
        </span>
      </kbd>
    </motion.div>
  );
};

export default ShortCutSuggetion;
