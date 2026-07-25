import { ChevronRight, FileX, Receipt } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { truncateText } from "../utils/short";
import { calculatedMembers } from "../redux/selector/memberSelector";

const Transactions = () => {
  const { approved } = useSelector(calculatedProjects);
  const { total_clients } = useSelector((state) => state.clients);
  const { active, inActive } = useSelector(calculatedMembers);
  const [index, setIndex] = useState(0);

  const projectClientMap = useMemo(() => {
    // get -> projectID -> Client ID -> client Data
    // get -> projectID -> member Data
    const clientIDMap = {};
    const memberMap = {};

    for (const client of total_clients) {
      clientIDMap[client.clientID] = client;
    }

    for (const member of [...active.list, ...inActive.list]) {
      member.oldProjects.forEach((p) => {
        memberMap[p] = member;
      });
    }

    return { clientIDMap, memberMap };
  }, [total_clients, active, inActive]);

  const { clientIDMap, memberMap } = projectClientMap;

  return (
    <div className="">
      <div className="flex items-center gap-1">
        <Receipt aria-hidden="true" />
        <h2 className="text-lg font-semibold">Transactions</h2>
      </div>
      <ul className="mt-3 space-y-1">
        {approved.count === 0 && (
          <li className="text-lg text-gray-600">
            <p>No transaction available !</p>
            <FileX aria-hidden="true" size={60} strokeWidth={1.4} />
          </li>
        )}
        {approved.list.map((p, i) => (
          <li key={p.projectID} className="border border-gray-400 px-3 py-2">
            <div className="justify-between items-center flex gap-2">
              <h3
                onClick={() => setIndex(i)}
                className={`${index !== i && "hover:underline cursor-pointer"}`}
              >
                {p.project}
              </h3>
              <div className="flex items-center gap-1">
                <p>${p.budget}</p>
                <button
                  onClick={() => setIndex(i)}
                  className="mb-0.5 cursor-pointer"
                >
                  <ChevronRight aria-hidden="true" size={20} />
                </button>
              </div>
            </div>
            <div
              className={`text-sm overflow-hidden ${index === i ? "mt-2 h-20" : "h-0 mt-0"} transition-all duration-200`}
            >
              <p>
                <span className="text-gray-600">Client:</span>{" "}
                {clientIDMap[p.clientID].name}
              </p>
              <p>
                <span className="text-gray-600">Client ID:</span> {p.clientID}
              </p>
              <p>
                <span className="text-gray-600">Contributor:</span>{" "}
                {memberMap[p.projectID] ? (
                  memberMap[p.projectID].name
                ) : (
                  <span className="text-red-600">Removed</span>
                )}
              </p>
              <p>
                <span className="text-gray-600">MID:</span>{" "}
                {memberMap[p.projectID] ? (
                  memberMap[p.projectID].mid
                ) : (
                  <span className="text-red-600">Removed</span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
