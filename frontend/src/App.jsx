import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

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

export default function App() {
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [walletBalance, setWalletBalance] = useState(500);
  const [mockApiState, setMockApiState] = useState(USE_MOCK_API);

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
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/employee-login" element={<EmployeeLoginPage />} />

            {/* Passenger Experience Routes */}
            <Route
              path="/"
              element={<SearchPage mockApiChanged={mockApiState} />}
            />
            <Route
              path="/results"
              element={
                <ResultsPage
                  onTicketBooked={handleTicketBooked}
                  mockApiChanged={mockApiState}
                />
              }
            />
            <Route
              path="/ticket/:ticketId"
              element={<TicketPage mockApiChanged={mockApiState} />}
            />
            <Route
              path="/wallet"
              element={
                <WalletPage
                  walletBalance={walletBalance}
                  onWalletUpdated={handleWalletUpdated}
                  mockApiChanged={mockApiState}
                />
              }
            />
            <Route
              path="/analytics"
              element={<AnalyticsPage />}
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
