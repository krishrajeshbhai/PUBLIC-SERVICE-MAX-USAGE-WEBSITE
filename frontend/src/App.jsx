import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import TicketPage from './pages/TicketPage';
import WalletPage from './pages/WalletPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { USE_MOCK_API } from './services/api';

export default function App() {
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [walletBalance, setWalletBalance] = useState(500);
  const [mockApiState, setMockApiState] = useState(USE_MOCK_API);

  const handleTicketBooked = (ticketId, newBalance) => {
    setActiveTicketId(ticketId);
    setWalletBalance(newBalance);
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}
