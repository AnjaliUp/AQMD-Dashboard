import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Chart = ({ title, data, color, fieldIndex }) => {
  const recentData = data.slice(-10);

  const currentTimestamp = new Date(); // Current timestamp
  const labels = Array.from({ length: 10 }).map((_, i) => {
    const time = new Date(currentTimestamp);
    time.setHours(currentTimestamp.getHours() - (9 - i)); // Set hour intervals
    return time.toLocaleTimeString();
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: recentData.map((entry) => parseFloat(entry[`field${fieldIndex}`]) || 0),
        borderColor: color,
        backgroundColor: `${color}50`,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: title } },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;
