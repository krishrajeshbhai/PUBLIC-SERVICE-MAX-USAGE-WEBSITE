import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main Landing Product Selector
import MainLandingPage from './pages/MainLandingPage';
import SettingsPage from './pages/SettingsPage';

// Module 1: Passenger App Imports
import PassengerShell from './modules/passenger/PassengerShell';
import PassengerAuth from './modules/passenger/auth/PassengerAuth';
import PassengerHome from './modules/passenger/home/PassengerHome';
import PassengerSearch from './modules/passenger/search/PassengerSearch';
import PassengerResults from './modules/passenger/search/PassengerResults';
import PassengerTickets from './modules/passenger/tickets/PassengerTickets';
import PassengerTrips from './modules/passenger/trips/PassengerTrips';
import PassengerWallet from './modules/passenger/wallet/PassengerWallet';
import PassengerProfile from './modules/passenger/profile/PassengerProfile';

// Module 2: Visitor Experience Imports
import VisitorShell from './modules/visitor/VisitorShell';
import VisitorAuth from './modules/visitor/auth/VisitorAuth';
import VisitorOnboarding from './modules/visitor/onboarding/VisitorOnboarding';
import VisitorExplore from './modules/visitor/explore/VisitorExplore';
import VisitorMapPage from './modules/visitor/explore/VisitorMapPage';
import VisitorDestinationDetail from './modules/visitor/destination/VisitorDestinationDetail';
import VisitorGuidedJourney from './modules/visitor/guidedJourney/VisitorGuidedJourney';
import VisitorAssistant from './modules/visitor/assistant/VisitorAssistant';
import VisitorHelpCenter from './modules/visitor/help/VisitorHelpCenter';
import VisitorProfile from './modules/visitor/profile/VisitorProfile';

// Module 3: Employee Operations Portal Imports
import EmployeeShell from './modules/employee/EmployeeShell';
import EmployeeAuth from './modules/employee/auth/EmployeeAuth';
import EmployeeDashboard from './modules/employee/dashboard/EmployeeDashboard';
import EmployeeNetwork from './modules/employee/network/EmployeeNetwork';
import EmployeeRoutes from './modules/employee/routes/EmployeeRoutes';
import EmployeeVehicles from './modules/employee/vehicles/EmployeeVehicles';
import EmployeeIncidents from './modules/employee/incidents/EmployeeIncidents';
import EmployeeAlerts from './modules/employee/alerts/EmployeeAlerts';
import EmployeeStations from './modules/employee/stations/EmployeeStations';
import EmployeeReports from './modules/employee/reports/EmployeeReports';
import EmployeeSettings from './modules/employee/settings/EmployeeSettings';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { initThemeFromUrlOrUser } from './store/uxProfileStore';
import { getAuthUser } from './store/authStore';
import { api, USE_MOCK_API } from './services/api';

export default function App() {
  const [walletBalance, setWalletBalance] = useState(500);

  useEffect(() => {
    initThemeFromUrlOrUser(getAuthUser());

    async function loadInitialWallet() {
      try {
        const u = getAuthUser();
        const res = await api.getWallet(u ? u.id : 'user-1');
        if (res && typeof res.balance === 'number') {
          setWalletBalance(res.balance);
        }
      } catch (e) {
        console.warn("Could not load initial wallet in App:", e);
      }
    }
    loadInitialWallet();
  }, []);

  return (
    <Router>
      <Routes>
        {/* ========================================================
            MAIN ENTRY POINT: Clean Product Selector
            ======================================================== */}
        <Route path="/" element={<MainLandingPage />} />
        <Route path="/landing" element={<MainLandingPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* ========================================================
            MODULE 1: PASSENGER APP (Domestic Commuter Product)
            ======================================================== */}
        <Route path="/passenger" element={<Navigate to="/passenger/home" replace />} />
        <Route path="/passenger/login" element={<PassengerAuth mode="login" />} />
        <Route path="/passenger/register" element={<PassengerAuth mode="register" />} />

        <Route
          path="/passenger/home"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerHome />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/search"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerSearch />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/results"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerResults />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/journeys"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerResults />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/trips"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerTrips />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/tickets"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerTickets />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/ticket/:ticketId"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerTickets />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/wallet"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerWallet />
              </PassengerShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/profile"
          element={
            <ProtectedRoute requiredRole="passenger">
              <PassengerShell walletBalance={walletBalance}>
                <PassengerProfile />
              </PassengerShell>
            </ProtectedRoute>
          }
        />

        {/* ========================================================
            MODULE 2: VISITOR EXPERIENCE (International Companion)
            ======================================================== */}
        <Route path="/visitor" element={<Navigate to="/visitor/welcome" replace />} />
        <Route path="/visitor/welcome" element={<VisitorAuth />} />
        <Route path="/visitor/login" element={<VisitorAuth />} />
        <Route path="/visitor/onboarding" element={<VisitorOnboarding />} />

        <Route
          path="/visitor/explore"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorExplore />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/home"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorExplore />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/destination/:id"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorDestinationDetail />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/journey/:id"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorGuidedJourney />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/map"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorMapPage />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/assistant"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorAssistant />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/help"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorHelpCenter />
              </VisitorShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/profile"
          element={
            <ProtectedRoute requiredRole="visitor">
              <VisitorShell>
                <VisitorProfile />
              </VisitorShell>
            </ProtectedRoute>
          }
        />

        {/* ========================================================
            MODULE 3: EMPLOYEE OPERATIONS PORTAL
            ======================================================== */}
        <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/employee-login" element={<Navigate to="/employee/login" replace />} />
        <Route path="/employee/login" element={<EmployeeAuth />} />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeDashboard />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/network"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeNetwork />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/routes"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeRoutes />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vehicles"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeVehicles />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/incidents"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeIncidents />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/alerts"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeAlerts />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/stations"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeStations />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/reports"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeReports />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/settings"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeShell>
                <EmployeeSettings />
              </EmployeeShell>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
