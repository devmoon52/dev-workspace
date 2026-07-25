import {
  Clock4,
  DollarSign,
  File,
  Folders,
  SquareUser,
  UsersRound,
} from "lucide-react";
import { filter } from "../utils/short";
import { useSelector } from "react-redux";
import { revenueData } from "../data/chartData";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { motion } from "motion/react";
import StatsCard from "./StatsCard";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { useEffect, useMemo } from "react";
import { calculatedMembers } from "../redux/selector/memberSelector";

const OverviewMatrics = () => {
  const dragStats = useHorizontalDrag();
  const { pending, running } = useSelector(calculatedProjects);
  const clients = useSelector((state) => state.clients.total_clients);
  const { active, total } = useSelector(calculatedMembers);

  const matrics = useMemo(() => {
    return [
      {
        id: 1,
        count: {
          previousWeek: 60,
          current: pending.count,
        },
        text: "Pending Projects",
        Icon: Clock4,
      },
      {
        id: 2,
        count: {
          previousWeek: revenueData[revenueData.length - 7 + 1]?.earning,
          current: revenueData[revenueData.length - 1]?.earning,
        },
        text: "Current Revenue",
        Icon: DollarSign,
      },
      {
        id: 3,
        count: {
          previousWeek: filter(clients, (c) => !c.isActive).length,
          current: filter(clients, (c) => c.isActive).length,
        },
        text: "Active Clients",
        Icon: SquareUser,
      },
      {
        id: 4,
        count: {
          previousWeek: 4,
          current: active.count,
        },
        text: "Active Team members",
        Icon: UsersRound,
      },
      {
        id: 5,
        count: {
          previousWeek: 12,
          current: running.count,
        },
        text: "Running Projects",
        Icon: Folders,
      },
    ];
  }, [pending, running, active, total, clients]);

  return (
    <motion.div
      ref={dragStats.ref}
      drag={dragStats.isDraggable ? "x" : false}
      style={{ x: dragStats.x }}
      dragConstraints={{ left: -dragStats.constraints, right: 0 }}
      className={`flex gap-4 ${dragStats.isDraggable && "cursor-grab active:cursor-grabbing"}`}
    >
      {matrics.map((matric) => {
        return <StatsCard data={matric} key={matric.id} />;
      })}
    </motion.div>
  );
};

export default OverviewMatrics;
