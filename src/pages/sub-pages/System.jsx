import { BrushCleaning, FilePieChart, TruckElectricIcon } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { update_System } from "../../redux/slice/settingSlice";
import { Helmet } from "react-helmet-async";

const System = () => {
  const { system } = useSelector((state) => state.settings);
  const { enabled, loop, loopDuration } = system.projectMonitor;
  const { autoCleanDuration } = system.recentActivity;
  const { overdueHighlighter, workloadAnalyzer } = system;

  const dispatch = useDispatch();

  return (
    <div className="md:space-y-10 space-y-6">
      <Helmet>
        <title>System | Settings | Dev Workspace</title>
      </Helmet>

      {/* Project Monitor */}
      <section className="border border-gray-300 rounded-md px-3 py-2">
        <div className="flex items-center gap-1">
          <FilePieChart />
          <h2 className="text-lg">Project Monitor</h2>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-2">
            <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
            <p>Project monitor display</p>
          </div>
          <div className="flex">
            <input
              checked={enabled}
              onChange={(e) => {
                dispatch(
                  update_System({
                    key: "project_monitor",
                    data: { ...system.projectMonitor, enabled: !enabled },
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                ${
                  enabled
                    ? "after:translate-x-4.5 bg-green-600"
                    : "bg-gray-400 after:translate-x-0"
                }
                `}
              type="checkbox"
              name="project monitor display"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex items-center gap-2">
            <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
            <p>Project monitor loop</p>
          </div>
          <div className="flex">
            <input
              checked={loop}
              onChange={(e) => {
                dispatch(
                  update_System({
                    key: "project_monitor",
                    data: { ...system.projectMonitor, loop: !loop },
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                ${
                  loop
                    ? "after:translate-x-4.5 bg-green-600"
                    : "bg-gray-400 after:translate-x-0"
                }
                `}
              type="checkbox"
              name="project monitor loop"
            />
          </div>
        </div>

        <div className={`mt-3 ${(!loop || !enabled) && "text-gray-500"}`}>
          <h3>Loop Duration</h3>
          {[5, 10, 15, 20].map((v, i) => {
            const isSelected = v === loopDuration;
            return (
              <div key={i + 1} className="space-x-1">
                <input
                  id={`second-${v}`}
                  type="radio"
                  disabled={!loop || !enabled}
                  name="peak-timer"
                  checked={isSelected}
                  onChange={(e) => {
                    dispatch(
                      update_System({
                        key: "project_monitor",
                        data: {
                          ...system.projectMonitor,
                          loopDuration: v,
                        },
                      }),
                    );
                  }}
                  className="relative top-0.5 h-3.5 w-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                />
                <label htmlFor={`second-${v}`} className="text-sm">
                  {v} seconds {v === 10 && "(recommended)"}
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* activity log */}
      <section className="space-y-3 bg-gray-200 px-3 py-2">
        <div className="flex items-center gap-1">
          <BrushCleaning />
          <h2 className="text-lg">Auto Clean Activity Log</h2>
        </div>
        <div>
          <h3>Keep logs for :</h3>
          {[7, 15, 30].map((v, i) => {
            const isSelected = v === autoCleanDuration;
            return (
              <div key={i + 1} className="space-x-1">
                <input
                  id={`days-${v}`}
                  type="radio"
                  name="peak-days"
                  checked={isSelected}
                  onChange={(e) => {
                    dispatch(
                      update_System({
                        key: "recentActivity",
                        data: v,
                      }),
                    );
                  }}
                  className="relative top-0.5 h-3.5 w-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                />
                <label htmlFor={`days-${v}`} className="text-sm">
                  {v} Days {v === 7 && "(recommended)"}
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* workload & highlight-overdue */}
      <section>
        <div className="flex items-center gap-2">
          <p>Analyze workload</p>
          <div className="flex">
            <input
              checked={workloadAnalyzer}
              onChange={(e) => {
                dispatch(
                  update_System({
                    key: "workload",
                    data: !workloadAnalyzer,
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                ${
                  workloadAnalyzer
                    ? "after:translate-x-4.5 bg-green-600"
                    : "bg-gray-400 after:translate-x-0"
                }
                `}
              type="checkbox"
              name="workload analyzer"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p>Highlight overdue projects</p>
          <div className="flex">
            <input
              checked={overdueHighlighter}
              onChange={(e) => {
                dispatch(
                  update_System({
                    key: "overdue",
                    data: !overdueHighlighter,
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                ${
                  overdueHighlighter
                    ? "after:translate-x-4.5 bg-green-600"
                    : "bg-gray-400 after:translate-x-0"
                }
                `}
              type="checkbox"
              name="overdue highlighter"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default System;
