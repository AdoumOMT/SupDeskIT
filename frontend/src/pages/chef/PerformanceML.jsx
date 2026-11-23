import { useEffect, useState } from "react";
import axios from "axios";
import "./PerformanceML.css";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const PerformanceML = () => {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8000/api/accounts/rapport_ml/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement du rapport ML :", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="performance-loader">Chargement des performances...</div>
    );
  }

  const classLabels = Object.keys(data).filter((key) =>
    ["haute", "moyenne", "basse"].includes(key)
  );

  const precision = classLabels.map((cls) => data[cls].precision);
  const recall = classLabels.map((cls) => data[cls].recall);
  const f1 = classLabels.map((cls) => data[cls]["f1-score"]);
  const avgAccuracy = data["accuracy"];

  return (
    <div className="performance-container">
      <div className="performance-header">
        <h2>Performance du Modèle ML</h2>

        <button
          className="refresh-btn"
          onClick={fetchData}
          disabled={refreshing}
        >
           {refreshing ? "Mise à jour..." : "Rafraîchir"}
        </button>
      </div>

      <div className="metric-block">
        <p>
          <strong>Exactitude globale (Accuracy):</strong>{" "}
          {(avgAccuracy * 100).toFixed(2)}%
        </p>
      </div>

      <div className="charts-container">
        <div className="chart chat1">
          <br />
          <Bar
            data={{
              labels: classLabels,
              datasets: [
                {
                  label: "Précision",
                  data: precision,
                  backgroundColor: "rgba(75, 192, 192, 0.7)",
                },
                {
                  label: "Rappel",
                  data: recall,
                  backgroundColor: "rgba(255, 159, 64, 0.7)",
                },
                {
                  label: "F1-Score",
                  data: f1,
                  backgroundColor: "rgba(153, 102, 255, 0.7)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
              scales: {
                y: {
                  min: 0,
                  max: 1,
                  ticks: {
                    callback: (val) => `${(val * 100).toFixed(0)}%`,
                  },
                },
              },
            }}
          />
        </div>

        <div className="chart chart2">
          <Doughnut
            data={{
              labels: classLabels,
              datasets: [
                {
                  data: classLabels.map((cls) => data[cls].support),
                  backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                },
              ],
            }}
            options={{
              plugins: {
                legend: { position: "right" },
              },
            }}
          />

          <p className="chart-label">
            <b>Répartition des exemples par classe</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceML;
