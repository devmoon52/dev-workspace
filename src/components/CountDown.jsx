import { motion, AnimatePresence } from "motion/react";
import { Copy, CopyCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { copyToClipboard, displayCopyToast } from "../utils/copy";
import { useDispatch } from "react-redux";
import { checkDeadline } from "../utils/calculateDate";
import { truncateText } from "../utils/short";

function createDeadlineDate(deadline) {
  const [day, month] = deadline?.split("/").map(Number);

  return new Date(new Date().getFullYear(), month - 1, day, 23, 59, 59);
}

function format(num) {
  return String(num).padStart(2, "0");
}

const CountDown = ({ currentProject }) => {
  const [copy, setCopy] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentProject.deadline) return;

    const deadlineDate = createDeadlineDate(currentProject.deadline);

    const interval = setInterval(() => {
      const diff = deadlineDate.getTime() - Date.now();

      if (diff <= 0) {
        clearInterval(interval);

        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const totalSeconds = Math.floor(diff / 1000);

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        hours,
        minutes,
        seconds,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentProject.deadline]);

  async function copyProjectID() {
    try {
      const res = await copyToClipboard(currentProject.projectID);
      if (!res) {
        return;
      }

      setCopy(currentProject.projectID);
      displayCopyToast(dispatch, setCopy, currentProject.projectID);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <motion.div
      layout
      className="grow bg-white px-3 py-4 rounded-md shadow-md flex items-center flex-col justify-center space-y-3"
    >
      <h3 className="text-lg font-semibold text-gray-600">
        {currentProject.isOverdue ? "Deadline Missed" : "Deadline Count Down"}
      </h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={currentProject.deadline}
        className="@md:text-5xl text-4xl font-semibold heading-font uppercase"
      >
        {currentProject.deadline ? (
          <p
            className={currentProject.isOverdue ? "text-red-500" : "text-black"}
          >
            <span>{format(timeLeft.hours)}</span>:
            <span>{format(timeLeft.minutes)}</span>:
            <span>{format(timeLeft.seconds)}</span>
          </p>
        ) : (
          <span>Completed</span>
        )}
      </motion.div>
      <div className="text-center text-sm text-gray-600">
        <p>{truncateText(currentProject.project, 18)}</p>
        <div className="flex items-center gap-1 justify-center">
          <p>{currentProject.projectID}</p>
          <button
            onClick={copyProjectID}
            className="hover:cursor-pointer hover:text-black"
          >
            {copy ? (
              <CopyCheck size={16} strokeWidth={1.4} />
            ) : (
              <Copy size={16} strokeWidth={1.4} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CountDown;
