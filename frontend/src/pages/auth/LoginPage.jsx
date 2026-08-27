import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { setAuthUser } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const res = await api.login(email, password);
      setAuthUser(res.user);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setAuthUser({
      id: 'user-guest',
      name: 'Guest Passenger',
      email: 'guest@transitone.in',
      role: 'passenger',
      country: 'India',
      token: 'mock-guest-token'
    });
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '10px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            marginBottom: '12px'
          }}>
            <Sparkles size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Welcome to TransitOne</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Travel smarter across India</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              MOBILE NUMBER OR EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="passenger@transitone.in or +91..."
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              PASSWORD / OTP
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '20px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            New to TransitOne?{' '}
            <Link to="/register" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </span>
        </div>

        {/* Visually Separated Employee Login Link */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
            OFFICIAL STAFF ACCESS
          </div>
          <Link
            to="/employee-login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ShieldCheck size={16} color="#f59e0b" /> Employee / Transport Staff Login ➔
          </Link>
        </div>

        {/* Guest Access Option */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={handleGuestLogin} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Continue as Guest Passenger
          </button>
        </div>
      </div>
    </div>
  );
}
