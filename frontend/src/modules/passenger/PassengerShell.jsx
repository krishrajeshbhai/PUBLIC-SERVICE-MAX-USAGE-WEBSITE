import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Compass, Ticket, Wallet, Award, User, Mic, Navigation, LogOut, ArrowLeft } from 'lucide-react';
import { getAuthUser, logoutUser } from '../../store/authStore';
import { api } from '../../services/api';
import PassengerAssistantModal from './components/PassengerAssistantModal';

export default function PassengerShell({ children, walletBalance = 500, activeTicketId = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser() || { name: 'Abhiraj', phone: '+91 98765 43210', id: 'user-1' });
  const [showAssistant, setShowAssistant] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(walletBalance);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const u = getAuthUser();
        const res = await api.getWallet(u ? u.id : 'user-1');
        if (res && typeof res.balance === 'number') {
          setCurrentBalance(res.balance);
        }
      } catch (e) {
        console.warn("Error loading wallet balance in shell:", e);
      }
    }
    fetchBalance();
  }, [location.pathname]);

  const navLinks = [
    { path: '/passenger/home', label: 'Home', icon: Home },
    { path: '/passenger/search', label: 'Plan Journey', icon: Search },
    { path: '/passenger/trips', label: 'My Trips', icon: Compass },
    { path: '/passenger/tickets', label: 'Tickets', icon: Ticket, badge: activeTicketId ? 'LIVE' : null },
    { path: '/passenger/wallet', label: 'Wallet', icon: Wallet, pill: `₹${currentBalance}` },
    { path: '/passenger/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-dark, #090d16)',
      color: 'var(--text-main, #f3f4f6)',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      {/* Top Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(10, 15, 26, 0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Logo & Module Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" title="Back to Main Hub" style={{
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)'
            }}>
              <ArrowLeft size={16} />
            </Link>

            <Link to="/passenger/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                padding: '8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}>
                <Navigation size={20} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  TransitOne <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '6px', marginLeft: '6px' }}>PASSENGER</span>
                </span>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Daily Commute & Multi-Modal Travel
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? '#60a5fa' : 'currentColor'} />
                  {item.label}
                  {item.badge && (
                    <span style={{ background: '#10b981', color: '#000', padding: '1px 6px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800 }}>
                      {item.badge}
                    </span>
                  )}
                  {item.pill && (
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.8rem' }}>
                      {item.pill}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Wallet & Voice Assistant Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/passenger/wallet" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '9999px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#34d399'
              }}>
                <Wallet size={15} />
                <span>₹{currentBalance}</span>
              </div>
            </Link>

            <button
              onClick={() => setShowAssistant(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
              }}
              title="Commuter Voice AI"
            >
              <Mic size={15} />
              <span className="assistant-btn-text">Voice AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, paddingBottom: '70px' }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 990,
        background: 'rgba(10, 15, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 4px 12px 4px'
      }}>
        {navLinks.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: isActive ? '#60a5fa' : '#94a3b8',
                padding: '4px 12px',
                position: 'relative'
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981'
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Commuter Voice Assistant Modal */}
      {showAssistant && (
        <PassengerAssistantModal onClose={() => setShowAssistant(false)} />
      )}
    </div>
  );
}
