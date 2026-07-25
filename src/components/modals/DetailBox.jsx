import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { filter, truncateText } from "../../utils/short";
import { useDispatch, useSelector } from "react-redux";
import { calculatedProjects } from "../../redux/selector/projectSelector";
import { addProject } from "../../redux/slice/memberSlice";
import { setFailedAlert, setSuccessAlert } from "../../redux/slice/modalSlice";
import { startProject } from "../../redux/slice/projectSlice";
import DelConfirmation from "./DelConfirmation";
import { updateMember } from "../../redux/slice/memberSlice";
import { calculatedMembers } from "../../redux/selector/memberSelector";
import DotLoader from "../DotLoader";
import useAsyncDelay from "../../utils/useAsyncDelay";
import { addActivity } from "../../redux/slice/activitySlice";

const DetailBox = ({ data, index, setIndex }) => {
  const [isAddNew, setIsAddNew] = useState(false);
  const [value, setValue] = useState("");
  const { pending, running, total } = useSelector(calculatedProjects);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const members = useSelector(calculatedMembers);
  const [isUnblockLoading, setisUnblockLoading] = useState(false);

  const dispatch = useDispatch();
  const delay = useAsyncDelay();

  const canManageMember = data[index]?.role.length === 0;

  // adding new project to member
  function takeAction() {
    if (!value) return;

    const user = data[index];
    const valueNum = parseInt(value);

    if (user.role.length >= 2) {
      dispatch(
        setFailedAlert({
          id: value,
          message: `${user.name} cannot handle 3 project at a time`,
        }),
      );
      return;
    }

    const project = filter(pending.list, (p) => {
      return p.projectID === valueNum;
    })[0];

    if (!project) {
      return dispatch(
        setFailedAlert({
          id: value,
          message:
            "Invalid ID! Please get the ID from your pending projects list",
        }),
      );
    }

    const updateObj = { project, mid: user.mid };

    dispatch(startProject(project.projectID));
    dispatch(addProject(updateObj));
    dispatch(
      setSuccessAlert({
        id: project.projectID,
        message: `Project added successfully`,
      }),
    );
    dispatch(
      addActivity({
        type: "project",
        log: "1 new project has been moved to running block.",
      }),
    );
    setIsAddNew(false);
  }

  // delete active member
  function deleteMember() {
    const member = data[index];

    const updated = filter(members.total.list, (m) => m.mid !== member.mid);

    dispatch(updateMember(updated));
    dispatch(
      addActivity({
        type: "member",
        log: `1 active member with 0 project has been removed. Member ID: ${member.mid}`,
      }),
    );
    if (index === data.length - 1) {
      setIndex((prev) => prev - 1);
    }
  }

  // block active member
  function blockMember() {
    const member = data[index];
    const allMembers = members.total.list;

    const updated = allMembers.map((m) => {
      if (m.mid === member.mid) {
        return {
          ...m,
          isBlocked: true,
        };
      }
      return m;
    });

    dispatch(updateMember(updated));
    dispatch(
      addActivity({
        type: "member",
        log: `1 active member with 0 project has been blocked. Member ID: ${member.mid}`,
      }),
    );
  }

  // unblock active member
  function unblockMember() {
    setisUnblockLoading(true);

    const member = data[index];
    const allMembers = members.total.list;

    const updated = allMembers.map((m) => {
      if (m.mid === member.mid) {
        return {
          ...m,
          isBlocked: false,
        };
      }
      return m;
    });

    delay(500, () => {
      setisUnblockLoading(false);
      dispatch(updateMember(updated));
      dispatch(
        addActivity({
          type: "member",
          log: `1 active member with 0 project has been unblocked. Member ID: ${member.mid}`,
        }),
      );
    });
  }

  // accessibility - right arrow, left arrow & esc key press
  useEffect(() => {
    function handler(e) {
      if (e.key === "ArrowRight") {
        setIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
      }

      if (e.key === "ArrowLeft") {
        setIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }

      if (e.key === "Escape") {
        setIndex(null);
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      onClick={() => setIndex(null)}
      className="fixed inset-0 bg-black/20 h-full flex justify-center items-center z-30"
    >
      {/* confirmation modal */}
      <AnimatePresence>
        {confirmationModal && (
          <DelConfirmation
            key={confirmationModal.action}
            message={confirmationModal.message}
            callback={confirmationModal.fn}
            offClick={setConfirmationModal}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsAddNew(false);
        }}
        className="bg-white max-w-lg w-[95%] pl-4 pt-3 pr-4 rounded-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-0.5">
            <User aria-hidden="true" size={26} strokeWidth={2.6} />
            <p>
              {data[index]?.name} -{" "}
              <span className="text-[#215B63]">[{data[index]?.mid}]</span>
            </p>
          </h2>
          <div className="flex items-center">
            <button
              aria-label="Previous member"
              onClick={() => {
                if (index !== 0) setIndex((prev) => prev - 1);
              }}
              className={`hover:bg-stone-600/10 transition-colors duration-200 p-1 rounded-full cursor-pointer active:bg-stone-600/20 ${index === 0 ? "text-gray-400" : "text-black"}`}
            >
              <ChevronLeft aria-hidden="true" size={26} strokeWidth={2.6} />
            </button>
            <button
              aria-label="Next member"
              onClick={() => {
                if (index !== data.length - 1) setIndex((prev) => prev + 1);
              }}
              className={`hover:bg-stone-600/10 transition-colors duration-200 p-1 rounded-full cursor-pointer active:bg-stone-600/20 ${index === data.length - 1 ? "text-gray-400" : "text-black"}`}
            >
              <ChevronRight aria-hidden="true" size={26} strokeWidth={2.6} />
            </button>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <AnimatePresence>
            {isAddNew ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center border border-gray-400 rounded-md h-8"
              >
                <input
                  type="text"
                  name="distribute-project"
                  value={value.current}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && takeAction()}
                  autoFocus
                  placeholder="Paste Project ID"
                  className="px-2 h-full rounded-md outline-none"
                />
                <button
                  aria-label="Add member by Member ID"
                  onClick={takeAction}
                  className="bg-stone-600/10 hover:bg-stone-600/30 h-full px-1 shrink-0 transition-colors duration-200"
                >
                  <Check aria-hidden="true" size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                aria-label="Add member by Member ID"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddNew(true);
                }}
                className="bg-stone-600/10 hover:bg-stone-600/30 transition-colors duration-200 cursor-pointer rounded-full h-8 px-5 flex items-center gap-1"
              >
                <span>Distribute a project</span>
                <Plus aria-hidden="true" size={18} />
              </motion.button>
            )}
          </AnimatePresence>
          {/* delete and block btns */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Delete member"
              onClick={() =>
                setConfirmationModal({
                  action: "delete",
                  message: "Are you sure want to delete this member?",
                  fn: deleteMember,
                })
              }
              disabled={!canManageMember}
              className={`bg-stone-600/10 p-1.5 rounded-full transition-colors duration-200 ${!canManageMember ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-black hover:bg-stone-600/30"}`}
            >
              <Trash2 aria-hidden="true" size={22} strokeWidth={1.6} />
            </button>
            {data[index].isBlocked ? (
              <button
                aria-label="Unblock member"
                onClick={unblockMember}
                className="text-sm bg-stone-600/10 h-8 w-17.5 rounded-md hover:bg-stone-600/30 cursor-pointer"
              >
                {isUnblockLoading ? (
                  <DotLoader aria-hidden="true" size="sm" />
                ) : (
                  "Unblock"
                )}
              </button>
            ) : (
              <button
                aria-label="Block member"
                onClick={() =>
                  setConfirmationModal({
                    action: "block",
                    message: "Are you sure want to block this member?",
                    fn: blockMember,
                  })
                }
                disabled={!canManageMember}
                className={`bg-stone-600/10 p-1.5 rounded-full transition-colors duration-200 ${!canManageMember ? "text-gray-400 cursor-not-allowed" : "cursor-pointer text-black hover:bg-stone-600/30"}`}
              >
                <Ban aria-hidden="true" size={22} strokeWidth={1.6} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2.5 bg-gray-600/20 px-3 py-2 pb-4 rounded-[10px_10px_0px_0px] min-h-18.5">
          {data[index]?.role.map((p, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={p.projectID}
              className="text-sm flex items-center justify-between"
            >
              <p>
                {i + 1}. {truncateText(p.project, 20)}{" "}
                <span className="text-xs text-gray-600">{`(ID:${p.projectID})`}</span>
              </p>
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 ${p.status === "completed" ? "bg-green-600" : p.status === "progress" ? "bg-amber-500" : "bg-sky-400"} rounded-full`}
                ></div>
                <p>{p.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailBox;
