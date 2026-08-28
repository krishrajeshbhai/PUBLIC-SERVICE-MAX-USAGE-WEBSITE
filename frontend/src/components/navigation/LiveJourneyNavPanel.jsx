import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Compass,
  Footprints,
  Bus,
  Train,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Zap,
  MapPin,
  ShieldCheck,
  Radio
} from 'lucide-react';
import {
  getState,
  subscribeLocation,
  startLiveLocationTracking,
  stopLiveLocationTracking,
  togglePauseTracking,
  startSimulationPlayback,
  simulateOffRouteDeviation,
  recalculateAlternativeRoute,
  speakNotification
} from '../../store/liveLocationStore';

export default function LiveJourneyNavPanel({ journeyOption, stops = [], onStepChange }) {
  const [navState, setNavState] = useState(getState());

  useEffect(() => {
    const unsub = subscribeLocation(setNavState);
    return unsub;
  }, []);

  const segments = journeyOption?.segments || [];
  const currentSeg = segments[navState.currentSegmentIndex] || segments[0];
  const nextSeg = segments[navState.currentSegmentIndex + 1];

  const getStopName = (id) => {
    const s = stops.find(x => x.id === id);
    return s ? s.name : id;
  };

  const getModeIcon = (mode) => {
    if (mode === 'metro') return <Train size={20} color="#a855f7" />;
    if (mode === 'bus') return <Bus size={20} color="#3b82f6" />;
    return <Footprints size={20} color="#34d399" />;
  };

  const handleStartGPS = () => {
    startLiveLocationTracking(journeyOption, stops);
  };

  const handleStartSimulation = () => {
    startSimulationPlayback(journeyOption, stops);
  };

  const handlePause = () => {
    togglePauseTracking();
  };

  const handleStop = () => {
    stopLiveLocationTracking();
  };

  const handleTestDeviation = () => {
    simulateOffRouteDeviation();
  };

  const handleRecalculate = () => {
    recalculateAlternativeRoute();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Top Turn-by-Turn Instruction Banner */}
      <div style={{
        padding: '18px 22px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: '18px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}>
            {getModeIcon(currentSeg?.mode)}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              STEP {navState.currentSegmentIndex + 1} OF {segments.length} · {currentSeg?.mode.toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>
              {currentSeg?.mode === 'walk'
                ? `Walk to ${getStopName(currentSeg.toStopId)}`
                : `Board ${currentSeg?.lineId ? currentSeg.lineId.toUpperCase() : 'Transit'} to ${getStopName(currentSeg?.toStopId)}`}
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Next transfer: {nextSeg ? `${nextSeg.mode.toUpperCase()} at ${getStopName(nextSeg.fromStopId)}` : 'Final Destination'}
            </div>
          </div>
        </div>

        {/* Live Tracking Mode Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navState.isTracking ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: navState.isPaused ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              border: `1px solid ${navState.isPaused ? '#f59e0b' : '#10b981'}`,
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: navState.isPaused ? '#f59e0b' : '#34d399'
            }}>
              <Radio size={14} className={navState.isPaused ? '' : 'live-indicator'} />
              <span>{navState.isPaused ? 'PAUSED' : navState.isSimulated ? 'SIMULATED GPS' : 'LIVE GPS ACTIVE'}</span>
            </div>
          ) : (
            <button
              onClick={handleStartGPS}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
            >
              <Navigation size={15} /> Start GPS Tracking
            </button>
          )}
        </div>
      </div>

      {/* 2. Contextual Notification Alert */}
      {navState.activeNotification && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          background: navState.activeNotification.type === 'deviation'
            ? 'rgba(239, 68, 68, 0.2)'
            : navState.activeNotification.type === 'milestone'
            ? 'rgba(16, 185, 129, 0.2)'
            : 'rgba(59, 130, 246, 0.2)',
          border: `1px solid ${
            navState.activeNotification.type === 'deviation'
              ? '#ef4444'
              : navState.activeNotification.type === 'milestone'
              ? '#10b981'
              : '#3b82f6'
          }`,
          color: '#fff',
          fontSize: '0.88rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulseGlow 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.1rem' }}>🔔</span>
            <span>{navState.activeNotification.message}</span>
          </div>
          <button
            onClick={() => speakNotification(navState.activeNotification.message)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}
            title="Replay Audio"
          >
            <Volume2 size={16} />
          </button>
        </div>
      )}

      {/* 3. Off-Route Deviation Warning Box */}
      {navState.isOffRoute && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.25) 100%)',
          border: '2px solid #ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#ef4444" />
            <div>
              <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.95rem' }}>
                ROUTE DEVIATION DETECTED ({navState.deviationDistanceMeters}m off-route)
              </div>
              <div style={{ color: '#fecaca', fontSize: '0.82rem' }}>
                You seem to have taken an alternate path. Would you like to recalculate?
              </div>
            </div>
          </div>
          <button
            onClick={handleRecalculate}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Recalculate Alternative Route ➔
          </button>
        </div>
      )}

      {/* 4. Live Telemetry HUD Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>REMAINING DISTANCE</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
            {navState.remainingDistanceMeters > 1000
              ? `${(navState.remainingDistanceMeters / 1000).toFixed(1)} km`
              : `${navState.remainingDistanceMeters} m`}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ESTIMATED TIME</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
            {navState.remainingDurationMinutes} min
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CURRENT SPEED</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
            {navState.userLocation.speed || 0} km/h
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>NEAREST TRANSIT STOP</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {navState.nearestStop ? navState.nearestStop.name : 'Central Station'}
          </div>
        </div>
      </div>

      {/* 5. Overall Journey Progress Bar */}
      <div style={{ padding: '0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
          <span>JOURNEY COMPLETION</span>
          <span style={{ fontWeight: 800, color: '#34d399' }}>{navState.overallProgress}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${navState.overallProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* 6. Navigation Controls & Simulation Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {navState.isTracking ? (
            <>
              <button
                onClick={handlePause}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: '8px' }}
              >
                {navState.isPaused ? <Play size={14} /> : <Pause size={14} />}
                {navState.isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                onClick={handleStop}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Square size={14} /> Stop
              </button>
            </>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: '8px', color: '#60a5fa' }}
            >
              <Play size={14} /> Simulate Movement (Demo)
            </button>
          )}
        </div>

        {/* Demo Deviation Trigger */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleTestDeviation}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.78rem', borderRadius: '8px', color: '#fbbf24' }}
            title="Simulate walking off-route to test auto-deviation alert"
          >
            ⚠️ Test Off-Route Deviation
          </button>
        </div>
      </div>
    </div>
  );
}
