import { LucideCheck, LucideCheckCircle2, SquareUser } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { filter } from "../../utils/short";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import DotLoader from "../DotLoader";
import { motion } from "motion/react";
import useAsyncDelay from "../../utils/useAsyncDelay";
import { useDispatch, useSelector } from "react-redux";
import { calculatedProjects } from "../../redux/selector/projectSelector";
import {
  setFailedAlert,
  removeFailedAlert,
} from "../../redux/slice/modalSlice";
import { calculatedMembers } from "../../redux/selector/memberSelector";

import { startProject } from "../../redux/slice/projectSlice";
import { addProject } from "../../redux/slice/memberSlice";
import { addActivity } from "../../redux/slice/activitySlice";

const MoveProject = ({ activeMembers, onOpen, projectData }) => {
  const [members, setMembers] = useState(activeMembers);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { total } = useSelector(calculatedProjects);
  const calcMember = useSelector(calculatedMembers);

  const dispatch = useDispatch();
  const delay = useAsyncDelay();

  const memberMap = useMemo(() => {
    let arr = {};
    activeMembers.forEach((m) => {
      arr[m.mid] = m;
    });

    return arr;
  }, [activeMembers]);

  function handleChange(e) {
    setValue(e.target.value);
  }

  // Filter data by member id
  useEffect(() => {
    const filtered = filter(activeMembers, (m) =>
      m.mid.toString().includes(value),
    );
    setMembers(filtered);
  }, [value]);

  // esc key press
  useEffect(() => {
    function escape(e) {
      if (e.key === "Escape") {
        onOpen(null);
      }
    }

    window.addEventListener("keydown", escape);

    return () => {
      window.removeEventListener("keydown", escape);
    };
  }, []);

  // btn action
  function completeProcess() {
    // validation check point
    if (!selected) return;
    if (memberMap[selected].role.length >= 2) {
      dispatch(
        setFailedAlert({
          id: selected,
          message: `${memberMap[selected].name} cannot handle ${memberMap[selected].role.length + 1} project at a time`,
        }),
      );
      return;
    }

    // loading state
    setIsLoading(true);

    // update states
    dispatch(addProject({ project: projectData, mid: selected })); // member update
    dispatch(startProject(projectData.projectID));
    dispatch(
      addActivity({
        type: "project",
        log: "1 new project has been moved to running block.",
      }),
    );

    // delay and close
    delay(1200, () => {
      setIsLoading(false);
      onOpen(null);
    });
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      onClick={() => onOpen(null)}
      className="fixed z-100 top-1/2 left-1/2 inset-0 -translate-1/2 flex items-center justify-center bg-black/20 w-full h-full backdrop-blur-sm"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-lg w-[90%] px-4 py-3 rounded-md space-y-0.5"
      >
        <div className="flex items-center gap-1 text-[#215B63]">
          <SquareUser aria-hidden="true" size={26} strokeWidth={2.4} />
          <h2 className="text-lg font-semibold">
            Select a member for this job
          </h2>
        </div>
        <p>
          {projectData.project} - [{projectData.projectID}]
        </p>

        <div className="mt-2 space-y-1">
          <div className="flex items-end gap-1 justify-between">
            <h3>Active members</h3>
            <input
              value={value}
              onChange={handleChange}
              type="text"
              placeholder="Find by ID"
              className="border outline-none px-2 w-40 py-1 rounded-md border-gray-400"
            />
          </div>
          <div role="list" className="space-y-1 h-34 overflow-y-auto smScroll">
            {members.length !== 0 ? (
              members.map((m) => (
                <div
                  onClick={() => setSelected(m.mid)}
                  role="listitem"
                  key={m.mid}
                  className={`text-sm flex gap-1 px-2 py-0.5 rounded-md justify-between cursor-pointer group ${selected === m.mid ? "bg-[#67c09085] text-[#215B63]" : "hover:bg-gray-300 bg-gray-200"}`}
                >
                  <p>
                    {m.name} -{" "}
                    <span
                      className={`text-xs ${selected !== m.mid && "text-gray-500 group-hover:text-black"}`}
                    >
                      ({m.role.length} Project)
                    </span>
                  </p>
                  <div
                    className={`flex items-center ${selected === m.mid ? "gap-1" : "gap-0"}`}
                  >
                    <p
                      className={` ${selected === m.mid ? "text-[#215B63]" : "text-gray-500 group-hover:text-black"}`}
                    >
                      {m.mid}
                    </p>
                    <CheckCircle2
                      aria-hidden="true"
                      className={`${selected === m.mid ? "w-5" : "w-0"} transition-all duration-300`}
                      size={20}
                      strokeWidth={2.4}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-1 justify-center h-full text-gray-600">
                <TriangleAlert aria-hidden="true" size={22} />
                <p>No Available Member !</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            disabled={isLoading}
            aria-label="Complete process"
            onClick={completeProcess}
            className="bg-[#67c09085] hover:bg-[#67c090be] text-[#215B63] w-30 h-9 rounded-md mt-2 flex items-center justify-center"
          >
            {isLoading ? (
              <DotLoader aria-hidden="true" size="sm" />
            ) : (
              <span>Complete</span>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(MoveProject);
