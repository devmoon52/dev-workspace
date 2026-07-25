import { Files, FileX, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculatedProjects } from "../../redux/selector/projectSelector";
import { motion, AnimatePresence } from "motion/react";
import { setFailedAlert, setSuccessAlert } from "../../redux/slice/modalSlice";
import { startProject } from "../../redux/slice/projectSlice";
import { addProject } from "../../redux/slice/memberSlice";
import DotLoader from "../DotLoader";
import useAsyncDelay from "../../utils/useAsyncDelay";
import { addActivity } from "../../redux/slice/activitySlice";

const MultiStepDrawer = ({ drawer, setDrawer }) => {
  const { pending } = useSelector(calculatedProjects);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const delay = useAsyncDelay();

  // complete action
  async function completeAction() {
    setLoading(true);
    if (drawer.role.length > 1) {
      dispatch(
        setFailedAlert({
          id: drawer.mid,
          message: "Can not assign over 2 project at a time !",
        }),
      );
      setLoading(false);
      return setDrawer(null);
    }

    // finishing
    await delay(600, () => {
      dispatch(startProject(selected.projectID));
      dispatch(addProject({ project: selected, mid: drawer.mid }));
      dispatch(addActivity({type: 'project', log: '1 new project has been moved to running block'}))
      dispatch(
        setSuccessAlert({
          id: selected.projectID,
          message: "New project added",
        }),
      );
    });

    setLoading(false);
    setDrawer(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute bg-black/10 inset-0"
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="sm:w-[75%] w-[80%] space-y-6 justify-self-end py-4 bg-white h-full flex flex-col relative"
      >
        {/* decoration and close */}
        <div className="flex justify-between items-center px-3">
          <div className="flex items-center gap-1">
            <Files />
            <h2 className="sm:text-lg">Select a project</h2>
          </div>
          <div className="flex items-center gap-1">
            <p>Close</p>
            <button
              onClick={() => setDrawer(null)}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-0.5 rounded-full"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* projects */}
        <ul className="overflow-y-auto smScroll">
          {pending.count === 0 && (
            <div className="px-3 text-gray-400">
              <h3>No Project Available !</h3>
              <FileX size={80} className="absolute left-1/2 top-1/2 -translate-1/2" />
            </div>
          )}
          {pending.list.map((p, i) => (
            <li
              key={p.projectID}
              onClick={() => {
                if (selected?.projectID === p.projectID) {
                  setSelected(null);
                } else {
                  setSelected(p);
                }
              }}
              className={`px-3 transition-colors duration-200 py-2 border-gray-300 justify-between flex items-center ${selected?.projectID === p.projectID ? "bg-gray-300" : "hover:bg-gray-200"} gap-1 sm:text-[16px] text-sm cursor-default ${pending.count - 1 !== i && "border-b"}`}
            >
              <p>{p.project}</p>
              <span>{p.projectID}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {selected && (
            <motion.button
              onClick={completeAction}
              disabled={loading}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-green-500 hover:bg-green-600 transition-colors duration-200 h-11 flex justify-center items-center w-[80%] bottom-15 shadow-md text-white left-1/2 -translate-x-1/2 absolute rounded-md"
            >
              {loading ? <DotLoader size="md" /> : "Complete Action"}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.aside>
    </motion.div>
  );
};

export default MultiStepDrawer;
