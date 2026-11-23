import { useEffect, useState } from "react";
import axios from "axios";
import "./Statistiques.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#50C3CC"];

export default function Statistiques() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/accounts/tickets/statistiques/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <div className="loading">Chargement des statistiques...</div>;
  }

  const formatCount = (items, key) =>
    items.map((item) => ({
      name: item[key] || "Non assigné",
      value: item.count,
    }));

  const prioriteData = formatCount(data.par_priorite, "priorite");

  return (
    <div className="stats-container">
      <h2 className="text-xl font-bold mb-4">
        Statistiques Générales des Tickets
      </h2>
      <br />

      <div className="counters">
        <div className="card">
          Total : <strong>{data.total}</strong>
        </div>

        {data.par_statut.map((s) => (
          <div key={s.statut} className="card">
            {s.statut} : <strong>{s.count}</strong>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="row-charts">
          <div className="chart-card">
            <h3 className="card3">Répartition par Priorité</h3>

            <PieChart width={250} height={250}>
              <Pie
                data={prioriteData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {prioriteData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="chart-card">
            <h3 className="card2">Répartition des tickets assignés</h3>

            <BarChart
              width={275}
              height={250}
              data={formatCount(data.par_technicien, "technicien_nom")}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#50C3CC" />
            </BarChart>
          </div>
        </div>

        {data.par_poste && (
          <div className="chart-card">
            <h3>Répartition des Pannes par Poste</h3>
            <br />

            <BarChart
              width={900}
              height={250}
              data={data.par_poste.map((p) => ({
                name: p.poste || "Non défini",
                value: p.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        )}

        {data.par_categorie && (
          <div className="chart-card">
            <h3>Répartition par Catégorie</h3>

            <LineChart
              width={1000}
              height={300}
              data={formatCount(data.par_categorie, "categorie")}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </div>
        )}

        {data.par_date && (
          <div className="chart-card">
            <h3>Évolution des Tickets (par date)</h3>

            <LineChart width={900} height={300} data={data.par_date}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </div>
        )}

        {data.courbe_mixte && (
          <div className="chart-card">
            <h3>Vue Globale : Temps moyen, Backlog & Taux de résolution</h3>

            <ResponsiveContainer width={900} height={350}>
              <LineChart data={data.courbe_mixte}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />

                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Tickets / Jours",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Taux %",
                    angle: 90,
                    position: "insideRight",
                  }}
                />

                <Tooltip />
                <Legend />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temps_moyen"
                  stroke="#8884d8"
                  name="Temps moyen (jours)"
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="backlog_en_attente"
                  stroke="#FF8042"
                  name="En attente"
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="backlog_en_cours"
                  stroke="#50C3CC"
                  name="En cours"
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="taux_resolution"
                  stroke="#00C49F"
                  name="Taux résolution (%)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
