import { useState, useEffect } from "react";
import axios from "axios";
import "./Assignation.css";

export default function UserModal({ user, onClose }) {
  const isEdit = Boolean(user);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "employe",
    poste: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        password: "",
        confirmPassword: "",
        email: user.email || "",
        role: user.role || "employe",
        poste: user.poste || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (loading) return;

    setError("");
    setLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const url = isEdit
      ? `http://localhost:8000/api/accounts/update/${formData.username}/`
      : "http://localhost:8000/api/accounts/create/";

    const method = isEdit ? "put" : "post";

    const payload = { ...formData };

    delete payload.confirmPassword;

    if (isEdit && !payload.password) {
      delete payload.password;
    }

    if (payload.role !== "employe") {
      delete payload.poste;
    }

    axios[method](url, payload, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setLoading(false);
        onClose();
      })
      .catch((err) => {
        setLoading(false);

        if (err.response?.status === 409) {
          setError("Ce nom d'utilisateur est déjà utilisé.");
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError("Erreur serveur. Veuillez réessayer.");
        }
      });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal">
        <h3 className="modalx">
          {isEdit
            ? "Modification utilisateur"
            : "Ajouter un nouvel utilisateur"}
        </h3>

        {error && <div className="error-message">{error}</div>}

        <input
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
          className="position-input int text-gray-600"
          disabled={isEdit}
        />

        <input
          name="password"
          type="password"
          placeholder={
            isEdit ? "Nouveau mot de passe (optionnel)" : "Mot de passe"
          }
          value={formData.password}
          className="position-input"
          onChange={handleChange}
        />

        <input
          className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]  "
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirmer le mot de passe"
        />

        <select
          name="role"
          value={formData.role}
          className="position-input"
          onChange={handleChange}
        >
          <option value="employe">Employé</option>
          <option value="technicien">Technicien</option>
        </select>

        {formData.role === "employe" && (
          <input
            className="position-input mb-4 px-4 py-2 border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
            type="text"
            name="poste"
            value={formData.poste || ""}
            onChange={handleChange}
            placeholder="Poste de l'employé"
          />
        )}

        <div className="modal-actions">
          <button
            onClick={handleSave}
            className="bg-[#000] hover:bg-[#2c3e50]"
            disabled={loading}
          >
            {isEdit ? "Mettre à jour" : "Créer"}
          </button>

          <button onClick={onClose} className=" bg-[#000] hover:bg-[#2c3e50]">
            Annuler
          </button>
        </div>
      </div>
    </>
  );
}
