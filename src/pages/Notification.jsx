import {
  Bell,
  FileExclamationPoint,
  Gauge,
  MessageSquareWarning,
  Receipt,
} from "lucide-react";
import { useEffect, useState } from "react";
import { notifications } from "../data/notificationData";
import { filter, truncateText } from "../utils/short";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const Notification = () => {
  const { all_notification } = useSelector((state) => state.activities);

  const [status, setStatus] = useState({
    current: "All",
    isOpen: false,
  });
  const [filtered, setFiltered] = useState(all_notification);

  useEffect(() => {
    if (!status.isOpen) return;

    function handler() {
      setStatus((prev) => ({ ...prev, isOpen: false }));
    }

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [status.isOpen]);

  useEffect(() => {
    if (status.current === "All") {
      setFiltered(all_notification);
    }
    if (status.current === "Today") {
      setFiltered(filter(all_notification, (n) => n.date === "Today"));
    }
    if (status.current === "Project") {
      setFiltered(filter(all_notification, (n) => n.type === "project"));
    }
  }, [status.current]);

  function checkType(type) {
    if (type === "revenue/revenue" || type === "revenue/asset") {
      return <Receipt size={20} strokeWidth={1.8} />;
    } else if (type === "project") {
      return <FileExclamationPoint size={20} strokeWidth={1.8} />;
    } else if (type === "workload") {
      return <Gauge size={20} strokeWidth={1.8} />;
    } else if (type === "message") {
      return <MessageSquareWarning size={20} strokeWidth={1.8} />;
    } else {
      return (
        <div className="text-2xl font-semibold h-10 w-10 rounded-full bg-gray-200 flex justify-center items-center">
          ?
        </div>
      );
    }
  }

  return (
    <div className="space-y-10 mb-5">
      <Helmet>
        <title>Notification | Dev Workspace</title>
      </Helmet>

      <h1
        role="heading"
        className="text-3xl heading-font font-semibold"
      >
        Notifications
      </h1>

      {/* new message quick see */}
      <div>
        <div className="flex items-center bg-gray-300/60 px-3 py-2 rounded-md gap-1 min-w-60">
          <Bell />
          <p>5 New</p>
        </div>
      </div>

      {/* notification feed */}
      <section className="space-y-3 min-w-75">
        {/* feed header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Notification Feed</h2>
          </div>
          <div className="flex gap-2 items-center relative">
            <span>Filter</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatus((prev) => ({ ...prev, isOpen: !prev.isOpen }));
              }}
              className="w-20 bg-white px-1 py-1.5 rounded-sm shadow-md text-center text-sm"
            >
              {status.current}
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-full bg-white w-full px-1 rounded-md flex-col text-sm py-1 shadow-md ${status.isOpen ? "flex" : "hidden"}`}
            >
              <button
                onClick={() =>
                  setStatus((prev) => ({ isOpen: false, current: "All" }))
                }
                className="py-1.5 active:bg-gray-200 hover:bg-gray-200 rounded-md"
              >
                All
              </button>
              <button
                onClick={() =>
                  setStatus((prev) => ({ isOpen: false, current: "Today" }))
                }
                className="py-1.5 active:bg-gray-200 hover:bg-gray-200 rounded-md"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setStatus((prev) => ({ isOpen: false, current: "Project" }))
                }
                className="py-1.5 active:bg-gray-200 hover:bg-gray-200 rounded-md"
              >
                Project
              </button>
            </div>
          </div>
        </div>

        <ul className="space-y-2">
          {filtered.map((n) => (
            <li
              key={n.id}
              className="bg-white px-2 py-3 rounded-md shadow-md flex items-start gap-2"
            >
              <div className="text-2xl shrink-0 font-semibold h-10 w-10 rounded-full bg-gray-200 flex justify-center items-center">
                {checkType(n.type)}
              </div>

              <div className="mt-1.5 space-y-1">
                <h2 className="text-lg text-gray-700">{n.notifyOn}</h2>

                {/* type revenue */}
                {n.type.startsWith("revenue") && (
                  <div className="text-sm">
                    <p>Current: ${n.revenue}</p>
                  </div>
                )}

                {/* type project */}
                {n.type === "project" && (
                  <ul className="text-sm">
                    {n.projects.map((p) => (
                      <li
                        key={p.id}
                        className={`${p.isOverdue && "text-red-700"} flex items-center gap-1.5`}
                      >
                        <div
                          aria-hidden="true"
                          className={`rounded-full ${p.isOverdue ? "bg-red-600/30" : "bg-[#124170]/30"} flex items-center justify-center h-3 w-3`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${p.isOverdue ? "bg-red-600" : "bg-[#124170]"}`}
                          ></span>
                        </div>
                        <p>
                          {p.project} - {p.id}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {/* type workload */}
                {n.type === "workload" && (
                  <div className="text-sm">
                    <p>Current Load: {n.load}</p>
                    <p>Pressure: {n.condition}</p>
                  </div>
                )}

                {/* type message */}
                {n.type === "message" && (
                  <div className="text-sm">
                    <p>
                      Client:{" "}
                      <span className="text-gray-600">{n.client.name}</span>
                    </p>
                    <p>
                      ID: <span className="text-gray-600">{n.client.id}</span>
                    </p>
                    <p>
                      Message:{" "}
                      <span className="text-gray-600">
                        {truncateText(n.client.message, 20)}
                      </span>
                    </p>
                  </div>
                )}

                <div className="text-sm bg-gray-200 px-2 text-gray-600 py-0.5 rounded-sm inline-block mt-1.5">
                  <span>{n.date}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Notification;
