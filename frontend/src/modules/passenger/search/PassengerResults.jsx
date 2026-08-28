import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Footprints, Leaf, ArrowRight, ShieldCheck, Bus, Train, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';

export default function PassengerResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const originId = searchParams.get('origin') || 'stop-1';
  const destId = searchParams.get('destination') || 'stop-2';
  const accessible = searchParams.get('accessible') === 'true';

  const [options, setOptions] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [stopsData, searchRes] = await Promise.all([
          api.getStops(),
          api.searchJourneys(originId, destId, { accessible })
        ]);
        setStops(stopsData);
        setOptions(searchRes.options || []);
        if (searchRes.options && searchRes.options.length > 0) {
          setSelectedOption(searchRes.options[0]);
        }
      } catch (err) {
        console.error("Failed to calculate routes:", err);
        setError("Could not calculate journey routes. Please try another stop pair.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [originId, destId, accessible]);

  const handleBook = async (opt) => {
    setBooking(true);
    setError(null);
    try {
      const result = await api.bookTicket('user-1', opt.id, opt);
      // Navigate to passenger digital ticket screen
      navigate(`/passenger/tickets?ticketId=${result.ticket.id}`);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to book ticket from wallet");
    } finally {
      setBooking(false);
    }
  };

  const getStopName = (id) => {
    const s = stops.find(x => x.id === id);
    return s ? s.name : id;
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'fastest': return { label: '⚡ FASTEST', class: 'badge-fastest' };
      case 'cheapest': return { label: '💰 CHEAPEST', class: 'badge-cheapest' };
      case 'least_walking': return { label: '🚶 LEAST WALKING', class: 'badge-least_walking' };
      case 'accessible': return { label: '♿ ACCESSIBLE', class: 'badge-accessible' };
      default: return { label: 'RECOMMENDED', class: 'badge-fastest' };
    }
  };

  const getModeIcon = (mode) => {
    if (mode === 'metro') return <Train size={16} color="#a855f7" />;
    if (mode === 'bus') return <Bus size={16} color="#3b82f6" />;
    return <Footprints size={16} color="#94a3b8" />;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1240px', margin: '60px auto', textAlign: 'center' }}>
        <div className="live-indicator" style={{ width: 28, height: 28, marginBottom: 16 }}></div>
        <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Calculating Best Multi-Modal Routes...</h2>
        <p style={{ color: '#94a3b8' }}>Evaluating bus schedules, metro lines & walking connections</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      {/* Route Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        padding: '20px 24px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RANKED COMMUTE ITINERARIES
          </div>
          <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', color: '#fff' }}>
            <span style={{ color: '#10b981' }}>{getStopName(originId)}</span>
            <ArrowRight size={18} color="#94a3b8" />
            <span style={{ color: '#ef4444' }}>{getStopName(destId)}</span>
          </h2>
        </div>
        <button onClick={() => navigate('/passenger/search')} className="btn-secondary">
          Change Search
        </button>
      </div>

      {error && (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          color: '#fca5a5',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Grid: Options List + Map */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Left Column: Ranked Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
            {options.length} Route Options Available
          </h3>

          {options.map((opt) => {
            const badge = getTypeBadge(opt.type);
            const isSelected = selectedOption && selectedOption.id === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt)}
                className="glass-panel"
                style={{
                  padding: '22px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.8)',
                  boxShadow: isSelected ? '0 0 25px rgba(59, 130, 246, 0.2)' : 'none',
                  borderRadius: '16px'
                }}
              >
                {/* Badge Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className={`badge ${badge.class}`}>{badge.label}</span>
                  <span style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Leaf size={14} /> {opt.co2SavedGrams}g CO₂ Offset
                  </span>
                </div>

                {/* Metrics Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '10px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DURATION</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{opt.totalMinutes} min</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FARE</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>₹{opt.totalCost}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>WALK DISTANCE</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#93c5fd' }}>{opt.totalWalkMeters} m</div>
                  </div>
                </div>

                {/* Mode Segments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                  {opt.segments.map((seg, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getModeIcon(seg.mode)}
                        <span style={{ fontWeight: 700, color: '#fff' }}>
                          {seg.mode.toUpperCase()} {seg.lineId ? `(${seg.lineId})` : ''}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {getStopName(seg.fromStopId)} ➔ {getStopName(seg.toStopId)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{seg.minutes}m</span>
                        {seg.crowdLevel && (
                          <span className={`crowd-dot crowd-${seg.crowdLevel}`} title={`Crowd: ${seg.crowdLevel}`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBook(opt);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
                  disabled={booking}
                >
                  {booking ? 'Issuing Ticket...' : `Book Unified Ticket (₹${opt.totalCost})`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column: Route Map */}
        <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#10b981" /> Itinerary Route Visualization
          </h3>
          <MapComponent stops={stops} journeyOption={selectedOption} height="460px" />
        </div>
      </div>
    </div>
  );
}
