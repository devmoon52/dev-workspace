import { useSelector } from "react-redux";
import StatsCard from "./StatsCard";
import { calculatedMembers } from "../redux/selector/memberSelector";
import { UserCheck, UserPlus, Users, UserX } from "lucide-react";
import { useMemo } from "react";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { motion } from "motion/react";

const TeamMemberMatrics = () => {
  const { total, available, active, inActive } = useSelector(calculatedMembers);
  const { isDraggable, ref, constraints, x } = useHorizontalDrag();

  const matrics = useMemo(() => {
    return [
      {
        id: 1,
        count: {
          previousWeek: 10,
          current: total.count,
        },
        text: "Total Members",
        Icon: Users,
      },
      {
        id: 2,
        count: {
          previousWeek: 4,
          current: active.count,
        },
        text: "Active Members",
        Icon: UserCheck,
      },
      {
        id: 3,
        count: {
          previousWeek: 0,
          current: inActive.count,
        },
        text: "Inactive Members",
        Icon: UserX,
      },
      {
        id: 4,
        count: {
          previousWeek: 0,
          current: available.count,
        },
        text: "Available Members",
        Icon: UserPlus,
      },
    ];
  }, [total, available, active, inActive]);

  return (
    <div>
      <motion.ul
        ref={ref}
        drag={isDraggable ? "x" : false}
        dragConstraints={{ left: -constraints, right: 0 }}
        style={{ x }}
        className={`flex gap-4 ${isDraggable && "cursor-grab active:cursor-grabbing"}`}
      >
        {matrics.map((d) => (
          <li key={d.id}>
            <StatsCard data={d} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default TeamMemberMatrics;
