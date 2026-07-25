import { Copy, CopyCheck, TriangleAlert, Gauge } from "lucide-react";
import { useEffect, useMemo, useRef, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { filter, truncateText } from "../utils/short";
import { copyToClipboard, displayCopyToast } from "../utils/copy";
import { setCopyToast, removeCopyToast } from "../redux/slice/modalSlice";
import { checkDeadline } from "../utils/calculateDate";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { NavLink } from "react-router-dom";

const WlBreakdown = () => {
  const [copy, setCopy] = useState(null);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const { pending, overdue, running } = useSelector(calculatedProjects);
  const { inActive, overloaded } = useSelector(calculatedMembers);
  const { system } = useSelector((state) => state.settings);

  // datas on total projects
  const data = useMemo(() => {
    let closestCount = 0;

    let overdueProjects = [];
    const todayProject = [];
    const urgents = [];

    for (const p of [...pending.list, ...running.list]) {
      let deadlineDiff = null;

      if (p.isOverdue) {
        overdueProjects.push(p);
      }

      if (p.deadline) {
        deadlineDiff = checkDeadline(p.deadline);
      }

      if (deadlineDiff !== null && deadlineDiff < 2 && !p.isOverdue) {
        closestCount++;
      }

      if (deadlineDiff === 0) {
        todayProject.push(p);
      }
    }

    if (todayProject.length > 0) {
      urgents.push(todayProject[0]);
    }
    if (overdueProjects.length > 0) {
      urgents.push(overdueProjects[0]);
    }

    return {
      closestCount,
      urgents,
    };
  }, [pending, running]);

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

  const copyComponent = useMemo(() => {
    return (idName, idValue) => (
      <div className="flex items-center gap-2">
        <p>
          {idName}: {idValue}
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
    <>
      <div className="flex items-center gap-1">
        <Gauge aria-hidden="true" size={26} strokeWidth={2.6} color="#364153" />
        <h1 className="text-lg font-semibold text-gray-700">
          Workload breakdown
        </h1>
      </div>

      {/* pending projects */}
      <div className="">
        <div className="flex gap-1 items-center text-amber-600">
          <TriangleAlert aria-hidden="true" />
          <p>{pending.count} Pending Projects</p>
        </div>
        <ul className="space-y-1 mt-1">
          {system.workloadAnalyzer &&
            pending.list.slice(0, 2).map((p) => (
              <li
                key={p?.projectID}
                className="flex items-center gap-3 text-sm justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 shrink-0 bg-amber-600 outline-3 outline-amber-600/40 rounded-full"></div>
                  <p className="text-sm">{truncateText(p?.project, 20)}</p>
                </div>

                {copyComponent("ID", p?.projectID)}
              </li>
            ))}
        </ul>
        {pending.count > 2 && system.workloadAnalyzer && (
          <NavLink
            to={"/management#manageProjects"}
            className="text-sm hover:text-amber-600 hover:underline"
          >
            ..more
          </NavLink>
        )}
      </div>

      {/* inactive members & overloaded projects */}
      <div>
        <div className="flex gap-1 items-center text-amber-600">
          <TriangleAlert aria-hidden="true" />
          <p>
            {inActive.count} Inactive member & {overloaded.count} Overloaded
          </p>
        </div>
        <ul className="space-y-1 mt-1">
          {system.workloadAnalyzer &&
            overloaded.list.slice(0, 2).map((o) => (
              <li
                className="flex items-center gap-3 text-sm justify-between"
                key={o.mid}
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 shrink-0 bg-amber-600 outline-3 outline-amber-600/40 rounded-full"></div>
                  <p className="text-sm">
                    {o.name} handling{" "}
                    <span className="text-red-500 font-semibold">
                      {o.role.length} projects
                    </span>
                  </p>
                </div>

                {copyComponent("MID", o.mid)}
              </li>
            ))}
        </ul>
        {overloaded.count > 2 && system.workloadAnalyzer && (
          <NavLink
            to="/team-members#team-alerts"
            className="text-sm hover:text-amber-600 hover:underline"
          >
            ..more
          </NavLink>
        )}
      </div>

      {/* closest and overdue */}
      <div>
        <div className="flex gap-1 items-center text-amber-600">
          <TriangleAlert aria-hidden="true" />
          <p>
            {data.closestCount} Closest to deadline & {overdue.count} Overdue
          </p>
        </div>
        <ul className="mt-1 space-y-1">
          {system.workloadAnalyzer &&
            data.urgents.map((p, i) => (
              <li
                key={p?.projectID ? p.projectID : i + 1}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 shrink-0 bg-amber-600 outline-3 outline-amber-600/40 rounded-full"></div>
                    <p className="text-sm">{p?.project}</p>
                  </div>

                  <div
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${p?.isOverdue ? "bg-red-500" : "bg-amber-500"} text-white`}
                  >
                    <TriangleAlert aria-hidden="true" size={18} />
                    <span>{p?.isOverdue ? "Deadline Missed" : "Today"}</span>
                  </div>
                </div>

                {copyComponent("ID", p?.projectID)}
              </li>
            ))}
        </ul>

        {data.closestCount > 2 || data.overdueCount > 2 ? (
          <>
            {system.workloadAnalyzer && (
              <NavLink
                to="/management#project-alerts"
                className="text-sm hover:text-amber-600 hover:underline"
              >
                ..more
              </NavLink>
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default memo(WlBreakdown);
