import { motion } from "motion/react";
import { useHorizontalDrag } from "../utils/useHorizontalDrag";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { Users } from "lucide-react";
import StatsCard from "./StatsCard";

const ClientMatrics = () => {
  const { isDraggable, ref, constraints, x } = useHorizontalDrag();
  const { total_clients } = useSelector((state) => state.clients);

  const clientMap = useMemo(() => {
    const map = {
      active: { count: 0 },
      inActive: { count: 0 },
    };

    for (const client of total_clients) {
      if (client.isActive) {
        map["active"].count++;
      }
      if (!client.isActive) {
        map["inActive"].count++;
      }
    }

    return map;
  }, [total_clients]);

  const matrics = useMemo(() => {
    return [
      {
        id: 1,
        count: {
          previousWeek: 0,
          current: total_clients.length,
        },
        text: "Total Clients",
        Icon: Users,
      },
      {
        id: 2,
        count: {
          previousWeek: 0,
          current: clientMap.inActive.count,
        },
        text: "Inactive Clients",
        Icon: Users,
      },
      {
        id: 3,
        count: {
          previousWeek: 0,
          current: clientMap.active.count,
        },
        text: "Active Clients",
        Icon: Users,
      },
    ];
  }, []);

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

export default ClientMatrics;
