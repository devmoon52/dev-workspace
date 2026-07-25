import Chart from "react-apexcharts";

const ActivityPie = ({ mapedData }) => {
  const chartData = Object.entries(mapedData);

  const series = chartData.map(([, value]) => value.count);

  const labels = chartData.map(([key]) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  });

  const options = {
    labels,

    legend: {
      position: "bottom",
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} Activities`,
      },
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="donut" height={320} />
    </div>
  );
};

export default ActivityPie;
