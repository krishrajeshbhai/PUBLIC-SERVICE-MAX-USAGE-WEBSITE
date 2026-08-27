import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ticket, QrCode, AlertTriangle, RefreshCw, CheckCircle, Clock, Zap, MapPin, Bus, Train, Footprints, ShieldCheck, Check, X } from 'lucide-react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';
import DynamicQRCode from '../components/ticket/DynamicQRCode';
import { getAuthUser } from '../store/authStore';

export default function TicketPage({ mockApiChanged, onWalletUpdated }) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const [ticketStatus, setTicketStatus] = useState(null);
  const [stops, setStops] = useState([]);
  const [activeOption, setActiveOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);
  const [lastPolled, setLastPolled] = useState(new Date());

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const userId = authUser ? authUser.id : 'user-1';
        const [stopsData, liveRes, walletRes] = await Promise.all([
          api.getStops(),
          api.getLiveTicketStatus(ticketId),
          api.getWallet(userId)
        ]);

        setStops(stopsData);
        setTicketStatus(liveRes);
        if (liveRes.rerouted) {
          setActiveOption(liveRes.rerouted);
        }
        if (walletRes && typeof walletRes.balance === 'number' && onWalletUpdated) {
          onWalletUpdated(walletRes.balance);
        }
      } catch (err) {
        console.error("Error loading ticket:", err);
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [ticketId, mockApiChanged]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const liveRes = await api.getLiveTicketStatus(ticketId);
        setTicketStatus(liveRes);
        if (liveRes.rerouted) {
          setActiveOption(liveRes.rerouted);
        }
        setLastPolled(new Date());
      } catch (err) {
        console.warn("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ticketId]);

  const handleSimulateDelay = async () => {
    setSimulating(true);
    setError(null);
    try {
      await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      const updatedStatus = await api.getLiveTicketStatus(ticketId);
      setTicketStatus(updatedStatus);
    } catch (err) {
      console.error("Delay simulation error:", err);
      setError("Failed to simulate delay on server.");
    } finally {
      setSimulating(false);
    }
  };

  const handleConfirmReroute = async () => {
    try {
      const res = await api.confirmReroute(ticketId);
      const liveRes = await api.getLiveTicketStatus(ticketId);
      setTicketStatus(liveRes);
      if (liveRes.rerouted) setActiveOption(liveRes.rerouted);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectReroute = async () => {
    try {
      await api.rejectReroute(ticketId);
      const liveRes = await api.getLiveTicketStatus(ticketId);
      setTicketStatus(liveRes);
    } catch (e) {
      console.error(e);
    }
  };

  const getStopName = (id) => {
    const s = stops.find(x => x.id === id);
    return s ? s.name : id;
  };

  const isDelayDetected = ticketStatus && ticketStatus.status === 'delay_detected';
  const isRerouted = Boolean(ticketStatus && (ticketStatus.status === 'rerouted' || ticketStatus.rerouted));

  const defaultFallbackOption = {
    id: 'jo-fallback',
    type: 'fastest',
    totalMinutes: 24,
    totalCost: 28,
    totalWalkMeters: 350,
    co2SavedGrams: 420,
    segments: [
      { mode: 'walk', fromStopId: 'stop-1', toStopId: 'stop-3', minutes: 5, cost: 0, crowdLevel: 'green' },
      { mode: 'bus', lineId: 'line-bus-201', fromStopId: 'stop-3', toStopId: 'stop-4', minutes: 14, cost: 14, crowdLevel: 'yellow' },
      { mode: 'metro', lineId: 'line-purple', fromStopId: 'stop-4', toStopId: 'stop-2', minutes: 5, cost: 14, crowdLevel: 'green' }
    ]
  };

  const displayOption = activeOption || (ticketStatus && (ticketStatus.journeyOption || (ticketStatus.ticket && ticketStatus.ticket.journeyOption) || ticketStatus.rerouted)) || defaultFallbackOption;

  if (loading) {
    return (
      <div style={{ maxWidth: '1280px', margin: '60px auto', textAlign: 'center' }}>
        <div className="live-indicator" style={{ width: 24, height: 24, marginBottom: 16 }}></div>
        <h2>Loading Digital Ticket & Live Status...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Interactive Delay Detection Notification Card */}
      {isDelayDetected ? (
        <div className="pulse-alert" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)',
          border: '2px solid #f59e0b',
          borderRadius: 'var(--radius-md)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: '#f59e0b', padding: '10px', borderRadius: '50%', display: 'flex' }}>
              <AlertTriangle size={24} color="#000" />
            </div>
            <div>
              <div style={{ color: '#fef08a', fontWeight: 800, fontSize: '1.15rem' }}>
                ⚠️ JOURNEY DISRUPTION DETECTED
              </div>
              <div style={{ color: '#fef3c7', fontSize: '0.95rem', marginTop: '4px' }}>
                {ticketStatus.alert || "Bus 201 is delayed by 15 mins. An alternative route via Metro Purple Line is available that saves 12 minutes!"}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={handleConfirmReroute} className="btn-warning" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
              <Check size={18} /> Switch to New Route (Save 12 mins)
            </button>
            <button onClick={handleRejectReroute} className="btn-secondary">
              <X size={18} /> Keep Current Route
            </button>
          </div>
        </div>
      ) : isRerouted ? (
        <div style={{
          padding: '20px 24px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-md)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={22} color="#34d399" />
            <span style={{ color: '#34d399', fontWeight: 700 }}>
              Updated Route Active: Switched to Metro Purple Line (Saved 12 minutes)
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '16px 24px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="live-indicator"></span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34d399' }}>
              Live Journey Active · Polling every 5s (Last checked {lastPolled.toLocaleTimeString()})
            </span>
          </div>
          <button onClick={handleSimulateDelay} className="btn-warning" disabled={simulating}>
            <Zap size={16} /> {simulating ? 'Injecting Delay...' : 'Simulate Live Delay (Demo)'}
          </button>
        </div>
      )}

      {error && (
        <div style={{ padding: '14px 20px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Main Layout: Digital Ticket + Interactive Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Digital Ticket & Connected Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Digital Dynamic QR Ticket Box */}
          <div className="glass-panel" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '6px',
              background: isRerouted ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #3b82f6, #10b981)'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', marginBottom: '6px' }}>
                  UNIFIED PASSENGER TICKET
                </span>
                <h2 style={{ fontSize: '1.4rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{ticketId}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge" style={{
                  background: isRerouted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isRerouted ? '#f59e0b' : '#34d399',
                  border: isRerouted ? '1px solid #f59e0b' : '1px solid #10b981'
                }}>
                  {isRerouted ? '⚠️ REROUTED' : '🟢 ACTIVE'}
                </span>
              </div>
            </div>

            {/* Dynamic SVG QR Generator & Fare Details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PASSENGER</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  {authUser ? authUser.name : 'Passenger User'}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DYNAMIC CALCULATED FARE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>₹{displayOption.totalCost}.00</div>
              </div>

              {/* SVG QR Code Generator */}
              <DynamicQRCode
                ticketId={ticketId}
                fare={displayOption.totalCost}
                userName={authUser ? authUser.name : 'Passenger'}
                size={100}
              />
            </div>

            {/* Connected Multi-Modal Itinerary Timeline */}
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#3b82f6" /> Unified Itinerary Timeline
            </h3>

            <div className="timeline-track">
              {displayOption.segments.map((seg, idx) => (
                <div key={idx} className="timeline-step">
                  <div className="timeline-node" style={{ borderColor: seg.mode === 'metro' ? '#a855f7' : seg.mode === 'bus' ? '#3b82f6' : '#94a3b8' }}>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                        {seg.mode.toUpperCase()} {seg.lineId ? `(${seg.lineId})` : ''}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>{seg.minutes} mins · ₹{seg.cost}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      From <strong style={{ color: '#e5e7eb' }}>{getStopName(seg.fromStopId)}</strong> ➔ To <strong style={{ color: '#e5e7eb' }}>{getStopName(seg.toStopId)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Map */}
        <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#10b981" /> Live Journey Map
            </h3>
            <span className="badge" style={{ background: isRerouted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: isRerouted ? '#f59e0b' : '#60a5fa' }}>
              {isRerouted ? 'UPDATED ROUTE' : 'ORIGINAL ROUTE'}
            </span>
          </div>

          <MapComponent stops={stops} journeyOption={displayOption} isRerouted={isRerouted} height="480px" />
        </div>
      </div>
    </div>
  );
}
