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

const Chart = ({ title, data, color }) => {
  // Extract and sanitize labels and data
  const labels = data.map((entry) => entry.time); // Extract labels
  const values = data
    .map((entry) => {
      if (entry.value === null || entry.value === undefined || isNaN(entry.value)) {
        console.warn("Invalid value detected:", entry.value);
        return null; // Filter out invalid values
      }
      return parseFloat(entry.value); // Convert to numbers
    })
    .filter((value) => value !== null); // Remove invalid entries

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: `${color}50`,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: { display: true, text: title },
        min: -1, // Set minimum Y-axis value
        max: 1,  // Set maximum Y-axis value
        ticks: {
          stepSize: 0.5, // Control the interval between ticks
          callback: (value) => value.toFixed(1), // Format tick labels
        },
      },
    },
  };

  console.log("Input data:", data);
  console.log("Processed chart data:", chartData);

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;
