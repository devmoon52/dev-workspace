import { filter, textToImage } from "../utils/short";
import { useEffect, useState } from "react";
import { memo } from "react";
import useAsyncDelay from "../utils/useAsyncDelay";
import DotLoader from "./DotLoader";
import { useSelector } from "react-redux";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { NavLink } from "react-router-dom";
import { UserX } from "lucide-react";

const statusColor = {
  completed: "bg-green-600",
  pending: "bg-sky-400",
  progress: "bg-amber-500",
};

const Collaboration = ({ reference }) => {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { active } = useSelector(calculatedMembers);

  function getUserStatus(user) {
    if (status) return status;

    return user.role[0]?.status;
  }

  const delay = useAsyncDelay();

  useEffect(() => {
    async function addStatus() {
      if (status) {
        setLoading(true);
        await delay(400, () => {
          setLoading(false);
          const f = filter(active.list, (m) => {
            return m.role.some((r) => r.status === status);
          });
          setMembers(f);
        });
      } else {
        setLoading(true);
        await delay(400, () => {
          setLoading(false);
          setMembers(active.list);
        });
      }
    }
    addStatus();
  }, [status]);

  return (
    <div
      ref={reference}
      className="bg-white grow sm:basis-90 basis-full sm:min-w-auto min-w-80 shrink-0 px-4 py-3 rounded-md shadow-md space-y-4 min-h-77.5 flex flex-col"
    >
      <div className="flex items-center justify-between">
        {/* heading */}
        <div className="space-y-0.5">
          <h2 className="font-semibold text-lg text-gray-700">
            Team Collaboration
          </h2>
          <div className="flex gap-1.5">
            <button
              aria-label="Completed members"
              onClick={() => setStatus("completed")}
              className="h-2.5 w-2.5 cursor-pointer rounded-full bg-green-600"
            ></button>
            <button
              aria-label="In progress members"
              onClick={() => setStatus("progress")}
              className="h-2.5 w-2.5 cursor-pointer rounded-full bg-amber-500"
            ></button>
            <button
              aria-label="All active members"
              onClick={() => setStatus("pending")}
              className="h-2.5 w-2.5 cursor-pointer rounded-full bg-sky-400"
            ></button>
            <button
              aria-label="Completed members"
              onClick={() => setStatus("")}
              className="h-2.5 w-2.5 cursor-pointer rounded-full"
              style={{
                background: `conic-gradient(
              #16a34a 0% 33%,
              #f59e0b 33% 66%,
              #38bdf8 66% 100%
            )`,
              }}
            ></button>
          </div>
        </div>
        <NavLink
          to="/team-members"
          aria-label="See detail in management"
          className="text-sm bg-[#67c09085] px-3 py-1.5 rounded-full text-[#215B63]"
        >
          Manage
        </NavLink>
      </div>

      {status && (
        <div>
          <h3 className="text-gray-600">
            {status === "completed"
              ? "Completed"
              : status === "progress"
                ? "In Progress"
                : "Pending"}
          </h3>
        </div>
      )}

      {loading ? (
        <div className="flex-1">
          <DotLoader size="md" />
        </div>
      ) : (
        <ul className="flex flex-col gap-2 relative">
          {active.count === 0 && (
            <div className="text-gray-400">
              <h3>No member available</h3>
              <UserX size={50} className="mx-auto my-10" />
            </div>
          )}
          {members.slice(0, 5).map((user) => (
            <li key={user.mid} className="flex items-center gap-2">
              <div className="rounded-full w-9 h-9 shrink-0 flex justify-center items-center font-semibold text-gray-600 bg-gray-300 relative">
                {textToImage(user.name)}
                <span
                  className={`h-2.5 w-2.5 absolute ${
                    statusColor[getUserStatus(user)] || "bg-gray-400"
                  } z-30 top-0 right-0 rounded-full`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500">
                    {user.role[0]?.project}
                  </p>
                  {user.role.length > 1 && (
                    <span className="text-xs text-gray-500">
                      {"("}+{user.role.length - 1}
                      {")"}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(Collaboration);
