import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, ArrowRight, ShieldCheck, Bus, Train } from 'lucide-react';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';
import { TOURIST_DESTINATIONS } from './VisitorExplore';

export default function VisitorMapPage() {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);

  useEffect(() => {
    async function loadStops() {
      try {
        const data = await api.getStops();
        setStops(data);
      } catch (e) {
        console.warn("Could not load map stops:", e);
      }
    }
    loadStops();
  }, []);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Interactive Tourist & Transit Map
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          Explore city metro connections, bus corridors, and historical monument stops.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Map Container */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <MapComponent stops={stops} height="520px" />
        </div>

        {/* Tourist Hotspots List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#fbbf24" /> Top Tourist Waypoints
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TOURIST_DESTINATIONS.map(d => (
              <div
                key={d.id}
                onClick={() => navigate(`/visitor/destination/${d.id}`)}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{d.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#fbbf24' }}>{d.transitSummary}</div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
