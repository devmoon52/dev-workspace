import React from "react";
import Chart from "react-apexcharts";

const StoragePie = ({ storage }) => {
  const series = storage.map((d) => d.count);

  const options = {
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    labels: storage.map((d) => d.label),
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="bg-white rounded-md shadow-md py-2 grow basis-80 overflow-hidden">
      <Chart options={options} series={series} type="donut" width={"100%"} />
    </div>
  );
};

export default StoragePie;
