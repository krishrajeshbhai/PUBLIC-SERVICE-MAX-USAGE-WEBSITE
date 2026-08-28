import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Radio,
  Sliders,
  CheckCircle2,
  Server,
  User,
  Lock,
  RefreshCw
} from 'lucide-react';
import { getAuthUser } from '../../../store/authStore';
import { getUseMockApi, setUseMockApi } from '../../../services/api';

export default function EmployeeSettings() {
  const [user, setUser] = useState(getAuthUser() || { id: 'EMP-9921', name: 'Officer EMP-9921', dept: 'Operations', roleTitle: 'Operations Controller' });
  const [refreshInterval, setRefreshInterval] = useState('10');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRerouteThreshold, setAutoRerouteThreshold] = useState('10');
  const [isMockApi, setIsMockApi] = useState(getUseMockApi());
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUseMockApi(isMockApi);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={26} color="#fbbf24" />
          Network Operations Center (NOC) Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
          Configure live telemetry ingestion thresholds, notification audio chimes, and inspect role authorizations
        </p>
      </div>

      {saved && (
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
          <CheckCircle2 size={16} /> NOC Control configuration updated and synced across active terminal session.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Card 1: Telemetry & Ingestion Settings */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="#3b82f6" /> Telemetry Stream Configuration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                GPS PING INGESTION INTERVAL
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="5">High Frequency (5 Seconds)</option>
                <option value="10">Standard NOC Rate (10 Seconds)</option>
                <option value="30">Low Bandwidth (30 Seconds)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                AUTO-REROUTE DELAY THRESHOLD
              </label>
              <select
                value={autoRerouteThreshold}
                onChange={(e) => setAutoRerouteThreshold(e.target.value)}
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="5">≥ 5 Minutes Delay</option>
                <option value="10">≥ 10 Minutes Delay (Recommended)</option>
                <option value="15">≥ 15 Minutes Delay</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="soundChk"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="soundChk" style={{ fontSize: '0.88rem', color: '#cbd5e1', cursor: 'pointer' }}>
              Play emergency audio chime when a High or Critical incident is reported
            </label>
          </div>
        </div>

        {/* Card 2: Officer Clearance & Security Matrix */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#f59e0b" /> Officer Clearance & Permission Matrix
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>OFFICER ID</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace', marginTop: '2px' }}>
                {user.id || 'EMP-9921'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>DESIGNATION</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>
                {user.roleTitle || 'Operations Controller'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>DEPARTMENT</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#cbd5e1', marginTop: '2px' }}>
                {user.dept || 'Network Operations Center'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>ACCESS TIER</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                Level 3 (Full Dispatch & Advisory)
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Backend API Service Mode */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="#a855f7" /> Backend Service Connection Mode
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              id="mockApiChk"
              checked={isMockApi}
              onChange={(e) => setIsMockApi(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <label htmlFor="mockApiChk" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                Use In-Memory Mock Telemetry Simulator (Recommended for Demo & Standalone Evaluation)
              </label>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                When unchecked, the app attempts to connect to the live backend Express/Nest API gateway.
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-warning"
          style={{ padding: '12px 24px', fontSize: '0.92rem' }}
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}
