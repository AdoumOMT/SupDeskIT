import { useEffect, useState } from "react";
import axios from "axios";
import "./Assignation.css";
import UserModal from "./UserModal";

export default function Assignation() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8000/api/accounts/users/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const fetchUnassignedTickets = () => {
    axios
      .get("http://localhost:8000/api/accounts/tickets/tous/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const unassigned = res.data.filter(
          (ticket) => ticket.technicien === null
        );
        setTickets(unassigned);
      })
      .catch((err) => console.error(err));
  };

  const handleAssign = (ticketId, technicienId) => {
    if (!technicienId) return;

    axios
      .put(
        `http://localhost:8000/api/accounts/tickets/${ticketId}/changer_technicien/`,
        {
          technicien_id: technicienId,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => fetchUnassignedTickets())
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
    fetchUnassignedTickets();
  }, []);

  return (
    <div className="assignation-container">
      <h2 className="text-xl font-bold mb-4">Gestion des Utilisateurs</h2>

      <button
        className="add-button bg-[#00acc1] hover:bg-[#00838f]"
        onClick={() => {
          setSelectedUser(null);
          setShowModal(true);
        }}
      >
        + Ajouter un utilisateur
      </button>

      <div className="user-list" title="Modifier utilisateur">
        {users.map((user) => (
          <div
            className="user-card"
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setShowModal(true);
            }}
          >
            <p>
              <strong>{user.username}</strong>
            </p>
            <p>{user.role}</p>
          </div>
        ))}
      </div>
      <br />

      <h2 className="text-xl font-bold mb-4">Assignation des Tickets</h2>

      <div className="tickets-section">
        {tickets.length === 0 ? (
          <p>Aucun ticket à assigner.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <h4>{ticket.objet}</h4>

              <p className="des">{ticket.description}</p>

              <div className="ass">
                <select
                  onChange={(e) => handleAssign(ticket.id, e.target.value)}
                >
                  <option value="">-- Assigner un technicien --</option>

                  {users
                    .filter((u) => u.role === "technicien")
                    .map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.username}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
