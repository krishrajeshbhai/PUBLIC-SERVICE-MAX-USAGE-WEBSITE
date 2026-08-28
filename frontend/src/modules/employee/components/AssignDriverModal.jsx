import React, { useState } from 'react';
import { X, Bus, CheckCircle2, User, Gauge, Battery, Users, MessageSquare, Send } from 'lucide-react';
import { api } from '../../../services/api';

export default function AssignDriverModal({ vehicle, onClose, onUpdated }) {
  const [driver, setDriver] = useState(vehicle?.driver || '');
  const [status, setStatus] = useState(vehicle?.status || 'active');
  const [dispatchMsg, setDispatchMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  if (!vehicle) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    try {
      await api.updateVehicleDriver(vehicle.id, driver, status);
      setSuccess(`Vehicle ${vehicle.id} updated successfully.`);
      if (onUpdated) onUpdated();
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendDispatchMsg = (e) => {
    e.preventDefault();
    if (!dispatchMsg.trim()) return;
    setSuccess(`Radio dispatch message sent to Driver ${driver}: "${dispatchMsg}"`);
    setDispatchMsg('');
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
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        color: '#f8fafc'
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
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }}>
              <Bus size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>FLEET UNIT DISPATCH</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                {vehicle.id} · {vehicle.line}
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
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {success && (
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
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          {/* Telemetry quick stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>SPEED</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Gauge size={14} color="#60a5fa" /> {vehicle.speed || '34 km/h'}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>BATTERY/FUEL</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Battery size={14} /> {vehicle.batteryFuel || '84%'}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>OCCUPANCY</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} /> {vehicle.passengerLoad || '62%'}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                ASSIGNED DRIVER / CREW
              </label>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                placeholder="Driver Name or ID..."
                required
                style={{
                  width: '100%',
                  background: 'rgba(10, 16, 30, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                OPERATIONAL STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(10, 16, 30, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.92rem'
                }}
              >
                <option value="active">🟢 Active Service (In Revenue Service)</option>
                <option value="delayed">🟡 Delayed (En Route with Traffic)</option>
                <option value="maintenance">🔴 Workshop / Maintenance</option>
                <option value="depot">⚪ Depot Standby</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {saving ? 'Updating...' : 'Save Unit Changes'}
              </button>
            </div>
          </form>

          {/* Radio Dispatch Note */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
              RADIO TELEMETRY DISPATCH MESSAGE
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={dispatchMsg}
                onChange={(e) => setDispatchMsg(e.target.value)}
                placeholder="e.g. Hold 2 mins at Trinity for connection..."
                style={{
                  flex: 1,
                  background: 'rgba(10, 16, 30, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <button
                onClick={handleSendDispatchMsg}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
