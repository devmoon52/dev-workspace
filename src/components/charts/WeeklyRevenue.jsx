import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { revenueData } from "../../data/chartData";

const WeeklyRevenue = ({ week }) => {
  const [currentData, setCurrentData] = useState(revenueData.slice(-7));

  useEffect(() => {
    if (week === "current") {
      setCurrentData(revenueData.slice(-7));
    } else if (week === "previous") {
      setCurrentData(revenueData.slice(-14, -7));
    } else {
      setCurrentData(revenueData.slice(-21, -14));
    }
  }, [week]);

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: currentData.map((d) => d.date),

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
        const item = currentData[dataPointIndex];

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
      data: currentData.map((d) => {
        return d.earning;
      }),
    },
  ];

  return (
    <div className="aspect-4/2">
      <Chart options={options} series={series} type="area" height="100%" />
    </div>
  );
};

export default WeeklyRevenue;
