 import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ChartPage.css";
import "../styles/Animations.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartPage() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState("all");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/json/aggregate.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load baby name data.");
        return res.json();
      })
      .then((data) => {
        const selectedData =
          gender === "M"
            ? data.maleData
            : gender === "F"
            ? data.femaleData
            : mergeGenderData(data.maleData, data.femaleData);

        const labels = Object.keys(selectedData).sort();
        const latestYear = labels[labels.length - 1];

        const topNames = Object.entries(selectedData[latestYear]?.names || {})
          .filter(([name]) =>
            name.toLowerCase().startsWith(nameFilter.toLowerCase())
          )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name]) => name);

        const datasets = topNames.map((name) => {
          const counts = labels.map(
            (year) => selectedData[year]?.names?.[name] || 0
          );

          return {
            label: name,
            data: counts,
            borderColor: getRandomColor(),
            backgroundColor: "transparent",
            tension: 0.4,
          };
        });

        setChartData({ labels, datasets });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [gender, nameFilter]);

  const mergeGenderData = (maleData, femaleData) => {
    const merged = { ...maleData };
    for (const year in femaleData) {
      if (!merged[year]) merged[year] = { names: {} };
      for (const name in femaleData[year].names) {
        merged[year].names[name] =
          (merged[year].names[name] || 0) + femaleData[year].names[name];
      }
    }
    return merged;
  };

  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

  const exportToImage = () => {
    const chartArea = document.querySelector(".chart-container");
    html2canvas(chartArea).then((canvas) => {
      const link = document.createElement("a");
      link.download = "baby_names_chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const exportToPDF = () => {
    const chartArea = document.querySelector(".chart-container");
    html2canvas(chartArea).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
      pdf.save("baby_names_chart.pdf");
    });
  };

  if (loading) return <p className="fade-in">⏳ Loading chart...</p>;
  if (error)
    return (
      <p className="error fade-in">
        ❌ Error loading chart: <strong>{error}</strong>
      </p>
    );

  return (
    <div className="chart-container page-wrapper fade-in">
      <h2 className="animated-title">Baby Name Popularity Over Time</h2>

      <div className="controls">
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="all">All Genders</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>

        <input
          type="text"
          placeholder="Search by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <button onClick={exportToImage}>📸 Export PNG</button>
        <button onClick={exportToPDF}>🧾 Export PDF</button>
      </div>

      <Line data={chartData} />
    </div>
  );
}

export default ChartPage;
