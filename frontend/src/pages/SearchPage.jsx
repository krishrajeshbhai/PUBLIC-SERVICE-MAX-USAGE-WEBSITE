import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Accessibility, Zap, Sparkles, AlertCircle, CheckCircle, Home, Briefcase, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';
import { t, getLanguage, subscribeLanguage } from '../i18n/i18n';

export default function SearchPage({ mockApiChanged }) {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [originStopId, setOriginStopId] = useState('');
  const [destinationStopId, setDestinationStopId] = useState('');
  const [accessible, setAccessible] = useState(false);
  const [loadingStops, setLoadingStops] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [error, setError] = useState(null);
  const [, setLangState] = useState(getLanguage());

  useEffect(() => {
    return subscribeLanguage(setLangState);
  }, []);

  useEffect(() => {
    async function loadStops() {
      setLoadingStops(true);
      setError(null);
      try {
        const data = await api.getStops();
        const validList = Array.isArray(data) ? data : [];
        setStops(validList);
        if (validList.length > 1) {
          setOriginStopId(validList[0].id);
          setDestinationStopId(validList[1].id);
        }
      } catch (err) {
        console.error("Failed to load stops:", err);
        setError("Could not load transit stops. Check backend connection or switch to Mock API mode.");
      } finally {
        setLoadingStops(false);
      }
    }
    loadStops();
  }, [mockApiChanged]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!originStopId || !destinationStopId) return;
    if (originStopId === destinationStopId) {
      setError("Origin and Destination cannot be the same stop.");
      return;
    }

    setIsSearching(true);
    setSearchStep(1);

    setTimeout(() => setSearchStep(2), 300);
    setTimeout(() => setSearchStep(3), 600);
    setTimeout(() => setSearchStep(4), 900);
    setTimeout(() => {
      navigate(`/results?origin=${originStopId}&destination=${destinationStopId}&accessible=${accessible}`);
    }, 1200);
  };

  const applyPreset = (orig, dest) => {
    setOriginStopId(orig);
    setDestinationStopId(dest);
    setError(null);
  };

  const startDailyCommute = () => {
    setOriginStopId('stop-1'); // Central Station / Home
    setDestinationStopId('stop-2'); // Tech Park / Office
    handleSearch();
  };

  const searchChecklist = [
    "Checking public transport operators...",
    "Comparing metro and bus fares...",
    "Checking transfer times & footpaths...",
    "Optimizing fastest & cheapest multi-modal routes..."
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <Sparkles size={14} /> Unified Multi-Modal Transit Engine
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '12px', lineHeight: 1.15 }}>
          {t('searchTitle')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
          {t('searchSubtitle')}
        </p>
      </div>

      {/* 1-Click Daily Commute Card */}
      <div
        className="glass-panel"
        style={{
          maxWidth: '840px',
          margin: '0 auto 32px auto',
          padding: '18px 24px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#3b82f6', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Home size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>
              {t('quickCommute')}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {t('homeToOffice')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className="live-indicator"></span> Metro Purple Line running on time
            </div>
          </div>
        </div>

        <button onClick={startDailyCommute} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
          Start Commute <ArrowRight size={16} />
        </button>
      </div>

      {error && (
        <div style={{
          maxWidth: '840px',
          margin: '0 auto 24px auto',
          padding: '14px 20px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-sm)',
          color: '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.9rem' }}>{error}</span>
        </div>
      )}

      {/* Searching Progress Checklist Modal */}
      {isSearching && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '36px', width: '90%', maxWidth: '480px', textAlign: 'center' }}>
            <Zap size={36} color="#60a5fa" className="pulse-alert" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Finding the Best Routes...</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {searchChecklist.map((stepText, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem' }}>
                  {searchStep > idx ? (
                    <CheckCircle size={18} color="#10b981" />
                  ) : (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--text-dim)' }} />
                  )}
                  <span style={{ color: searchStep > idx ? '#ffffff' : 'var(--text-muted)' }}>
                    {stepText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Form + Interactive Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Search Panel Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Navigation size={22} color="#3b82f6" /> Plan Your Trip
          </h2>

          <form onSubmit={handleSearch}>
            {/* Origin Picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                {t('fromLabel').toUpperCase()}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={originStopId}
                  onChange={(e) => setOriginStopId(e.target.value)}
                  disabled={loadingStops}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                >
                  {stops.map(s => (
                    <option key={s.id} value={s.id} style={{ background: '#0f172a', color: '#fff' }}>
                      {s.name} {s.noStairs ? '♿' : ''}
                    </option>
                  ))}
                </select>
                <MapPin size={18} color="#10b981" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>

            {/* Destination Picker */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                {t('toLabel').toUpperCase()}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={destinationStopId}
                  onChange={(e) => setDestinationStopId(e.target.value)}
                  disabled={loadingStops}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                >
                  {stops.map(s => (
                    <option key={s.id} value={s.id} style={{ background: '#0f172a', color: '#fff' }}>
                      {s.name} {s.noStairs ? '♿' : ''}
                    </option>
                  ))}
                </select>
                <MapPin size={18} color="#ef4444" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>

            {/* Accessibility Switch */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Accessibility size={20} color="#22d3ee" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Step-Free / Accessible</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prefer elevators & minimal stairs</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={accessible}
                  onChange={(e) => setAccessible(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Search CTA Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={loadingStops || !originStopId || !destinationStopId}
            >
              <Zap size={18} /> {t('findRoutes')}
            </button>
          </form>

          {/* Quick Presets */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              ⚡ Quick Demo Routes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => applyPreset('stop-1', 'stop-2')} className="btn-secondary" style={{ justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: '0.85rem' }}>Central Station ➔ Tech Park</span>
                <span className="badge badge-fastest">Fastest Multi-modal</span>
              </button>
              <button onClick={() => applyPreset('stop-10', 'stop-5')} className="btn-secondary" style={{ justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: '0.85rem' }}>Majestic ➔ Indiranagar</span>
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}>Metro Purple Line</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Preview Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>City Transit Network Map</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stops.length} Active Stops</span>
          </div>

          <MapComponent stops={stops} height="430px" />

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#a855f7' }}></span> Metro Purple
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span> Metro Green
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }}></span> Bus 201
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }}></span> Bus 500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
