import { Calendar } from "lucide-react";
import { forwardRef } from "react";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="@lg:w-80 w-70 border border-gray-400 rounded-md px-3 py-2 flex items-center justify-between gap-1"
    >
      <span className="text-gray-600 md:text-[16px] text-sm">{value || "Set reminder time"}</span>

      <Calendar size={18} />
    </button>
  );
});

export default CustomDateInput;