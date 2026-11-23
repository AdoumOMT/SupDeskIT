import { useEffect, useState } from "react";
import axios from "axios";
import "../employe/Historique.css";

export default function TicketsTraites() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/accounts/tickets/technicien/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setTickets(
          response.data.filter((ticket) => ticket.statut === "resolu")
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des tickets traités",
          error
        );
      }
    };

    fetchTickets();
  }, []);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const openImageModal = (imageUrl) => {
    setImageSrc(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => setIsImageModalOpen(false);

  return (
    <div className="traite-container">
      <h2 className="text-2xl font-bold">Tickets Traités</h2>
      <br />
      {tickets.length === 0 ? (
        <p>Aucun ticket résolu pour le moment.</p>
      ) : (
        <div className="overflow-x-auto w-[80%]">
          <table
            className="tickets-table"
            style={{ width: "85%", marginLeft: "0" }}
          >
            <thead>
              <tr>
                <th>Objet</th>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.objet}</td>
                  <td>{ticket.categorie}</td>
                  <td>{ticket.description}</td>
                  <td>{new Date(ticket.date_creation).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-consulter"
                      onClick={() => openModal(ticket)}
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="d3">Détails du ticket</h3>
            <p>
              <strong>Objet :</strong> {selectedTicket.objet}
            </p>
            <p>
              <strong>Description :</strong> {selectedTicket.description}
            </p>
            <p>
              <strong>Commentaire technicien :</strong>{" "}
              {selectedTicket.commentaire_tech || "Aucun"}
            </p>
            <p>
              <strong>Créé le :</strong>{" "}
              {new Date(selectedTicket.date_creation).toLocaleString()}
            </p>

            {selectedTicket.fichier && (
              <div>
                <strong>Fichier :</strong>
                <button
                  onClick={() =>
                    openImageModal(
                      `http://localhost:8000${selectedTicket.fichier}`
                    )
                  }
                  className="btn-voir-fichier"
                >
                  Voir fichier
                </button>
              </div>
            )}
            <button className="btn-fermer" onClick={closeModal}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {isImageModalOpen && imageSrc && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content">
            <img
              src={imageSrc}
              alt="Fichier joint"
              style={{ maxWidth: "100%" }}
            />
            <button className="btn-fermer" onClick={closeImageModal}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
