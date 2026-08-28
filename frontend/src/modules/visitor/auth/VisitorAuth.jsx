import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Globe, ArrowRight, ShieldCheck, Mail, Sparkles, MapPin } from 'lucide-react';
import { setAuthUser } from '../../../store/authStore';

export default function VisitorAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartOnboarding = (type = 'guest') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/visitor/onboarding');
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(10, 15, 26, 0.98) 70%)',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '460px',
        padding: '36px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        textAlign: 'center'
      }}>
        {/* Flag Icon Banner */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
        }}>
          <Compass size={32} color="#000" />
        </div>

        <span style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#fbbf24',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '3px 12px',
          borderRadius: '999px',
          display: 'inline-block',
          marginBottom: '12px'
        }}>
          INTERNATIONAL VISITOR EXPERIENCE
        </span>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '4px 0 10px 0' }}>
          WELCOME TO INDIA 🇮🇳
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '28px' }}>
          Your personal travel companion for navigating Indian public transit safely, effortlessly, and in your native language.
        </p>

        {/* Primary Action */}
        <button
          onClick={() => handleStartOnboarding('guest')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Preparing Companion...' : 'Get Started / Quick Explore'} <ArrowRight size={18} />
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          color: '#64748b',
          fontSize: '0.8rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ padding: '0 12px' }}>SIGN IN WITH ACCOUNT</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <button
            onClick={() => handleStartOnboarding('google')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <Globe size={18} color="#60a5fa" /> Continue with Google
          </button>

          <button
            onClick={() => handleStartOnboarding('apple')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
             Continue with Apple
          </button>
        </div>

        {/* Footer info */}
        <div style={{
          padding: '12px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderRadius: '10px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          fontSize: '0.8rem',
          color: '#fbbf24',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={16} /> Verified Official Tourist Transit Safety Protocol
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Main Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
