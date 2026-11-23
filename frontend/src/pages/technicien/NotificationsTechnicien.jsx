import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./Notificationstechnicien.css";
import logo3 from "../../assets/profil-image.svg";

export default function NotificationsTechnicien() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/accounts/notifications/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `http://localhost:8000/api/accounts/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error("Erreur lors du marquage de la notification :", error);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/accounts/notifications/${id}/delete/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la notification :",
        error
      );
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.ticket_id) {
      console.warn("Cette notification ne contient pas de ticket_id :", notif);
      return;
    }

    navigate(`/technicien/dashboard/tickets/${notif.ticket_id}`);
  };

  return (
    <div className=" notif p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <br />

      <ul className="notifications-list space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`notification-item border p-4 rounded ${
              notif.lu ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center ">
              <div>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={
                      notif?.employe_photo
                        ? `http://localhost:8000${notif.employe_photo}`
                        : logo3
                    }
                    alt="Profil"
                    className="ticket-profil w-8 h-8 rounded-full border"
                  />

                  <div>
                    <p className="ppp ticket-categorie text-sm font-medium">
                      Demande faite par : {notif.employe_username}
                    </p>
                  </div>
                </div>

                <p
                  className=" ticket-categorie text-blue-600 hover:underline cursor-pointer"
                  onClick={() => handleNotifClick(notif)}
                >
                  {notif.message}
                </p>

                <small className="ticket-categorie text-gray-500">
                  {new Date(notif.date_creation).toLocaleString()}
                </small>
              </div>

              <div className="icc flex flex-row items-center gap-4 ml-4">
                <button
                  onClick={() => markAsRead(notif.id)}
                  title="Marquer comme lue"
                  className={`icon-style text-green-600 hover:text-green-800 ${
                    notif.lu ? "invisible" : ""
                  }`}
                >
                  <FaCheck />
                </button>

                <button
                  onClick={() => deleteNotif(notif.id)}
                  title="Supprimer"
                  className="icon-position text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
