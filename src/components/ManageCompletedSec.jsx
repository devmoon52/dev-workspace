import { useEffect, useMemo, useState } from "react";
import Reminders from "./Reminders";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCheck,
  Circle,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  FileCheck,
  FileXCorner,
  Star,
  Trash,
} from "lucide-react";
import { filter } from "../utils/short";
import { updateProjects } from "../redux/slice/projectSlice";
import { motion, AnimatePresence } from "motion/react";
import DelConfirmation from "./modals/DelConfirmation";
import { addActivity } from "../redux/slice/activitySlice";

const ManageCompletedSec = () => {
  const { completed, total } = useSelector(calculatedProjects);
  const dispatch = useDispatch();

  const [isSelect, setIsSelect] = useState(false);
  const [isOpenBar, setIsOpenBar] = useState(false);
  const [isOpenDelete, setisOpenDelete] = useState(null);
  const [status, setStatus] = useState("approved");
  const [selected, setSelected] = useState(new Set());

  // project maped
  const projectMaped = useMemo(() => {
    let approved = [];
    let notApproved = [];

    for (const p of completed.list) {
      if (p.isApproved) {
        approved.push(p);
      } else {
        notApproved.push(p);
      }
    }

    return {
      approved,
      notApproved,
    };
  }, [completed]);

  // filtered for toggle approved
  const [filteredCompleted, setFilteredCompleted] = useState(
    projectMaped.approved,
  );

  // toggle status -> Approved | Not Approved
  useEffect(() => {
    if (status === "notApproved") {
      setIsSelect(false);
      setSelected(new Set());
      setFilteredCompleted(projectMaped.notApproved);
    } else {
      setFilteredCompleted(projectMaped.approved);
    }
  }, [status, completed]);

  // window offClick
  useEffect(() => {
    function handler() {
      setIsOpenBar(false);
    }

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  // delete selected projects
  function deleteSelectedProjects() {
    if (selected.size === 0) return;

    const filtered = filter(total.list, (p) => {
      return !selected.has(p.projectID);
    });

    dispatch(updateProjects(filtered));
    dispatch(
      addActivity({
        type: "project",
        log: `${selected.size} completed & approved project has been deleted.`,
      }),
    );
    setSelected(new Set());
    setIsSelect(false);
  }

  // project selection or deselection
  function selectProject(projectID) {
    if (!isSelect) return;

    setSelected((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(projectID)) {
        newSet.delete(projectID);
      } else {
        newSet.add(projectID);
      }

      return newSet;
    });
  }

  return (
    <section className="flex gap-3 flex-wrap @container">
      <AnimatePresence>
        {isOpenDelete && (
          <DelConfirmation
            callback={deleteSelectedProjects}
            message={isOpenDelete.message}
            offClick={setisOpenDelete}
          />
        )}
      </AnimatePresence>
      {/* notes and reminders */}
      <div className="px-3 py-2 basis-83 grow space-y-3 bg-white rounded-md shadow-md h-150 overflow-y-auto smScroll">
        <Reminders />
      </div>

      {/* completed projects */}
      <div id="approved"
        style={{
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
        className="space-y-1.5 @md:basis-100 basis-80 @lg:basis-180 grow h-150 overflow-y-scroll pr-2 @lg:shrink shrink-0"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <FileCheck aria-hidden="true" strokeWidth={2.6} size={26} />
          <h2 className="text-lg uppercase font-semibold">
            Completed Projects
          </h2>
        </div>

        {/* buttons */}
        <div className="flex justify-between items-center">
          {/* approved & not approved btns */}
          <div className="space-x-2">
            <button
              aria-label="Approved projects"
              onClick={() => setStatus("approved")}
              className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${status === "approved" ? "bg-[#215b63] text-white" : "bg-gray-300"}`}
            >
              Approved
            </button>
            <button
              aria-label="Not approved projects"
              onClick={() => setStatus("notApproved")}
              className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${status === "notApproved" ? "bg-[#215b63] text-white" : "bg-gray-300"}`}
            >
              Not Approved
            </button>
          </div>

          {/* ui print while width < @lg */}
          <AnimatePresence>
            {status === "approved" && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="relative flex @lg:hidden items-center gap-2"
              >
                <span>{selected.size}</span>
                <button
                  aria-label="Toggle available options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpenBar((prev) => !prev);
                  }}
                  className="@lg:hidden block"
                >
                  <CircleEllipsis aria-hidden="true" />
                </button>
                {isOpenBar && (
                  <div className="bg-gray-300 absolute right-0 top-full rounded-md overflow-hidden w-40">
                    {/* select one */}
                    <button
                      aria-label="Select one"
                      disabled={isSelect || filteredCompleted.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSelect(true);
                        setIsOpenBar(false);
                      }}
                      className={`px-3 py-1.5 text-sm flex items-center gap-1 w-full ${isSelect || filteredCompleted.length === 0 ? "text-gray-500 hover:bg-transparent" : "text-black hover:bg-gray-400"}`}
                    >
                      <CircleCheck aria-hidden="true" size={20} />
                      <span>Select</span>
                    </button>
                    {/* select all */}
                    <button
                      aria-label="Toggle select or deselect all"
                      disabled={filteredCompleted.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSelect(true);
                        setSelected((prev) => {
                          if (prev.size === filteredCompleted.length) {
                            return new Set();
                          } else {
                            return new Set(
                              filteredCompleted.map((p) => p.projectID),
                            );
                          }
                        });
                      }}
                      className={`px-3 py-1.5 text-sm flex items-center gap-1 w-full ${filteredCompleted.length === 0 ? "text-gray-500 hover:bg-transparent" : "text-black hover:bg-gray-400"}`}
                    >
                      <CheckCheck aria-hidden="true" size={20} />
                      <span>
                        {selected.size === filteredCompleted.length
                          ? "Deselect All"
                          : "Select All"}
                      </span>
                    </button>
                    {/* cancel btn */}
                    <button
                      aria-label="Cancel all actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSelect(false);
                        setSelected(new Set());
                        setIsOpenBar(false);
                      }}
                      className="px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-gray-400 w-full"
                    >
                      <CircleX aria-hidden="true" size={20} />
                      <span>Cancel</span>
                    </button>
                    {/* delete btn */}
                    <button
                      aria-label="Delete project"
                      disabled={selected.size === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setisOpenDelete({
                          message: `Deleting ${selected.size} completed projects?`,
                        });
                        setIsOpenBar(false);
                      }}
                      className={`px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-gray-400 w-full ${selected.size === 0 && "text-gray-500 hover:bg-transparent"}`}
                    >
                      <Trash aria-hidden="true" size={20} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* selection and delete btns */}
          <div className="hidden @lg:flex gap-2 items-center">
            {!isSelect && status === "approved" && (
              <>
                <button
                  aria-label="Select one"
                  disabled={filteredCompleted.length === 0}
                  onClick={() => setIsSelect(true)}
                  className={`text-sm px-3 py-1.5 rounded-full bg-gray-300 ${filteredCompleted.length === 0 ? "text-gray-500" : "hover:bg-gray-400"}`}
                >
                  Select
                </button>
                <button
                  aria-label="Select all"
                  disabled={filteredCompleted.length === 0}
                  onClick={(e) => {
                    setIsSelect(true);
                    setSelected(
                      new Set(filteredCompleted.map((p) => p.projectID)),
                    );
                  }}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1 hover: bg-gray-300 rounded-full w-full ${filteredCompleted.length === 0 ? "text-gray-500" : "hover:bg-gray-400"}`}
                >
                  <span>Select All</span>
                </button>
              </>
            )}
            {isSelect && status === "approved" && (
              <>
                <p className="text-sm">{selected.size} Selected</p>
                <div className="flex gap-2">
                  {/* cancel btn */}
                  <button
                    aria-label="Cancel all actions"
                    onClick={() => {
                      setIsSelect(false);
                      setSelected(new Set());
                    }}
                    className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 rounded-full text-sm"
                  >
                    Cancel
                  </button>
                  {/* delete btn */}
                  <button
                    aria-label="Delete"
                    disabled={selected.size === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setisOpenDelete({
                        message: `Deleting ${selected.size} completed projects?`,
                      });
                    }}
                    className={`p-1.5 rounded-full bg-gray-300 ${selected.size === 0 ? "text-gray-500" : "hover:bg-gray-400"}`}
                  >
                    <Trash aria-hidden="true" size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* completed projects list */}
        <ul className="space-y-1">
          {filteredCompleted.length === 0 && (
            <div className="mt-40 flex justify-center">
              <div className="flex gap-1 border px-10 py-7 rounded-full border-gray-300 text-gray-500">
                <FileXCorner aria-hidden="true" />{" "}
                <span>No Project Available !</span>
              </div>
            </div>
          )}
          {filteredCompleted.map((p) => (
            <li
              onClick={() => selectProject(p.projectID)}
              className={`py-0.5 border px-1 flex gap-1 ${isSelect && "cursor-pointer"} ${selected.has(p.projectID) ? "border-[#216350]" : "border-gray-300"} justify-between items-center`}
              key={p.projectID}
            >
              <div className="flex gap-1">
                {isSelect && (
                  <div className="mt-0.5">
                    {selected.has(p.projectID) ? (
                      <CircleCheck
                        aria-hidden="true"
                        fill="#67C09085"
                        color="#216350"
                        size={18}
                      />
                    ) : (
                      <Circle aria-hidden="true" size={18} />
                    )}
                  </div>
                )}
                <div>
                  <p>{p.project}</p>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                    <p>Project ID: {p.projectID}</p>
                    <p>Client ID: {p.clientID}</p>
                  </div>
                </div>
              </div>

              {p.review && (
                <div className="flex items-center gap-1">
                  <p className="font-semibold">{p?.review}</p>
                  <Star
                    aria-hidden="true"
                    color="#E17100"
                    size={20}
                    fill="#E17100"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ManageCompletedSec;
