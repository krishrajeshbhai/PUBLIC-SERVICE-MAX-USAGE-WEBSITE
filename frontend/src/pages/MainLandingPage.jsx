import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Compass, Shield, ArrowRight, Sparkles, Navigation, Globe, MapPin, Zap } from 'lucide-react';

export default function MainLandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 10%, rgba(30, 58, 138, 0.25) 0%, rgba(10, 15, 30, 0.98) 70%)',
      color: '#f8fafc',
      padding: '40px 24px 80px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '20px'
        }}>
          <Sparkles size={15} /> Unified Urban Mobility Ecosystem
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '16px'
        }}>
          Welcome to <span className="gradient-text">TransitOne</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          lineHeight: 1.6,
          margin: '0 auto'
        }}>
          How will you be using TransitOne today? Select your experience below:
        </p>
      </div>

      {/* Main 2 Consumer Product Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 420px))',
        gap: '28px',
        width: '100%',
        maxWidth: '900px',
        marginBottom: '40px',
        justifyContent: 'center'
      }}>
        {/* Card 1: Passenger App */}
        <div
          onClick={() => navigate('/passenger/home')}
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '20px',
            padding: '32px 28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
          }} />

          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Bus size={32} color="#60a5fa" />
            </div>

            <div style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#60a5fa',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}>
              DOMESTIC COMMUTERS
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Passenger App
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
              One search, one QR ticket, and one wallet for daily Bus, Metro, and Walking. Real-time automatic re-routing when delays occur.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <Zap size={15} color="#3b82f6" /> 1-Click Usual Commute Booking
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <Navigation size={15} color="#10b981" /> Live Connected Itinerary Timeline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <Sparkles size={15} color="#a855f7" /> Voice Commuter AI Assistant
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
            }}
          >
            Continue as Passenger <ArrowRight size={18} />
          </button>
        </div>

        {/* Card 2: Visitor Experience */}
        <div
          onClick={() => navigate('/visitor/welcome')}
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px',
            padding: '32px 28px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = '#f59e0b';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(245, 158, 11, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
          }} />

          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Compass size={32} color="#fbbf24" />
            </div>

            <div style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}>
              INTERNATIONAL TOURISTS & TRAVELERS
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              Visitor Experience
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Explore India with confidence. Step-by-step navigation, bilingual signage translations, multi-currency support, and offline journey safety.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <Globe size={15} color="#f59e0b" /> 9 Languages + Audio Explanations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <MapPin size={15} color="#10b981" /> "Explain This Step" & Driver Translation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <Shield size={15} color="#06b6d4" /> 24/7 Tourist SOS & Help Center
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
            }}
          >
            Explore India 🇮🇳 <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Staff / Employee Portal Link at Bottom */}
      <div style={{
        textAlign: 'center',
        padding: '18px 24px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
          <Shield size={16} color="#94a3b8" /> Transport Operator or City Official?
        </div>
        <button
          onClick={() => navigate('/employee/login')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e2e8f0',
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Staff & Operations Login ➔
        </button>
      </div>
    </div>
  );
}
