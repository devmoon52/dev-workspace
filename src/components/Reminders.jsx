import { memo, useEffect, useRef, useState } from "react";
import {
  CirclePlus,
  NotebookPen,
  CircleMinus,
  Trash2,
  Pencil,
} from "lucide-react";
import DatePicker from "react-datepicker";
import CustomDateInput from "./CustomDateInput";
import { NavLink } from "react-router-dom";
import { addNewReminder, updateReminder } from "../redux/slice/reminderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getLocalTimeFormat } from "../utils/calculateDate";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { filter } from "../utils/short";
import DelConfirmation from "./modals/DelConfirmation";
import { AnimatePresence } from "motion/react";
import { addActivity } from "../redux/slice/activitySlice";

const checkBoxs = [
  {
    id: "avgDeadline",
    label: "AVG Deadline",
  },
  {
    id: "currentRevenue",
    label: "Current Revenue",
  },
  {
    id: "overdue",
    label: "Overdue Projects",
  },
];

const Reminders = () => {
  const { reminder } = useSelector((state) => state.reminders);
  const { overdue } = useSelector(calculatedProjects);
  const { avgDeadline } = useSelector((state) => state.projects);
  const [isOpen, setisOpen] = useState(false);
  const [btnMode, setBtnMode] = useState("add");
  const [totalHeight, setTotalHeight] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    note: "",
    reminderTime: null,
    extraOptions: {
      avgDeadline: false,
      currentRevenue: false,
      overdue: false,
    },
  });

  const insertOne = useRef(null);
  const timerRef = useRef(null);
  const noteRef = useRef(null);
  const createNoteRef = useRef(null);
  const dispatch = useDispatch();

  // handling resize ui
  useEffect(() => {
    function handler() {
      if (!insertOne.current) return;
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setTotalHeight(insertOne.current.scrollHeight);
      }, 200);
    }

    handler();

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
      clearTimeout(timerRef.current);
    };
  }, []);

  // add reminder action
  function addReminder() {
    if (!formData.note.trim() && !formData.reminderTime) {
      noteRef.current.focus();
      noteRef.current.style.border = "1px solid red";
      return;
    }

    const fullData = {
      ...formData,
      id: Date.now(),
      createdAt: Date.now(),
      reminderTime: formData.reminderTime?.getTime() || null,
    };

    dispatch(addNewReminder(fullData));
    dispatch(
      addActivity({
        type: "reminder",
        log: `New reminder was created ${formData.reminderTime ? "for " + getLocalTimeFormat(formData.reminderTime) : ""}`,
      }),
    );
    setFormData({
      id: null,
      note: "",
      reminderTime: null,
      extraOptions: {
        avgDeadline: false,
        currentRevenue: false,
        overdue: false,
      },
    });
    setisOpen(false);
  }

  // delete note action
  function deleteNote() {
    const id = confirmation.id;
    const filtered = filter(reminder, (r) => r.id !== id);

    setFormData({
      id: null,
      note: "",
      reminderTime: null,
      extraOptions: {
        avgDeadline: false,
        currentRevenue: false,
        overdue: false,
      },
    });
    setisOpen(false);
    setBtnMode("add");
    dispatch(updateReminder(filtered));
  }

  // edit note action
  function editNote(data) {
    setFormData({
      ...data,
      reminderTime: data.reminderTime ? new Date(data.reminderTime) : null,
    });

    setBtnMode("save");
    setisOpen(true);

    createNoteRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // save after edit note
  function saveChanges() {
    if (!formData.note.trim() && !formData.reminderTime) {
      noteRef.current.focus();
      noteRef.current.style.border = "1px solid red";
      return;
    }

    const maped = reminder.map((r) => {
      if (r.id === formData.id) {
        return {
          ...formData,
          createdAt: Date.now(),
          reminderTime: formData.reminderTime?.getTime() || null,
        };
      }

      return r;
    });

    setisOpen(false);
    setFormData({
      id: null,
      note: "",
      reminderTime: null,
      extraOptions: {
        avgDeadline: false,
        currentRevenue: false,
        overdue: false,
      },
    });
    setBtnMode("add");
    dispatch(updateReminder(maped));
  }

  return (
    <>
      <AnimatePresence>
        {confirmation && (
          <DelConfirmation
            callback={deleteNote}
            message={confirmation.message}
            offClick={setConfirmation}
          />
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2 text-gray-700">
        <NotebookPen aria-hidden="true" strokeWidth={2.6} size={26} />
        <h2 className="text-lg font-semibold uppercase">Notes & Reminders</h2>
      </div>

      <div ref={createNoteRef}>
        <div className="flex items-center justify-between">
          <h2>Set A Note</h2>
          <button
            aria-label="Toggle reminder form"
            onClick={() => {
              setisOpen((prev) => !prev);
              setFormData({
                id: null,
                note: "",
                reminderTime: null,
                extraOptions: {
                  avgDeadline: false,
                  currentRevenue: false,
                  overdue: false,
                },
              });
              setBtnMode("add");
            }}
            className={`cursor-pointer p-0.5 rounded-full ${isOpen ? "bg-gray-200" : "hover:bg-gray-200"}`}
          >
            {isOpen ? (
              <CircleMinus aria-hidden="true" size={22} strokeWidth={1.8} />
            ) : (
              <CirclePlus aria-hidden="true" size={22} strokeWidth={1.8} />
            )}
          </button>
        </div>
        {/* wrapper div - toggle accordion */}
        <div
          style={{
            height: isOpen ? totalHeight : 0,
            marginTop: isOpen ? 6 : 0,
          }}
          className="overflow-hidden transition-all duration-200"
        >
          {/* actual accordion content */}
          <div
            ref={insertOne}
            className={`transition-all duration-200 w-full overflow-hidden`}
          >
            <textarea
              id="note"
              ref={noteRef}
              value={formData.note}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  note: e.target.value,
                }));
                noteRef.current.style.border = "1px solid #99a1af";
              }}
              name="Add-Note"
              placeholder="Write a Note"
              className="border text-sm px-3 py-1.5 rounded-md outline-none border-gray-400 resize-none h-25 w-full"
            ></textarea>
            <div className="flex flex-wrap gap-2">
              <DatePicker
                id="date-and-time"
                selected={formData.reminderTime}
                onChange={(date) =>
                  setFormData((prev) => {
                    return {
                      ...prev,
                      reminderTime: date,
                    };
                  })
                }
                showTimeSelect
                customInput={<CustomDateInput />}
                dateFormat="MMM d, yyyy h:mm aa"
                className="w-full block border border-gray-400 rounded-md px-3 py-2 outline-none"
              />
              {checkBoxs.map((v) => (
                <div key={v.id} className="space-x-1 text-sm flex items-center">
                  <input
                    checked={formData.extraOptions[v.id]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        extraOptions: {
                          ...prev.extraOptions,
                          [v.id]: e.target.checked,
                        },
                      }))
                    }
                    id={v.id}
                    type="checkbox"
                  />
                  <label htmlFor={v.id} className="select-none">
                    {v.label}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={btnMode === "save" ? saveChanges : addReminder}
              className="w-full bg-gray-200 hover:bg-gray-300 py-1.5 rounded-md mt-2 cursor-pointer"
            >
              {btnMode === "save" ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2>All Tasks</h2>
        <ul className="space-y-1.5">
          {reminder.length === 0 && (
            <div className="my-4 text-sm text-center">
              No Notes or Reminders Available !
            </div>
          )}
          {reminder.map((n) => (
            <li
              className="text-sm rounded-md bg-gray-300 px-2 py-1.5 space-y-1"
              key={n.id}
            >
              <div className="flex items-center justify-between">
                <div>
                  {" "}
                  {/* reminder time */}
                  <h2 className="text-lg">
                    {getLocalTimeFormat(n.createdAt).split("(")[0]}
                  </h2>
                </div>
                <div className="space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmation({
                        message: "Deleting one reminder?",
                        id: n.id,
                      });
                    }}
                    className="bg-[#216350] p-1 rounded-full text-white hover:bg-[#2b7c65]"
                  >
                    <Trash2 aria-hidden="true" size={20} strokeWidth={1.6} />
                  </button>
                  <button
                    onClick={() => editNote(n)}
                    className="bg-[#216350] p-1 rounded-full text-white hover:bg-[#2b7c65]"
                  >
                    <Pencil aria-hidden="true" size={20} strokeWidth={1.6} />
                  </button>
                </div>
              </div>
              <p>{n.note}</p>
              <div>
                {/* created at time */}
                <p className="text-gray-500">
                  Created At:{" "}
                  <span className="text-[#216350]">
                    {getLocalTimeFormat(n.createdAt)}
                  </span>
                </p>
                {/* reminder time */}
                {n.reminderTime && (
                  <p className="text-gray-500">
                    Remind At:{" "}
                    <span className="text-[#216350]">
                      {getLocalTimeFormat(n.reminderTime)}
                    </span>
                  </p>
                )}
                {/* overdue projects */}
                {n.extraOptions.overdue && (
                  <p className="text-gray-500">
                    Overdue:{" "}
                    <NavLink
                      className={"hover:text-[#216350] text-black underline"}
                      to={"/"}
                    >
                      {overdue.count} Projects
                    </NavLink>
                  </p>
                )}
                {/* avg deadline */}
                {n.extraOptions.avgDeadline && (
                  <p className="text-gray-500">
                    AVG Deadline:{" "}
                    <span className="text-[#216350]">{avgDeadline}</span>
                  </p>
                )}
                {/* current revenue */}
                {n.extraOptions.currentRevenue && (
                  <p className="text-gray-500">
                    Current Revenue: <span className="text-black">$3800</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default memo(Reminders);
