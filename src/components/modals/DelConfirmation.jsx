import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useAsyncDelay from "../../utils/useAsyncDelay";

const DelConfirmation = ({ message, callback, offClick }) => {
  const delay = useAsyncDelay();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function closePopup() {
      offClick(null);
    }

    window.addEventListener("click", closePopup);
    return () => {
      window.removeEventListener("click", closePopup);
    };
  }, []);

  async function takeAction() {
    setLoading(true);
    await delay(500, () => {
      callback();
    });

    setLoading(false);
    offClick(null);
  }

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
      onClick={(e) => e.stopPropagation()}
      className="bg-red-400 max-w-100 px-3 py-2 rounded-md z-9999 w-[92%] fixed top-10 left-1/2 -translate-x-1/2 space-y-3 overflow-hidden"
    >
      {/* animation div */}
      <motion.div
        animate={{
          x: ["-200%", "400%"],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1
        }}
        className="w-25 absolute left-0 -bottom-10 -top-10"
      >
        <div className="w-full rotate-18 absolute left-0 -bottom-10 -top-10 bg-linear-to-r from-transparent via-white/25 to-transparent blur-sm"></div>
      </motion.div>

      <div>
        <h2 className="font-semibold ">Confirm Action !</h2>
        <p className="text-sm ">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => offClick(null)}
          className="text-sm bg-red-100 rounded-sm px-2 py-1 hover:bg-red-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={takeAction}
          autoFocus
          className={`text-sm bg-red-100 rounded-sm w-10 h-7 flex items-center justify-center ${!loading && "cursor-pointer hover:bg-red-200"}`}
        >
          {loading ? (
            <div className="h-4.5 w-4.5 rounded-full border-2 border-red-200 border-t-red-400 animate-spin"></div>
          ) : (
            <span>Yes</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default DelConfirmation;
