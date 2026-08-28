import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Accessibility,
  ArrowUpRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { api } from '../../../services/api';

export default function EmployeeStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCrowd, setFilterCrowd] = useState('all');

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeStations();
      setStations(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const filtered = stations.filter(s => {
    if (filterCrowd !== 'all' && (s.crowdLevel || '').toLowerCase() !== filterCrowd.toLowerCase()) return false;
    return true;
  });

  const getCrowdColor = (level) => {
    switch ((level || '').toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={26} color="#06b6d4" />
            Station Concourse & Platform Monitoring
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Live platform crowd density, hourly commuter influx, and accessibility infrastructure health
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={filterCrowd}
            onChange={(e) => setFilterCrowd(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.84rem' }}
          >
            <option value="all">All Crowd Levels</option>
            <option value="critical">Critical (Majestic)</option>
            <option value="high">High Density</option>
            <option value="medium">Medium Density</option>
            <option value="low">Low Density</option>
          </select>

          <button
            onClick={fetchStations}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
          >
            <RefreshCw size={15} /> Refresh Stations
          </button>
        </div>
      </div>

      {/* Grid of Stations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {filtered.map(st => (
          <div
            key={st.id}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${getCrowdColor(st.crowdLevel)}, transparent)`
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {st.id}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '2px 0 0 0' }}>
                  {st.name}
                </h3>
              </div>

              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '6px',
                background: `rgba(255, 255, 255, 0.06)`,
                color: getCrowdColor(st.crowdLevel),
                border: `1px solid ${getCrowdColor(st.crowdLevel)}`
              }}>
                {st.crowdLevel} Density
              </span>
            </div>

            {/* Influx & Platform Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              margin: '16px 0',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '12px',
              borderRadius: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>HOURLY INFLUX</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> {st.influxPerHour ? st.influxPerHour.toLocaleString() : '3,200'} /hr
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>ACTIVE PLATFORMS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {st.activePlatforms} Platforms
                </div>
              </div>
            </div>

            {/* Accessibility Infrastructure Checklist */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Accessibility size={13} color="#06b6d4" /> ACCESSIBILITY & VERTICAL TRANSIT
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>🛗 Lifts Operational:</span>
                <strong style={{ color: '#34d399' }}>{st.liftsWorking || '2/2'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>🪜 Escalators Operational:</span>
                <strong style={{ color: '#fbbf24' }}>{st.escalatorsWorking || '3/4'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <span>♿ Wheelchair Ramps:</span>
                <strong style={{ color: st.wheelchairReady ? '#34d399' : '#f87171' }}>
                  {st.wheelchairReady ? 'Verified Ready' : 'Maintenance'}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
