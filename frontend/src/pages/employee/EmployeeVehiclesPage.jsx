import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, Train, MapPin, RefreshCw, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import MapComponent from '../../components/MapComponent';

export default function EmployeeVehiclesPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [vData, sData] = await Promise.all([
          api.getEmployeeVehicles(),
          api.getStops()
        ]);
        setVehicles(vData);
        setStops(sData);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      <button onClick={() => navigate('/employee')} className="btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Operations Dashboard
      </button>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bus size={28} color="#3b82f6" /> Vehicle Fleet Tracking & Live Positions
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Realtime GPS telemetry and driver status across active bus & metro lines</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Vehicles Table */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Active Fleet Units ({vehicles.length})</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>VEHICLE ID</th>
                  <th style={{ padding: '12px' }}>LINE / ROUTE</th>
                  <th style={{ padding: '12px' }}>LOCATION</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{v.id}</td>
                    <td style={{ padding: '14px 12px' }}>{v.line}</td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{v.locationName}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className="badge" style={{
                        background: v.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: v.status === 'active' ? '#34d399' : '#f59e0b'
                      }}>
                        {v.status === 'active' ? '🟢 Active' : '🟡 Delayed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Network Fleet Map */}
        <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Network Fleet Telemetry Map</h3>
          <MapComponent stops={stops} height="480px" />
        </div>
      </div>
    </div>
  );
}
