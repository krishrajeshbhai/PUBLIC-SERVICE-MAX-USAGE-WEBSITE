import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, X, Radio } from 'lucide-react';
import {
  getState,
  startLiveLocationTracking,
  getHaversineDistance
} from '../../store/liveLocationStore';

export default function LocationPromptModal({ isOpen, onClose, onLocationAcquired, stops = [] }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleRequestLocation = () => {
    setLoading(true);
    setErrorMsg(null);

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;

          // Find nearest stop from stops list
          let nearest = null;
          let minDistance = Infinity;

          stops.forEach(s => {
            if (s && typeof s.lat === 'number' && typeof s.lng === 'number') {
              const d = getHaversineDistance(latitude, longitude, s.lat, s.lng);
              if (d < minDistance) {
                minDistance = d;
                nearest = { ...s, distanceMeters: d };
              }
            }
          });

          const locResult = {
            lat: latitude,
            lng: longitude,
            accuracy: Math.round(accuracy || 10),
            speed: speed ? Math.round(speed * 3.6) : 0,
            nearestStop: nearest || { name: 'Bengaluru Central', id: 'stop-1' }
          };

          setSuccessData(locResult);
          setLoading(false);

          // Notify parent callback
          if (onLocationAcquired) {
            onLocationAcquired(locResult);
          }

          setTimeout(() => {
            onClose();
          }, 1800);
        },
        (err) => {
          console.warn("Geolocation permission error:", err);
          setLoading(false);
          setErrorMsg(
            err.code === 1
              ? "Location permission was denied. You can enable it in browser settings or use Demo GPS."
              : "Unable to retrieve GPS signal. Try using Demo GPS coordinates."
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLoading(false);
      setErrorMsg("Geolocation is not supported on this device/browser.");
    }
  };

  const handleUseDemoLocation = () => {
    const demoLoc = {
      lat: 12.9716,
      lng: 77.5946,
      accuracy: 8,
      speed: 0,
      nearestStop: { name: 'Central Station (Bengaluru Hub)', id: 'stop-1' }
    };
    setSuccessData(demoLoc);
    if (onLocationAcquired) {
      onLocationAcquired(demoLoc);
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '32px 28px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* GPS Radar Icon */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
        }}>
          <Navigation size={34} color="#fff" />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
          Enable Live Location Tracking
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          Allow location access so TransitOne can track your live movement, detect nearby stops, and provide turn-by-turn guidance.
        </p>

        {/* Success Banner */}
        {successData && (
          <div style={{
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: '14px',
            color: '#34d399',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
              <CheckCircle2 size={18} /> Live GPS Acquired!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
              Nearest Stop: <strong>{successData.nearestStop.name}</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Lat: {successData.lat.toFixed(5)}, Lng: {successData.lng.toFixed(5)} (Accuracy: ±{successData.accuracy}m)
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            padding: '14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '14px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <AlertCircle size={18} color="#ef4444" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        {!successData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleRequestLocation}
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <span className="live-indicator"></span> Acquiring GPS Signal...
                </>
              ) : (
                <>
                  <Navigation size={18} /> Allow & Show My Live Location
                </>
              )}
            </button>

            <button
              onClick={handleUseDemoLocation}
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                color: '#cbd5e1'
              }}
            >
              Use Demo City Center Coordinates
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '20px',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <ShieldCheck size={14} /> Your GPS location is processed locally for transit navigation.
        </div>
      </div>
    </div>
  );
}
