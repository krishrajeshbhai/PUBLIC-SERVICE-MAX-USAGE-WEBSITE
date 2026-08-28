import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users,
  Eye,
  Trash2,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { api } from '../../../services/api';

export default function EmployeeAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [line, setLine] = useState('Purple Line');
  const [severity, setSeverity] = useState('High');
  const [issueType, setIssueType] = useState('Signal Failure');
  const [expectedDelay, setExpectedDelay] = useState('15 Minutes');
  const [customMsg, setCustomMsg] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeAlerts();
      setAlerts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const generatedPreviewMessage = customMsg.trim()
    ? customMsg
    : `⚠️ Delay of ~${expectedDelay} on ${line} due to ${issueType.toLowerCase()}. Passengers are advised to consider parallel multi-modal alternatives.`;

  const handlePublish = async (e) => {
    e.preventDefault();
    setPublishing(true);
    setPublishSuccess(false);

    try {
      await api.publishServiceAlert(line, severity, generatedPreviewMessage, expectedDelay);
      // Trigger passenger rerouting delay push
      await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      setPublishSuccess(true);
      setCustomMsg('');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const handleRevoke = async (alertId) => {
    try {
      await api.revokeServiceAlert(alertId);
      fetchAlerts();
    } catch (e) {
      console.error(e);
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
            <Radio size={26} color="#f59e0b" />
            Service Alert Broadcast & Commuter Notification Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Broadcast real-time service advisories and trigger automated passenger rerouting calculations
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="btn-secondary"
          style={{ fontSize: '0.85rem', padding: '9px 16px' }}
        >
          <RefreshCw size={15} /> Refresh Alerts
        </button>
      </div>

      {/* Main Grid: Alert Composer (Left) + Published Alerts Feed (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Composer Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#f59e0b" /> Compose Network Advisory
          </div>

          {publishSuccess && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> Broadcasted to ~3,200 active commuters & app users.
            </div>
          )}

          <form onSubmit={handlePublish}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                TRANSIT LINE / ROUTE
              </label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
              >
                <option value="Purple Line">Purple Line Metro</option>
                <option value="Green Line">Green Line Metro</option>
                <option value="Bus 201">Bus 201 Express Corridor</option>
                <option value="Bus 500">Bus 500 Outer Ring Road</option>
                <option value="All Lines">All Network Lines (System-Wide)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  SEVERITY
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                >
                  <option value="High">High (Reroute Active)</option>
                  <option value="Medium">Medium (Minor Delays)</option>
                  <option value="Low">Low (Informational)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  EXPECTED DELAY
                </label>
                <select
                  value={expectedDelay}
                  onChange={(e) => setExpectedDelay(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                >
                  <option value="5 Minutes">5 Minutes</option>
                  <option value="10 Minutes">10 Minutes</option>
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="Indefinite Delay">Indefinite Delay</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                PRIMARY REASON / CATEGORY
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
              >
                <option value="Signal Failure">Signaling / Interlocking Fault</option>
                <option value="Track Maintenance">Track & Catenary Maintenance</option>
                <option value="Road Bottleneck Congestion">Heavy Road Traffic Bottleneck</option>
                <option value="Passenger Overcrowding">Platform Crowd Congestion</option>
                <option value="Inclement Weather">Adverse Weather / Rain</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                CUSTOM MESSAGE (OPTIONAL OVERRIDE)
              </label>
              <textarea
                rows={3}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Leave blank to use auto-generated standard broadcast text..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* Message Preview */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} /> Passenger App Preview
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                {generatedPreviewMessage}
              </div>
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
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Send size={16} /> {publishing ? 'Publishing...' : 'Broadcast Alert & Reroute'}
            </button>
          </form>
        </div>

        {/* Active Broadcasts Feed */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '18px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Network Broadcasts ({alerts.length})</span>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
              ● Push Channels Operational
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                No active service alerts published.
              </div>
            ) : (
              alerts.map(alt => (
                <div
                  key={alt.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
                        {alt.id}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        {alt.line}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: alt.status === 'Active' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: alt.status === 'Active' ? '#fbbf24' : '#94a3b8'
                    }}>
                      {alt.status || 'Active'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '12px' }}>
                    {alt.message}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.76rem',
                    color: '#94a3b8',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '10px'
                  }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <span>👥 Reach: ~{alt.reachCount || 3420} commuters</span>
                      <span>⏱️ {alt.timestamp}</span>
                    </div>

                    {alt.status === 'Active' && (
                      <button
                        onClick={() => handleRevoke(alt.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        Revoke Alert
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
