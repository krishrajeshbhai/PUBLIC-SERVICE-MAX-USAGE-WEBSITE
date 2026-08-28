import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Bus,
  AlertTriangle,
  Radio,
  RefreshCw,
  Send,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';
import { api } from '../../../services/api';
import MetricsCard from '../components/MetricsCard';
import IncidentDetailModal from '../components/IncidentDetailModal';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [opsData, setOpsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Quick alert form state
  const [alertLine, setAlertLine] = useState('Purple Line');
  const [alertSeverity, setAlertSeverity] = useState('High');
  const [alertMessage, setAlertMessage] = useState('');
  const [expectedDelay, setExpectedDelay] = useState('15 mins');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeOpsData();
      setOpsData(data);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handlePublishQuickAlert = async (e) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;
    setPublishing(true);
    setPublishSuccess(false);
    try {
      await api.publishServiceAlert(alertLine, alertSeverity, alertMessage, expectedDelay);
      await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      setPublishSuccess(true);
      setAlertMessage('');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading && !opsData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: '12px', color: '#fbbf24' }} />
        <h2>Connecting to Network Operations Center Telemetry...</h2>
      </div>
    );
  }

  const activeIncidents = opsData?.incidents?.filter(i => i.status !== 'RESOLVED') || [];
  const health = opsData?.networkHealth || { normalPercent: 92, delayedPercent: 7, criticalPercent: 1 };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            <Shield size={13} /> TRANSITONE CONTROL ROOM
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#fff' }}>
            Operations & Fleet Overview
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Real-time urban multi-modal telematics, passenger impact tracking & dispatch console
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/employee/network')}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
          >
            <MapPin size={15} color="#60a5fa" /> Live Map
          </button>
          <button
            onClick={fetchDashboardData}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
          >
            <RefreshCw size={15} /> Refresh Feed
          </button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <MetricsCard
          title="Active Vehicles"
          value={opsData?.activeVehiclesCount || 1482}
          subtitle="98.4% Fleet operational"
          icon={Bus}
          accentColor="#3b82f6"
          badgeText="ONLINE"
          badgeColor="#34d399"
          onClick={() => navigate('/employee/vehicles')}
        />

        <MetricsCard
          title="Delayed Routes"
          value={opsData?.delayedCount || 23}
          subtitle="Bus 201 corridor bottleneck"
          icon={Activity}
          accentColor="#f59e0b"
          badgeText="15m MAX DELAY"
          badgeColor="#f59e0b"
          onClick={() => navigate('/employee/routes')}
        />

        <MetricsCard
          title="Critical Incidents"
          value={activeIncidents.length}
          subtitle="1,824 commuters impacted"
          icon={AlertTriangle}
          accentColor="#ef4444"
          badgeText="ACTIVE"
          badgeColor="#ef4444"
          onClick={() => navigate('/employee/incidents')}
        />

        <MetricsCard
          title="Daily Commuters"
          value="482,150"
          subtitle="Multi-modal passengers"
          icon={TrendingUp}
          accentColor="#10b981"
          badgeText="+8.4% vs L.W."
          badgeColor="#34d399"
          onClick={() => navigate('/employee/reports')}
        />
      </div>

      {/* Network Health Bar Panel */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '28px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
            <Activity size={18} color="#10b981" />
            <span>Realtime Network Operational Health</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 700 }}>
            <span style={{ color: '#34d399' }}>● Normal ({health.normalPercent}%)</span>
            <span style={{ color: '#fbbf24' }}>● Delayed ({health.delayedPercent}%)</span>
            <span style={{ color: '#f87171' }}>● Critical ({health.criticalPercent}%)</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          height: '12px',
          borderRadius: '999px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2px'
        }}>
          <div style={{ width: `${health.normalPercent}%`, background: '#10b981', borderRadius: '4px 0 0 4px' }} title={`Normal ${health.normalPercent}%`} />
          <div style={{ width: `${health.delayedPercent}%`, background: '#f59e0b' }} title={`Delayed ${health.delayedPercent}%`} />
          <div style={{ width: `${health.criticalPercent}%`, background: '#ef4444', borderRadius: '0 4px 4px 0' }} title={`Critical ${health.criticalPercent}%`} />
        </div>
      </div>

      {/* Main Grid: Incident Desk (Left) + Service Alert Composer & Live Status (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* Active Incident Log */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800 }}>
              <AlertTriangle size={18} color="#ef4444" />
              <span>Active Incident Desk</span>
            </div>
            <button
              onClick={() => navigate('/employee/incidents')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View All Desk ➔
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeIncidents.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                ✓ No active critical incidents. All routes operating under normal parameters.
              </div>
            ) : (
              activeIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>
                      {inc.id} · {inc.line}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: inc.status === 'INVESTIGATING' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: inc.status === 'INVESTIGATING' ? '#fca5a5' : '#fbbf24'
                    }}>
                      {inc.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                    {inc.title}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                    <span>📍 {inc.location || 'Track Interlock'}</span>
                    <span>👥 {inc.affectedPassengers || 1824} commuters</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Service Alert Broadcast Center */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px' }}>
            <Radio size={18} color="#f59e0b" />
            <span>Publish Service Advisory</span>
          </div>

          {publishSuccess && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> Service alert broadcasted! Passenger re-routing activated.
            </div>
          )}

          <form onSubmit={handlePublishQuickAlert}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  TARGET LINE
                </label>
                <select
                  value={alertLine}
                  onChange={(e) => setAlertLine(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <option value="Purple Line">Purple Line Metro</option>
                  <option value="Green Line">Green Line Metro</option>
                  <option value="Bus 201">Bus 201 Express</option>
                  <option value="Bus 500">Bus 500 Outer Ring</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  SEVERITY
                </label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (Minor Delays)</option>
                  <option value="High">High (Disruption & Reroute)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                BROADCAST ADVISORY MESSAGE
              </label>
              <textarea
                rows={3}
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Describe reason, expected delay duration and recommended passenger alternative..."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(10, 16, 30, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={publishing}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
              }}
            >
              <Send size={15} /> {publishing ? 'Broadcasting to Network...' : 'Publish Service Alert & Reroute'}
            </button>
          </form>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdated={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
