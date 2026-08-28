import React, { useState } from 'react';
import { X, AlertTriangle, Users, Clock, MapPin, CheckCircle2, ShieldAlert, ArrowRight, Radio, Send, RefreshCw } from 'lucide-react';
import { api } from '../../../services/api';

export default function IncidentDetailModal({ incident, onClose, onUpdated }) {
  const [status, setStatus] = useState(incident?.status || 'INVESTIGATING');
  const [note, setNote] = useState(incident?.mitigationPlan || '');
  const [saving, setSaving] = useState(false);
  const [rerouting, setRerouting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!incident) return null;

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      await api.updateIncidentStatus(incident.id, newStatus, note);
      setSuccessMsg(`Incident ${incident.id} status updated to ${newStatus}`);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerPassengerReroute = async () => {
    setRerouting(true);
    setSuccessMsg(null);
    try {
      // Broadcast alert and trigger mock delay simulation to passenger live tickets
      await api.publishServiceAlert(
        incident.line,
        incident.severity,
        `Active incident on ${incident.line} (${incident.location}). Alternative routes recommended.`
      );
      await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      setSuccessMsg(`✅ Automated rerouting pushed! 1,824 affected passenger tickets updated with Metro alternatives.`);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setRerouting(false);
    }
  };

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      await api.updateIncidentStatus(incident.id, status, note);
      setSuccessMsg(`Incident plan and notes updated.`);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const getSeverityColor = (sev) => {
    switch ((sev || '').toLowerCase()) {
      case 'high':
      case 'critical': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      background: 'rgba(5, 10, 20, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        color: '#f8fafc',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `rgba(${getSeverityColor(incident.severity) === '#ef4444' ? '239, 68, 68' : '245, 158, 11'}, 0.15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getSeverityColor(incident.severity)
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>
                {incident.id} · {incident.line}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                {incident.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {successMsg && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              borderRadius: '10px',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>SEVERITY</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: getSeverityColor(incident.severity), marginTop: '4px' }}>
                {incident.severity}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>COMMUTERS AFFECTED</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} /> {incident.affectedPassengers || 1824}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>STARTED AT</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} /> {incident.startedAt || '14:42'}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>EST. RESOLUTION</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                {incident.expectedResolution || '45 mins'}
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
              INCIDENT SYNOPSIS & LOCATION
            </label>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '0.9rem',
              color: '#cbd5e1',
              lineHeight: 1.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem' }}>
                <MapPin size={15} /> {incident.location || 'Network Segment'}
              </div>
              {incident.description || "Automatic interlocking sensor flagged emergency braking threshold violation."}
            </div>
          </div>

          {/* Mitigation Protocol & Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
              MITIGATION RESPONSE PLAN & CONTINGENCY ACTIONS
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter dispatcher notes or mitigation instructions..."
              style={{
                width: '100%',
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={handleSaveNote}
                disabled={saving}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save Protocol Note
              </button>
            </div>
          </div>

          {/* Action Center */}
          <div style={{
            background: 'rgba(30, 58, 138, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
              <Radio size={16} /> PASSENGER IMPACT CONTINGENCY DISPATCH
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Broadcast automated service advisory to active passengers on this route and push real-time multi-modal alternative rerouting.
            </p>
            <button
              onClick={handleTriggerPassengerReroute}
              disabled={rerouting}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Send size={15} /> {rerouting ? 'Pushing Notifications...' : 'Notify Passengers & Activate Reroutes'}
            </button>
          </div>

          {/* Status Workflow Buttons */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' }}>
              CHANGE INCIDENT LIFECYCLE STATE
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleStatusChange('INVESTIGATING')}
                style={{
                  flex: 1,
                  minWidth: '110px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: status === 'INVESTIGATING' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: status === 'INVESTIGATING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: status === 'INVESTIGATING' ? '#fbbf24' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Investigating
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('MITIGATING')}
                style={{
                  flex: 1,
                  minWidth: '110px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: status === 'MITIGATING' ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: status === 'MITIGATING' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: status === 'MITIGATING' ? '#60a5fa' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Mitigating
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('MONITORING')}
                style={{
                  flex: 1,
                  minWidth: '110px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: status === 'MONITORING' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: status === 'MONITORING' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: status === 'MONITORING' ? '#c084fc' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Monitoring
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('RESOLVED')}
                style={{
                  flex: 1,
                  minWidth: '110px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: status === 'RESOLVED' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: status === 'RESOLVED' ? '#34d399' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                ✓ Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
