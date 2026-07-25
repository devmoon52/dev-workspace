import {
  CornerUpLeft,
  Files,
  FileUser,
  Info,
  MessageSquareMore,
  SendHorizontal,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { textToImage, truncateText } from "../utils/short";
import { addMessage } from "../redux/slice/clientSlice";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { motion } from "motion/react";
import { addActivity } from "../redux/slice/activitySlice";

const ClientInteract = () => {
  const { total_clients, messages } = useSelector((state) => state.clients);
  const { total } = useSelector(calculatedProjects);
  const [open, setOpen] = useState({
    clientSide: false,
    detailSide: false,
  });

  const [index, setIndex] = useState(0);

  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const isChated = useRef(false);

  const clientProjectMap = useMemo(() => {
    const map = {};

    for (const p of total.list) {
      if (!map[p.clientID]) {
        map[p.clientID] = {
          completed: 0,
          uncompleted: 0,
          list: [],
        };
      }

      p.status === "completed"
        ? map[p.clientID].completed++
        : map[p.clientID].uncompleted++;

      map[p.clientID].list.push(p);
    }

    return map;
  }, [total]);

  // send messaeg btn action
  function sendMsg() {
    const msg = inputRef.current.value;
    if (!msg.trim()) return;

    isChated.current = true;
    dispatch(addMessage({ clientID: clientID, msg: msg }));

    inputRef.current.value = "";
  }

  const clientID = total_clients[index]?.clientID;
  const detail = clientProjectMap[clientID];

  // add activity for message
  useEffect(() => {
    return () => {
      if (isChated.current) {
        isChated.current = false;
        dispatch(
          addActivity({
            type: "message",
            log: `Chatted with a client. Client ID: ${clientID}`,
          }),
        );
      }
    };
  }, [clientID]);

  const completed = detail
    ? Math.round((detail.completed / detail?.list.length) * 100)
    : 0;

  if (total_clients.length === 0) {
    return null;
  }

  return (
    <section className="flex gap-3 @container relative">
      {/* clients */}
      <aside
        className={`grow @4xl:static absolute basis-70 shrink-0 bg-white pl-3 py-2 rounded-md shadow-md space-y-3 @4xl:h-auto h-140 @4xl:block flex flex-col inset-0 ${open.clientSide ? "translate-x-0" : "-translate-x-full @4xl:translate-x-0"} transition-transform duration-300 min-w-70`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-gray-700">
            <Users size={26} aria-hidden="true" strokeWidth={2.3} />
            <h2 className="font-semibold text-lg">Clients</h2>
          </div>
          <div className="pr-3 @4xl:hidden">
            <button
              onClick={() =>
                setOpen((prev) => ({ ...prev, clientSide: false }))
              }
              className="bg-gray-200 hover:bg-gray-300 cursor-pointer p-1 rounded-full"
            >
              <CornerUpLeft aria-hidden="true" size={20} />
            </button>
          </div>
        </div>

        {/* cilents list */}
        <ul className="space-y-1 @4xl:max-h-150 h-full overflow-auto smScroll">
          {total_clients.map((c, i) => (
            <li
              onClick={() => {
                setIndex(i);
                if (open.clientSide) {
                  setOpen((prev) => ({ ...prev, clientSide: false }));
                }
              }}
              key={c.clientID}
              className={`flex items-center gap-2 ${index === i ? "bg-[#67C090]/30" : "hover:bg-[#67C090]/20"} rounded-md cursor-default mr-3`}
            >
              <div className="bg-gray-300 h-10 w-10 flex justify-center items-center rounded-full text-sm">
                {textToImage(c.name)}
              </div>
              <div className="-space-y-1">
                <h3>{c.name}</h3>
                <p className="text-xs text-gray-600">
                  {truncateText(c.lastMessage, 18)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* message */}
      <div className="basis-90 grow-3 min-h-140 bg-white px-3 py-2 rounded-md shadow-md flex flex-col">
        {/* msg header */}
        <div className="border-b border-gray-300 pb-2 flex items-center @4xl:gap-3 gap-2">
          <div className="bg-gray-300 h-12 w-12 hidden justify-center items-center rounded-full text-lg font-semibold @4xl:flex">
            {textToImage(total_clients[index].name)}
          </div>
          <div className="mt-1 @4xl:hidden">
            <MessageSquareMore strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="-space-y-1">
            <h3 className="text-lg font-semibold">
              {total_clients[index].name}
            </h3>
            <p className="text-sm @4xl:block hidden text-gray-600">
              ID: {total_clients[index].clientID}
            </p>
          </div>

          <div className="ml-auto @4xl:hidden flex items-center gap-2">
            <button
              lang="Toggle detail side menu"
              onClick={() => setOpen((prev) => ({ detailSide: true }))}
              className="bg-gray-200 p-1 rounded-sm cursor-pointer"
            >
              <Info aria-hidden="true" size={20} />
            </button>
            <button
              lang="Toggle clients side menu"
              onClick={() => setOpen((prev) => ({ ...prev, clientSide: true }))}
              className="bg-gray-200 p-1 rounded-sm cursor-pointer"
            >
              <Users aria-hidden="true" size={20} />
            </button>
          </div>
        </div>

        {/* msg content */}
        <div className="grow mt-2">
          <ul className="flex flex-col gap-2 items-start overflow-y-auto smScroll max-h-130.75 pr-1">
            {messages[clientID]?.map((m, i) => (
              <li
                key={i}
                className={`bg-gray-300 px-3 py-1.5 rounded-lg text-sm ${m.type === "client" ? "self-start mr-10" : "self-end ml-10"}`}
              >
                {m.msg}
              </li>
            ))}
          </ul>
        </div>

        {/* msg field */}
        <div className="flex mt-3 gap-1">
          <input
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMsg();
              }
            }}
            placeholder="Type something..."
            className="border py-1.5 grow rounded-full outline-none border-gray-300 px-4 focus:border-[#195DA0]"
            name="send-message"
            type="text"
          />
          <button
            onClick={sendMsg}
            className="border aspect-square w-10 rounded-full flex justify-center items-center border-gray-300 cursor-pointer hover:bg-[#195DA0]/30 hover:text-[#195DA0] hover:border-[#195DA0]"
          >
            <SendHorizontal aria-hidden="true" size={20} />
          </button>
        </div>
      </div>

      {/* details */}
      <aside
        className={`basis-80 grow bg-white px-3 py-2 rounded-md shadow-md space-y-4 @4xl:static absolute inset-0 ${open.detailSide ? "translate-x-0" : "translate-x-full @4xl:translate-x-0"} transition-transform duration-300 min-w-70`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 mt-1">
            <FileUser aria-hidden="true" strokeWidth={1.4} size={28} />
            <h2 className="text-xl">Details</h2>
          </div>
          <div className="@4xl:hidden">
            <button
              onClick={() =>
                setOpen((prev) => ({ ...prev, detailSide: false }))
              }
              className="bg-gray-200 hover:bg-gray-300 cursor-pointer p-1 rounded-full"
            >
              <CornerUpLeft aria-hidden="true" size={20} />
            </button>
          </div>
        </div>

        {/* client detail */}
        <div>
          <p className="flex justify-between items-center text-sm">
            <span>Name:</span> <span>{total_clients[index].name}</span>
          </p>
          <p className="flex justify-between items-center text-sm">
            <span>ID:</span> <span>{total_clients[index].clientID}</span>
          </p>
          <p className="flex justify-between items-center text-sm">
            <span>Total Project:</span>{" "}
            <span>{detail ? detail.list.length : 0}</span>
          </p>
          <p className="flex justify-between items-center text-sm">
            <span>Completed:</span> <span>{completed}%</span>
          </p>
          <p className="flex justify-between items-center text-sm">
            <span>Uncompleted:</span>{" "}
            <span>{detail ? detail.uncompleted : 0} Project</span>
          </p>
        </div>

        {/* projects list */}
        <div>
          <div className="flex items-center gap-1 text-gray-700">
            <Files aria-hidden="true" strokeWidth={2.2} />
            <h3 className="font-semibold">Projects</h3>
          </div>

          <ul className="space-y-1 mt-2">
            {detail?.list.map((p, i) => (
              <li
                key={p.projectID}
                className={`${i !== detail?.list.length - 1 && "border-b"} border-gray-300 py-1 text-sm ${p.status === "completed" ? "text-green-600" : "text-gray-600"}`}
              >
                <p>
                  {i + 1}. {p.project}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
};

export default ClientInteract;
