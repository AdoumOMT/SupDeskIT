import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import logo from "../assets/SupDesktIT.svg";
import logo3 from "../assets/profil-image.svg";
import { FaBell, FaFileAlt, FaHistory } from "react-icons/fa";
import "./DashboardEmploye.css";
import ModalProfil from "../pages/employe/ModalProfil";

export default function DashboardEmploye() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const searchRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const searchItems = [
    { label: "Nouvelle Demande", path: "demande" },
    { label: "Historique", path: "" },
    { label: "Notifications", path: "notifications" },
    { label: "Modifier Profil", action: "profile" },
    { label: "Déconnexion", action: "logout" },
  ];

  const filteredResults = searchTerm
    ? searchItems.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/select-login");
  };

  const handleSearchResult = (result) => {
    if (result.action === "profile") {
      setIsModalOpen(true);
    } else if (result.action === "logout") {
      handleLogout();
    } else {
      navigate(result.path);
    }

    setSearchTerm("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Token ${token}`,
    };

    axios
      .get("http://localhost:8000/api/accounts/profile/", { headers })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Erreur de récupération du profil :", err));

    axios
      .get("http://localhost:8000/api/accounts/notifications/unread_count/", {
        headers,
      })
      .then((res) => setUnreadCount(res.data.unread_count))
      .catch((err) =>
        console.error("Erreur de récupération des notifications :", err)
      );

    const handleClickOutside = (event) => {
      if (!event.target.closest(".group")) {
        setShowProfileOptions(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen m-0 w-full">
      <div className="container">
        <aside className="navbar w-72 bg-[#2c3e50] text-white fixed left-0 top-0 bottom-0 h-screen flex flex-col p-6 shadow-lg z-50">
          <div className="position-haut">
            <div className="logo-sidebar flex flex-col items-center mb-10">
              <img
                src={logo}
                alt="Logo"
                className="img-sidebar object-contain mb-3"
              />
            </div>

            <nav className="position-navigation flex flex-col gap-4">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FaHistory /> Historique
              </NavLink>

              <NavLink
                to="demande"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FaFileAlt /> Nouvelle Demande
              </NavLink>

              <NavLink
                to="notifications"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FaBell /> Notification
              </NavLink>
            </nav>
          </div>
        </aside>

        <div className="contenu">
          <div className="position-logo-header flex justify-end items-center gap-4 pr-6 pt-4 pb-4 shadow-md">
            <div ref={searchRef} className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="position-recherche"
              />

              {filteredResults.length > 0 && (
                <div className="style-liste-recherche absolute top-16 right-32 bg-white shadow-md rounded-md border border-gray-200 z-50 w-100 max-h-60 overflow-auto">
                  {filteredResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearchResult(result)}
                      className="posi px-4 py-2 hover:bg-[#d1d9e0] hover:text-white cursor-pointer"
                    >
                      {result.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="position-icon-logo-style relative cursor-pointer"
              onClick={() => navigate("notifications")}
              title="Voir les notifications"
            >
              <FaBell
                style={{ fontSize: "22px" }}
                className="color-icon-style text-white hover:text-[#d1d9e0]"
              />

              {unreadCount > 0 && (
                <span className="color-notif-style absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[14px] px-1 py-0.5 rounded-full shadow-md">
                  {unreadCount}
                </span>
              )}
            </div>

            <div
              className="grid items-center gap-2 cursor-pointer group"
              onClick={() => setShowProfileOptions(!showProfileOptions)}
              title="Options du profil"
            >
              <img
                src={user?.photo ? `http://localhost:8000${user.photo}` : logo3}
                alt="profil"
                className="img-profil w-6 h-6 rounded-full border-4 border-white object-cover mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-80"
              />

              <h2 className="taille-text text-lg font-semibold text-center">
                {user?.username || "Chargement..."}
              </h2>
            </div>

            {showProfileOptions && (
              <div className="option-profil absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setShowProfileOptions(false);
                  }}
                  className="bouton-option-profil block w-full text-left text-gray-800 hover:bg-gray-100"
                >
                  Modifier Profil
                </button>

                <button
                  onClick={() => {
                    setShowProfileOptions(false);
                    handleLogout();
                  }}
                  className="bouton-option-profil block w-full text-left text-gray-800 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          <main className="min-h-screen w-full flex bg-white">
            <div className="contenu-main">
              <Outlet />

              {isModalOpen && (
                <>
                  <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40"></div>

                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <ModalProfil
                      user={user}
                      onClose={() => setIsModalOpen(false)}
                      onUpdate={(updatedData) => setUser(updatedData)}
                    />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
