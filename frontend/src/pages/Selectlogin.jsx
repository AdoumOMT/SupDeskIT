import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Wrench, ShieldCheck } from "lucide-react";
import "./Selectlogin.css";

const Selectlogin = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="selectlogin-wrapper">
      <div className={`selectlogin-container ${isVisible ? "fade-in" : ""}`}>
        <h1 className="selectlogin-title">Me Connecter en temps que :</h1>

        <div className="selectlogin-buttons">
          <button
            onClick={() => handleRoleSelect("employe")}
            className="selectlogin-btn"
          >
            <User className="w-5 h-5" />
            Employé
          </button>

          <button
            onClick={() => handleRoleSelect("technicien")}
            className="selectlogin-btn"
          >
            <Wrench className="w-5 h-5" />
            Technicien
          </button>

          <button
            onClick={() => handleRoleSelect("chef")}
            className="selectlogin-btn"
          >
            <ShieldCheck className="w-5 h-5" />
            Chef de service
          </button>
        </div>

        <div className="po">
          <Link to="/" className="selectlogin-link">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Selectlogin;
