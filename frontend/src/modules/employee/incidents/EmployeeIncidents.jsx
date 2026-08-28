import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Users,
  Plus,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  Radio,
  Send,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../../services/api';
import IncidentDetailModal from '../components/IncidentDetailModal';

export default function EmployeeIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'monitoring', 'resolved'
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New incident form state
  const [newTitle, setNewTitle] = useState('');
  const [newLine, setNewLine] = useState('Purple Line');
  const [newSeverity, setNewSeverity] = useState('High');
  const [newLocation, setNewLocation] = useState('');
  const [newAffected, setNewAffected] = useState(1200);
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeIncidents();
      setIncidents(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await api.createIncident({
        title: newTitle,
        line: newLine,
        severity: newSeverity,
        location: newLocation || 'Corridor Junction',
        affectedPassengers: newAffected,
        description: newDescription,
        alternativesAvailable: true
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      fetchIncidents();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    if (activeTab === 'active') return inc.status === 'INVESTIGATING' || inc.status === 'MITIGATING';
    if (activeTab === 'monitoring') return inc.status === 'MONITORING';
    if (activeTab === 'resolved') return inc.status === 'RESOLVED';
    return true;
  });

  const totalAffected = incidents
    .filter(i => i.status !== 'RESOLVED')
    .reduce((sum, i) => sum + (Number(i.affectedPassengers) || 0), 0);

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
            <AlertTriangle size={26} color="#ef4444" />
            Safety & Incident Response Desk
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Track network disruptions, evaluate commuter impact and orchestrate real-time mitigation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-warning"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
          >
            <Plus size={15} /> Log New Incident
          </button>
          <button
            onClick={fetchIncidents}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
          >
            <RefreshCw size={15} /> Refresh Log
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>ACTIVE DISRUPTIONS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
            {incidents.filter(i => i.status === 'INVESTIGATING').length}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#fca5a5', marginTop: '2px' }}>High urgency dispatch</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>COMMUTERS IMPACTED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>
            {totalAffected.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#93c5fd', marginTop: '2px' }}>Multi-modal alternative active</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>RESOLVED TODAY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {incidents.filter(i => i.status === 'RESOLVED').length}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '2px' }}>Avg. resolution time 18m</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'active' ? '2px solid #ef4444' : '2px solid transparent',
            color: activeTab === 'active' ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Active Incidents ({incidents.filter(i => i.status === 'INVESTIGATING' || i.status === 'MITIGATING').length})
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'monitoring' ? '2px solid #a855f7' : '2px solid transparent',
            color: activeTab === 'monitoring' ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Monitoring & Minor ({incidents.filter(i => i.status === 'MONITORING').length})
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'resolved' ? '2px solid #10b981' : '2px solid transparent',
            color: activeTab === 'resolved' ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Resolved Archive ({incidents.filter(i => i.status === 'RESOLVED').length})
        </button>
      </div>

      {/* Incidents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '18px' }}>
        {filteredIncidents.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '14px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            color: '#94a3b8'
          }}>
            ✓ No incidents in this category.
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = inc.severity === 'High' ? '#ef4444' : '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: inc.status === 'RESOLVED' ? '#10b981' : inc.severity === 'High' ? '#ef4444' : '#f59e0b'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>
                  {inc.id} · {inc.line}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: inc.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : inc.status === 'INVESTIGATING' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: inc.status === 'RESOLVED' ? '#34d399' : inc.status === 'INVESTIGATING' ? '#fca5a5' : '#fbbf24'
                }}>
                  {inc.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
                {inc.title}
              </h3>

              <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <MapPin size={13} color="#f59e0b" /> {inc.location}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: '#cbd5e1',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span>👥 {inc.affectedPassengers} affected</span>
                <span>⏱️ Started: {inc.startedAt}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdated={() => {
            fetchIncidents();
          }}
        />
      )}

      {/* Create New Incident Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          background: 'rgba(5, 10, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1322',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            padding: '24px',
            color: '#f8fafc'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 16px 0', color: '#fff' }}>
              Log Network Disruption Incident
            </h2>

            <form onSubmit={handleCreateIncident}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  INCIDENT TITLE
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Signal Interlock Failure near Halasuru"
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    AFFECTED LINE
                  </label>
                  <select
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <option value="Purple Line">Purple Line Metro</option>
                    <option value="Green Line">Green Line Metro</option>
                    <option value="Bus 201">Bus 201 Express</option>
                    <option value="Bus 500">Bus 500 Outer Ring</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    SEVERITY LEVEL
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <option value="High">High (Major Delay & Reroute)</option>
                    <option value="Medium">Medium (Moderate Delay)</option>
                    <option value="Low">Low (Minor Advisory)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    LOCATION / SECTION
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Trinity → Halasuru"
                    style={{ width: '100%', padding: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    EST. PASSENGERS
                  </label>
                  <input
                    type="number"
                    value={newAffected}
                    onChange={(e) => setNewAffected(e.target.value)}
                    style={{ width: '100%', padding: '10px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  DESCRIPTION & INITIAL MITIGATION PLAN
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details of the failure and initial response..."
                  style={{ width: '100%', padding: '10px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-warning"
                >
                  {creating ? 'Logging...' : 'Publish to Incident Desk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
