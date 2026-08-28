import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Shield, ArrowRight, CheckCircle2, Lock, Sparkles, Navigation, Globe, Mail } from 'lucide-react';
import { setAuthUser } from '../../../store/authStore';

export default function PassengerAuth({ mode = 'login' }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'email'
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['5', '8', '2', '0']);
  const [name, setName] = useState('Abhiraj');
  const [email, setEmail] = useState('abhiraj@example.com');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const passengerUser = {
        id: 'user-1',
        name: name || 'Abhiraj',
        phone: `+91 ${phone}`,
        email: email || 'abhiraj@example.com',
        role: 'passenger',
        walletBalance: 500,
        streak: 7
      };
      setAuthUser(passengerUser);
      setLoading(false);
      navigate('/passenger/home');
    }, 500);
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      const passengerUser = {
        id: 'user-1',
        name: provider === 'google' ? 'Abhiraj Sharma (Google)' : 'Abhiraj Sharma',
        phone: '+91 98765 43210',
        email: 'abhiraj@example.com',
        role: 'passenger',
        walletBalance: 500,
        streak: 7
      };
      setAuthUser(passengerUser);
      setLoading(false);
      navigate('/passenger/home');
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.15) 0%, rgba(9, 13, 22, 0.98) 70%)',
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
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        padding: '36px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)'
          }}>
            <Navigation size={28} color="#fff" />
          </div>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: 'rgba(59, 130, 246, 0.15)',
            padding: '3px 10px',
            borderRadius: '999px',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            PASSENGER APP
          </span>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>
            Welcome to TransitOne
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            {step === 'phone' ? 'Enter your mobile number for instant ticket & wallet access' : 'Enter the 4-digit code sent to your phone'}
          </p>
        </div>

        {/* Step 1: Phone Input Form */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                MOBILE NUMBER
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  color: '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 80px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                * Demo default: 9876543210 (instant verified login)
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                marginBottom: '20px'
              }}
            >
              {loading ? 'Sending OTP...' : 'Continue with Phone'} <ArrowRight size={18} />
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
              <span style={{ padding: '0 12px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Social Logins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
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
                type="button"
                onClick={() => handleSocialLogin('email')}
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
                <Mail size={18} color="#a855f7" /> Continue with Email
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>Code sent to <strong>+91 {phone}</strong></span>
              <button
                type="button"
                onClick={() => setStep('phone')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '10px', textAlign: 'center' }}>
                ENTER 4-DIGIT VERIFICATION CODE
              </label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '2px solid #3b82f6',
                      color: '#fff',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Open Commuter Dashboard'} <CheckCircle2 size={18} />
            </button>
          </form>
        )}

        {/* Footer switch back to home */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Switch to Visitor or Staff Login
          </Link>
        </div>
      </div>
    </div>
  );
}
