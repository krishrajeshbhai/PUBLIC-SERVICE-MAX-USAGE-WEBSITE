import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Key, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { setAuthUser } from '../../store/authStore';

export default function EmployeeLoginPage() {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [dept, setDept] = useState('Operations');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    if (!staffId.trim() || !pin.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.employeeLogin(staffId, dept, pin);
      setAuthUser(res.user);
      navigate('/employee');
    } catch (err) {
      setError("Invalid Staff Credentials or Security PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '36px', border: '2px solid #f59e0b' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            marginBottom: '12px'
          }}>
            <ShieldCheck size={28} color="#f59e0b" />
          </div>
          <span className="badge" style={{ background: '#f59e0b', color: '#000', marginBottom: '8px' }}>
            STAFF & OPERATIONS PORTAL
          </span>
          <h1 style={{ fontSize: '1.6rem', marginTop: '6px', marginBottom: '4px' }}>Official Staff Login</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Authorized transport personnel & dispatchers only</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 'var(--radius-sm)', marginBottom: '18px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmployeeLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              OFFICIAL STAFF ID / BADGE NUMBER
            </label>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. EMP-9921"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              DEPARTMENT / OPERATOR
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                outline: 'none'
              }}
            >
              <option value="Operations">Network Operations Center</option>
              <option value="Metro">Metro Control Division</option>
              <option value="Bus">City Bus Dispatch</option>
              <option value="Safety">Safety & Incident Response</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              SECURITY PIN / ACCESS CODE
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn-warning" style={{ width: '100%', padding: '14px', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Authenticating Staff...' : 'Access Operations Portal'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Passenger Login
          </Link>
        </div>
      </div>
    </div>
  );
}
