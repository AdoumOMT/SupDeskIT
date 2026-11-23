import { useState } from "react";
import axios from "axios";
import "./ModalProfil.css";

export default function ModalProfil({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const data = new FormData();

    data.append("username", formData.username);
    data.append("email", formData.email);

    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    if (formData.password) {
      data.append("password", formData.password);
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/accounts/profile/update/",
        data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      alert("Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Modifier le profil</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4 bg-white p-8 rounded-2xl shadow-xl"
        >
          <input
            className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1] "
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
          />

          <input
            className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1] "
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1] "
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nouveau mot de passe (laisser vide si inchangé)"
          />

          <input
            className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]  "
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmer le mot de passe"
          />

          <input
            className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1] "
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 bg-[#000] hover:bg-[#2c3e50]"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded bg-[#000] hover:bg-[#2c3e50]"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
