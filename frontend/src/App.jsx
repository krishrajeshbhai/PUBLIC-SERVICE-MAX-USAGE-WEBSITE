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

// Module 3: Employee Operations Portal (Kept Untouched as Requested)
import EmployeeLoginPage from './pages/auth/EmployeeLoginPage';
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import EmployeeVehiclesPage from './pages/employee/EmployeeVehiclesPage';
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
            <PassengerShell walletBalance={walletBalance}>
              <PassengerHome />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/search"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerSearch />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/results"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerResults />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/journeys"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerResults />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/trips"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerTrips />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/tickets"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerTickets />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/ticket/:ticketId"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerTickets />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/wallet"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerWallet />
            </PassengerShell>
          }
        />
        <Route
          path="/passenger/profile"
          element={
            <PassengerShell walletBalance={walletBalance}>
              <PassengerProfile />
            </PassengerShell>
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
            <VisitorShell>
              <VisitorExplore />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/home"
          element={
            <VisitorShell>
              <VisitorExplore />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/destination/:id"
          element={
            <VisitorShell>
              <VisitorDestinationDetail />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/journey/:id"
          element={
            <VisitorShell>
              <VisitorGuidedJourney />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/map"
          element={
            <VisitorShell>
              <VisitorMapPage />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/assistant"
          element={
            <VisitorShell>
              <VisitorAssistant />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/help"
          element={
            <VisitorShell>
              <VisitorHelpCenter />
            </VisitorShell>
          }
        />
        <Route
          path="/visitor/profile"
          element={
            <VisitorShell>
              <VisitorProfile />
            </VisitorShell>
          }
        />

        {/* ========================================================
            MODULE 3: EMPLOYEE PORTAL (Untouched as requested)
            ======================================================== */}
        <Route path="/employee-login" element={<EmployeeLoginPage />} />
        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/vehicles"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeVehiclesPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
