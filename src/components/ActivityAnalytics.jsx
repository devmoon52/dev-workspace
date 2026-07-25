import React, { useMemo, useState } from "react";
import ActivityBar from "./charts/ActivityBar";
import { ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import ActivityPie from "./charts/ActivityPie";
import { calculatedActivity } from "../redux/selector/activitySelector";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const ActivityAnalytics = () => {
  const { filteredByDay } = useSelector(calculatedActivity);

  const [day, setDay] = useState(1);

  const activityMap = useMemo(() => {
    const current = filteredByDay[day].list;
    const map = {
      project: { count: 0 },
      member: { count: 0 },
      asset: { count: 0 },
      reminder: { count: 0 },
      message: { count: 0 },
      setting: { count: 0 },
    };

    for (const a of current) {
      map[a.type].count++;
    }

    return map;
  }, [day]);

  return (
    <section className="space-y-3">
      <div className="justify-self-end flex">
        <NavLink to={'/activity-log#newActivities'}>
          <button className="bg-white px-3 py-2 border border-gray-100 shadow text-sm hover:bg-gray-100 active:bg-gray-50">New Activities</button>
        </NavLink>
        <NavLink to={'/activity-log#oldActivities'}>
          <button className="bg-white px-3 py-2 border border-gray-100 shadow text-sm hover:bg-gray-100 active:bg-gray-50">Old Activities</button>
        </NavLink>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="bg-white rounded-md px-3 py-2 shadow-md grow-3 basis-80 shrink-0">
          <div className="flex items-center gap-2 text-gray-700">
            <ScrollText size={26} strokeWidth={1.8} />
            <h2 className="text-lg font-semibold">This Week Activities</h2>
          </div>
          <ActivityBar filteredByDay={filteredByDay} />
        </div>

        <div className="bg-white rounded-md shadow-md flex justify-center items-center flex-col px-3 py-2 basis-75 shrink-0 grow">
          <div className="self-start justify-self-start my-2 flex items-center gap-3">
            <div className="flex gap-1">
              <button
                aria-label="Move to previous day"
                onClick={() => setDay((prev) => (prev > 1 ? prev - 1 : prev))}
                className="bg-gray-100 hover:bg-gray-200"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                aria-label="Move to next day"
                onClick={() => setDay((prev) => (prev < 7 ? prev + 1 : prev))}
                className="bg-gray-100 hover:bg-gray-200"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
            <div>
              <p>
                Day {day} {day === 1 && <span>- (Today)</span>}
              </p>
            </div>
          </div>
          <ActivityPie mapedData={activityMap} />
        </div>
      </div>
    </section>
  );
};

export default ActivityAnalytics;
