import {
  CheckCheck,
  ChevronRight,
  Copy,
  CopyCheck,
  FileX,
  FolderClock,
  FolderOpen,
  FolderSync,
  TriangleAlert,
} from "lucide-react";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { useSelector } from "react-redux";
import { truncateText } from "../utils/short";
import { useEffect, useState, useMemo, useRef } from "react";
import { copyToClipboard, displayCopyToast } from "../utils/copy";
import { useDispatch } from "react-redux";
import Dropdown from "./Dropdown";
import { calculatedMembers } from "../redux/selector/memberSelector";
import MoveProject from "./modals/MoveProject";
import DotLoader from "./DotLoader";
import { AnimatePresence } from "motion/react";
import useAsyncDelay from "../utils/useAsyncDelay";
import { finishProject } from "../redux/slice/projectSlice";
import { removeProject } from "../redux/slice/memberSlice";
import { addActivity } from "../redux/slice/activitySlice";
import { setSuccessAlert } from "../redux/slice/modalSlice";

const ManageProjects = () => {
  const { pending, running, total } = useSelector(calculatedProjects);
  const { active } = useSelector(calculatedMembers);
  const { system } = useSelector((state) => state.settings);
  const { overdueHighlighter } = system;

  const [modalData, setModalData] = useState(null);
  const [expand, setExpand] = useState(0);
  const [startRunning, setStartRunning] = useState(0);
  const [startPending, setStartPending] = useState(0);
  const [currentLoading, setCurrentLoading] = useState([]);
  const [copy, setCopy] = useState(null);

  const dragImageRef = useRef(null);

  const delay = useAsyncDelay();
  const dispatch = useDispatch();

  const [filteredPending, setFilteredPending] = useState(
    pending.list.slice(0, 10),
  );
  const [filteredRunning, setFilteredRunning] = useState(
    running.list.slice(0, 7),
  );

  // updating while redux store will change
  useEffect(() => {
    setFilteredPending(pending.list.slice(0, 10));
  }, [pending]);
  useEffect(() => {
    setFilteredRunning(running.list.slice(0, 7));
  }, [running]);

  // drag and drop div
  useEffect(() => {
    const div = document.createElement("div");
    div.classList.add(
      "bg-amber-200",
      "inline-block",
      "px-5",
      "py-1",
      "rounded-lg",
      "border",
      "border-gray-300",
      "text-sm",
    );

    div.style.position = "fixed";
    div.style.top = "-9999px";
    div.style.left = "-9999px";

    document.body.appendChild(div);
    dragImageRef.current = div;

    return () => {
      div.remove();
    };
  }, []);

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

  // copy component for every id copy
  const copyComponent = useMemo(() => {
    return (idName, idValue) => (
      <div className="flex items-center gap-2 text-sm">
        <p>
          <span className="text-gray-500">{idName}</span>: {idValue}
        </p>
        <button
          aria-label="Copy id"
          onClick={() => copyId(idValue)}
          className="p-0.5 cursor-pointer"
        >
          {copy === idValue ? (
            <CopyCheck aria-hidden="true" size={18} />
          ) : (
            <Copy aria-hidden="true" size={18} />
          )}
        </button>
      </div>
    );
  }, [copy]);

  return (
    <section
      id="manageProjects"
      className="flex gap-3 flex-wrap pb-3 overflow-auto"
    >
      {/* move project modal */}
      <AnimatePresence>
        {modalData !== null && (
          <MoveProject
            onOpen={setModalData}
            projectData={modalData}
            activeMembers={active.list}
          />
        )}
      </AnimatePresence>

      {/* pending projects */}
      <div className="bg-white min-h-139 grow basis-100 shadow-md rounded-md px-3 py-2 space-y-3 shrink-0 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <FolderClock aria-hidden="true" size={26} strokeWidth={2.6} />
            <h2 className="text-lg font-semibold uppercase">
              Pending Projects
            </h2>
          </div>
          {pending.count > 10 && (
            <Dropdown
              label={"Filter"}
              total={pending.count}
              setFn={setFilteredPending}
              list={pending.list}
              setStart={setStartPending}
            />
          )}
        </div>
        <ul className="space-y-2">
          {pending.count === 0 && (
            <div className="text-gray-400">
              <h3>No Project Available !</h3>
              <FileX
                className="absolute top-1/2 left-1/2 -translate-1/2"
                size={80}
              />
            </div>
          )}
          {filteredPending.map((p, i) => (
            <li
              draggable
              onDragStart={(e) => {
                dragImageRef.current.innerHTML = `
                <h2 class="font-semibold text-gray-700">${p.project}</h2>
                  <p class="text-xs text-gray-500">ID: ${p.projectID}</p>
                `;

                e.dataTransfer.setData("projectID", JSON.stringify(p));
                e.dataTransfer.setDragImage(dragImageRef.current, 10, 10);
              }}
              onClick={() => setExpand(i)}
              key={p.projectID}
              className={`${expand === i ? "bg-gray-300 px-3 py-2 rounded-md" : "hover:bg-gray-300 cursor-pointer hover:pl-3"} transition-all duration-200`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>{startPending + i + 1}.</span>
                  <p>
                    {expand === i ? p.project : truncateText(p.project, 22)}
                  </p>
                </div>
                <button
                  aria-label="Open Accordion"
                  className={`cursor-pointer ${expand === i && "rotate-90"} transition-transform duration-200`}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>

              <div
                className={`${expand === i ? "h-40 mt-2" : "h-0"} transition-height duration-300 space-y-2 overflow-hidden`}
              >
                {copyComponent("Project ID", p.projectID)}
                {copyComponent("Client ID", p.clientID)}
                <p className="text-sm">
                  <span className="text-gray-500">Deadline:</span> {p.deadline}
                </p>
                <hr className="border-t border-gray-400" />
                <div className="space-y-0.5">
                  <p className="text-sm text-gray-600">
                    &#9673; Ready to start working on this project?
                  </p>
                  <button
                    aria-label="Start Project"
                    onClick={() => setModalData(p)}
                    className="bg-[#215B63] px-4 py-2 rounded-md text-white hover:bg-[#276972] cursor-pointer text-sm"
                  >
                    Start Project
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Running projects */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          try {
            let project = e.dataTransfer.getData("projectID") || {};
            let data = JSON.parse(project);
            if (data) {
              setModalData(data);
            }
          } catch (err) {
            console.error("Failed to catch your destination !");
          }
        }}
        className="@container grow min-h-139 basis-100 bg-white shrink-0 px-3 py-2 rounded-md shadow-md space-y-3 relative"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-700">
            <FolderSync aria-hidden="true" size={26} strokeWidth={2.6} />
            <h2 className="text-lg font-semibold uppercase">
              Running Projects
            </h2>
          </div>
          <Dropdown
            total={running.count}
            size={7}
            label={"Filter"}
            list={running.list}
            setFn={setFilteredRunning}
            setStart={setStartRunning}
          />
        </div>
        <div>
          <ul className="space-y-2">
            {running.count === 0 && (
              <div className="text-gray-400">
                <h3>No Project Available !</h3>
                <FileX
                  className="absolute top-1/2 left-1/2 -translate-1/2"
                  size={80}
                />
              </div>
            )}
            {filteredRunning.map((r, i) => (
              <li
                key={r.projectID}
                className={`border px-2 py-1 rounded-md ${projectMemberMap[r.projectID]?.isOverdue && overdueHighlighter ? "border-red-300" : "border-gray-300"} flex justify-between items-center`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-semibold ${projectMemberMap[r.projectID]?.isOverdue && overdueHighlighter && "text-red-500"}`}
                    >
                      {startRunning + i + 1}. {r.project}
                    </h3>{" "}
                  </div>
                  <div className="text-sm flex flex-wrap gap-1">
                    <p>
                      <span className="text-gray-500">Project ID:</span>{" "}
                      {r.projectID}
                    </p>
                    <p>
                      <span className="text-gray-500">Member ID:</span>{" "}
                      {projectMemberMap[r.projectID]?.mid}
                    </p>
                  </div>
                </div>
                {projectMemberMap[r.projectID]?.status === "completed" ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <h2>100%</h2>
                    </div>
                    <button
                      aria-label="Finish Project"
                      onClick={() => onFinish(r.projectID)}
                      disabled={currentLoading.includes(r.projectID)}
                      className="bg-green-500 @lg:w-28 h-8 w-12 text-white rounded-full text-sm cursor-pointer hover:bg-green-600 flex justify-center items-center"
                    >
                      {currentLoading.includes(r.projectID) ? (
                        <DotLoader aria-hidden="true" size="sm" />
                      ) : (
                        <>
                          <span className="@lg:block hidden">
                            Finish Project
                          </span>
                          <CheckCheck
                            aria-hidden="true"
                            className="@lg:hidden block"
                          />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      background: `conic-gradient(#22c55e ${projectMemberMap[r.projectID]?.status === "pending" ? "25%" : "50%"}, #e5e7eb 0%)`,
                    }}
                    className="h-12 w-12 bg-amber-200 text-xs justify-center items-center flex rounded-full"
                  >
                    <div className="bg-white rounded-full h-9 w-9 flex justify-center items-center">
                      {projectMemberMap[r.projectID]?.status === "pending"
                        ? "25%"
                        : "50%"}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ManageProjects;
