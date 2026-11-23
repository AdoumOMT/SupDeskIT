import { useEffect, useState } from "react";
import axios from "axios";
import "./Historique.css";

export default function Historique() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [updatedTicket, setUpdatedTicket] = useState({
    objet: "",
    description: "",
    categorie: "",
    fichier: null,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/accounts/tickets/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        setTickets(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des tickets :", err);
      }
    };

    fetchTickets();
  }, []);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);

    setUpdatedTicket({
      objet: ticket.objet || "",
      description: ticket.description || "",
      categorie: ticket.categorie || "",
      fichier: null,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setUpdatedTicket((prev) => ({
      ...prev,
      fichier: file || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTicket) return;

    const data = new FormData();
    data.append("objet", updatedTicket.objet);
    data.append("description", updatedTicket.description);
    data.append("categorie", updatedTicket.categorie);

    if (updatedTicket.fichier) {
      data.append("fichier", updatedTicket.fichier);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/accounts/tickets/${selectedTicket.id}/`,
        data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === selectedTicket.id ? response.data : ticket
        )
      );

      closeModal();
    } catch (err) {
      console.error(
        "Erreur lors de la modification du ticket :",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="historique-container">
      <h2 className="text-2xl font-bold">Historique des Tickets</h2>
      <br />

      <div className="tickets-list cursor-pointer" title="Modifier le Tickets">
        {tickets.length === 0 ? (
          <p>Aucun ticket trouvé</p>
        ) : (
          tickets.map((ticket) => (
            <div
              className="ticket-card"
              key={ticket.id}
              onClick={() => openModal(ticket)}
            >
              <div className="ticket-info">
                <h3 className="ticket-title">Ticket #{ticket.id}</h3>

                <p className="ticket-description">{ticket.description}</p>

                <p className="ticket-status">
                  Statut: <strong>{ticket.statut}</strong>
                </p>
              </div>

              <div className="ticket-date">
                <p>
                  Date de création:{" "}
                  {new Date(ticket.date_creation).toLocaleString()}
                </p>

                <p>
                  Date de mise à jour:{" "}
                  {new Date(ticket.date_modification).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content ">
            <h2>Modifier le Ticket</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Catégorie:
                <select
                  name="categorie"
                  value={updatedTicket.categorie}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded position-inputdemande position-inputdemande2 mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                >
                  <option value="réseau">Réseau</option>
                  <option value="matériel">Matériel</option>
                  <option value="logiciel">Logiciel</option>
                </select>
              </label>

              <label>
                Objet:
                <input
                  type="text"
                  name="objet"
                  value={updatedTicket.objet}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded position-inputdemande position-inputdemande2 mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                />
              </label>

              <label>
                Description:
                <textarea
                  name="description"
                  value={updatedTicket.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded position-inputdemande position-inputdemande2 mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                />
              </label>

              <label>
                Pièce jointe:
                <input
                  type="file"
                  name="fichier"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded position-inputdemande position-inputdemande2 mb-4 px-4 py-4 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
                />
              </label>

              <button className="bg-[#000] hover:bg-[#2c3e50]" type="submit">
                Sauvegarder
              </button>

              <button
                className="bg-[#000] hover:bg-[#2c3e50]"
                type="button"
                onClick={closeModal}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
