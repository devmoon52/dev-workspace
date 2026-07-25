import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { removeFailedAlert } from "../../redux/slice/modalSlice";
import useAsyncDelay from "../../utils/useAsyncDelay";
import { useDispatch } from "react-redux";
import { motion } from "motion/react";

const FailedPopup = ({ message }) => {
  const delay = useAsyncDelay();
  const dispatch = useDispatch();

  useEffect(() => {
    delay(3000, () => {
      dispatch(removeFailedAlert());
    });
  }, [message]);

  return (
    <motion.div
      initial={{
        y: -15,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: -15,
        opacity: 0,
      }}
      className="flex items-center gap-1 bg-red-400 fixed left-1/2 top-8 z-9999 rounded-md px-4 shadow-md py-2 -translate-x-1/2 text-white min-w-70 sm:w-auto w-[90%]"
    >
      <TriangleAlert />
      <p className="text-sm">{message} !</p>
    </motion.div>
  );
};

export default FailedPopup;
