import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Ticket, Wallet, BarChart3, Navigation, Database, Server } from 'lucide-react';
import { api, USE_MOCK_API, setUseMockApi } from '../services/api';

export default function Navbar({ activeTicketId, walletBalance, onToggleMockApi }) {
  const location = useLocation();
  const [isMock, setIsMock] = useState(USE_MOCK_API);

  const handleToggle = (e) => {
    const val = e.target.checked;
    setIsMock(val);
    setUseMockApi(val);
    if (onToggleMockApi) onToggleMockApi(val);
  };

  const navItems = [
    { path: '/', label: 'Search Journeys', icon: Search },
    ...(activeTicketId ? [{ path: `/ticket/${activeTicketId}`, label: 'Live Ticket', icon: Ticket, badge: 'LIVE' }] : []),
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/analytics', label: 'City Insights', icon: BarChart3 },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <Navigation size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">
              TransitOne
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Multi-Modal Mobility
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#60a5fa' : 'currentColor'} />
                {item.label}
                {item.badge && (
                  <span className="badge" style={{ background: '#10b981', color: '#000', padding: '2px 6px', fontSize: '0.65rem' }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Wallet Pill + Mock/API Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Wallet Balance Pill */}
          <Link to="/wallet" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#34d399'
            }}>
              <Wallet size={15} />
              <span>₹{walletBalance !== null ? walletBalance : 500}</span>
            </div>
          </Link>

          {/* API Mode Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            {isMock ? <Database size={13} color="#f59e0b" /> : <Server size={13} color="#10b981" />}
            <span style={{ fontWeight: 600 }}>{isMock ? 'Mock API' : 'Express API'}</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={isMock} onChange={handleToggle} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
