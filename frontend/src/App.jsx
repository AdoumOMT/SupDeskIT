import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

// Pages générales
import Home from "./pages/Home";
import Selectlogin from "./pages/Selectlogin";
import LoginPage from "./pages/LoginPage";

// Pages chef
import DashboardChef from "./pages/DashboardChef";
import VueTickets from "./pages/chef/VueTickets";
import Assignation from "./pages/chef/Assignation";
import Statistiques from "./pages/chef/Statistiques";
import PerformanceML from "./pages/chef/PerformanceML";

// Pages employé
import DashboardEmploye from "./pages/DashboardEmploye";
import DemandeForm from "./pages/employe/DemandeForm";
import Notifications from "./pages/employe/Notifications";
import Historique from "./pages/employe/Historique";

// Pages technicien
import DashboardTechnicien from "./pages/DashboardTechnicien";
import TicketsATraiter from "./pages/technicien/TicketsATraiter";
import TicketsTraites from "./pages/technicien/TicketsTraites";
import NotificationsTechnicien from "./pages/technicien/NotificationsTechnicien";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages générales */}
        <Route path="/" element={<Home />} />
        <Route path="/select-login" element={<Selectlogin />} />
        <Route path="/login/:role" element={<LoginPage />} />

        {/* Espace chef */}
        <Route path="/chef/dashboard" element={<DashboardChef />}>
          <Route index element={<VueTickets />} />
          <Route path="assignation" element={<Assignation />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="performance-ml" element={<PerformanceML />} />
        </Route>

        {/* Espace employé */}
        <Route path="/employe/dashboard" element={<DashboardEmploye />}>
          <Route index element={<Historique />} />
          <Route path="demande" element={<DemandeForm />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Espace technicien */}
        <Route path="/technicien/dashboard" element={<DashboardTechnicien />}>
          <Route index element={<TicketsATraiter />} />
          <Route path="tickets/:id" element={<TicketsATraiter />} />
          <Route path="traites" element={<TicketsTraites />} />
          <Route path="notifications" element={<NotificationsTechnicien />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
