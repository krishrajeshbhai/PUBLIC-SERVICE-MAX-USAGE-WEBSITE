import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Zap, ArrowRight, Sparkles, Footprints, Shield, Bus, Train, Leaf, Flame, Search } from 'lucide-react';
import { getAuthUser } from '../../../store/authStore';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';

export default function PassengerHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser() || { name: 'Abhiraj', id: 'user-1' });
  const [stops, setStops] = useState([]);
  const [searchDestination, setSearchDestination] = useState('');

  useEffect(() => {
    async function loadStops() {
      try {
        const data = await api.getStops();
        setStops(data);
      } catch (e) {
        console.warn("Could not fetch stops for dashboard:", e);
      }
    }
    loadStops();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchDestination.trim()) {
      navigate('/passenger/search');
    } else {
      navigate(`/passenger/search?query=${encodeURIComponent(searchDestination)}`);
    }
  };

  const handleStartUsualJourney = () => {
    // Quick book/view usual route: stop-1 (Central Station / Home) -> stop-2 (Tech Park / College)
    navigate('/passenger/results?origin=stop-1&destination=stop-2');
  };

  const recentDestinations = [
    { label: 'Home', stopId: 'stop-1', stopName: 'Central Station', icon: '🏠', time: '12 min' },
    { label: 'College', stopId: 'stop-2', stopName: 'Tech Park', icon: '🎓', time: '42 min' },
    { label: 'Office', stopId: 'stop-4', stopName: 'MG Road', icon: '💼', time: '20 min' },
    { label: 'City Market', stopId: 'stop-11', stopName: 'City Market', icon: '🛍️', time: '15 min' }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      {/* Greeting Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          Location: Bengaluru Central Transit Hub
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          Good Morning, {user.name} 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
          Ready for your commute? All bus & metro lines running on regular schedule.
        </p>
      </div>

      {/* Main Grid: Commute Search & Usual Journey on Left, Map & Stats on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Search Bar Card */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.8)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
              Where do you want to go?
            </h2>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="text"
                  placeholder="Search stop, station, or college..."
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ borderRadius: '12px', padding: '0 20px', whiteSpace: 'nowrap' }}
              >
                Search
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '0.8rem',
              color: '#94a3b8'
            }}>
              <MapPin size={14} color="#10b981" />
              <span>Current: <strong>Central Station (stop-1)</strong></span>
            </div>
          </div>

          {/* YOUR USUAL JOURNEY Featured Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span className="badge" style={{ background: '#3b82f6', color: '#fff', fontWeight: 800 }}>
                ⭐ YOUR USUAL COMMUTE
              </span>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Leaf size={14} /> 420g CO₂ Saved
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Home ➔ College
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
                Central Station ➔ Tech Park (via Bus 201 + Metro Purple)
              </div>
            </div>

            {/* Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '12px',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>DURATION</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>42 min</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>FARE</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>₹28</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>STATUS</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60a5fa' }}>🟢 On Time</div>
              </div>
            </div>

            <button
              onClick={handleStartUsualJourney}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}
            >
              <Zap size={18} /> Start Usual Journey Now
            </button>
          </div>

          {/* Recent & Saved Locations */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              SAVED & RECENT PLACES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {recentDestinations.map((place, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/passenger/results?origin=stop-1&destination=${place.stopId}`)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{place.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{place.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{place.stopName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Network Map & Commute Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Commute Streak & Eco Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
                <Flame size={18} /> COMMUTE STREAK
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                7 Days 🔥
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Top 5% green commuter in Bengaluru
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.8rem', fontWeight: 700 }}>
                <Leaf size={18} /> CARBON SAVED
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
                9.2 kg
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Equal to 14kg of coal emissions
              </div>
            </div>
          </div>

          {/* Interactive Transit Map */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>City Transit Grid</h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{stops.length} Active Stops</span>
            </div>

            <MapComponent stops={stops} height="400px" />

            <div style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginTop: '12px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }}></span> Metro Purple
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Metro Green
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></span> Bus 201
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }}></span> Bus 500
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
