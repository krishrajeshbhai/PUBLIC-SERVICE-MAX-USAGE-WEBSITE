import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, Send, CheckCircle2, Bus, Train, Radio, RefreshCw, BarChart2 } from 'lucide-react';
import { api } from '../../services/api';
import { t } from '../../i18n/i18n';

export default function EmployeeDashboardPage() {
  const navigate = useNavigate();
  const [opsData, setOpsData] = useState(null);
  const [line, setLine] = useState('Purple Line');
  const [severity, setSeverity] = useState('Medium');
  const [message, setMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fetchOps = async () => {
    try {
      const data = await api.getEmployeeOpsData();
      setOpsData(data);
    } catch (e) {
      console.error("Ops fetch error:", e);
    }
  };

  useEffect(() => {
    fetchOps();
  }, []);

  const handlePublishAlert = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setPublishing(true);
    setPublishSuccess(false);

    try {
      // Publish alert & simulate network delay push to passenger live tickets
      await api.publishServiceAlert(line, severity, message);
      await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      setPublishSuccess(true);
      setMessage('');
      fetchOps();
    } catch (err) {
      console.error("Alert publish error:", err);
    } finally {
      setPublishing(false);
    }
  };

  if (!opsData) {
    return (
      <div style={{ maxWidth: '1280px', margin: '60px auto', textAlign: 'center' }}>
        <h2>Loading Operations Desk...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px' }}>
            <Shield size={14} /> EMPLOYEE & STAFF CONTROL PORTAL
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>{t('opsOverview')}</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/employee/vehicles')} className="btn-secondary">
            <Bus size={16} /> Track Fleet Map
          </button>
          <button onClick={fetchOps} className="btn-secondary">
            <RefreshCw size={16} /> Refresh Network
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE VEHICLES</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginTop: '6px' }}>{opsData.activeVehiclesCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px' }}>🟢 98.4% Fleet operational</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>DELAYED ROUTES</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>{opsData.delayedCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '4px' }}>⚠️ Traffic & signals affected</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CANCELLED TRIPS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '6px' }}>{opsData.cancelledCount}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>0.2% Cancellation rate</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CRITICAL INCIDENTS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', marginTop: '6px' }}>{opsData.criticalIncidentsCount}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Staff assigned</div>
        </div>
      </div>

      {/* Network Health Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#10b981" /> Realtime Network Health Status
          </h3>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>92% Normal Operation</span>
        </div>
        <div style={{ display: 'flex', height: '14px', borderRadius: '9999px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.05)' }}>
          <div style={{ width: '92%', background: '#10b981' }} title="92% Normal"></div>
          <div style={{ width: '7%', background: '#f59e0b' }} title="7% Delayed"></div>
          <div style={{ width: '1%', background: '#ef4444' }} title="1% Critical"></div>
        </div>
      </div>

      {/* Main Grid: Alert Publisher Form + Active Incidents Desk */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
        {/* Disruption Alert Publisher */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={20} color="#f59e0b" /> Publish Network Service Alert
          </h3>

          {publishSuccess && (
            <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Alert published! Passenger live reroute triggered.
            </div>
          )}

          <form onSubmit={handlePublishAlert}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>LINE / OPERATOR</label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              >
                <option value="Purple Line">Purple Line Metro</option>
                <option value="Green Line">Green Line Metro</option>
                <option value="Bus 201">Bus 201 Express</option>
                <option value="Bus 500">Bus 500 Outer Ring</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>SEVERITY</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              >
                <option value="Low">Low (Informational)</option>
                <option value="Medium">Medium (Minor Delays)</option>
                <option value="High">High (Major Delay & Reroute)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>BROADCAST MESSAGE</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe disruption details for affected passengers..."
                rows={4}
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-warning" style={{ width: '100%', padding: '14px', justifyContent: 'center' }} disabled={publishing}>
              <Send size={18} /> {publishing ? 'Broadcasting Alert...' : 'Publish Service Alert'}
            </button>
          </form>
        </div>

        {/* Active Incidents Desk */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#ef4444" /> Active Incident Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {opsData.incidents.map(inc => (
              <div key={inc.id} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>{inc.id} · {inc.line}</span>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>{inc.status}</span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{inc.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Affected: {inc.affectedPassengers} passengers · Started at {inc.startedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
