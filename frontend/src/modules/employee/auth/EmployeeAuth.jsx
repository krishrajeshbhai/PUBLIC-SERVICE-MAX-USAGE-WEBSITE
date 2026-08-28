import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowRight, ArrowLeft, Key, UserCheck, AlertTriangle, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { api } from '../../../services/api';
import { setAuthUser } from '../../../store/authStore';

export default function EmployeeAuth() {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [dept, setDept] = useState('Network Operations Center');
  const [roleTitle, setRoleTitle] = useState('Operations Controller');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!staffId.trim() || !pin.trim()) {
      setError("Please enter Staff ID and Security PIN.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.employeeLogin(staffId, dept, pin, roleTitle);
      if (res && res.user) {
        setAuthUser(res.user);
        navigate('/employee/dashboard');
      } else {
        setError("Invalid Staff Credentials or Security PIN.");
      }
    } catch (err) {
      setError(err.message || "Invalid Staff Credentials or Security PIN.");
    } finally {
      setLoading(false);
    }
  };

  const applyDemoRole = (demoId, demoDept, demoRole, demoPin = '9921') => {
    setStaffId(demoId);
    setDept(demoDept);
    setRoleTitle(demoRole);
    setPin(demoPin);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.12) 0%, rgba(7, 11, 20, 0.98) 75%)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      {/* Top Brand Link */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#94a3b8',
          textDecoration: 'none',
          fontSize: '0.86rem',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '16px'
        }}>
          <ArrowLeft size={15} /> TransitOne Ecosystem Hub
        </Link>
      </div>

      {/* Main Login Card */}
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
        }} />

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            marginBottom: '14px',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
          }}>
            <Shield size={28} />
          </div>

          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#fbbf24',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            TRANSITONE OPERATIONS
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
            Secure Employee Access
          </h1>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Authorized transport personnel, dispatchers & supervisors
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Staff ID */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
              EMPLOYEE ID / BADGE NUMBER
            </label>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. EMP-9921"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Role Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
              OPERATIONAL ROLE
            </label>
            <select
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              <option value="Operations Controller">Operations Controller (Full NOC Access)</option>
              <option value="Route Manager">Route Manager (Timetables & Headway)</option>
              <option value="Incident Manager">Incident Manager (Safety & Mitigation)</option>
              <option value="Fleet Supervisor">Fleet Supervisor (Vehicles & Drivers)</option>
              <option value="Administrator">Administrator (System & Config)</option>
              <option value="Support Staff">Support Staff (Passenger Info & Inquiries)</option>
            </select>
          </div>

          {/* Department */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
              DEPARTMENT / DIVISION
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              <option value="Network Operations Center">Network Operations Center (NOC)</option>
              <option value="Metro Control Division">Metro Control Division</option>
              <option value="City Bus Dispatch">City Bus Dispatch</option>
              <option value="Safety & Incident Response">Safety & Incident Response</option>
              <option value="Executive Management">Executive Management & Auditing</option>
            </select>
          </div>

          {/* Security PIN */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                SECURITY PIN / 2FA CODE
              </label>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>
                Demo PIN: 9921
              </span>
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.95rem',
                letterSpacing: '0.2em'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)'
            }}
          >
            {loading ? 'Authenticating Staff...' : 'Access Operations Desk'} <ArrowRight size={18} />
          </button>
        </form>

        {/* 1-Click Fast Test Profiles */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderRadius: '12px',
          border: '1px dashed rgba(245, 158, 11, 0.35)'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.06em' }}>
            ⚡ 1-Click Demo Profiles (Click to Auto-Fill)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => applyDemoRole('NOC-CONTROLLER', 'Network Operations Center', 'Operations Controller')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.76rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: '#fbbf24', fontWeight: 700 }}>NOC Controller</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ID: NOC-CONTROLLER</div>
            </button>

            <button
              type="button"
              onClick={() => applyDemoRole('INCIDENT-MGR', 'Safety & Incident Response', 'Incident Manager')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.76rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: '#ef4444', fontWeight: 700 }}>Incident Manager</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ID: INCIDENT-MGR</div>
            </button>

            <button
              type="button"
              onClick={() => applyDemoRole('ROUTE-MGR', 'Metro Control Division', 'Route Manager')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.76rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: '#a855f7', fontWeight: 700 }}>Route Manager</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ID: ROUTE-MGR</div>
            </button>

            <button
              type="button"
              onClick={() => applyDemoRole('FLEET-SUPV', 'City Bus Dispatch', 'Fleet Supervisor')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.76rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: '#3b82f6', fontWeight: 700 }}>Fleet Supervisor</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ID: FLEET-SUPV</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
