import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculatedMembers } from "../../redux/selector/memberSelector";
import { calculatedProjects } from "../../redux/selector/projectSelector";
import { update_notificationToggle } from "../../redux/slice/settingSlice";
import { Bell, BrushCleaning } from "lucide-react";
import { Helmet } from "react-helmet-async";

const NotificationSetting = () => {
  const { total } = useSelector(calculatedMembers);
  const { total_clients } = useSelector((state) => state.clients);
  const project = useSelector(calculatedProjects);
  const { reminder } = useSelector((state) => state.reminders);

  const { notification } = useSelector((state) => state.settings);
  const { toggleAlert, autoCleanUp } = notification;

  const dispatch = useDispatch();

  const datas = useMemo(() => {
    return [
      {
        id: 1,
        alertLabel: "teamMember",
        alertName: "Team members",
        value: toggleAlert["teamMember"],
      },
      {
        id: 2,
        alertLabel: "client",
        alertName: "Clients",
        value: toggleAlert["client"],
      },
      {
        id: 3,
        alertLabel: "project",
        alertName: "Projects",
        value: toggleAlert["project"],
      },
      {
        id: 4,
        alertLabel: "reminder",
        alertName: "Reminders",
        value: toggleAlert["reminder"],
      },
      {
        id: 5,
        alertLabel: "workload",
        alertName: "Workloads",
        value: toggleAlert["workload"],
      },
      {
        id: 6,
        alertLabel: "revenueAndAsset",
        alertName: "Revenue and assets",
        value: toggleAlert["revenueAndAsset"],
      },
      {
        id: 7,
        alertLabel: "messages",
        alertName: "Messages",
        value: toggleAlert["messages"],
      },
    ];
  }, [toggleAlert]);

  return (
    <div className="md:space-y-10 space-y-6">
      <Helmet>
        <title>Notification | Setting | Dev Workspace</title>
      </Helmet>

      <section className="bg-gray-200 px-2 py-2.5 space-y-3">
        <div className="flex items-center gap-1">
          <BrushCleaning />
          <h2 className="text-lg">Auto clean notification</h2>
        </div>

        <div>
          <h3>Keep notifications for :</h3>

          <ul className="text-sm">
            {[7, 15, 30].map((v, i) => {
              const isSelected = v === autoCleanUp.duration;
              return (
                <li key={i + 1} className="space-x-1">
                  <input
                    id={`days-${v}`}
                    type="radio"
                    name="peak-days"
                    checked={isSelected}
                    onChange={(e) => {
                      dispatch(
                        update_notificationToggle({
                          key: "autoCleanUp",
                          value: v,
                        }),
                      );
                    }}
                    className="relative top-0.5 h-3.5 w-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <label htmlFor={`days-${v}`} className="text-sm">
                    {v} Days {v === 7 && "(recommended)"}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-1">
          <Bell />
          <h2 className="text-lg">Notification Preferences</h2>
        </div>

        {/* enable all notification */}
        <div className="bg-gray-200 px-2 py-2.5 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
            <p>Enable all notification</p>
          </div>
          <div className="flex">
            <input
              checked={toggleAlert.allNotification}
              onChange={(e) => {
                dispatch(
                  update_notificationToggle({
                    key: "allNotification",
                    value: e.target.checked,
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                          ${
                            toggleAlert.allNotification
                              ? "after:translate-x-4.5 bg-green-600"
                              : "bg-gray-400 after:translate-x-0"
                          }
                          `}
              type="checkbox"
              name="workload analyzer"
            />
          </div>
        </div>

        <ul className="space-y-1 px-2 py-2.5">
          {datas.map((data) => {
            return (
              <li key={data.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
                  <p>{data.alertName}</p>
                </div>
                <div className="flex">
                  <input
                    checked={data.value}
                    onChange={(e) => {
                      dispatch(
                        update_notificationToggle({
                          key: data.alertLabel,
                        }),
                      );
                    }}
                    className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                          ${
                            data.value
                              ? "after:translate-x-4.5 bg-green-600"
                              : "bg-gray-400 after:translate-x-0"
                          }
                          `}
                    type="checkbox"
                    name="workload analyzer"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default NotificationSetting;
