import { useDispatch, useSelector } from "react-redux";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { filter, truncateText } from "../utils/short";
import {
  Ban,
  CirclePlus,
  FileX,
  SquareArrowOutUpRight,
  Trash,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import DetailBox from "./modals/DetailBox";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import Dropdown from "./Dropdown";
import DelConfirmation from "./modals/DelConfirmation";
import { addNewMember, updateMember } from "../redux/slice/memberSlice";
import useAsyncDelay from "../utils/useAsyncDelay";
import { setSuccessAlert } from "../redux/slice/modalSlice";
import { addActivity } from "../redux/slice/activitySlice";

const ManageMember = () => {
  const { total, active, inActive, overloaded, available } =
    useSelector(calculatedMembers);

  const [filteredAvailable, setFilteredAvailable] = useState(
    available.list.slice(0, 6),
  );
  const [filteredActive, setFilteredActive] = useState(active.list.slice(0, 6));

  const [currentLoading, setCurrentLoading] = useState([]);
  const dispatch = useDispatch();
  const delay = useAsyncDelay();
  const { x, ref, isDraggable, constraints } = useHorizontalDrag();

  const [delAction, setDelAction] = useState(null);
  const [index, setIndex] = useState(null);
  const [start, setStart] = useState(0);

  // filtered available update
  useEffect(() => {
    setFilteredAvailable(available.list.slice(0, 6));
  }, [available.list]);

  // filtered active update
  useEffect(() => {
    setFilteredActive(active.list.slice(0, 6));
  }, [active.list]);

  // add new member
  function addMember(mid) {
    setCurrentLoading((prev) => [...prev, mid]);

    delay(600, () => {
      dispatch(addNewMember(mid));
      dispatch(setSuccessAlert({ id: mid, message: "New member added" }));
      dispatch(addActivity({type: 'member', log: `1 new member aded to team. Member ID: ${mid}`}))
      setCurrentLoading((prev) => filter(prev, (id) => id !== mid));
    });
  }

  // delete inactive member
  function deleteMember() {
    if (!delAction) return;
    const { mid } = delAction;

    const updated = filter(total.list, (m) => m.mid !== mid);
    dispatch(updateMember(updated));
    dispatch(addActivity({type: 'member', log: '1 inactive member has been removed.'}))
  }

  return (
    <>
      <AnimatePresence>
        {index !== null && (
          <DetailBox index={index} setIndex={setIndex} data={active.list} />
        )}
        {delAction && (
          <DelConfirmation
            key={delAction.mid}
            message={delAction.message}
            callback={deleteMember}
            offClick={setDelAction}
          />
        )}
      </AnimatePresence>

      <motion.section
        ref={ref}
        drag={isDraggable ? "x" : false}
        style={{ x: x }}
        dragConstraints={{ left: -constraints, right: 0 }}
        className={`flex gap-3 ${isDraggable && "cursor-grab active:cursor-grabbing"}`}
      >
        {/* active team members */}
        <div className="bg-white grow shrink-0 basis-80 shadow-md px-3 py-2 rounded-md space-y-3 min-h-61">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-green-600">
              <UserCheck aria-hidden="true" strokeWidth={2.6} size={26} />
              <h2 className="text-lg font-semibold uppercase">
                Active Members
              </h2>
            </div>
            {active.count > 6 && (
              <div>
                <Dropdown
                  label=""
                  size={6}
                  total={active.count}
                  setFn={setFilteredActive}
                  list={active.list}
                  setStart={setStart}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            {active.count === 0 && (
              <div className="h-full">
                <p className="text-gray-500">No Active Members !</p>
                <div className="h-30 flex items-center justify-center">
                  <FileX
                    aria-hidden="true"
                    size={70}
                    strokeWidth={1.4}
                    color="gray"
                  />
                </div>
              </div>
            )}
            {filteredActive.map((m, i) => (
              <div key={m.mid} className="flex justify-between">
                <div className="space-x-1 flex items-center gap-0.5">
                  {m.isBlocked && <Ban size={18} />}
                  <p
                    className={`${m.isBlocked ? "text-gray-400" : "text-black"}`}
                  >
                    {truncateText(m.name, 20)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {`(${m.role.length} ${m.role.length > 1 ? "Projects" : "Project"})`}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    aria-label={`Open ${m.name} detail`}
                    onClick={() => setIndex(start + i)}
                    className="cursor-pointer text-gray-600 hover:text-black"
                  >
                    <SquareArrowOutUpRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* inactive team members */}
        <div className="bg-white grow shrink-0 basis-80 shadow-md px-3 py-2 rounded-md space-y-3 min-h-61">
          <div className="flex items-center gap-1 text-red-500">
            <UserX aria-hidden="true" strokeWidth={2.6} size={26} />
            <h2 className="text-lg font-semibold uppercase">
              Inactive Members
            </h2>
          </div>

          <div className="space-y-2">
            {inActive.count === 0 && (
              <div className="h-full">
                <p className="text-gray-500">No Inactive Members !</p>
                <div className="h-30 flex items-center justify-center">
                  <FileX
                    aria-hidden="true"
                    size={70}
                    strokeWidth={1.4}
                    color="gray"
                  />
                </div>
              </div>
            )}
            {inActive.list.map((m, i) => (
              <div key={m.mid} className="flex justify-between">
                <div className="space-x-1 flex items-center gap-0.5">
                  <p>{truncateText(m.name, 20)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    aria-label={`Delete member ${m.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDelAction({
                        message: "Are you sure want to delete this member?",
                        mid: m.mid,
                      });
                    }}
                    className="cursor-pointer text-gray-600 hover:text-black"
                  >
                    <Trash aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* available members */}
        <div className="bg-white grow shrink-0 basis-80 shadow-md px-3 py-2 rounded-md space-y-3 min-h-61">
          {/* title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <UserPlus aria-hidden="true" strokeWidth={2.6} size={26} />
              <h2 className="text-lg font-semibold uppercase">
                Available Members
              </h2>
            </div>
            {available.count > 6 && (
              <div>
                <Dropdown
                  label={""}
                  total={available.count}
                  setFn={setFilteredAvailable}
                  list={available.list}
                  size={6}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {available.count === 0 && (
              <div className="h-full">
                <p className="text-gray-500">No Available Members !</p>
                <div className="h-30 flex items-center justify-center">
                  <FileX
                    aria-hidden="true"
                    size={70}
                    strokeWidth={1.4}
                    color="gray"
                  />
                </div>
              </div>
            )}
            {filteredAvailable.map((m, i) => (
              <div key={m.mid} className="flex justify-between">
                <div className="space-x-1 flex items-center gap-0.5">
                  <p>{truncateText(m.name, 20)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    aria-label={`Add member ${m.name}`}
                    disabled={currentLoading.includes(m.mid)}
                    onClick={() => addMember(m.mid)}
                    className={`${!currentLoading.includes(m.mid) && "cursor-pointer"} text-gray-600 hover:text-green-600`}
                  >
                    {currentLoading.includes(m.mid) ? (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin"></div>
                    ) : (
                      <CirclePlus aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ManageMember;
