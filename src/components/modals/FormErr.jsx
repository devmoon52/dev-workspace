import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const FormErr = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-red-200 px-3 py-2 absolute top-full left-1 text-sm rounded-sm shadow-sm flex items-center gap-1.5 text-red-600 z-500"
    >
      <div className="absolute -top-1.5 left-4 h-3 w-3 bg-red-200 rotate-45"></div>

      <TriangleAlert className="shrink-0" size={20} />
      <span>{message} !</span>
    </motion.div>
  );
};

export default FormErr;
