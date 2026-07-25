import { Ban, SearchAlert, Trash, User, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { truncateText } from "../utils/short";
import Dropdown from "./Dropdown";
import { AnimatePresence } from "motion/react";
import DelConfirmation from "./modals/DelConfirmation";
import { filter } from "../utils/short";
import { updateMember } from "../redux/slice/memberSlice";
import { addActivity } from "../redux/slice/activitySlice";

const TeamAlertsSection = () => {
  const { inActive, overloaded, total } = useSelector(calculatedMembers);
  const [filteredOverloaded, setFilteredOverloaded] = useState(
    overloaded.list.slice(0, 4),
  );
  const [delAction, setDelAction] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setFilteredOverloaded(overloaded.list.slice(0, 4));
  }, [overloaded]);

  function deleteMember() {
    if (!delAction) return;
    const { mid } = delAction;

    const updated = filter(total.list, (m) => m.mid !== mid);
    dispatch(updateMember(updated));
    dispatch(
      addActivity({
        type: "member",
        log: `1 inactive member has been removed. Member ID: ${mid}`,
      }),
    );
  }

  return (
    <section id="team-alerts" className="flex gap-3 flex-wrap">
      <AnimatePresence>
        {delAction && (
          <DelConfirmation
            message={delAction.message}
            callback={deleteMember}
            offClick={setDelAction}
          />
        )}
      </AnimatePresence>

      {/* Inactive members */}
      <div className="bg-white px-3 py-2 rounded-md space-y-3 shadow-md basis-80 shrink-0 grow relative min-h-92">
        <div className="flex items-center gap-2 text-gray-700">
          <UserX aria-hidden="true" size={26} strokeWidth={2.6} />
          <h2 className="text-lg font-semibold">Inactive Members</h2>
        </div>

        <ul>
          {inActive.count === 0 && (
            <div className="text-gray-400 h-full">
              <h3>No member available !</h3>
              <UserX
                className="absolute top-1/2 left-1/2 -translate-1/2"
                size={80}
              />
            </div>
          )}
          {inActive.list.map((m, i) => (
            <li
              key={m.mid}
              className={`flex items-center gap-1 justify-between ${inActive.count - 1 !== i && "border-b"} border-gray-300 py-2`}
            >
              <div>
                <h2>{m.name}</h2>
                <p className="text-sm text-gray-600">{m.mid}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDelAction({
                    message: "Are you sure want to delete this member?",
                    mid: m.mid,
                  });
                }}
                className="cursor-pointer"
              >
                <Trash size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Overloaded Members */}
      <div
        id="overloadedMembers"
        className="bg-white px-3 py-2 rounded-md space-y-3 shadow-md basis-80 grow shrink-0 min-h-92 relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <SearchAlert aria-hidden="true" size={26} strokeWidth={2.6} />
            <h2 className="text-lg font-semibold">Overloaded Members</h2>
          </div>
          <Dropdown
            total={overloaded.count}
            size={4}
            setFn={setFilteredOverloaded}
            list={overloaded.list}
          />
        </div>

        <ul className="space-y-1">
          {overloaded.count === 0 && (
            <div className="text-gray-400 h-full">
              <h3>No member available !</h3>
              <UserX
                className="absolute top-1/2 left-1/2 -translate-1/2"
                size={80}
              />
            </div>
          )}
          {filteredOverloaded.map((m) => (
            <li
              key={m.mid}
              className="border border-gray-300 rounded-sm px-1 py-0.5 space-y-1"
            >
              <div className="flex items-center gap-0.5">
                <User size={20} strokeWidth={2.4} />
                <h3 className="font-semibold">
                  {m.name} - {m.mid}
                </h3>
              </div>

              <ul className="text-sm">
                {m.role.map((p) => (
                  <li key={p.projectID}>
                    <p className="text-gray-600">
                      {truncateText(p.project, 20)} - {p.projectID}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamAlertsSection;
