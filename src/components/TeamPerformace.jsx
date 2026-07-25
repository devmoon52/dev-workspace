import { ChartPie, HandCoins } from "lucide-react";
import { useState } from "react";
import WeeklyRevenue from "./charts/WeeklyRevenue";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { useMemo } from "react";

const TeamPerformace = () => {
  const [week, setWeek] = useState("current");
  const { approved } = useSelector(calculatedProjects);
  const { active, inActive } = useSelector(calculatedMembers);
  const { memberPercentage } = useSelector(
    (state) => state.settings.asset_manager,
  );

  const projectClientMap = useMemo(() => {
    // get -> projectID -> member Data
    const memberMap = {};

    for (const member of [...active.list, ...inActive.list]) {
      member.oldProjects.forEach((p) => {
        memberMap[p] = member;
      });
    }

    return { memberMap };
  }, [active, inActive]);

  const { memberMap } = projectClientMap;

  return (
    <section className="flex gap-3 flex-wrap">
      <div className="bg-white rounded-md shadow-md px-3 py-2 space-y-3 basis-90 grow-2">
        <div className="flex text-gray-700 items-center gap-2">
          <ChartPie aria-hidden="true" strokeWidth={2.4} size={26} />
          <h2 className="text-lg font-semibold">Revenue Analysis</h2>
        </div>

        {/* btns */}
        <div className="flex gap-2">
          <button
            onClick={() => setWeek("first")}
            className={`text-sm transition-colors duration-200 border px-3 py-1.5 ${week === "first" ? "border-[#175491] text-[#175491]" : "border-gray-300"}`}
          >
            First Week
          </button>
          <button
            onClick={() => setWeek("previous")}
            className={`text-sm transition-colors duration-200 border px-3 py-1.5 ${week === "previous" ? "border-[#175491] text-[#175491]" : "border-gray-300"}`}
          >
            Previous Week
          </button>
          <button
            onClick={() => setWeek("current")}
            className={`text-sm transition-colors duration-200 border px-3 py-1.5 ${week === "current" ? "border-[#175491] text-[#175491]" : "border-gray-300"}`}
          >
            Current Week
          </button>
        </div>

        {/* chart */}
        <div>
          <WeeklyRevenue week={week} />
        </div>
      </div>

      {/* member payroll */}
      <div className="bg-white rounded-md shadow-md px-3 py-2 basis-70 grow flex justify-center items-center">
        <div className="space-y-3">
          <div className="flex text-gray-700 items-center gap-2">
            <HandCoins aria-hidden="true" strokeWidth={2.4} size={26} />
            <h2 className="text-lg font-semibold">Member Payroll</h2>
          </div>

          {/* percentage */}
          <div>
            <h3 className="text-4xl font-semibold text-[#195DA0]">
              {memberPercentage}%
            </h3>
            <p className="text-sm text-gray-600">
              Members will automatically receive {memberPercentage}% for each project.
            </p>
          </div>

          <ul
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 10%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 10%, transparent 100%)",
            }}
            className="space-y-1"
          >
            {approved.list.slice(0, 4).map((p) => (
              <li
                key={p.projectID}
                className="flex items-center justify-between gap-1"
              >
                <div className="flex items-center gap-1">
                  <div
                    aria-hidden="true"
                    className="rounded-full bg-[#124170]/30 flex items-center justify-center h-3.5 w-3.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#124170]"></span>
                  </div>
                  <p>{memberMap[p.projectID].name}</p>
                </div>
                <p>${p.budget / 2}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TeamPerformace;
