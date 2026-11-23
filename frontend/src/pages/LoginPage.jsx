import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "lucide-react";
import "./LoginPage.css";

const LoginPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        {
          username,
          password,
        }
      );

      if (response.data.role !== role) {
        setError("Ce compte n'est pas autorisé pour ce rôle.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (role === "chef") {
        navigate("/chef/dashboard");
      } else if (role === "employe") {
        navigate("/employe/dashboard");
      } else if (role === "technicien") {
        navigate("/technicien/dashboard");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err.response?.data || err.message);
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-cyan-300">
      <form
        onSubmit={handleLogin}
        className=" position-form bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="flex justify-center mb-2">
          <User className="text-[#00acc1]" size={50} />
        </div>

        <h2 className=" titre text-2xl font-bold mb-6 text-[#006064]">
          Espace {role}
        </h2>

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="position-input mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="position-input mb-6 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00accc]"
          required
        />

        <button
          type="submit"
          className=" position-button w-[66%] py-3 bg-[#00acc1] hover:bg-[#00838f] text-white font-semibold rounded-xl transition-all"
        >
          Se connecter
        </button>

        {error && <p className="error-message">{error}</p>}

        <div className=" position-link mt-6">
          <Link
            to="/select-login"
            className="text-[#00acc1] hover:text-[#00838f]"
          >
            Changer de rôle
          </Link>

          <Link to="/" className="text-[#00acc1] hover:text-[#00838f]">
            Retour à l'accueil
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
