import {
  Ban,
  Copy,
  CopyCheck,
  FileDigit,
  FileX,
  LockKeyholeOpen,
  Pin,
  PinOff,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { checkDeadline, getMonthAndDay } from "../utils/calculateDate";
import { truncateText } from "../utils/short";
import Dropdown from "./Dropdown";
import MoveProject from "./modals/MoveProject";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { AnimatePresence } from "motion/react";
import { controlProject, finishProject } from "../redux/slice/projectSlice";
import { removeProject } from "../redux/slice/memberSlice";
import DotLoader from "./DotLoader";
import useAsyncDelay from "../utils/useAsyncDelay";
import { addActivity } from "../redux/slice/activitySlice";
import { copyToClipboard, displayCopyToast } from "../utils/copy";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { motion } from "motion/react";
import { setSuccessAlert } from "../redux/slice/modalSlice";
import DelConfirmation from "./modals/DelConfirmation";

const ProjectWatchlist = () => {
  const { pending, running, overdue, blocked, pined } =
    useSelector(calculatedProjects);
  const { active } = useSelector(calculatedMembers);
  const { x, isDraggable, constraints, ref } = useHorizontalDrag();

  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const delay = useAsyncDelay();
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [modalData, setModalData] = useState(null);
  const [currentLoading, setCurrentLoading] = useState([]);
  const [copy, setCopy] = useState(null);
  const [recentIndex, setRecentIndex] = useState(0);
  const [unblock, setUnblock] = useState(null);

  // mamber-map by id: member
  const projectMemberMap = useMemo(() => {
    const map = {};

    active.list.forEach((member) => {
      member.role.forEach((project) => {
        map[project.projectID] = {
          mid: member.mid,
          name: member.name,
          project: project.project,
          status: project.status,
          isOverdue: project.isOverdue ? true : false,
        };
      });
    });

    return map;
  }, [active]);

  // datas on pending + running project
  const data = useMemo(() => {
    const closest = { count: 0, list: [] };

    for (const p of [...pending.list, ...running.list]) {
      let deadlineDiff = checkDeadline(p.deadline);

      if (deadlineDiff < 2 && !p.isOverdue) {
        closest.count++;
        closest.list.push(p);
      }
    }

    return {
      closest,
    };
  }, [pending, running]);

  // update filtered closest
  useEffect(() => {
    setFilteredClosest(data.closest.list.slice(0, 3));
  }, [data.closest]);

  // update filtered pined
  useEffect(() => {
    setFilteredPined(pined.list.slice(0, 4));
  }, [pined.list]);

  // update filtered blocked
  useEffect(() => {
    setFilteredBlocked(blocked.list.slice(0, 4));
  }, [blocked.list]);

  const [filteredClosest, setFilteredClosest] = useState(
    data.closest.list.slice(0, 3),
  );
  const [filteredPined, setFilteredPined] = useState(pined.list.slice(0, 4));
  const [filteredBlocked, setFilteredBlocked] = useState(
    blocked.list.slice(0, 4),
  );

  // finish button action
  async function onFinish(projectID) {
    setCurrentLoading((prev) => [...prev, projectID]);
    const mid = projectMemberMap[projectID].mid;

    await delay(1000, () => {
      dispatch(finishProject(projectID));
      dispatch(removeProject({ projectID, mid }));
      dispatch(
        addActivity({
          type: "project",
          log: "1 new project has been moved to completed block.",
        }),
      );

      setCurrentLoading((prev) => prev.filter((id) => id !== projectID));
      dispatch(
        setSuccessAlert({
          id: projectID,
          message: "Project has been successfully finished",
        }),
      );
    });
  }

  // copy button action
  async function copyId(val) {
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

  // set index
  useEffect(() => {
    if (!isMobile) return;

    const unsubscribe = x.on("change", (latest) => {
      const cardWidth = cardRef.current.offsetWidth;

      const index = Math.round(Math.abs(latest) / cardWidth);
      setRecentIndex(index);
    });

    return () => unsubscribe();
  }, [x, isMobile]);

  // resize event
  useEffect(() => {
    function handler() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 200);
    }
    handler();

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
      clearTimeout(timerRef.current);
    };
  }, []);

  // unblock fn
  function unBlockFn() {
    dispatch(
      addActivity({
        type: "project",
        log: `1 new ${unblock.projectStatus} project has been unblocked.`,
      }),
    );
    dispatch(controlProject({ type: "block", projectID: unblock.id }));
  }

  return (
    <section id="project-alerts" className="flex gap-3 @container relative">
      {/* move project modal */}
      <AnimatePresence>
        {modalData !== null && (
          <MoveProject
            onOpen={setModalData}
            projectData={modalData}
            activeMembers={active.list}
          />
        )}
        {unblock && (
          <DelConfirmation
            message={unblock.message}
            callback={unBlockFn}
            offClick={setUnblock}
          />
        )}
      </AnimatePresence>

      {/* wrapper */}
      <motion.div
        ref={ref}
        drag={isDraggable ? "x" : false}
        style={{ x: x }}
        dragConstraints={{ left: -constraints, right: 0 }}
        className={`flex gap-3 w-full ${isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
      >
        {/* Deadline Closest */}
        <div
          ref={cardRef}
          className="bg-white @md:basis-75 grow shrink-0 rounded-md shadow-md px-3 py-2 space-y-3 min-h-69 @md:w-auto w-full min-w-75"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <FileDigit aria-hidden="true" strokeWidth={2.6} />
              <h2 className="text-lg font-semibold">Deadline Closest</h2>
            </div>
            {data.closest.count > 3 && (
              <div>
                <Dropdown
                  total={data.closest.count}
                  size={3}
                  setFn={setFilteredClosest}
                  list={data.closest.list}
                />
              </div>
            )}
          </div>

          <ul className="space-y-1.5">
            {data.closest.count === 0 && (
              <div className="flex flex-col items-center space-y-1 text-gray-400">
                <p className="self-start justify-self-start">
                  Empty Closest Projects !
                </p>
                <FileX className="my-10" size={80} aria-hidden="true" />
              </div>
            )}
            {filteredClosest.map((p) => (
              <li
                className="bg-gray-100 px-1 flex gap-1 justify-between"
                key={p.projectID}
              >
                <div>
                  <p>{truncateText(p.project, 18)}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-700 mt-1">
                      ID: {p.projectID}
                    </p>
                    <button
                      aria-label="Copy id"
                      onClick={() => copyId(p.projectID)}
                    >
                      {copy === p.projectID ? (
                        <CopyCheck size={16} strokeWidth={1.4} />
                      ) : (
                        <Copy size={16} strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    Deadline: {getMonthAndDay(p.deadline)}
                  </p>
                </div>
                <div className="mt-1">
                  {p.status === "pending" ? (
                    <button
                      aria-label="Open modal for start project"
                      onClick={() => setModalData(p)}
                      className="text-sm bg-[#215b63] hover:bg-[#276972] text-white px-2.5 py-1 rounded-sm cursor-pointer"
                    >
                      Start
                    </button>
                  ) : (
                    <span className="text-sm">Running</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Overdue projects */}
        <div className="bg-white @md:basis-75 grow shrink-0 rounded-md shadow-md px-3 py-2 space-y-3 min-h-69 @md:w-auto w-full min-w-75">
          <div className="flex items-center gap-2 text-gray-700">
            <TriangleAlert aria-hidden="true" strokeWidth={2.6} />
            <h2 className="text-lg font-semibold">Overdue Projects</h2>
          </div>

          <ul className="space-y-1.5">
            {overdue.count === 0 && (
              <div className="flex flex-col items-center space-y-1 text-gray-400">
                <p className="self-start justify-self-start">
                  Empty Overdue Projects !
                </p>
                <FileX className="my-10" size={80} aria-hidden="true" />
              </div>
            )}
            {overdue.list.map((p) => (
              <li
                className="flex justify-between bg-red-600/20 px-1"
                key={p.projectID}
              >
                <div>
                  <p>{truncateText(p.project, 18)}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-700">
                      ID: {p.projectID}
                    </span>
                    <button
                      aria-label="Copy id"
                      onClick={() => copyId(p.projectID)}
                    >
                      {copy === p.projectID ? (
                        <CopyCheck size={16} strokeWidth={1.4} />
                      ) : (
                        <Copy size={16} strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <button
                    onClick={() => onFinish(p.projectID)}
                    className="text-sm rounded-sm bg-green-500 text-white cursor-pointer hover:bg-green-600 w-15.5 h-7 flex justify-center items-center"
                  >
                    {currentLoading.includes(p.projectID) ? (
                      <DotLoader aria-hidden="true" size="sm" />
                    ) : (
                      <>
                        <span>Finish</span>
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Blocked projects */}
        <div className="bg-white @md:basis-75 grow shrink-0 rounded-md shadow-md px-3 py-2 space-y-3 min-h-69 @md:w-auto w-full min-w-75">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Ban aria-hidden="true" strokeWidth={2.6} />
              <h2 className="text-lg font-semibold">Blocked Projects</h2>
            </div>
            {blocked.count > 4 && (
              <div>
                <Dropdown
                  total={blocked.count}
                  size={4}
                  setFn={setFilteredBlocked}
                  list={blocked.list}
                />
              </div>
            )}
          </div>

          <ul>
            {blocked.count === 0 && (
              <div className="flex flex-col items-center space-y-1 text-gray-400">
                <p className="self-start justify-self-start">
                  Empty Blocked Projects !
                </p>
                <FileX className="my-10" size={80} aria-hidden="true" />
              </div>
            )}
            {filteredBlocked.map((p, i) => (
              <li
                key={p.projectID}
                className={`flex justify-between border-gray-400 py-1 ${i !== filteredBlocked.length - 1 && "border-b"}`}
              >
                <div className="text-gray-600 -space-y-0.5">
                  <p>{truncateText(p.project, 18)}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">ID: {p.projectID}</span>
                    <button
                      aria-label="Copy id"
                      onClick={() => copyId(p.projectID)}
                    >
                      {copy === p.projectID ? (
                        <CopyCheck size={16} strokeWidth={1.4} />
                      ) : (
                        <Copy size={16} strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUnblock({
                        id: p.projectID,
                        message: `Confirm unblocking ${truncateText(p.project, 18)} ?`,
                        projectStatus: p.status,
                      });
                    }}
                    aria-label="Unblock project"
                    className="bg-gray-200 hover:bg-gray-300 p-1 rounded-sm"
                  >
                    <LockKeyholeOpen size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* pinned projects */}
        <div className="bg-white @md:basis-75 grow shrink-0 rounded-md shadow-md px-3 py-2 space-y-3 min-h-69 @md:w-auto w-full min-w-75">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Pin aria-hidden="true" strokeWidth={2.6} />
              <h2 className="text-lg font-semibold">Pined Projects</h2>
            </div>
            {pined.count > 4 && (
              <div>
                <Dropdown
                  total={pined.count}
                  size={4}
                  setFn={setFilteredPined}
                  list={pined.list}
                />
              </div>
            )}
          </div>

          <ul className="space-y-1.5">
            {pined.count === 0 && (
              <div className="flex flex-col items-center space-y-1 text-gray-400">
                <p className="self-start justify-self-start">
                  Empty Pined Projects !
                </p>
                <FileX className="my-10" size={80} aria-hidden="true" />
              </div>
            )}
            {filteredPined.map((p, i) => (
              <li
                key={p.projectID}
                className="flex justify-between bg-gray-100 px-1"
              >
                <div className="text-gray-600 -space-y-0.5">
                  <p>{truncateText(p.project, 18)}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">ID: {p.projectID}</span>
                    <button
                      aria-label="Copy id"
                      onClick={() => copyId(p.projectID)}
                    >
                      {copy === p.projectID ? (
                        <CopyCheck size={16} strokeWidth={1.4} />
                      ) : (
                        <Copy size={16} strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    aria-label="Unpin action"
                    onClick={() => {
                      dispatch(
                        controlProject({ type: "pin", projectID: p.projectID }),
                      );
                    }}
                    className="bg-gray-200 hover:bg-gray-300 p-1 rounded-sm"
                  >
                    <PinOff size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="absolute z-10 -bottom-5 flex @md:hidden items-center gap-1 left-1/2 -translate-x-1/2">
        {[1, 2, 3, 4].map((_, i) => {
          return (
            <div
              key={i + 1}
              className={`h-2.5 w-2.5 ${recentIndex === i ? "bg-gray-700" : "bg-gray-600/50"} rounded-full`}
            ></div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectWatchlist;
