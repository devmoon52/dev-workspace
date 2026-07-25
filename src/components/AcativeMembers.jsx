import { File, UserCheck, UserCircle, UserX } from "lucide-react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { calculatedMembers } from "../redux/selector/memberSelector";
import FullDetail from "./modals/FullDetail";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

const variant = (direction) => ({
  hidden: {
    x: direction === "left" ? "-100%" : "100%",
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
});

const text = "Manage team members, add remove and give a new job.";

const AcativeMembers = () => {
  const { active } = useSelector(calculatedMembers);
  const [index, setIndex] = useState(null);

  return (
    <div className="flex @2xl:gap-3 gap-5 @2xl:items-center @2xl:flex-row flex-col">
      <AnimatePresence>
        {index !== null && (
          <FullDetail index={index} setIndex={setIndex} members={active.list} />
        )}
      </AnimatePresence>

      {/* design text */}
      <div className="space-y-1 max-w-120 w-full min-w-70">
        <div className="grid @xl:grid-rows-2">
          <div className="overflow-hidden @xl:block hidden">
            <motion.h1
              variants={variant("left")}
              initial="hidden"
              animate="visible"
              className="@3xl:text-8xl 2xl:text-7xl @md:text-8xl text-7xl text-[#124170]  font-semibold heading-font justify-self-start"
            >
              Team
            </motion.h1>
          </div>
          <div className="overflow-hidden @xl:block hidden">
            <motion.h1
              variants={variant("right")}
              initial="hidden"
              animate="visible"
              className="@3xl:text-8xl 2xl:text-7xl @md:text-8xl text-7xl heading-font text-[#124170]  font-semibold justify-self-end"
            >
              Stats
            </motion.h1>
          </div>

          <h1 className="text-5xl @xl:hidden text-[#124170] font-semibold heading-font">Team Stats</h1>
        </div>
        <h2 className="md:text-xl sm:text-lg font-semibold text-gray-700">
          {text.split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="w-0 overflow-hidden"
            >
              {c}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* member lists */}
      <div className="w-full grow min-w-80 space-y-2 relative">
        <div className="flex items-center gap-2 text-gray-700">
          <UserCheck aria-hidden="true" size={26} strokeWidth={2.6} />
          <h2 className="text-lg font-semibold">Active Members</h2>
        </div>

        {/* Active member lists */}
        <ul
          style={{
            maskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
          className="space-y-1 pl-1 pt-1 h-80 overflow-y-auto overflow-x-hidden pr-1 smScroll"
        >
          {active.count === 0 && (
            <div className="text-gray-400">
              <h3>No Member Available !</h3>
              <UserX className="absolute top-1/2 left-1/2 -translate-1/2" size={80} />
            </div>
          )}
          {active.list.map((m, i) => (
            <li
              onClick={() => setIndex(i)}
              key={m.mid}
              className="border bg-white border-gray-300 rounded-md px-2 py-2 space-y-2 hover:shadow-md hover:-translate-y-1 hover:scale-101 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <UserCircle />
                <h3 className="text-lg font-semibold">
                  {m.name} - {m.mid}
                </h3>
              </div>
              {/* badges */}
              <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0px_0px_15px_2px_#00eb00]"></div>
                  <p className="text-sm">Active</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full">
                  <File size={16} strokeWidth={1.4} />
                  <p className="text-sm">{m.role.length} Project</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AcativeMembers;
