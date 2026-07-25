import StatsCard from "./StatsCard";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { useMemo } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { calculatedActivity } from "../redux/selector/activitySelector";
import { ClipboardCheck } from "lucide-react";

const ActivityMatrics = () => {
  const { ref, x, isDraggable, constraints } = useHorizontalDrag();
  const {
    newActivities,
    total,
    project,
    member,
    asset,
    reminder,
    message,
    setting,
  } = useSelector(calculatedActivity);

  const matrics = useMemo(() => {
    return [
      {
        id: 1,
        count: {
          previousWeek: 0,
          current: newActivities.count,
        },
        text: "New Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 2,
        count: {
          previousWeek: 15,
          current: total.count,
        },
        text: "Total Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 3,
        count: {
          previousWeek: 3,
          current: project.count,
        },
        text: "Project Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 4,
        count: {
          previousWeek: 2,
          current: member.count,
        },
        text: "Member Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 5,
        count: {
          previousWeek: 3,
          current: asset.count,
        },
        text: "Asset Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 6,
        count: {
          previousWeek: 3,
          current: reminder.count,
        },
        text: "Reminder Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 7,
        count: {
          previousWeek: 2,
          current: message.count,
        },
        text: "Message Activities",
        Icon: ClipboardCheck,
      },
      {
        id: 8,
        count: {
          previousWeek: 2,
          current: setting.count,
        },
        text: "Setting Activities",
        Icon: ClipboardCheck,
      },
    ];
  }, [
    newActivities,
    total,
    project,
    member,
    asset,
    reminder,
    message,
    setting,
  ]);

  return (
    <section>
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
    </section>
  );
};

export default ActivityMatrics;
