import { useEffect, useState } from "react";
import axios from "axios";
import "./VueTickets.css";

export default function VueTickets() {
  const [tickets, setTickets] = useState([]);
  const [filtre, setFiltre] = useState({
    statut: "",
    priorite: "",
    technicien_id: "",
    technicien_username: "",
    employe_username: "",
    employe_poste: "",
  });

  useEffect(() => {
    fetchTickets();
  }, [filtre]);

  const fetchTickets = () => {
    axios
      .get("http://localhost:8000/api/accounts/tickets/tous/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        params: filtre,
      })
      .then((res) => setTickets(res.data))
      .catch((err) => console.error(err));
  };

  const exportTickets = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/accounts/tickets/export/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "tickets_export.csv");

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Erreur lors de l'export CSV :", error);
      });
  };

  return (
    <div className="vue-tickets-container">
      <div className="header-section">
        <h1 className="title">Vue Globale des Tickets</h1>
        <button
          onClick={exportTickets}
          className="export-btn bg-[#00acc1] hover:bg-[#00838F]"
        >
          Exporter CSV
        </button>
      </div>

      <div className="filters">
        <select
          value={filtre.statut}
          onChange={(e) => setFiltre({ ...filtre, statut: e.target.value })}
        >
          <option value="">-- Statut --</option>
          <option value="en_attente">En attente</option>
          <option value="en_cours">En cours</option>
          <option value="resolu">Résolu</option>
        </select>

        <select
          value={filtre.priorite}
          onChange={(e) => setFiltre({ ...filtre, priorite: e.target.value })}
        >
          <option value="">-- Priorité --</option>
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Objet</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Technicien</th>
              <th>Emetteur</th>
              <th>Poste</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.objet}</td>
                <td>{ticket.categorie}</td>
                <td>{ticket.statut}</td>
                <td>{ticket.priorite}</td>
                <td>{ticket.technicien_username || "Non assigné"}</td>
                <td>{ticket.employe_username || "Non défini"}</td>
                <td>{ticket.employe_poste || "Non défini"}</td>
                <td>{new Date(ticket.date_creation).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
