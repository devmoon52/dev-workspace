import { Mail, Phone, SquareUser, Tally3, UserRound, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, useDragControls, useMotionValue } from "motion/react";
import { useRef, useState } from "react";
import { removeAccModal } from "../../redux/slice/modalSlice";

const AccountModal = () => {
  const { adminSetting } = useSelector((state) => state.settings);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const dispatch = useDispatch();

  const dragControls = useDragControls();
  const modalRef = useRef(null);

  function handleBoundary() {
    const rect = modalRef.current.getBoundingClientRect();

    if (rect.left < 0) {
      x.set(x.get() - rect.left);
    }

    if (rect.right > window.innerWidth) {
      x.set(x.get() - (rect.right - window.innerWidth));
    }

    if (rect.top < 0) {
      y.set(y.get() - rect.top);
    }

    if (rect.bottom > window.innerHeight) {
      y.set(y.get() - (rect.bottom - window.innerHeight));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      ref={modalRef}
      drag
      style={{ x, y }}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={handleBoundary}
      className="fixed left-1/2 top-1/2 -translate-1/2 bg-white rounded-md shadow-md z-9998 max-w-sm w-[90%] overflow-hidden border border-gray-400"
    >
      <div>
        <button
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none hover:bg-gray-200 active:bg-gray-300 w-full flex justify-center items-center cursor-grab active:cursor-grabbing border-b border-gray-300"
        >
          <Tally3 className="rotate-90 mt-1.75" size={28} strokeWidth={1.4} />
        </button>
        <button
          onClick={() => dispatch(removeAccModal())}
          className="absolute right-0 top-0 bg-white p-1.5 cursor-pointer hover:text-gray-700"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <div className="px-3 py-2.5 ">
        <div className="flex items-center gap-1">
          <UserRound strokeWidth={2.4} aria-hidden="true" />
          <h2 className="text-lg font-semibold heading-font">ADMIN</h2>
        </div>

        <div className="mt-3 text-gray-700 space-y-1">
          <div className="flex items-center gap-1">
            <SquareUser size={22} />
            <p>{adminSetting.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <Mail size={22} />
            <p>{adminSetting.email}</p>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={21} />
            <p>+{adminSetting.phone}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountModal;
