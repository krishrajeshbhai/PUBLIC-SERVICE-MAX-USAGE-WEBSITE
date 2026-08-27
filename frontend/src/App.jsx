import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import TicketPage from './pages/TicketPage';
import WalletPage from './pages/WalletPage';
import AnalyticsPage from './pages/AnalyticsPage';

import VisitorHomePage from './pages/visitor/VisitorHomePage';
import VisitorAttractionPage from './pages/visitor/VisitorAttractionPage';
import VisitorGuidedNavPage from './pages/visitor/VisitorGuidedNavPage';

import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import EmployeeVehiclesPage from './pages/employee/EmployeeVehiclesPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EmployeeLoginPage from './pages/auth/EmployeeLoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import VoiceAssistant from './components/assistant/VoiceAssistant';
import { USE_MOCK_API } from './services/api';
import { initThemeFromUrlOrUser } from './store/uxProfileStore';
import { getAuthUser } from './store/authStore';

export default function App() {
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [walletBalance, setWalletBalance] = useState(500);
  const [mockApiState, setMockApiState] = useState(USE_MOCK_API);

  useEffect(() => {
    // Parse URL parameter ?theme= or apply active user's theme status
    initThemeFromUrlOrUser(getAuthUser());

    // Fetch initial persistent wallet balance on app load
    async function loadInitialWallet() {
      try {
        const activeUser = getAuthUser();
        const userId = activeUser ? activeUser.id : 'user-1';
        const walletRes = await api.getWallet(userId);
        if (walletRes && typeof walletRes.balance === 'number') {
          setWalletBalance(walletRes.balance);
        }
      } catch (e) {
        console.warn("Could not fetch initial wallet balance:", e);
      }
    }
    loadInitialWallet();
  }, [mockApiState]);

  const handleTicketBooked = (ticketId, newBalance) => {
    setActiveTicketId(ticketId);
    if (newBalance !== undefined) setWalletBalance(newBalance);
  };

  const handleWalletUpdated = (newBalance) => {
    setWalletBalance(newBalance);
  };

  const handleToggleMockApi = (val) => {
    setMockApiState(val);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          activeTicketId={activeTicketId}
          walletBalance={walletBalance}
          onToggleMockApi={handleToggleMockApi}
        />
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Landing Page as Default Initial Route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/employee-login" element={<EmployeeLoginPage />} />

            {/* Protected Passenger Routes */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage mockApiChanged={mockApiState} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <ResultsPage
                    onTicketBooked={handleTicketBooked}
                    mockApiChanged={mockApiState}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket/:ticketId"
              element={
                <ProtectedRoute>
                  <TicketPage mockApiChanged={mockApiState} onWalletUpdated={handleWalletUpdated} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <WalletPage
                    walletBalance={walletBalance}
                    onWalletUpdated={handleWalletUpdated}
                    mockApiChanged={mockApiState}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Foreign Visitor Experience Routes */}
            <Route
              path="/visitor"
              element={<VisitorHomePage />}
            />
            <Route
              path="/visitor/attraction/:id"
              element={<VisitorAttractionPage />}
            />
            <Route
              path="/visitor/guided/:id"
              element={<VisitorGuidedNavPage />}
            />

            {/* Employee Operations Portal Routes (Role Guard Protected) */}
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
          </Routes>
        </main>

        {/* Global Voice & Text AI Assistant */}
        <VoiceAssistant onTicketBooked={handleTicketBooked} />
      </div>
    </Router>
  );
}
