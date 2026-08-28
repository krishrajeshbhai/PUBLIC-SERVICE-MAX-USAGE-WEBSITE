import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Clock,
  Bus,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Send,
  Zap,
  Layers
} from 'lucide-react';
import { api } from '../../../services/api';

export default function EmployeeRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editHeadway, setEditHeadway] = useState(4);
  const [simDelayMins, setSimDelayMins] = useState(15);
  const [successMsg, setSuccessMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeRoutes();
      setRoutes(data || []);
      if (data && data.length > 0 && !selectedRoute) {
        setSelectedRoute(data[0]);
        setEditHeadway(data[0].frequencyMins);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleUpdateHeadway = async (e) => {
    e.preventDefault();
    if (!selectedRoute) return;
    setActionLoading(true);
    try {
      await api.updateRouteHeadway(selectedRoute.id, editHeadway);
      setSuccessMsg(`Headway for ${selectedRoute.name} adjusted to ${editHeadway} minutes.`);
      fetchRoutes();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInjectDelay = async () => {
    if (!selectedRoute) return;
    setActionLoading(true);
    try {
      await api.simulateDelay(selectedRoute.id, 'stop-1', 'stop-4', Number(simDelayMins));
      setSuccessMsg(`⚠️ Simulated ${simDelayMins}m delay injected on ${selectedRoute.name}. Passenger app reroute triggered!`);
      fetchRoutes();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
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
            <GitBranch size={26} color="#a855f7" />
            Route Management & Headway Dispatch
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Monitor corridor timetables, on-time performance (OTP), and dynamically tune headway frequencies
          </p>
        </div>

        <button
          onClick={fetchRoutes}
          className="btn-secondary"
          style={{ fontSize: '0.85rem', padding: '9px 16px' }}
        >
          <RefreshCw size={15} /> Refresh Routes
        </button>
      </div>

      {successMsg && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          borderRadius: '10px',
          fontSize: '0.88rem',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Main Grid: Routes Table (Left) + Route Control Console (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(360px, 1.2fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Routes List Table */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: '#fff' }}>
            Active Network Transit Corridors ({routes.length})
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.74rem', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '12px 8px' }}>ROUTE NAME</th>
                  <th style={{ padding: '12px 8px' }}>HEADWAY</th>
                  <th style={{ padding: '12px 8px' }}>FLEET</th>
                  <th style={{ padding: '12px 8px' }}>OTP %</th>
                  <th style={{ padding: '12px 8px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => {
                      setSelectedRoute(r);
                      setEditHeadway(r.frequencyMins);
                      setSuccessMsg(null);
                    }}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: selectedRoute?.id === r.id ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color || '#3b82f6' }} />
                        {r.name}
                      </div>
                    </td>
                    <td style={{ padding: '14px 8px', color: '#cbd5e1' }}>
                      Every {r.frequencyMins}m
                    </td>
                    <td style={{ padding: '14px 8px', color: '#94a3b8' }}>
                      {r.activeVehicles} units
                    </td>
                    <td style={{ padding: '14px 8px', fontWeight: 700, color: r.onTimePercent >= 95 ? '#34d399' : '#fbbf24' }}>
                      {r.onTimePercent}%
                    </td>
                    <td style={{ padding: '14px 8px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: r.status === 'normal' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: r.status === 'normal' ? '#34d399' : '#fbbf24'
                      }}>
                        {r.currentDelay || 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Route Controller Console */}
        {selectedRoute && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase' }}>
                  DISPATCH CONTROLLER
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#fff' }}>
                  {selectedRoute.name}
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '6px' }}>
                {selectedRoute.stopsCount || 6} Interconnected Stops
              </span>
            </div>

            {/* Quick telemetry metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>ON-TIME PERFORMANCE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  {selectedRoute.onTimePercent}%
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PRIMARY DEPOT</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginTop: '6px' }}>
                  {selectedRoute.depot || 'NOC Central Depot'}
                </div>
              </div>
            </div>

            {/* Headway Frequency Adjustment Form */}
            <form onSubmit={handleUpdateHeadway} style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                ADJUST RUNNING HEADWAY FREQUENCY (MINUTES)
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={editHeadway}
                  onChange={(e) => setEditHeadway(e.target.value)}
                  style={{
                    width: '90px',
                    padding: '10px 12px',
                    background: 'rgba(10, 16, 30, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 700
                  }}
                />
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Apply New Frequency
                </button>
              </div>
            </form>

            {/* Delay Injection / Rerouting Simulation Tester */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 800, fontSize: '0.82rem', marginBottom: '6px' }}>
                <Zap size={15} /> TEST DISRUPTION & PASSENGER AUTO-REROUTE
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                Simulate bottleneck delay on this route to verify that the passenger application calculates Metro alternatives.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={simDelayMins}
                  onChange={(e) => setSimDelayMins(e.target.value)}
                  style={{ padding: '8px', fontSize: '0.82rem', width: '120px' }}
                >
                  <option value="10">10 Minutes</option>
                  <option value="15">15 Minutes</option>
                  <option value="25">25 Minutes</option>
                  <option value="40">40 Minutes</option>
                </select>

                <button
                  type="button"
                  onClick={handleInjectDelay}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Simulate Delay ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
