import { SquareChartGantt } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { calculatedActivity } from "../redux/selector/activitySelector";

const ActivityFeed = () => {
  const { newActivities, oldActivities } = useSelector(calculatedActivity);

  return (
    <section className="space-y-8 min-w-70">
      <div id="newActivities" className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <SquareChartGantt aria-hidden="true" strokeWidth={2.2} size={26} />
          <h2 className="font-semibold text-lg">New Activities</h2>
        </div>

        <ul className="space-y-1.5">
          {newActivities.list.map((a, i) => (
            <li className="bg-white px-3 py-2 rounded-md shadow-md" key={i}>
              <div className="flex items-center gap-1.5">
                <div
                  aria-hidden="true"
                  className={`rounded-full bg-[#124170]/30 flex items-center justify-center h-3.5 w-3.5`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-[#124170]`}
                  ></span>
                </div>
                <h3 className="text-lg">
                  {a.type[0].toUpperCase() + a.type.slice(1)}
                </h3>
              </div>
              <p className="text-gray-700">{a.log}</p>
            </li>
          ))}
        </ul>
      </div>

      <div id="oldActivities" className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <SquareChartGantt aria-hidden="true" strokeWidth={2.2} size={26} />
          <h2 className="font-semibold text-lg">Old Activities</h2>
        </div>

        <ul className="space-y-1.5">
          {oldActivities.list.map((a, i) => (
            <li className="bg-white px-3 py-2 rounded-md shadow-md" key={i}>
              <div className="flex items-center gap-1.5">
                <div
                  aria-hidden="true"
                  className={`rounded-full bg-[#124170]/30 flex items-center justify-center h-3.5 w-3.5`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-[#124170]`}
                  ></span>
                </div>
                <h3 className="text-lg">
                  {a.type[0].toUpperCase() + a.type.slice(1)}
                </h3>
              </div>
              <p className="text-gray-700">{a.log}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ActivityFeed;
