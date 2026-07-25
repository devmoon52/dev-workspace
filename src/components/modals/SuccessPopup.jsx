import { CircleCheck } from "lucide-react";
import useAsyncDelay from "../../utils/useAsyncDelay";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { motion } from "motion/react";
import { removeSuccessAlert } from "../../redux/slice/modalSlice";

const SuccessPopup = ({ message }) => {
  const delay = useAsyncDelay();
  const dispatch = useDispatch();

  useEffect(() => {
    delay(3000, () => {
      dispatch(removeSuccessAlert());
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
      className="flex items-center gap-1 bg-green-500 fixed left-1/2 top-8 z-9999 rounded-md px-4 shadow-md  py-2 -translate-x-1/2 text-white max-w-sm w-[90%]"
    >
      <CircleCheck className="shrink-0" />
      <p className="text-sm">{message} !</p>
    </motion.div>
  );
};

export default SuccessPopup;
