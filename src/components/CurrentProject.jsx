import { TriangleAlert } from "lucide-react";
import { calculateDate } from "../utils/calculateDate";
import { truncateText } from "../utils/short";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";

const CurrentProject = () => {
  const { running, pending, overdue, completed, total } =
    useSelector(calculatedProjects);
  const { avgDeadline } = useSelector((state) => state.projects);

  const completedPercentage =
    Math.round((completed.count / total.count) * 100) || 0;

  return (
    <div className="bg-white grow sm:basis-90 sm:min-w-auto min-w-80 basis-full shrink-0 grid grid-cols-2 grid-rows-2 gap-2 px-4 py-3 rounded-md shadow-md">
      {/* running projects count */}
      <div className="bg-gray-200 rounded-md flex justify-center items-center flex-col">
        <h2 className="text-2xl font-semibold">{running.count}</h2>
        <p className="text-center text-sm">Total Running Project</p>
      </div>

      {/* average deadlines */}
      <div className="bg-gray-200 rounded-md flex justify-center items-center flex-col">
        <h2 className="text-2xl font-semibold">{avgDeadline}</h2>
        <p className="text-center text-sm">AVG Deadlines</p>
      </div>

      {/* deadline missed - overdue */}
      <div className="bg-gray-200 flex flex-col py-3 px-2 rounded-md">
        {overdue.list.slice(0, 3).map((a, i) => (
          <div key={a.projectID}>
            {/* data */}
            <div className="px-1 flex justify-between items-center">
              <h3 className="text-sm">{truncateText(a.project, 10)}</h3>
              <TriangleAlert aria-hidden="true" className="text-amber-500" />
            </div>

            {i !== overdue.count - 1 && (
              <hr className="border-t border-gray-400 my-2" />
            )}
          </div>
        ))}
      </div>

      {/* completed percentage */}
      <div className="bg-gray-200 rounded-md flex flex-col justify-center items-center">
        {/* Pie chart */}
        <div
          className="relative w-18 h-18 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(#22c55e ${completedPercentage}%, #cccccc ${completedPercentage}%)`,
          }}
        >
          {/* inner circle */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="font-semibold text-sm text-gray-800">
              {completedPercentage}%
            </span>
          </div>
        </div>
        <h2 className="font-semibold">Completed</h2>
      </div>
    </div>
  );
};

export default memo(CurrentProject);
