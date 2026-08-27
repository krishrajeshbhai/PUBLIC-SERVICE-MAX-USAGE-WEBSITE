import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Ticket, Wallet, BarChart3, Navigation, Database, Server, Compass, ShieldAlert, Globe, Eye, User, LogOut, LogIn, Settings } from 'lucide-react';
import { api, USE_MOCK_API, setUseMockApi, subscribeMockApi } from '../services/api';
import { LANGUAGES, getLanguage, setLanguage, subscribeLanguage, t } from '../i18n/i18n';
import { getUXProfile, toggleSimplifiedMode, subscribeUXProfile } from '../store/uxProfileStore';
import { getAuthUser, logoutUser, subscribeAuth } from '../store/authStore';

export default function Navbar({ activeTicketId, walletBalance, onToggleMockApi }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMock, setIsMock] = useState(USE_MOCK_API);
  const [currentLang, setCurrentLangState] = useState(getLanguage());
  const [uxProfile, setUxProfileState] = useState(getUXProfile());
  const [authUser, setAuthUserState] = useState(getAuthUser());

  useEffect(() => {
    const unsubLang = subscribeLanguage(setCurrentLangState);
    const unsubUX = subscribeUXProfile(setUxProfileState);
    const unsubAuth = subscribeAuth(setAuthUserState);
    const unsubApi = subscribeMockApi(setIsMock);
    return () => {
      unsubLang();
      unsubUX();
      unsubAuth();
      unsubApi();
    };
  }, []);

  const handleToggle = (val) => {
    setIsMock(val);
    setUseMockApi(val);
    if (onToggleMockApi) onToggleMockApi(val);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isVisitorMode = location.pathname.startsWith('/visitor');
  const isEmployeeMode = location.pathname.startsWith('/employee');
  const hideNavbarPaths = ['/', '/landing', '/login', '/register', '/employee-login'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname) || isEmployeeMode;

  if (shouldHideNavbar) return null;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(9, 13, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '10px 24px'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo & Shell Switcher Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
              <Navigation size={20} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }} className="gradient-text">
                {t('appName')}
              </span>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t('tagline')}
              </span>
            </div>
          </Link>

          {/* Three Core Shell Switcher */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <button
              onClick={() => navigate(authUser ? '/search' : '/login')}
              style={{
                background: location.pathname === '/search' || location.pathname === '/results' ? '#3b82f6' : 'transparent',
                color: location.pathname === '/search' || location.pathname === '/results' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🚀 {t('navPassenger')}
            </button>

            <button
              onClick={() => navigate('/visitor')}
              style={{
                background: isVisitorMode ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'transparent',
                color: isVisitorMode ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🏛️ {t('navVisitor')}
            </button>

            <button
              onClick={() => navigate('/employee')}
              style={{
                background: isEmployeeMode ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                color: isEmployeeMode ? '#000000' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🛡️ {t('navEmployee')}
            </button>
          </div>
        </div>

        {/* Nav Links */}
        {!isVisitorMode && !isEmployeeMode && (
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link
              to="/search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: location.pathname === '/search' ? '#ffffff' : 'var(--text-muted)',
                background: location.pathname === '/search' ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
              }}
            >
              <Search size={15} /> Search
            </Link>

            {activeTicketId && (
              <Link
                to={`/ticket/${activeTicketId}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: location.pathname.startsWith('/ticket') ? '#ffffff' : 'var(--text-muted)',
                  background: location.pathname.startsWith('/ticket') ? 'rgba(16, 185, 129, 0.2)' : 'transparent'
                }}
              >
                <Ticket size={15} color="#10b981" /> Ticket
                <span className="badge" style={{ background: '#10b981', color: '#000', padding: '1px 5px', fontSize: '0.6rem' }}>
                  LIVE
                </span>
              </Link>
            )}

            <Link
              to="/wallet"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: location.pathname === '/wallet' ? '#ffffff' : 'var(--text-muted)',
                background: location.pathname === '/wallet' ? 'rgba(139, 92, 246, 0.2)' : 'transparent'
              }}
            >
              <Wallet size={15} /> Wallet
            </Link>

            <Link
              to="/analytics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: location.pathname === '/analytics' ? '#ffffff' : 'var(--text-muted)',
                background: location.pathname === '/analytics' ? 'rgba(245, 158, 11, 0.2)' : 'transparent'
              }}
            >
              <BarChart3 size={15} /> Insights
            </Link>

            <Link
              to="/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: location.pathname === '/settings' ? '#ffffff' : 'var(--text-muted)',
                background: location.pathname === '/settings' ? 'rgba(6, 182, 212, 0.2)' : 'transparent'
              }}
            >
              <Settings size={15} /> Settings
            </Link>
          </nav>
        )}

        {/* Right Controls: User Auth status + i18n + UX Toggle + Wallet Pill + API Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* User Auth Pill / Login Actions */}
          {authUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
              {authUser.avatar ? (
                authUser.avatar.startsWith('http') ? (
                  <img src={authUser.avatar} alt="Avatar" style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '0.9rem' }}>{authUser.avatar}</span>
                )
              ) : (
                <User size={14} color="#60a5fa" />
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{authUser.name}</span>
              <button onClick={handleLogout} title="Logout" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                <LogIn size={13} /> Login
              </button>
            </Link>
          )}

          {/* i18n Language Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
            <Globe size={14} color="#60a5fa" />
            <select
              value={currentLang}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} style={{ background: '#0f172a', color: '#fff' }}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Senior / Simplified Adaptive UX Toggle Button */}
          <button
            onClick={toggleSimplifiedMode}
            title="Toggle Senior / Simplified Accessibility Mode"
            style={{
              background: uxProfile.mode === 'simplified' ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)',
              color: uxProfile.mode === 'simplified' ? '#000000' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Eye size={14} />
            <span>{uxProfile.mode === 'simplified' ? 'Senior Mode' : 'Standard'}</span>
          </button>

          {/* Wallet Pill */}
          <Link to="/wallet" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#34d399'
            }}>
              <Wallet size={14} />
              <span>₹{walletBalance !== null ? walletBalance : 500}</span>
            </div>
          </Link>

          {/* Segmented API Mode Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '3px'
          }}>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              style={{
                background: isMock ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                color: isMock ? '#000000' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <Database size={13} /> Mock
            </button>
            <button
              type="button"
              onClick={() => handleToggle(false)}
              style={{
                background: !isMock ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: !isMock ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <Server size={13} /> Express
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
