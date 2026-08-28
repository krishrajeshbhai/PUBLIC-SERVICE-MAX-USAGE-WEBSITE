import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Globe, Hotel, ShieldCheck, Download, LogOut, CheckCircle2, Languages, Clock } from 'lucide-react';
import { getAuthUser, logoutUser } from '../../../store/authStore';
import { getLanguage, setLanguage, LANGUAGES } from '../../../i18n/i18n';

export default function VisitorProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser() || { nationality: '🇺🇸 United States', hotel: 'The Taj Connemara, Chennai', duration: '1 Week' });
  const [lang, setLang] = useState(getLanguage());
  const [currency, setCurrency] = useState('USD');
  const [offlineSaved, setOfflineSaved] = useState(false);

  const handleDownloadOffline = () => {
    setOfflineSaved(true);
    setTimeout(() => setOfflineSaved(false), 3000);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          International Visitor Profile
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          Customized travel companion settings, verified hotel coordinates, and offline transit safety pack.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Visitor Details Card */}
        <div className="glass-panel" style={{ padding: '28px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <User size={24} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>Travel Companion Record</h3>
              <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>Verified Foreign Tourist Registration</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>NATIONALITY / PASSPORT</label>
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.3)', color: '#fff', fontWeight: 600 }}>
                {user.nationality || '🇺🇸 United States'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>BASE ACCOMMODATION / HOTEL</label>
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.3)', color: '#fff', fontWeight: 600 }}>
                {user.hotel || 'The Taj Connemara, Chennai'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>INTERFACE LANGUAGE</label>
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  setLanguage(e.target.value);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
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

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>CURRENCY DISPLAY</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                <option value="USD" style={{ background: '#0f172a', color: '#fff' }}>$ USD (US Dollar)</option>
                <option value="EUR" style={{ background: '#0f172a', color: '#fff' }}>€ EUR (Euro)</option>
                <option value="GBP" style={{ background: '#0f172a', color: '#fff' }}>£ GBP (British Pound)</option>
                <option value="JPY" style={{ background: '#0f172a', color: '#fff' }}>¥ JPY (Japanese Yen)</option>
                <option value="INR" style={{ background: '#0f172a', color: '#fff' }}>₹ INR (Indian Rupee)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offline Journey Download Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', margin: '0 0 4px 0' }}>
                Offline Journey & Safety Package
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
                Download your transit tickets, offline maps, step instructions, and emergency translations.
              </p>
            </div>

            <button
              onClick={handleDownloadOffline}
              style={{
                background: '#10b981',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} /> {offlineSaved ? 'Saved Offline! ✓' : 'Download Offline Pack'}
            </button>
          </div>
        </div>

        {/* Exit & Sign Out */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/visitor/onboarding')}
            className="btn-secondary"
            style={{ borderRadius: '10px' }}
          >
            Re-run Onboarding Wizard ⚙️
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
            <LogOut size={16} /> Exit Visitor Session
          </button>
        </div>
      </div>
    </div>
  );
}
