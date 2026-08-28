import React, { useState, useEffect } from 'react';
import {
  Bus,
  Search,
  Filter,
  RefreshCw,
  Gauge,
  Battery,
  Users,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../../../services/api';
import AssignDriverModal from '../components/AssignDriverModal';

export default function EmployeeVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeVehicles();
      setVehicles(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter(v => {
    if (filterMode !== 'all' && v.mode !== filterMode) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = (v.id || '').toLowerCase().includes(q);
      const matchLine = (v.line || '').toLowerCase().includes(q);
      const matchDriver = (v.driver || '').toLowerCase().includes(q);
      const matchLoc = (v.locationName || '').toLowerCase().includes(q);
      if (!matchId && !matchLine && !matchDriver && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
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
            <Bus size={26} color="#3b82f6" />
            Vehicle Fleet Telematics & Driver Allocation
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Inspect rolling stock telemetry, battery reserves, passenger load factors and driver assignments
          </p>
        </div>

        <button
          onClick={fetchVehicles}
          className="btn-secondary"
          style={{ fontSize: '0.85rem', padding: '9px 16px' }}
        >
          <RefreshCw size={15} /> Refresh Fleet
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicle ID, line, driver or location..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              fontSize: '0.88rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            style={{ padding: '9px 14px', fontSize: '0.85rem' }}
          >
            <option value="all">All Transit Modes</option>
            <option value="metro">Metro Rolling Stock</option>
            <option value="bus">City Express Buses</option>
            <option value="electric">Electric Feeders</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '9px 14px', fontSize: '0.85rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Service</option>
            <option value="delayed">Delayed</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Fleet Units ({filtered.length})</span>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Click any row to open dispatch controls
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.74rem', letterSpacing: '0.06em' }}>
                <th style={{ padding: '12px 10px' }}>VEHICLE ID</th>
                <th style={{ padding: '12px 10px' }}>LINE / CORRIDOR</th>
                <th style={{ padding: '12px 10px' }}>ASSIGNED CREW</th>
                <th style={{ padding: '12px 10px' }}>LOCATION</th>
                <th style={{ padding: '12px 10px' }}>SPEED</th>
                <th style={{ padding: '12px 10px' }}>ENERGY / FUEL</th>
                <th style={{ padding: '12px 10px' }}>OCCUPANCY</th>
                <th style={{ padding: '12px 10px' }}>STATUS</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 10px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                    {v.id}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: 600 }}>
                    {v.line}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#cbd5e1' }}>
                    {v.driver}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#94a3b8', fontSize: '0.82rem' }}>
                    {v.locationName}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#60a5fa', fontWeight: 700 }}>
                    {v.speed}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#34d399', fontWeight: 700 }}>
                    {v.batteryFuel}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#fbbf24', fontWeight: 700 }}>
                    {v.passengerLoad}
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: v.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : v.status === 'delayed' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: v.status === 'active' ? '#34d399' : v.status === 'delayed' ? '#fbbf24' : '#fca5a5'
                    }}>
                      {v.status === 'active' ? '🟢 Active' : v.status === 'delayed' ? '🟡 Delayed' : '🔴 Maintenance'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicle(v);
                      }}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Driver / Dispatch Modal */}
      {selectedVehicle && (
        <AssignDriverModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onUpdated={() => {
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
}
