import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, Accessibility, Zap, Clock, DollarSign, Footprints } from 'lucide-react';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';

export default function PassengerSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const [stops, setStops] = useState([]);
  const [originStopId, setOriginStopId] = useState('stop-1');
  const [destinationStopId, setDestinationStopId] = useState('stop-2');
  const [preference, setPreference] = useState('fastest'); // 'fastest' | 'cheapest' | 'least_walking' | 'accessible'
  const [accessible, setAccessible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStops() {
      try {
        const data = await api.getStops();
        setStops(data);
        if (data.length > 1) {
          if (queryParam) {
            const matched = data.find(s => s.name.toLowerCase().includes(queryParam.toLowerCase()));
            if (matched) {
              setDestinationStopId(matched.id);
            }
          }
        }
      } catch (e) {
        console.warn("Could not load stops:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStops();
  }, [queryParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!originStopId || !destinationStopId) return;
    if (originStopId === destinationStopId) {
      alert("Origin and Destination cannot be the same stop.");
      return;
    }
    navigate(`/passenger/results?origin=${originStopId}&destination=${destinationStopId}&pref=${preference}&accessible=${accessible || preference === 'accessible'}`);
  };

  const quickRoutes = [
    { label: 'Central Station ➔ Tech Park', orig: 'stop-1', dest: 'stop-2', tag: 'Fastest Multi-modal' },
    { label: 'Majestic ➔ Indiranagar', orig: 'stop-10', dest: 'stop-5', tag: 'Purple Line Metro' },
    { label: 'Banashankari ➔ Malleshwaram', orig: 'stop-14', dest: 'stop-15', tag: 'Green Line + Bus' }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          Plan Your Commute
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          Compare Fastest, Cheapest, and Step-Free routes with live crowd data.
        </p>
      </div>

      {/* Grid: Form + Network Map */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Form Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <form onSubmit={handleSearch}>
            {/* Origin */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                FROM (ORIGIN STOP)
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={originStopId}
                  onChange={(e) => setOriginStopId(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
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
                <MapPin size={18} color="#10b981" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              </div>
            </div>

            {/* Destination */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                TO (DESTINATION STOP)
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={destinationStopId}
                  onChange={(e) => setDestinationStopId(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
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
                <MapPin size={18} color="#ef4444" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              </div>
            </div>

            {/* Route Preferences Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>
                COMMUTE PREFERENCE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { id: 'fastest', label: '⚡ Fastest', desc: 'Min trip time' },
                  { id: 'cheapest', label: '💰 Cheapest', desc: 'Lowest fare' },
                  { id: 'least_walking', label: '🚶 Least Walking', desc: 'Direct transit' },
                  { id: 'accessible', label: '♿ Accessible', desc: 'No stairs / Elevators' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPreference(p.id);
                      if (p.id === 'accessible') setAccessible(true);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: preference === p.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: preference === p.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: preference === p.id ? '#fff' : '#94a3b8',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}
            >
              <Zap size={18} /> Find Ranked Routes
            </button>
          </form>

          {/* Quick Route Suggestions */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
              ⚡ Popular Commute Corridors
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickRoutes.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setOriginStopId(r.orig);
                    setDestinationStopId(r.dest);
                  }}
                  className="btn-secondary"
                  style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}
                >
                  <span>{r.label}</span>
                  <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                    {r.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Preview Panel */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Transit Stop Network</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{stops.length} Total Stops</span>
          </div>
          <MapComponent stops={stops} height="480px" />
        </div>
      </div>
    </div>
  );
}
