import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Key } from 'lucide-react';
import { api } from '../../services/api';
import { setAuthUser } from '../../store/authStore';
import { updateUXProfile, initThemeFromUrlOrUser } from '../../store/uxProfileStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset font scaling & senior mode to default when unauthenticated on login screen
    initThemeFromUrlOrUser(null);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email, password);
      
      // Auto-trigger Senior Citizen mode if user profile age > 50
      if (res.user.age && res.user.age > 50) {
        updateUXProfile({
          mode: 'simplified',
          fontSize: 'large',
          highContrast: true
        });
      }

      setAuthUser(res.user);
      navigate('/search');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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

        {/* Error Alert Banner */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-sm)',
            color: '#fca5a5',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

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
            {loading ? 'Authenticating...' : 'Login'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Helper Box */}
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={14} /> DEMO ACCOUNTS (CLICK TO AUTO-FILL)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => handleDemoFill('passenger@transitone.in', 'Password@123')} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer' }}>
              • Passenger: <strong>passenger@transitone.in</strong> / Password@123
            </button>
            <button onClick={() => handleDemoFill('senior@transitone.in', 'Password@123')} style={{ background: 'none', border: 'none', color: '#fef08a', fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer' }}>
              • Senior (Age 65): <strong>senior@transitone.in</strong> / Password@123
            </button>
            <button onClick={() => handleDemoFill('tourist@transitone.in', 'Password@123')} style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer' }}>
              • Tourist (France): <strong>tourist@transitone.in</strong> / Password@123
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0 0 0' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            New to TransitOne?{' '}
            <Link to="/register" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </span>
        </div>

        {/* Visually Separated Employee Login Link */}
        <div style={{
          marginTop: '20px',
          padding: '14px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <Link
            to="/employee-login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ShieldCheck size={16} color="#f59e0b" /> Official Staff Portal Login ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
