import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Footprints, Leaf, ArrowRight, ShieldCheck, Bus, Train, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';

export default function ResultsPage({ onTicketBooked, mockApiChanged }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const originId = searchParams.get('origin');
  const destId = searchParams.get('destination');
  const accessible = searchParams.get('accessible') === 'true';

  const [options, setOptions] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!originId || !destId) {
        navigate('/');
        return;
      }
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
        console.error("Failed to load journey results:", err);
        setError("Failed to calculate journey options. Please try another route or switch API mode.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [originId, destId, accessible, mockApiChanged, navigate]);

  const handleBook = async (option) => {
    setBooking(true);
    setError(null);
    try {
      const result = await api.bookTicket('user-1', option.id, option);
      if (onTicketBooked) {
        onTicketBooked(result.ticket.id, result.walletBalance);
      }
      navigate(`/ticket/${result.ticket.id}`);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to book ticket");
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
      <div style={{ maxWidth: '1280px', margin: '60px auto', textAlign: 'center' }}>
        <div className="live-indicator" style={{ width: 24, height: 24, marginBottom: 16 }}></div>
        <h2 style={{ fontSize: '1.4rem' }}>Calculating Optimal Ranked Routes...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Evaluating Bus, Metro, Walk edges & Crowd levels</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Route Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        padding: '20px 24px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            SEARCH RESULTS FOR
          </div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <span style={{ color: '#10b981' }}>{getStopName(originId)}</span>
            <ArrowRight size={20} color="var(--text-muted)" />
            <span style={{ color: '#ef4444' }}>{getStopName(destId)}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Change Route
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-sm)',
          color: '#fca5a5',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Main Grid: Journey Option Cards + Map View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Ranked Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
            {options.length} Ranked Journey Options
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
                  padding: '24px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-card)',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-card)',
                  position: 'relative'
                }}
              >
                {/* Badge & Mode Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span className={`badge ${badge.class}`}>{badge.label}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Leaf size={14} color="#34d399" /> {opt.co2SavedGrams}g CO₂ Saved
                  </span>
                </div>

                {/* Key Metrics Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DURATION</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{opt.totalMinutes} min</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FARE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>₹{opt.totalCost}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WALKING</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#93c5fd' }}>{opt.totalWalkMeters} m</div>
                  </div>
                </div>

                {/* Step List Segments Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {opt.segments.map((seg, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {getModeIcon(seg.mode)}
                        <span style={{ fontWeight: 600, color: '#e5e7eb' }}>
                          {seg.mode.toUpperCase()} {seg.lineId ? `(${seg.lineId})` : ''}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {getStopName(seg.fromStopId)} ➔ {getStopName(seg.toStopId)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{seg.minutes} min</span>
                        {seg.crowdLevel && (
                          <span className={`crowd-dot crowd-${seg.crowdLevel}`} title={`Crowd level: ${seg.crowdLevel}`}></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBook(opt);
                  }}
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={booking}
                >
                  {booking ? 'Deducting Wallet & Issuing Ticket...' : `Book Unified Ticket (₹${opt.totalCost})`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Option Map */}
        <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#10b981" /> Itinerary Route Map
          </h3>
          <MapComponent stops={stops} journeyOption={selectedOption} height="480px" />
          {selectedOption && (
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing path for: <strong style={{ color: '#fff' }}>{selectedOption.type.toUpperCase()}</strong> ({selectedOption.totalMinutes} mins · ₹{selectedOption.totalCost})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
