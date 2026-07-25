import Chart from "react-apexcharts";
import { DollarSign } from "lucide-react";
import { revenueData } from "../../data/chartData";

const Revenue = () => {
  const weekly = revenueData.slice(-7);

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: weekly.map((d) => d.date),

      labels: {
        formatter: (value) => {
          if (!value) return "";
          return value.split("/")[0];
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (value >= 1000) {
            const result = value / 1000;

            return Number.isInteger(result)
              ? result + "K"
              : result.toFixed(1) + "K";
          }

          return value;
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#215B63"],
    grid: {
      strokeDashArray: 4,
    },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const item = weekly[dataPointIndex];

        return `
      <div style="
        padding:10px;
        background:white;
        border-radius:8px;
        box-shadow:0 4px 12px rgba(0,0,0,0.1)
      ">
        <div style="font-weight:600">${item.date}</div>
        <div>Revenue: ${item.earning}</div>
      </div>
    `;
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: weekly.map((d) => {
        return d.earning;
      }),
    },
  ];
  return (
    <div className="sm:basis-140 sm:shrink-0 grow bg-white shadow-md rounded-lg flex flex-col">
      <div className="px-2 mt-2">
        <h2 className="text-xl sm:px-0 font-semibold flex items-center gap-1 text-[#67C090]">
          <DollarSign aria-hidden="true" strokeWidth={2.6} />
          <span>Weekly Revenue</span>
        </h2>
        <p className="text-gray-600 text-sm">Last week analytics</p>
      </div>

      <div className="flex-1 w-full sm:aspect-video aspect-4/3">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </div>
  );
};

export default Revenue;
