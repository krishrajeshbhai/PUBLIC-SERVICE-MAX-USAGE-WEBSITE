import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bus,
  Gauge,
  Battery,
  Users,
  AlertTriangle,
  RefreshCw,
  Filter,
  CheckCircle2,
  Navigation,
  Radio,
  Layers
} from 'lucide-react';
import { api } from '../../../services/api';
import MapComponent from '../../../components/MapComponent';
import AssignDriverModal from '../components/AssignDriverModal';

export default function EmployeeNetwork() {
  const [vehicles, setVehicles] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalVehicle, setModalVehicle] = useState(null);

  const loadNetwork = async () => {
    try {
      setLoading(true);
      const [vData, sData] = await Promise.all([
        api.getEmployeeVehicles(),
        api.getStops()
      ]);
      setVehicles(vData || []);
      setStops(sData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetwork();
    const interval = setInterval(loadNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    if (filterMode !== 'all' && v.mode !== filterMode) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Navigation size={26} color="#3b82f6" />
            Live Network & Fleet Telematics Map
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Real-time GPS vehicle positions, corridor bottlenecks, and interlocking station statuses
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.84rem' }}
          >
            <option value="all">All Vehicle Types</option>
            <option value="metro">Metro Trains Only</option>
            <option value="bus">City Buses Only</option>
            <option value="electric">Electric Shuttles Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.84rem' }}
          >
            <option value="all">All Service Statuses</option>
            <option value="active">Active Service</option>
            <option value="delayed">Delayed Units</option>
            <option value="maintenance">Workshop / Maintenance</option>
          </select>

          <button
            onClick={loadNetwork}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Main Layout: Left Map Visualizer (Wide) + Right Telemetry Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Map Container */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ height: '560px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapComponent stops={stops} height="560px" />
          </div>

          {/* Quick Map Legend */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '14px',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            fontSize: '0.78rem',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>🟣 Purple Line Metro</span>
              <span>🟢 Green Line Metro</span>
              <span>🔵 Bus 201 Express</span>
              <span>🟠 Bus 500 Outer Ring</span>
            </div>
            <div style={{ fontWeight: 700, color: '#34d399' }}>
              📡 {filteredVehicles.length} Units Active in Telemetry Grid
            </div>
          </div>
        </div>

        {/* Right Telemetry List & Unit Inspector */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          height: '625px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Tracked Fleet Units</span>
            <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>
              {filteredVehicles.length} Active
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
            {filteredVehicles.map(v => (
              <div
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: selectedVehicle?.id === v.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedVehicle?.id === v.id ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                    {v.id}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: v.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: v.status === 'active' ? '#34d399' : '#fbbf24'
                  }}>
                    {v.status === 'active' ? '🟢 Active' : '🟡 Delayed'}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
                  {v.line}
                </div>

                <div style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <MapPin size={12} color="#fbbf24" /> {v.locationName}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '6px',
                  fontSize: '0.72rem',
                  color: '#cbd5e1',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '6px 8px',
                  borderRadius: '6px'
                }}>
                  <div>⚡ {v.speed}</div>
                  <div>🔋 {v.batteryFuel}</div>
                  <div>👥 {v.passengerLoad}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalVehicle(v);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Dispatch Controls ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Driver / Dispatch Modal */}
      {modalVehicle && (
        <AssignDriverModal
          vehicle={modalVehicle}
          onClose={() => setModalVehicle(null)}
          onUpdated={() => {
            loadNetwork();
          }}
        />
      )}
    </div>
  );
}
