import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Later, replace this with real API fetch
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/names"); // replace with your real API
        const data = await res.json();

        // Transform data to Chart.js format
        const years = data.years;
        const datasets = data.names.map((nameEntry) => ({
          label: nameEntry.name,
          data: nameEntry.counts,
          borderColor: getRandomColor(),
          fill: false,
        }));

        setChartData({
          labels: years,
          datasets,
        });
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    };

    fetchData();
  }, []);

  const getRandomColor = () => {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Baby Name Trends Over Time</h2>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Dashboard;
