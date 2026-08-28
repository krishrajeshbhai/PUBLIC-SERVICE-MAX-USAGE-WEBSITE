import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Accessibility, Bell, Globe, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { getAuthUser, logoutUser } from '../../../store/authStore';
import { getLanguage, setLanguage, LANGUAGES } from '../../../i18n/i18n';

export default function PassengerProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser() || { name: 'Abhiraj', phone: '+91 98765 43210', email: 'abhiraj@example.com' });
  const [accessible, setAccessible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [lang, setLang] = useState(getLanguage());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLanguage(lang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
          Commuter Profile & Preferences
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          Manage your contact details, accessibility accommodations, and trip alerts.
        </p>
      </div>

      {saved && (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: '12px',
          color: '#34d399',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> Preferences updated successfully.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Personal Information */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#3b82f6" /> Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>FULL NAME</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>MOBILE NUMBER</label>
              <input
                type="text"
                value={user.phone}
                disabled
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Accessibility & Preferences */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Accessibility size={18} color="#22d3ee" /> Travel & Accessibility Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Step-Free / Accessible Routes</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Always prioritize elevators, ramps, and zero-stair transfers</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Real-time Delay & Disruption Alerts</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Notify instantly when planned bus/metro is delayed and rerouted</div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>

            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>APP LANGUAGE</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} style={{ background: '#0f172a', color: '#fff' }}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: '12px 24px', borderRadius: '10px' }}
          >
            Save Preferences
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
