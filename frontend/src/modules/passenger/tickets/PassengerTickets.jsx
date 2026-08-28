import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ticket, QrCode, AlertTriangle, RefreshCw, CheckCircle2, Clock, Zap, MapPin, Bus, Train, Footprints, ShieldCheck } from 'lucide-react';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';
import DynamicQRCode from '../../../components/ticket/DynamicQRCode';

export default function PassengerTickets() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticketIdParam = searchParams.get('ticketId') || 'tkt-active-101';

  const [ticketId, setTicketId] = useState(ticketIdParam);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [stops, setStops] = useState([]);
  const [activeOption, setActiveOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [lastPolled, setLastPolled] = useState(new Date());

  useEffect(() => {
    async function init() {
      try {
        const stopsData = await api.getStops();
        setStops(stopsData);

        const liveRes = await api.getLiveTicketStatus(ticketId);
        setTicketStatus(liveRes);
        if (liveRes.rerouted) {
          setActiveOption(liveRes.rerouted);
        }
      } catch (e) {
        console.warn("Error fetching ticket:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [ticketId]);

  // 5-second polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const liveRes = await api.getLiveTicketStatus(ticketId);
        setTicketStatus(liveRes);
        if (liveRes.rerouted) {
          setActiveOption(liveRes.rerouted);
        }
        setLastPolled(new Date());
      } catch (e) {
        console.warn("Polling ticket update:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ticketId]);

  const handleSimulateDelay = async () => {
    setSimulating(true);
    try {
      await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      const updatedStatus = await api.getLiveTicketStatus(ticketId);
      setTicketStatus(updatedStatus);
      if (updatedStatus.rerouted) {
        setActiveOption(updatedStatus.rerouted);
      }
    } catch (e) {
      console.error("Delay simulation error:", e);
    } finally {
      setSimulating(false);
    }
  };

  const isRerouted = ticketStatus && (ticketStatus.status === 'rerouted' || !!ticketStatus.rerouted);

  const getStopName = (id) => {
    const s = stops.find(x => x.id === id);
    return s ? s.name : id;
  };

  const displayOption = activeOption || (ticketStatus && ticketStatus.journeyOption) || {
    id: 'jo-commute-default',
    type: 'fastest',
    totalMinutes: 24,
    totalCost: 28,
    totalWalkMeters: 450,
    co2SavedGrams: 420,
    segments: [
      { mode: 'walk', fromStopId: 'stop-1', toStopId: 'stop-3', minutes: 5, cost: 0, crowdLevel: 'green' },
      { mode: 'bus', lineId: 'line-bus-201', fromStopId: 'stop-3', toStopId: 'stop-4', minutes: 14, cost: 14, crowdLevel: 'yellow' },
      { mode: 'metro', lineId: 'line-purple', fromStopId: 'stop-4', toStopId: 'stop-2', minutes: 5, cost: 14, crowdLevel: 'green' }
    ]
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      {/* Top Banner: Delay & Auto-Reroute Alert */}
      {isRerouted ? (
        <div className="pulse-alert" style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#f59e0b', padding: '10px', borderRadius: '50%', display: 'flex' }}>
              <AlertTriangle size={24} color="#000" />
            </div>
            <div>
              <div style={{ color: '#fef08a', fontWeight: 800, fontSize: '1.05rem' }}>
                AUTOMATIC LIVE RE-ROUTE ACTIVATED
              </div>
              <div style={{ color: '#fef3c7', fontSize: '0.88rem', marginTop: '2px' }}>
                {ticketStatus.alert || "Bus 201 delayed 15 min. TransitOne re-routed your connection via Metro Purple Line!"}
              </div>
            </div>
          </div>
          <span className="badge" style={{ background: '#f59e0b', color: '#000', padding: '6px 14px', fontWeight: 800 }}>
            ⚡ NEW OPTIMAL ROUTE
          </span>
        </div>
      ) : (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="live-indicator"></span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34d399' }}>
              Live Journey Active · Polling every 5s (Checked {lastPolled.toLocaleTimeString()})
            </span>
          </div>

          <button
            onClick={handleSimulateDelay}
            className="btn-warning"
            disabled={simulating}
            style={{ borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Zap size={15} /> {simulating ? 'Injecting...' : 'Simulate Live Delay (Demo)'}
          </button>
        </div>
      )}

      {/* Grid: QR Ticket Card & Timeline on Left, Live Map on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Left Column: Digital Ticket */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '5px',
              background: isRerouted ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #3b82f6, #10b981)'
            }} />

            {/* Ticket Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', marginBottom: '6px' }}>
                  UNIFIED COMMUTER PASS
                </span>
                <h2 style={{ fontSize: '1.3rem', fontFamily: 'monospace', margin: 0, color: '#fff' }}>
                  {ticketId}
                </h2>
              </div>
              <span className="badge" style={{
                background: isRerouted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: isRerouted ? '#f59e0b' : '#34d399',
                border: isRerouted ? '1px solid #f59e0b' : '1px solid #10b981'
              }}>
                {isRerouted ? '⚠️ REROUTED' : '🟢 ACTIVE'}
              </span>
            </div>

            {/* QR Mockup & Details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '14px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>COMMUTER</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Abhiraj (user-1)</div>

                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>FARE AUTO-DEDUCTED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>₹{displayOption.totalCost}</div>
              </div>

              {/* Dynamic QR */}
              <div style={{ background: '#fff', padding: '10px', borderRadius: '12px' }}>
                <QrCode size={72} color="#0f172a" />
              </div>
            </div>

            {/* Connected Vertical Timeline */}
            <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={17} color="#3b82f6" /> Connected Multi-Modal Timeline
            </h3>

            <div className="timeline-track">
              {displayOption.segments.map((seg, idx) => (
                <div key={idx} className="timeline-step">
                  <div className="timeline-node" style={{
                    borderColor: seg.mode === 'metro' ? '#a855f7' : seg.mode === 'bus' ? '#3b82f6' : '#94a3b8'
                  }} />
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                        {seg.mode.toUpperCase()} {seg.lineId ? `(${seg.lineId})` : ''}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>{seg.minutes} mins</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#10b981" /> Live Journey Tracking Map
            </h3>
            <span className="badge" style={{
              background: isRerouted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              color: isRerouted ? '#f59e0b' : '#60a5fa'
            }}>
              {isRerouted ? 'UPDATED REROUTE' : 'SCHEDULED PATH'}
            </span>
          </div>

          <MapComponent stops={stops} journeyOption={displayOption} isRerouted={isRerouted} height="480px" />
        </div>
      </div>
    </div>
  );
}
