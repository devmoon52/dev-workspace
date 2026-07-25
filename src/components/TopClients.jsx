import Top from "./Top";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";

const TopClients = () => {
  const { total } = useSelector(calculatedProjects);
  const { total_clients } = useSelector((state) => state.clients);

  const clientCountMap = total.list.reduce((acc, project) => {
    const { clientID } = project;

    if (!acc[clientID]) {
      const client = total_clients.find((c) => c.clientID === clientID);

      acc[clientID] = {
        clientID,
        count: 0,
        name: client?.name,
      };
    }

    acc[clientID].count++;

    return acc
  }, {});
  
  const topClients = Object.values(clientCountMap).sort((a, b) => b.count - a.count)

  return (
    <section className="@container min-w-75">
      <div className="@3xl:w-1/2 w-full">
        <Top list={topClients.slice(0, 5)} type={"clients"} text={"Top Clients"} />
      </div>
    </section>
  );
};

export default TopClients;
