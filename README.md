# SupDeskIT — Plateforme Intelligente de Gestion des Tickets IT

![React](https://img.shields.io/badge/Frontend-React_%7C_Vite_%7C_TailwindCSS-00acc1?style=flat-square&logo=react)
![Django](https://img.shields.io/badge/Backend-Django_%7C_DRF-2c3e50?style=flat-square&logo=django)
![Machine Learning](https://img.shields.io/badge/IA-Scikit--Learn-f59e0b?style=flat-square&logo=scikit-learn)

**SupDeskIT** est une application web full-stack de gestion d'assistance technique (Helpdesk) permettant de centraliser, suivre et résoudre les incidents informatiques au sein d'un établissement. Elle intègre un module de **Machine Learning** capable de prédire automatiquement le niveau de priorité des tickets dès leur création.

---

## Contexte du projet & Démarche d'apprentissage

Ce projet a été réalisé durant mon **stage de 2ᵉ année** pour l'obtention de mon **DUT en Informatique Décisionnelle et Apprentissage Automatique (2024–2025)**, au sein de **SupMTI Oujda** et sous le suivi d'un encadrant.

Développée dans un cadre d'apprentissage du développement web full-stack (React & Django REST Framework) et de l'intégration de modèles prédictifs, cette application n'est pas parfaite : certaines normes d'architecture logicielle idéales (factorisation avancée, gestion d'état centralisée, intercepteurs HTTP ou séparation stricte des responsabilités) n'ont pas toutes été respectées. L'objectif principal était de concevoir et livrer une solution fonctionnelle de bout en bout répondant à un besoin réel de support informatique.

---

## Fonctionnalités principales

L'application s'articule autour de **trois espaces distincts** selon le rôle de l'utilisateur :

### Espace Employé
- **Création de tickets** : soumission d'une demande avec catégorie (*Réseau*, *Matériel*, *Logiciel*), objet, description détaillée et pièce jointe facultative (avec aperçu d'image).
- **Suivi et historique** : consultation de l'ensemble de ses tickets et de l'évolution de leur statut (`en_attente`, `en_cours`, `resolu`).
- **Notifications** : alertes lors de la prise en charge ou de la résolution d'un ticket.

### Espace Technicien
- **Gestion de la file d'attente** : visualisation des tickets assignés à traiter et de l'historique des tickets déjà résolus.
- **Traitement des incidents** : mise à jour du statut d'un ticket, ajout de commentaires techniques et consultation des pièces jointes.
- **Navigation rapide** : redirection directe depuis une notification vers le ticket concerné avec mise en évidence visuelle.

### Espace Chef de Service
- **Vue globale et filtrage** : supervision de tous les tickets de l'établissement avec filtres dynamiques par statut et par priorité.
- **Export de données** : exportation de la liste des tickets au format **CSV**.
- **Assignation** : attribution manuelle ou réaffectation des tickets aux techniciens.
- **Tableaux de bord & IA** : suivi des statistiques globales et consultation des métriques de performance du modèle de Machine Learning (*Performance ML*).

### Fonctionnalités transverses
- Authentification par token et redirection selon le rôle.
- Barre de recherche rapide intégrée dans l'en-tête de chaque dashboard.
- Gestion et mise à jour du profil utilisateur (nom d'utilisateur, photo de profil).

---

## Stack Technique

| Couche | Technologies utilisées |
| :--- | :--- |
| **Frontend** | React, Vite, React Router DOM, Tailwind CSS, Axios, React Icons, Lucide React |
| **Backend** | Python, Django, Django REST Framework (DRF), Token Authentication |
| **Data & IA** | Scikit-learn, Pandas, NumPy, Joblib (classification de priorité des tickets) |
| **Base de données** | SQLite (environnement de développement) |

---

## Architecture du projet

```text
SupDeskIT/
├── backend/                      # API REST Django & module Machine Learning
│   ├── accounts/                 # Application principale (utilisateurs, tickets, notifications, prédiction ML)
│   ├── manage.py                 # Point d'entrée CLI Django
│   └── requirements.txt          # Dépendances Python
│
├── frontend/                     # Interface client React + Vite
│   ├── src/
│   │   ├── assets/               # Logos et ressources graphiques
│   │   ├── pages/
│   │   │   ├── chef/             # VueTickets, Assignation, Statistiques, PerformanceML
│   │   │   ├── employe/          # DemandeForm, Historique, Notifications, ModalProfil
│   │   │   ├── technicien/       # TicketsATraiter, TicketsTraites, NotificationsTechnicien
│   │   │   ├── DashboardChef.jsx
│   │   │   ├── DashboardEmploye.jsx
│   │   │   ├── DashboardTechnicien.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── Selectlogin.jsx
│   │   ├── App.jsx               # Configuration des routes de l'application
│   │   ├── index.css             # Styles globaux et configuration Tailwind
│   │   └── main.jsx              # Point d'entrée React
│   ├── package.json              # Dépendances et scripts Node.js
│   └── tailwind.config.js        # Configuration Tailwind CSS
│
├── .gitignore                    # Fichiers et dossiers ignorés par Git
└── README.md                     # Documentation du projet
```

---

## Installation et lancement en local

### Prérequis
- **Node.js** (v18 ou supérieur) & **npm**
- **Python** (v3.10 ou supérieur) & **pip**

### 1. Cloner le dépôt
```bash
git clone https://github.com/AdoumOMT/SupDeskIT.git
cd SupDeskIT
```

### 2. Configuration du Backend (Django)
```bash
cd backend

# Créer et activer un environnement virtuel
python -m venv venv
# Sous Windows :
venv\Scripts\activate
# Sous Linux / macOS :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations et lancer le serveur
python manage.py migrate
python manage.py runserver
```
> L'API backend sera accessible sur `http://localhost:8000`.

### 3. Configuration du Frontend (React)
Ouvre un second terminal à la racine du projet (`SupDeskIT`) :
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```
> L'interface web sera accessible sur `http://localhost:5173`.

---

## Perspectives d'évolution

Plusieurs améliorations techniques et fonctionnelles sont envisagées pour les prochaines versions :

- **Refactoring & Clean Architecture** : factorisation des composants communs (layouts de dashboards, barre de recherche, modales), centralisation des appels API avec des intercepteurs Axios et utilisation de variables d'environnement (`.env`).
- **Mode Sombre (Dark Mode)** : implémentation d'un thème sombre complet et harmonisé sur l'ensemble des interfaces avec sauvegarde de la préférence utilisateur.
- **Notifications en temps réel** : remplacement des requêtes HTTP classiques par des WebSockets (**Django Channels**) pour recevoir les alertes instantanément sans rechargement.
- **Amélioration continue du modèle ML** : ajout d'une boucle de rétroaction permettant au chef de service de valider ou corriger la priorité prédite afin de réentraîner le modèle sur de nouvelles données.
- **Sécurisation avancée** : migration vers une authentification JWT avec cookies `HttpOnly` et gestion fine des permissions côté serveur.
- **Conteneurisation** : ajout de fichiers `Dockerfile` et `docker-compose.yml` pour faciliter le déploiement.

---

## Auteur

Adoum Oumar Moussa Tahir
Étudiant en informatique — Data & IA, Systèmes d'optimisations.

GitHub : https://github.com/AdoumOMT

Les retours, suggestions d'amélioration et conseils d'architecture sont les bienvenus !