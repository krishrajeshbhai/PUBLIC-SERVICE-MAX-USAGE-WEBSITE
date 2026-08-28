import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Navigation, Map, MessageSquare, HelpCircle, User, Globe, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { getLanguage, setLanguage, LANGUAGES, t } from '../../i18n/i18n';
import { getAuthUser } from '../../store/authStore';

export default function VisitorShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState(getLanguage());
  const [currency, setCurrency] = useState('USD');
  const [user, setUser] = useState(getAuthUser() || { nationality: '🇺🇸 United States', hotel: 'The Taj Connemara' });

  const navLinks = [
    { path: '/visitor/explore', label: 'Explore', icon: Compass },
    { path: '/visitor/journey/dest-1', label: 'My Journey', icon: Navigation },
    { path: '/visitor/map', label: 'Map', icon: Map },
    { path: '/visitor/assistant', label: 'Travel Guide AI', icon: MessageSquare },
    { path: '/visitor/help', label: 'Help & SOS', icon: HelpCircle, alert: true },
    { path: '/visitor/profile', label: 'Profile', icon: User }
  ];

  const handleLanguageChange = (code) => {
    setLang(code);
    setLanguage(code);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(circle at 50% 10%, rgba(245, 158, 11, 0.08) 0%, rgba(10, 15, 26, 0.98) 70%)',
      color: '#f8fafc',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      {/* Top Visitor Travel Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
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
          {/* Logo & Tourist Badge */}
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

            <Link to="/visitor/explore" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: '8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
              }}>
                <Compass size={22} color="#000" />
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  TransitOne <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px', marginLeft: '6px' }}>VISITOR INDIA 🇮🇳</span>
                </span>
                <div style={{ fontSize: '0.68rem', color: '#fbbf24', letterSpacing: '0.04em' }}>
                  Safe, Guided International Travel Companion
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
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? '#fbbf24' : 'currentColor'} />
                  {item.label}
                  {item.alert && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Language Switcher & Currency Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Currency Pill */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fbbf24',
                padding: '6px 8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              <option value="USD" style={{ background: '#0f172a', color: '#fff' }}>$ USD</option>
              <option value="EUR" style={{ background: '#0f172a', color: '#fff' }}>€ EUR</option>
              <option value="GBP" style={{ background: '#0f172a', color: '#fff' }}>£ GBP</option>
              <option value="JPY" style={{ background: '#0f172a', color: '#fff' }}>¥ JPY</option>
              <option value="INR" style={{ background: '#0f172a', color: '#fff' }}>₹ INR</option>
            </select>

            {/* Language Selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} style={{ background: '#0f172a', color: '#fff' }}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick SOS / Help Button */}
            <Link
              to="/visitor/help"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Shield size={14} /> SOS Help
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, paddingBottom: '70px' }}>
        {children}
      </main>

      {/* Mobile Visitor Bottom Navigation Bar */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 990,
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)',
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
                color: isActive ? '#fbbf24' : '#94a3b8',
                padding: '4px 12px',
                position: 'relative'
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.alert && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#ef4444'
                }} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
