import { motion } from "motion/react";
import { Check, ClipboardCheck, FileXCorner } from "lucide-react";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { NavLink } from "react-router-dom";

const getPercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
};

const Approved = () => {
  const { approved, completed } = useSelector(calculatedProjects);
  const clients = useSelector((state) => state.clients.total_clients);

  // get client name
  const clientMap = useMemo(() => {
    return Object.fromEntries(clients.map((c) => [c.clientID, c.name]));
  }, [clients]);

  const data = useMemo(() => {
    const topApprovals = approved.list
      .sort((a, b) => {
        if (b.review !== a.review) return b.review - a.review;
        return b.projectID - a.projectID;
      })
      .slice(0, 3);

    return {
      topApprovals,
    };
  }, [approved]);

  const percent = getPercentage(approved.count, completed.count);

  return (
    <div className="bg-white sm:min-w-auto min-w-80 grow sm:basis-90 basis-full space-y-3 shrink-0 px-4 py-3 rounded-md shadow-md min-h-80">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Client Approved</h2>
        <NavLink
          aria-label="See details"
          to="/management#approved"
          className="underline text-[#215B63]"
        >
          See Detail
        </NavLink>
      </div>

      {/* progress */}
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <p className="text-sm">Total: {completed.count}</p>
          <p className="text-sm">Approved: {approved.count}</p>
        </div>

        <div className="w-full rounded-full relative overflow-hidden h-6 bg-gray-400/50">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: percent / 100 }}
            transition={{ duration: 0.6 }}
            className="absolute origin-left bg-green-500 w-full h-full"
          />
          <span className="absolute left-1/2 top-1/2 -translate-1/2 text-white text-sm font-semibold">
            {percent}%
          </span>
        </div>
      </div>

      {/* top approvals */}
      <div className="space-y-1.5">
        <h3 className="flex items-center gap-1">
          <ClipboardCheck aria-hidden="true" />
          <span>Top Approval</span>
        </h3>

        <ul className="space-y-1">
          {data.topApprovals.length === 0 && (
            <div className="my-10 flex justify-center">
              <div className="flex gap-1 border px-10 py-7 rounded-full border-gray-300 text-gray-500">
                <FileXCorner /> <span>No Project Available !</span>
              </div>
            </div>
          )}
          {data.topApprovals.map((a) => (
            <li
              key={a.projectID}
              className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md"
            >
              <Check size={26} strokeWidth={2.6} className="text-green-500" />

              <div>
                <h3 className="font-semibold text-gray-800">
                  {clientMap[a.clientID]}
                </h3>
                <p className="text-sm text-gray-500">{a.project}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(Approved);
