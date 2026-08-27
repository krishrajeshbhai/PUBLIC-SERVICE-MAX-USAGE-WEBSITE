import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, Accessibility, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';

export default function SearchPage({ mockApiChanged }) {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [originStopId, setOriginStopId] = useState('');
  const [destinationStopId, setDestinationStopId] = useState('');
  const [accessible, setAccessible] = useState(false);
  const [loadingStops, setLoadingStops] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStops() {
      setLoadingStops(true);
      setError(null);
      try {
        const data = await api.getStops();
        setStops(data);
        if (data.length > 1) {
          setOriginStopId(data[0].id); // Central Station
          setDestinationStopId(data[1].id); // Tech Park
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
    e.preventDefault();
    if (!originStopId || !destinationStopId) return;
    if (originStopId === destinationStopId) {
      setError("Origin and Destination cannot be the same stop.");
      return;
    }
    navigate(`/results?origin=${originStopId}&destination=${destinationStopId}&accessible=${accessible}`);
  };

  const applyPreset = (orig, dest) => {
    setOriginStopId(orig);
    setDestinationStopId(dest);
    setError(null);
  };

  const quickPresets = [
    { label: 'Central Station ➔ Tech Park', orig: 'stop-1', dest: 'stop-2', tag: 'Fastest Multi-modal' },
    { label: 'Majestic ➔ Indiranagar', orig: 'stop-10', dest: 'stop-5', tag: 'Purple Line Metro' },
    { label: 'Banashankari ➔ Malleshwaram', orig: 'stop-14', dest: 'stop-15', tag: 'Bus & Green Line' }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <Sparkles size={14} /> Next-Gen Multi-Modal Transit Engine
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '16px', lineHeight: 1.15 }}>
          One Search. One Ticket. <span className="gradient-text">One Wallet.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          Combine Metro, Bus & Walking in one unified itinerary. Automatically re-plans your trip the second a delay occurs.
        </p>
      </div>

      {error && (
        <div style={{
          maxWidth: '800px',
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
                ORIGIN STOP
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
                DESTINATION STOP
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
              <Zap size={18} /> Search Ranked Journeys
            </button>
          </form>

          {/* Quick Presets */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              ⚡ Quick Demo Routes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset.orig, preset.dest)}
                  className="btn-secondary"
                  style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{preset.label}</span>
                  <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', textTransform: 'none' }}>
                    {preset.tag}
                  </span>
                </button>
              ))}
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
