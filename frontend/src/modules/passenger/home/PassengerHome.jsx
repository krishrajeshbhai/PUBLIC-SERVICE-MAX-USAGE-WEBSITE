import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Zap, ArrowRight, Sparkles, Footprints, Shield, Bus, Train, Leaf, Flame, Search, Radio, CheckCircle2 } from 'lucide-react';
import { getAuthUser } from '../../../store/authStore';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';
import LocationPromptModal from '../../../components/location/LocationPromptModal';
import { getState, subscribeLocation, startLiveLocationTracking } from '../../../store/liveLocationStore';

export default function PassengerHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getAuthUser() || { name: 'Abhiraj', id: 'user-1' });
  const [stops, setStops] = useState([]);
  const [searchDestination, setSearchDestination] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [liveLocationData, setLiveLocationData] = useState(null);
  const [navState, setNavState] = useState(getState());

  useEffect(() => {
    const unsub = subscribeLocation(setNavState);
    return unsub;
  }, []);

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
    navigate('/passenger/results?origin=stop-1&destination=stop-2');
  };

  const handleLocationAcquired = (loc) => {
    setLiveLocationData(loc);
    // Start tracking in store with current stops
    startLiveLocationTracking(null, stops);
  };

  const recentDestinations = [
    { label: 'Home', stopId: 'stop-1', stopName: 'Central Station', icon: '🏠', time: '12 min' },
    { label: 'College', stopId: 'stop-2', stopName: 'Tech Park', icon: '🎓', time: '42 min' },
    { label: 'Office', stopId: 'stop-4', stopName: 'MG Road', icon: '💼', time: '20 min' },
    { label: 'City Market', stopId: 'stop-11', stopName: 'City Market', icon: '🛍️', time: '15 min' }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      {/* Location Modal */}
      <LocationPromptModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationAcquired={handleLocationAcquired}
        stops={stops}
      />

      {/* Greeting Header & Live Location Request Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            {liveLocationData ? (
              <span style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} /> GPS Synced: {liveLocationData.nearestStop.name} (±{liveLocationData.accuracy}m)
              </span>
            ) : (
              <span>Location: Bengaluru Central Transit Hub</span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Good Morning, {user.name} 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
            Ready for your commute? All bus & metro lines running on regular schedule.
          </p>
        </div>

        {/* Ask Location / Live Location Button */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          style={{
            background: liveLocationData ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: liveLocationData ? '1px solid #10b981' : 'none',
            color: liveLocationData ? '#34d399' : '#ffffff',
            padding: '12px 20px',
            borderRadius: '14px',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: liveLocationData ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Navigation size={18} />
          {liveLocationData ? '📍 Live Location Active' : '📍 Ask & Show My Live Location'}
        </button>
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
              justifyContent: 'space-between',
              marginTop: '12px',
              fontSize: '0.8rem',
              color: '#94a3b8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#10b981" />
                <span>Origin: <strong>{liveLocationData ? liveLocationData.nearestStop.name : 'Central Station (stop-1)'}</strong></span>
              </div>

              <button
                onClick={() => setIsLocationModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 700 }}
              >
                Change ➔
              </button>
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

          {/* Interactive Transit Map with Live User GPS Marker */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>City Transit Grid</h3>
              {liveLocationData ? (
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                  📍 GPS ACTIVE
                </span>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{stops.length} Active Stops</span>
              )}
            </div>

            <MapComponent
              stops={stops}
              height="400px"
              userLocation={navState.userLocation}
              isTracking={navState.isTracking || !!liveLocationData}
              userBreadcrumbs={navState.userBreadcrumbs}
            />

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
