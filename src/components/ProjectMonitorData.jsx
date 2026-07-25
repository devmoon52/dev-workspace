import { memo, useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  FileQuestionMark,
  LockKeyholeOpen,
  Pause,
  Pin,
  PinOff,
  ShieldCheck,
  Star,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { truncateText } from "../utils/short";
import { checkDeadline, getMonthAndDay } from "../utils/calculateDate";
import { calculatedMembers } from "../redux/selector/memberSelector";
import CircularProgress from "./CircularProgress";
import { motion } from "motion/react";
import { controlProject } from "../redux/slice/projectSlice";
import DelConfirmation from "./modals/DelConfirmation";
import { AnimatePresence } from "motion/react";
import { addActivity } from "../redux/slice/activitySlice";

function capitalize(txt) {
  if (!txt) return "";

  return txt[0].toUpperCase() + txt.slice(1);
}

const containerVar = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

const projectChildVar = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};
const clientChildVar = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function getUrgency(deadline) {
  const diff = checkDeadline(deadline);

  if (diff === 0) {
    return "Today";
  } else if (diff === 1) {
    return "Tomorrow";
  } else if (diff < 0) {
    return `${-diff} Day Missed`;
  } else {
    return `${diff} Day Left`;
  }
}

const ProjectMonitorData = ({
  currentDisplay,
  currentCID,
  currentProject,
  setCustomIndex,
  onPause,
  onPlay,
  animationKey,
  onNext,
  onBack,
  raset,
}) => {
  const { active } = useSelector(calculatedMembers);
  const { total_clients } = useSelector((state) => state.clients);
  const { system } = useSelector((state) => state.settings);
  const { enabled, loop, loopDuration } = system.projectMonitor;

  const [control, setControl] = useState(null);
  const dispatch = useDispatch();

  const activeMemberMap = useMemo(() => {
    let map = {};

    active.list.forEach((member) => {
      member.role.forEach((r) => {
        map[r.projectID] = { member, r };
      });
    });

    return map;
  }, [active]);

  const clientMap = useMemo(() => {
    let maped = {};

    for (const client of total_clients) {
      maped[client.clientID] = client;
    }

    return maped;
  }, [total_clients]);

  // project delete action
  function deleteProject() {
    dispatch(
      addActivity({
        type: "project",
        log: `1 new ${control.projectStatus} project has been deleted.`,
      }),
    );
    raset();
    dispatch(controlProject({ type: control.type, projectID: control.id }));
  }

  // project block action
  function blockProject() {
    dispatch(
      addActivity({
        type: "project",
        log: `1 new ${control.projectStatus} project has been ${control.isBlocked ? "unblocked" : "blocked"}.`,
      }),
    );
    raset();
    dispatch(controlProject({ type: control.type, projectID: control.id }));
  }

  // project pin action
  function pinProject(id) {
    dispatch(controlProject({ type: "pin", projectID: id }));
  }

  return (
    <motion.div className="bg-white @container min-h-93.5 shadow-md px-3 py-2 rounded-md space-y-4">
      <AnimatePresence>
        {control && (
          <DelConfirmation
            message={control.message}
            callback={
              control.type === "block"
                ? blockProject
                : control.type === "delete"
                  ? deleteProject
                  : pinProject
            }
            offClick={setControl}
          />
        )}
      </AnimatePresence>

      {/* decoration, client & controls - card header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <div className="text-sm @md:block hidden text-right -space-y-0.5">
            <p className="text-gray-500">Clients &</p>
            <p className="text-lg font-semibold">Projects</p>
          </div>
          {/* vr line */}
          <div className="border-r border-gray-300" />
          {/* client name */}
          <div className="-space-y-0.5">
            <p className="text-sm text-gray-500">Client Name</p>
            <h2 className="@sm:text-lg font-semibold">
              {clientMap[currentCID].name}
            </h2>
          </div>
        </div>

        {/* back, next & circular progress */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => onBack()}
              className="bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => onNext()}
              className="bg-gray-100 hover:bg-gray-200"
            >
              <ChevronRight />
            </button>
          </div>

          {/* pause btn */}
          {loop && (
            <CircularProgress
              aria-hidden="true"
              key={animationKey}
              onPause={onPause}
              onPlay={onPlay}
            />
          )}
        </div>
      </div>

      {/* main flex container */}
      <div className="flex">
        {/* projects - left side container */}
        <div className="space-y-3 w-50 @xl:block hidden shrink-0">
          <div className="flex gap-1">
            <FilePenLine aria-hidden="true" size={20} strokeWidth={1.4} />
            <h2>Projects</h2>
          </div>
          <motion.ul
            variants={containerVar}
            initial="hidden"
            animate="visible"
            key={currentCID}
            className="space-y-0.5 smScroll @3xl:max-h-57 max-h-65 overflow-auto pr-1"
          >
            {currentDisplay[currentCID].map((p, i) => (
              <motion.li
                variants={clientChildVar}
                onClick={() => setCustomIndex(i)}
                key={p?.projectID}
                className={`${p?.projectID === currentProject?.projectID ? "bg-gray-300" : "hover:bg-gray-200"} w-full py-0.5 px-1 rounded-sm cursor-pointer`}
              >
                <p className="text-sm truncate">{p.project}</p>
                <p className="text-xs text-gray-500">{p.projectID}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* vr line */}
        <div
          aria-hidden="true"
          className="border-r @xl:block hidden border-gray-300 pl-1"
        ></div>

        {/* insights - right side container */}
        <motion.div
          variants={containerVar}
          key={currentProject.projectID}
          initial="hidden"
          animate="visible"
          className="@xl:pl-3 space-y-3 grow"
        >
          <div className="flex items-center gap-1">
            <FileQuestionMark aria-hidden="true" strokeWidth={1.4} size={20} />
            <p>Insights</p>
          </div>

          {/* Project name and id */}
          <div className="flex justify-between items-start">
            <div className="-space-y-0.5">
              <h2 className="font-semibold @sm:text-lg">
                {currentProject.project}
              </h2>
              <p className="text-sm text-gray-500">
                Project ID: {currentProject.projectID}
              </p>
            </div>

            {/* Implement more things - delete block or pin or something */}
            <div className="flex items-center">
              {/* block and unblock */}
              <button
                disabled={
                  currentProject.status === "running"
                    ? true
                    : currentProject.status === "completed" &&
                      !currentProject.isApproved
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setControl({
                    id: currentProject.projectID,
                    message: `Sure want to ${currentProject.isBlocked ? "unblock" : "block"} this project?`,
                    type: "block",
                    isBlocked: currentProject.isBlocked,
                    projectStatus: currentProject.status,
                  });
                }}
                aria-label="Toggle block button"
                className={`p-1 rounded-full ${currentProject.status === "running" ? "text-gray-400" : currentProject.status === "completed" && !currentProject.isApproved ? "text-gray-400" : "text-black hover:bg-gray-200"}`}
              >
                {currentProject.isBlocked ? (
                  <LockKeyholeOpen
                    strokeWidth={1.6}
                    aria-hidden="true"
                    size={20}
                  />
                ) : (
                  <Ban aria-hidden="true" size={20} strokeWidth={1.6} />
                )}
              </button>
              {/* delete */}
              <button
                disabled={
                  currentProject.status === "running"
                    ? true
                    : currentProject.status === "completed" &&
                      !currentProject.isApproved
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setControl({
                    id: currentProject.projectID,
                    message: `Sure want to delete this project?`,
                    type: "delete",
                    projectStatus: currentProject.status,
                  });
                }}
                aria-label="Delete Proejct"
                className={`p-1 rounded-full ${currentProject.status === "running" ? "text-gray-400" : currentProject.status === "completed" && !currentProject.isApproved ? "text-gray-400" : "text-black hover:bg-gray-200"}`}
              >
                <Trash aria-hidden="true" size={20} strokeWidth={1.6} />
              </button>
              {/* pin and unpin */}
              <button
                onClick={() => pinProject(currentProject.projectID)}
                aria-label="Toggle pin button"
                className="p-1 rounded-full hover:bg-gray-200"
              >
                {currentProject.pined ? (
                  <PinOff aria-hidden="true" size={20} strokeWidth={1.6} />
                ) : (
                  <Pin aria-hidden="true" size={20} strokeWidth={1.6} />
                )}
              </button>
            </div>
          </div>

          {/* Project Data */}
          <div className="flex flex-wrap gap-2">
            {/* project status */}
            <motion.div
              variants={projectChildVar}
              className="border grow border-gray-300 px-3 py-1 rounded-md"
            >
              <h3 className="text-sm text-gray-500">Project Status</h3>
              <div className="flex items-center gap-1">
                <div
                  className={`rounded-full w-2 h-2 bg-amber-500 ${currentProject.status === "pending" ? "bg-sky-400 shadow-[0px_0px_10px_1px] shadow-sky-400" : currentProject.status === "running" ? "bg-amber-500 shadow-[0px_0px_10px_1px] shadow-amber-500" : "bg-green-600 shadow-[0px_0px_10px_1px] shadow-green-500"}`}
                ></div>
                <span>{capitalize(currentProject.status)}</span>
              </div>
            </motion.div>

            {/* client name and id */}
            <motion.div
              variants={projectChildVar}
              className="border grow border-gray-300 px-3 py-1 rounded-md text-sm"
            >
              <p>
                <span className="text-gray-500">CLIENT NAME:</span>{" "}
                {truncateText(clientMap[currentCID].name, 10)}
              </p>
              <p>
                <span className="text-gray-500">CLIENT ID:</span> {currentCID}
              </p>
            </motion.div>

            {/* project approval */}
            <motion.div
              variants={projectChildVar}
              className="border grow border-gray-300 px-3 py-1 rounded-md"
            >
              <h3 className="text-sm text-gray-500">Client Approval</h3>
              {currentProject.isApproved ? (
                <div className="flex items-center gap-0.5">
                  <span>Approved {currentProject.review}</span>
                  <Star
                    className="mb-1"
                    size={19}
                    fill="#E17100"
                    color="#E17100"
                  />
                </div>
              ) : (
                <div>
                  <p>Not Approved Yet</p>
                </div>
              )}
            </motion.div>

            {/* deadline */}
            <motion.div
              variants={projectChildVar}
              className="border grow border-gray-300 px-3 py-1 rounded-md"
            >
              {currentProject.deadline ? (
                <>
                  <h3 className="text-sm text-gray-500">Deadline</h3>
                  <p>{getMonthAndDay(currentProject.deadline)}</p>
                </>
              ) : (
                <>
                  <h3 className="text-sm text-gray-500">Deadline</h3>
                  <p>Completed</p>
                </>
              )}
            </motion.div>

            {/* overdue */}
            <motion.div
              variants={projectChildVar}
              className="border grow border-gray-300 px-3 py-1 rounded-md"
            >
              {currentProject.isOverdue ? (
                <>
                  <h3 className="text-sm text-gray-500">Overdue</h3>
                  <div className="flex items-center gap-0.5 text-red-500">
                    <TriangleAlert size={20} strokeWidth={1.6} />
                    <p>Deadline Missed !</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm text-gray-500">Overdue</h3>
                  <p>Deadline Not Missed</p>
                </>
              )}
            </motion.div>

            {/* urgency - tomorrow, today */}
            <motion.div
              variants={projectChildVar}
              className="border grow border-gray-300 px-3 py-1 rounded-md"
            >
              <h3 className="text-sm text-gray-500">Urgency</h3>
              {currentProject.deadline ? (
                <p>{getUrgency(currentProject.deadline)}</p>
              ) : (
                <p>No Urgency</p>
              )}
            </motion.div>
          </div>

          {/* contributor */}
          <motion.div
            variants={projectChildVar}
            className="border border-gray-300 px-3 py-1 rounded-md"
          >
            <h2 className="font-semibold">Contributor</h2>
            {activeMemberMap[currentProject.projectID] ? (
              <div className="text-sm">
                <p>
                  <span className="text-gray-500">Name:</span> John Doe
                </p>
                <p>
                  <span className="text-gray-500">ID:</span> 909091
                </p>
                <p>
                  <span className="text-gray-500">Status:</span> Pending
                </p>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>{capitalize(currentProject.status)} Project</p>
                <p>No Contributor</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(ProjectMonitorData);
