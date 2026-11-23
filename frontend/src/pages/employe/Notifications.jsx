import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

export default function NotificationsEmploye() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:8000/api/accounts/notifications/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
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
    const ticketIdMatch = notif.message.match(/ticket.*?:.*?(\d+)/i);

    if (ticketIdMatch) {
      navigate("/employe/dashboard");
    }
  };

  return (
    <div className="p-4">
      <h2 className="notif-position text-xl font-bold mb-4">
        Vos notifications
      </h2>

      <ul className="notifications-list">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`notification-item border p-4 rounded shadow-md ${
              notif.lu ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center ">
              <div>
                <p
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleNotifClick(notif)}
                >
                  {notif.message}
                </p>

                <small className="text-gray-500">
                  {new Date(notif.date_creation).toLocaleString()}
                </small>
              </div>

              <div className="flex flex-row items-center gap-4 ml-4">
                <button
                  onClick={() => markAsRead(notif.id)}
                  title="Marquer comme lue"
                  className={`icon-style text-green-600 hover:text-green-800 ${
                    notif.lu ? "invisible" : ""
                  }`}
                >
                  <FaCheck className="text-green-600 hover:text-green-800" />
                </button>

                <button
                  onClick={() => deleteNotif(notif.id)}
                  title="Supprimer"
                  className=" icon-position text-red-600 hover:text-red-800"
                >
                  <FaTrash className=" text-red-600 hover:text-red-800" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <br />
    </div>
  );
}
