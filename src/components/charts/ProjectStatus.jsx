import { FolderOpen } from "lucide-react";
import PieChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../../redux/selector/projectSelector";

const ProjectStatus = () => {
  const { pending, completed, running } = useSelector(calculatedProjects);

  const data = [
    { name: "Pending", value: pending.count, color: "#f87171" },
    { name: "Completed", value: completed.count, color: "#00C951" },
    { name: "Running", value: running.count, color: "#215B63" },
  ];

  const options = {
    chart: {
      type: "donut",
    },
    labels: data.map((d) => d.name),
    colors: data.map((d) => d.color),
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
        },
      },
    },
  };

  const series = data.map((d) => d.value);

  return (
    <div className="sm:basis-80 sm:shrink-0 grow flex flex-col gap-1 justify-center items-center rounded-lg shadow-md w-full bg-white sm:py-0 py-5 ">
      <div className="flex items-center gap-1.5">
        <FolderOpen
          aria-hidden="true"
          size={26}
          strokeWidth={2.4}
          color="#364153"
        />
        <h2 className="text-lg font-semibold text-gray-700">Project Status</h2>
      </div>
      <div className="lg:w-[85%] xl:w-[80%]">
        <PieChart
          series={series}
          options={options}
          type="donut"
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default ProjectStatus;
