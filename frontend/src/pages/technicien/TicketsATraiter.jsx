import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "../employe/Historique.css";
import logo3 from "../../assets/profil-image.svg";

export default function TicketsATraiter() {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [highlightedId, setHighlightedId] = useState(null);
  const [updatedTicket, setUpdatedTicket] = useState({
    statut: "",
    commentaire_tech: "",
  });
  const [imageSrc, setImageSrc] = useState("");

  const ticketRefs = useRef({});

  const openModal = (ticket) => {
    setSelectedTicket(ticket);

    setUpdatedTicket({
      statut: ticket.statut,
      commentaire_tech: ticket.commentaire_tech || "",
    });

    setMessage("");
    setIsModalOpen(true);
  };

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

        const nonResolu = response.data.filter(
          (ticket) => ticket.statut !== "resolu"
        );

        setTickets(nonResolu);

        if (id) {
          const exists = nonResolu.some(
            (ticket) => String(ticket.id) === String(id)
          );
          if (!exists) {
            setMessage("Ticket introuvable ou déjà résolu.");
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tickets :", error);
      }
    };

    fetchTickets();
  }, [id]);

  useEffect(() => {
    if (id && tickets.length > 0) {
      const targetElement = ticketRefs.current[String(id)];

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setHighlightedId(String(id));

        const timer = setTimeout(() => {
          setHighlightedId(null);
        }, 2400);

        return () => clearTimeout(timer);
      }
    }
  }, [id, tickets]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8000/api/accounts/tickets/technicien/${selectedTicket.id}/traiter/`,
        updatedTicket,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (updatedTicket.statut === "resolu") {
        setTickets((prev) =>
          prev.filter((ticket) => ticket.id !== selectedTicket.id)
        );
      } else {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === selectedTicket.id
              ? { ...ticket, ...updatedTicket }
              : ticket
          )
        );
      }

      setIsModalOpen(false);
      setSelectedTicket(null);
      setMessage("✅ Mise à jour réussie");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setMessage("❌ Erreur lors de la mise à jour");
    }
  };

  const openImageModal = (imageUrl) => {
    setImageSrc(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImageSrc("");
  };

  return (
    <div className="historique-container">
      <h2 className="text-2xl font-bold">Tickets à traiter</h2>
      <br />

      {message && (
        <div
          className={`mb-5 px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-between transition-all ${
            message.startsWith(" ")
              ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300"
              : "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300"
          }`}
        >
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="!m-15 !p-15 !bg-transparent !border-0 text-current opacity-70 hover:opacity-100 font-bold text-lg leading-none cursor-pointer"
            title="Fermer"
          >
            ×
          </button>
        </div>
      )}

      <div className="tickets-list cursor-pointer">
        {tickets.length === 0 ? (
          <p>Aucun ticket à traiter</p>
        ) : (
          tickets.map((ticket) => (
            <div
              ref={(el) => (ticketRefs.current[String(ticket.id)] = el)}
              className={`ticket-card ${
                highlightedId === String(ticket.id) ? "ticket-flash" : ""
              }`}
              title="Modifier le ticket"
              key={ticket.id}
              onClick={(e) => {
                if (e.target.tagName !== "A") {
                  openModal(ticket);
                }
              }}
            >
              <div className="ticket-info">
                <div className="ticket-profil-img">
                  <img
                    src={
                      ticket?.employe_photo
                        ? `http://localhost:8000${ticket.employe_photo}`
                        : logo3
                    }
                    alt="Profil"
                    className="ticket-profil rounded-full"
                  />

                  <p className="ticket-name">{ticket.employe_username}</p>
                </div>

                <p className="ticket-categorie">
                  <b>Poste : </b>
                  {ticket.employe_poste}
                </p>

                <h3 className="ticket-title">
                  <b>Objet : </b>
                  {ticket.objet}
                </h3>

                <p className="ticket-categorie">
                  <b>Catégorie : </b>
                  {ticket.categorie}
                </p>

                <p className="ticket-categorie">
                  <b>Description : </b>
                  {ticket.description}
                </p>

                <div className="ticket-categorie">
                  <p className={`badge ${ticket.priorite}`}>
                    <b>Priorité : </b>
                    {ticket.priorite}
                  </p>
                </div>

                {ticket.fichier && (
                  <p className="ticket-fichier" title="Ouvrir l'image">
                    <b>Pièce-jointe : </b>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openImageModal(
                          `http://localhost:8000${ticket.fichier}`
                        );
                      }}
                    >
                      Ouvrir l'image
                    </a>
                  </p>
                )}

                <p className="ticket-status">
                  Statut : <strong>{ticket.statut}</strong>
                </p>
              </div>

              <div className="ticket-date">
                <p>Date : {new Date(ticket.date_creation).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isImageModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Image du Ticket</h2>

            <img
              src={imageSrc}
              alt="Ticket Attachment"
              className="ticket-image"
            />

            <button
              onClick={closeImageModal}
              className="bg-gray-300 p-2 rounded bg-[#000] hover:bg-[#2c3e50]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modalx">Mettre à jour le Ticket</h3>

            <form onSubmit={handleSubmit}>
              <label>
                Statut:
                <select
                  name="statut"
                  value={updatedTicket.statut}
                  onChange={handleChange}
                  className="position-input w-full border p-2 rounded mb-4 hover:bg-gray-100"
                >
                  <option value="en_attente" className="hover:bg-gray-100">
                    En attente
                  </option>

                  <option value="en_cours">En cours</option>

                  <option value="resolu">Résolu</option>
                </select>
              </label>

              <label>
                Ajouter un Commentaire:
                <textarea
                  name="commentaire_tech"
                  value={updatedTicket.commentaire_tech}
                  onChange={handleChange}
                  rows={3}
                  className="position-input border p-2 rounded mb-4"
                />
              </label>

              <button
                type="submit"
                className="bg-[#000] hover:bg-[#2c3e50] text-white p-2"
              >
                Mettre à jour
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="ml-2 p-2 bg-[#000] hover:bg-[#2c3e50]"
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
