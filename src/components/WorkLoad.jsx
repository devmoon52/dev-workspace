import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { filter } from "../utils/short";
import { checkDeadline } from "../utils/calculateDate";
import { calculatedMembers } from "../redux/selector/memberSelector";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rgb(c) {
  return `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;
}

function getColor(value) {
  const v = Math.max(0, Math.min(100, value));

  const GREEN = { r: 34, g: 197, b: 94 };
  const AMBER = { r: 245, g: 158, b: 11 };
  const RED = { r: 239, g: 68, b: 68 };

  if (v < 33) {
    return rgb({
      r: GREEN.r,
      g: GREEN.g,
      b: GREEN.b,
    });
  }

  if (v >= 33 && v < 66) {
    const t = (v - 33) / 33;

    return rgb({
      r: lerp(GREEN.r, AMBER.r, t),
      g: lerp(GREEN.g, AMBER.g, t),
      b: lerp(GREEN.b, AMBER.b, t),
    });
  }

  if (v >= 66) {
    const t = (v - 66) / 34;

    return rgb({
      r: lerp(AMBER.r, RED.r, t),
      g: lerp(AMBER.g, RED.g, t),
      b: lerp(AMBER.b, RED.b, t),
    });
  }
}

function getPercent(current, total, percent = 100) {
  if (total === 0) return 0;
  return Math.round((current / total) * percent);
}

const WorkLoad = () => {
  const [status, setStatus] = useState("Low");
  const { system } = useSelector((state) => state.settings);

  // pending, in-active, overloaded, closest, overdue
  const { pending, overdue, running } = useSelector(calculatedProjects);
  const members = useSelector(calculatedMembers);
  const closest = filter(
    [...pending.list, ...running.list],
    (p) => checkDeadline(p.deadline) < 2 && !p.isOverdue,
  );

  const pendingCount = pending.count;
  const inActiveCount = members.inActive.count;
  const overloadedCount = members.overloaded.count;
  const closestCount = closest.length;
  const overdueCount = overdue.count;

  // totals
  const totalProjects = 27;
  const totalMembers = members.total.count;
  const totalActiveMembers = members.active.count;

  // weights
  const pendingWeight = getPercent(pendingCount, totalProjects, 10);
  const inActiveWeight = getPercent(inActiveCount, totalMembers, 10);
  const overloadedWeight = getPercent(overloadedCount, totalActiveMembers, 20);
  const closestWeight = getPercent(closestCount, totalProjects, 20);
  const overdueWeight = getPercent(overdueCount, totalProjects, 40);

  const totalWidth =
    pendingWeight +
    inActiveWeight +
    overloadedWeight +
    closestWeight +
    overdueWeight;

  const value = system.workloadAnalyzer ? totalWidth : 0;
  const v = clamp(value, 0, 100);

  useEffect(() => {
    if (value < 40) {
      setStatus("Low");
    } else if (value < 75) {
      setStatus("Medium");
    } else {
      setStatus("High");
    }
  }, [value]);

  const angle = (v / 100) * 360;

  const color = getColor(v);

  return (
    <div className="flex w-full sm:min-w-auto min-w-80 flex-col justify-center items-center gap-4 px-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">Work Load</h2>
      </div>

      <div className="relative max-w-64 min-w-50 w-full aspect-square">
        {/* back track */}
        <div className="absolute inset-0 rounded-full bg-gray-300" />

        {/* progress arc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${color} ${angle}deg, transparent 0deg)`,
          }}
        />

        {/* inner cut */}
        <div className="absolute inset-10 z-20 rounded-full bg-white" />
        <div
          style={{
            background: `conic-gradient(#d1d5dc ${angle - 10}deg, transparent 0deg)`,
          }}
          className="absolute inset-5 rounded-full bg-gray"
        />

        {/* center value */}
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold z-30 heading-font">
          {v}%
        </div>
      </div>

      <div
        style={{ backgroundColor: color }}
        className="px-4 text-white py-2 rounded-full"
      >
        <h3 className="">{status}</h3>
      </div>
    </div>
  );
};

export default WorkLoad;
