import Chart from "react-apexcharts";

const ActivityBar = ({ filteredByDay }) => {
  const chartData = Object.entries(filteredByDay).map(([day, value]) => ({
    day: `Day ${day}`,
    count: value.count,
  }));

  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "55%",
      },
    },

    xaxis: {
      categories: chartData.map((d) => d.day),
    },

    yaxis: {
      min: 0,
      forceNiceScale: true,
    },

    colors: ["#215B63"],

    tooltip: {
      y: {
        formatter: (value) => `${value} Activities`,
      },
    },
  };

  const series = [
    {
      name: "Activities",
      data: chartData.map((d) => d.count),
    },
  ];

  return (
    <div className="sm:h-80 h-60 xl:h-100 w-full">
      <Chart options={options} series={series} type="bar" width={"100%"} height="100%" />
    </div>
  );
};

export default ActivityBar;
