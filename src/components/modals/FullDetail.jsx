import {
  Ban,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Copy,
  CopyCheck,
  FilePenLine,
  FilePlus,
  Files,
  ReceiptText,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { textToImage } from "../../utils/short";
import { displayCopyToast } from "../../utils/copy";
import { useDispatch } from "react-redux";
import MultiStepDrawer from "./MultiStepDrawer";
import { AnimatePresence, motion } from "motion/react";
import { copyToClipboard } from "../../utils/copy";
import { getMonthAndDay } from "../../utils/calculateDate";

const FullDetail = ({ members, index, setIndex }) => {
  const [copy, setCopy] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const dispatch = useDispatch();

  const currentMember = members[index];

  async function copyID(val) {
    try {
      const res = await copyToClipboard(val);
      if (!res) {
        return;
      }

      setCopy(val);
      displayCopyToast(dispatch, setCopy, val);
    } catch (err) {
      console.error(err);
    }
  }

  // accessibility - left arrow, right arrow & esc key press
  useEffect(() => {
    function handleKeyPress(e) {
      if (e.key === "Escape") {
        if (drawer) {
          setDrawer(null);
        } else {
          setIndex(null);
        }
      }

      if (!drawer) {
        if (e.key === "ArrowLeft") {
          setIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        if (e.key === "ArrowRight") {
          setIndex((prev) =>
            prev < members.length - 1 ? prev + 1 : members.length - 1,
          );
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [drawer]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-1000 bg-black/10"
    >
      <motion.section
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 30, opacity: 0 }}
        className="bg-white xl:w-1/2 sm:left-auto left-2 sm:w-[70%] absolute sm:right-6 right-2 top-6 bottom-6 rounded-md sm:px-5 px-2 py-2 space-y-5 overflow-hidden"
      >
        {/* btns */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : 0))}
              aria-label="Move left"
              className={`hover:bg-gray-200 rounded-full cursor-pointer ${index === 0 && "text-gray-400"}`}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <span className="border w-10 flex justify-center items-center border-b-2 border-gray-300 border-b-gray-700">
              {index + 1}
            </span>
            <button
              onClick={() =>
                setIndex((prev) =>
                  prev < members.length - 1 ? prev + 1 : members.length - 1,
                )
              }
              aria-label="Move right"
              className={`hover:bg-gray-200 rounded-full cursor-pointer ${members.length - 1 === index && "text-gray-400"}`}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <p>Close</p>
            <button
              onClick={() => setIndex(null)}
              className=" bg-gray-200 p-1 rounded-full cursor-pointer hover:bg-gray-300"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* team member image */}
        <div className="sm:mt-20 flex items-center gap-3">
          <div className="h-14 w-14 border rounded-full border-gray-300 flex justify-center items-center">
            <h2 className="text-lg font-semibold">
              {textToImage(currentMember.name)}
            </h2>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{currentMember.name}</h2>
            <div className="flex items-center gap-1.5">
              <p className="text-sm">ID: {currentMember.mid}</p>
              <button
                onClick={() => copyID(currentMember.mid)}
                className="cursor-pointer"
              >
                {copy ? (
                  <CopyCheck aria-hidden="true" size={16} strokeWidth={1.4} />
                ) : (
                  <Copy aria-hidden="true" size={16} strokeWidth={1.4} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* details */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <ReceiptText aria-hidden="true" />
            <h2>Details</h2>
          </div>

          <div className="border border-gray-300 space-y-1 py-1 px-1 rounded-md">
            <div className="">
              <span className="text-gray-600">Member Status:</span>{" "}
              <span
                className={`font-semibold ${currentMember.isActive ? "text-green-500" : "text-red-500"}`}
              >
                {currentMember.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Handling Projects: </span>
              <span className="font-semibold">
                {currentMember.role.length} Project
              </span>
            </div>
          </div>
        </div>

        {/* projects */}
        <motion.div
          key={currentMember.mid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-1">
            <FilePenLine aria-hidden="true" />
            <h2>Projects</h2>
          </div>

          {currentMember.role.length === 0 && (
            <div className="border border-gray-300 px-3 text-center py-5 rounded-md text-gray-600">
              No Available Project !
            </div>
          )}

          {currentMember.role.map((p) => (
            <div
              role="listitem"
              key={p.projectID}
              className="border border-gray-300 px-2 py-1 rounded-md"
            >
              <h2 className="font-semibold text-lg">{p.project}</h2>
              <p className="text-sm">
                <span className="text-gray-600">Project ID:</span> {p.projectID}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Project Status:</span>{" "}
                {p.status[0].toUpperCase() + p.status.slice(1)}
              </p>
              <p className={`text-sm ${p.isOverdue && "text-red-500"}`}>
                <span className="text-gray-600">Deadline:</span>{" "}
                {getMonthAndDay(p.deadline)}{" "}
                {p.isOverdue && <span>- Overdue</span>}
              </p>
            </div>
          ))}

          <button
            aria-label="Add A Project"
            onClick={() => setDrawer(currentMember)}
            className="flex items-center gap-1 border w-full justify-center py-4 rounded-md border-gray-300 hover:bg-gray-100 transition-colors duration-200"
          >
            <CirclePlus aria-hidden="true" size={22} strokeWidth={1.4} />{" "}
            <span>Add A Project</span>
          </button>
        </motion.div>

        {/* multi step drawer - side panel */}
        <AnimatePresence>
          {drawer && <MultiStepDrawer drawer={drawer} setDrawer={setDrawer} />}
        </AnimatePresence>
      </motion.section>
    </motion.div>
  );
};

export default FullDetail;
