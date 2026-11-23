import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import logo from "../assets/SupDesktIT.svg";
import logo2 from "../assets/image-tech.jpg";
import logoSUPMTI from "../assets/SUPMTI-LOGO.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

import {
  faUpRightFromSquare,
  faWrench,
  faBell,
  faChartLine,
  faRobot,
  faHeadset,
  faFileCsv,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const smoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", smoothScroll);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", smoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <a href="https://supmtioujda.ifgroup-tech.com/">
          <img
            src={logo}
            alt="Logo"
            className=" rounded-full object-cover logo"
          />
        </a>

        <ul className=" liste-scroll flex space-x-6">
          <li>
            <a href="#accueil" className=" liste-scroll-li  ">
              Accueil
            </a>
          </li>
          <li>
            <a href="#fonctionnalites" className="liste-scroll-li ">
              Fonctionnalités
            </a>
          </li>
          <li>
            <a href="#a-propos" className="liste-scroll-li  ">
              À propos
            </a>
          </li>
        </ul>

        <div className="space-x-4">
          <a
            href="https://www.facebook.com/share/1McoAKVBqH/?mibextid=wwXIfr"
            className="Font"
          >
            <FontAwesomeIcon
              icon={faFacebookF}
              size="2x"
              color="black"
              className="Font"
            />
          </a>
          <a
            href="https://www.instagram.com/supmti.oujda?evlk=MWdmZDljdDRpbnMzZw=="
            className="Font"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              size="2x"
              color="black"
              className="Font"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/supmti-oujda/"
            className="Font"
          >
            <FontAwesomeIcon
              icon={faLinkedinIn}
              size="2x"
              color="black"
              className="Font"
            />
          </a>
        </div>
      </header>

      <main
        id="accueil"
        className="flex items-center justify-center px-4 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-2xl w-full"
        >
          <h1 className="position-section-main text-3xl font-bold text-blue-700 mb-6">
            Bienvenue sur le Portail IT de SUPMTI
          </h1>
          <div>
            <div className="content">
              <div>
                <motion.p
                  className="text-md text-gray-600 mb-8 leading-relaxed text-justify text-main"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <br></br>
                  Cette plateforme intelligente est conçue pour optimiser la
                  gestion des demandes de réparation techniqueinformatiques au
                  sein du <strong>SUPMTI Oujda</strong>. Elle permet aux{" "}
                  <strong>employés</strong> de soumettre facilement leurs
                  problèmes techniques, aux <strong>techniciens</strong> de les
                  prendre en charge efficacement, et aux{" "}
                  <strong>chefs de service</strong> de suivre l’évolution des
                  tickets et superviser l’ensemble du processus. Grâce à
                  l’intégration de l’<strong>intelligence artificielle</strong>,
                  les demandes sont automatiquement{" "}
                  <strong>classées par priorité</strong>, assurant une
                  résolution rapide et structurée.
                  <br></br>
                  <br />
                  <button
                    className=" bg-[#00acc1] hover:bg-[#00838f] text-white font-semibold rounded-xl transition-all"
                    onClick={() => navigate("/select-login")}
                    style={{
                      padding: "10px 15px",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Accéder à la plateforme
                    <FontAwesomeIcon icon={faUpRightFromSquare} size="sm" />
                  </button>
                </motion.p>
              </div>
              <div>
                <img src={logo2} alt="Logo" className="logo2" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <section id="fonctionnalites" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Fonctionnalités Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faWrench} size="3x" />
              </div>
              <h3 className="feature-title">Gestion des Tickets</h3>
              <p className="feature-description">
                Soumission et suivi des tickets de réparation en temps réel avec
                statut mis à jour automatiquement.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faRobot} size="3x" />
              </div>
              <h3 className="feature-title">Priorisation IA</h3>
              <p className="feature-description">
                Notre intelligence artificielle analyse et priorise
                automatiquement les demandes selon leur urgence.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faChartLine} size="3x" />
              </div>
              <h3 className="feature-title">Tableaux de Bord</h3>
              <p className="feature-description">
                Visualisation claire des statistiques et indicateurs de
                performance pour les chefs de service.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faBell} size="3x" />
              </div>
              <h3 className="feature-title">Notifications</h3>
              <p className="feature-description">
                Alertes en temps réel pour informer les utilisateurs des mises à
                jour importantes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faHeadset} size="3x" />
              </div>
              <h3 className="feature-title">Support Technique</h3>
              <p className="feature-description">
                Canal de communication direct entre employés et techniciens pour
                une résolution rapide.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faFileCsv} size="3x" />
              </div>
              <h3 className="feature-title">Export des Tickets</h3>
              <p className="feature-description">
                Exportez l'historique des tickets au format CSV pour analyse
                approfondie dans Excel ou tout autre outil de Business
                Intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="a-propos" className="about-section">
        <div className="section-container">
          <h2 className="section-title">À Propos de SUPMTI</h2>

          <div className="about-content">
            <div className="about-image">
              <img src={logoSUPMTI} alt="Logo SUPMTI" className="about-logo" />
            </div>
            <div className="about-text">
              <p className="about-description">
                Le <strong>SUPMTI Oujda</strong> est un établissement
                d'enseignement supérieur marocain spécialisé dans les métiers
                des technologies de l'information et de la communication.
              </p>
              <p className="about-description">
                Cette plateforme a été développée dans le cadre d'un projet
                innovant visant à moderniser la gestion des services
                informatiques au sein de l'établissement, en mettant à profit
                les dernières technologies et l'intelligence artificielle.
              </p>
              <p className="about-description">
                Notre mission est de fournir un environnement de travail optimal
                pour le personnel, avec un support technique réactif et
                efficace.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-white shadow-inner mt-10 py-6 px-4 text-center text-sm text-gray-500">
        © 2025 SUPMTI Oujda - Tous droits réservés.
      </footer>
    </div>
  );
}
