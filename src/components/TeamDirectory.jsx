import { Trophy, UserPlus, UserStar, UserX } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculatedMembers } from "../redux/selector/memberSelector";
import DotLoader from "./DotLoader";
import { addNewMember } from "../redux/slice/memberSlice";
import useAsyncDelay from "../utils/useAsyncDelay";
import Dropdown from "./Dropdown";
import { setSuccessAlert } from "../redux/slice/modalSlice";
import Top from "./Top";
import { addActivity } from "../redux/slice/activitySlice";

const TeamDirectory = () => {
  const { inActive, active, available } = useSelector(calculatedMembers);
  const [filteredAvailable, setFilteredAvailable] = useState(
    available.list.slice(0, 5),
  );
  const [loading, setLoading] = useState(new Set());

  const dispatch = useDispatch();
  const delay = useAsyncDelay();

  useEffect(() => {
    setFilteredAvailable(available.list.slice(0, 5));
  }, [available]);

  const topMembers = [...inActive.list, ...active.list].sort((a, b) => {
    if (b.oldProjects.length === a.oldProjects.length) {
      return b.mid - a.mid;
    } else {
      return b.oldProjects.length - a.oldProjects.length;
    }
  });

  function addMember(mid) {
    setLoading((prev) => {
      const next = new Set(prev);
      next.add(mid);
      return next;
    });

    delay(500, () => {
      dispatch(addNewMember(mid));
      dispatch(
        addActivity({
          type: "member",
          log: `1 new member added to team. Member ID: ${mid}`,
        }),
      );
      setLoading((prev) => {
        const next = new Set(prev);

        next.delete(mid);
        return next;
      });
      dispatch(setSuccessAlert({ id: mid, message: "New member added" }));
    });
  }

  return (
    <section className="flex gap-3 flex-wrap">
      {/* top members */}
      <div className="basis-80 grow shrink-0">
        <Top
          text={"Top Performed Members"}
          type="member"
          list={topMembers.slice(0, 5)}
        />
      </div>

      {/* available new members */}
      <div className="basis-95 grow-5 min-w-80 bg-white shadow-md rounded-md px-3 py-2 space-y-4 min-h-81 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <UserPlus aria-hidden="true" size={26} strokeWidth={2.6} />
            <h2 className="text-lg font-semibold">Available Members</h2>
          </div>

          {available.count > 0 && (
            <Dropdown
              total={available.count}
              size={5}
              setFn={setFilteredAvailable}
              list={available.list}
            />
          )}
        </div>

        <ul className="space-y-2">
          {available.count === 0 && (
            <div className="text-gray-400">
              <h3>No Members Available !</h3>
              <UserX
                className="absolute left-1/2 top-1/2 -translate-1/2"
                size={80}
              />
            </div>
          )}
          {filteredAvailable.map((m) => (
            <li key={m.mid} className="flex items-center justify-between">
              <div>
                <h3>{m.name}</h3>
                <p className="text-sm text-gray-500">{m.mid}</p>
              </div>
              <button
                disabled={loading.has(m.mid)}
                onClick={() => addMember(m.mid)}
                className="bg-[#195DA0] text-white w-13.5 h-8 rounded-full flex justify-center items-center cursor-pointer"
              >
                {loading.has(m.mid) ? (
                  <div className="h-5.5 w-5.5 border-2 border-gray-400 border-t-white animate-spin rounded-full"></div>
                ) : (
                  <span className="text-sm">Add</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamDirectory;
