import { BrushCleaning, CloudBackup, File, Package } from "lucide-react";
import StoragePie from "../../components/charts/StoragePie";
import { useDispatch, useSelector } from "react-redux";
import { calculatedMembers } from "../../redux/selector/memberSelector";
import { calculatedProjects } from "../../redux/selector/projectSelector";
import { update_autoBackup } from "../../redux/slice/settingSlice";
import RasetAndRemoveModal from "../../components/modals/RasetAndRemoveModal";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import {
  removeAllActivity,
  removeAllNotification,
} from "../../redux/slice/activitySlice";
import { removeAllClients } from "../../redux/slice/clientSlice";
import { removeAllMembers } from "../../redux/slice/memberSlice";
import { removeAllProjects } from "../../redux/slice/projectSlice";
import { removeAllReminder } from "../../redux/slice/reminderSlice";
import { Helmet } from "react-helmet-async";

const DataCenter = () => {
  const { reminder } = useSelector((state) => state.reminders);
  const { total_clients } = useSelector((state) => state.clients);
  const { total } = useSelector(calculatedMembers);
  const projects = useSelector(calculatedProjects);
  const { data_center } = useSelector((state) => state.settings);
  const { all_notification } = useSelector((state) => state.activities);

  const [processType, setProcessType] = useState(null);
  const [modal, setModal] = useState(null);

  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const storage = [
    {
      label: "Projects",
      count: projects.total.count,
    },
    {
      label: "Members",
      count: total.count,
    },
    {
      label: "Clients",
      count: total_clients.length,
    },
    {
      label: "Reminders",
      count: reminder.length,
    },
    {
      label: "Notifications",
      count: all_notification.length,
    },
  ];

  function factoryRaset() {
    setProcessType("erase");
    setModal("processing");

    timerRef.current = setTimeout(() => {
      dispatch(removeAllActivity());
      dispatch(removeAllClients());
      dispatch(removeAllMembers());
      dispatch(removeAllReminder());
      dispatch(removeAllProjects());
      dispatch(removeAllNotification());
      setModal(null);
      navigate("/");
    }, 5000);
  }

  function backUp() {
    setProcessType("restore");
    setModal("processing");

    timerRef.current = setTimeout(() => {
      setModal(null);
      window.location.href = "/";
    }, 5000);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="md:space-y-10 space-y-6 pb-3">
      <Helmet>
        <title>Data Center | Settings | Dev Workspace</title>
      </Helmet>

      <AnimatePresence>
        {/* === erase data modal === */}
        {modal === "erase" && (
          <RasetAndRemoveModal key={"erase"} onClose={() => setModal(null)}>
            <div className="flex gap-1">
              <BrushCleaning />
              <h2 className="text-lg font-semibold">Erase All Data</h2>
            </div>
            <p className="text-sm mt-2">
              This will delete all of your app data, including projects,
              members, clients, reminders, and notifications.
            </p>

            <button
              onClick={factoryRaset}
              className="mt-2 bg-red-300/70 hover:bg-red-300 px-4 py-1.5 rounded-sm text-red-700"
            >
              Erase Now
            </button>
          </RasetAndRemoveModal>
        )}

        {/* === restore data modal === */}
        {modal === "restore" && (
          <RasetAndRemoveModal key={"restore"} onClose={() => setModal(null)}>
            <div className="flex gap-1">
              <CloudBackup />
              <h2 className="text-lg font-semibold">Restore All Data</h2>
            </div>
            <p className="text-sm mt-2">
              Are you sure you want to restore your data? This will overwrite
              your current settings.
            </p>
            <button
              onClick={backUp}
              className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-sm text-white"
            >
              Restore Now
            </button>
          </RasetAndRemoveModal>
        )}

        {/* === processing modal === */}
        {modal === "processing" && (
          <RasetAndRemoveModal key={"process"}>
            <div className="text-center">
              <div className="-space-y-0.5">
                <h2 className="text-lg">
                  {processType === "erase"
                    ? "Removing all data"
                    : "Restoring all data"}
                </h2>
                <p className="text-sm">Wait a moment...</p>
              </div>
              <div className="h-4 mt-3 rounded-sm bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 5,
                    ease: "linear",
                  }}
                  className="bg-green-500 h-full"
                />
              </div>
            </div>
          </RasetAndRemoveModal>
        )}
      </AnimatePresence>

      <section className="space-y-2">
        <div className="flex items-center gap-1">
          <Package aria-hidden="true" />
          <h2 className="text-lg">Storage Overview</h2>
        </div>

        <div className="flex gap-3 flex-wrap">
          <StoragePie storage={storage} />
          <div className="grow-3 basis-70">
            <ul className="space-y-1 py-2">
              {storage.map((d) => (
                <li key={d.label} className="flex justify-between items-center">
                  <p>{d.label}</p>
                  <div className="flex items-center gap-1">
                    <p>{d.count}</p>
                    <File size={18} strokeWidth={1.4} />
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setModal("erase")}
              className="bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-200 py-2 max-w-70 w-full md:mt-10 mt-6"
            >
              Remove All Data
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-2 px-3">
        <div className="flex gap-1 items-center">
          <CloudBackup />
          <h2 className="text-lg">Restore & Backup Data</h2>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-2">
            <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
            <p>Auto Backup</p>
          </div>
          <div className="flex">
            <input
              checked={data_center.autoBackup}
              onChange={(e) => {
                dispatch(update_autoBackup());
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                ${
                  data_center.autoBackup
                    ? "after:translate-x-4.5 bg-green-600"
                    : "bg-gray-400 after:translate-x-0"
                }
                `}
              type="checkbox"
              name="auto backup"
            />
          </div>
        </div>
        <button
          onClick={() => setModal("restore")}
          className="bg-[#124170] py-2 px-4 mt-2 text-white text-sm hover:bg-[#154b81] rounded-sm"
        >
          Restore All Data
        </button>
      </section>
    </div>
  );
};

export default DataCenter;
