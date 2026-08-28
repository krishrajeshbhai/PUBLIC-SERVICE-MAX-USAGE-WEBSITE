import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Compass,
  Shield,
  ArrowRight,
  Sparkles,
  Navigation,
  Globe,
  MapPin,
  Zap,
  Volume2,
  Users,
  Award,
  CheckCircle2,
  Sliders,
  Layers,
  Radio,
  Flame,
  Leaf,
  Clock
} from 'lucide-react';
import { getUXProfile, setAgePersona, subscribeUXProfile, UX_MODES } from '../store/uxProfileStore';
import { setAuthUser } from '../store/authStore';

export default function MainLandingPage() {
  const navigate = useNavigate();
  const [uxProfile, setUXProfile] = useState(getUXProfile());
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    return subscribeUXProfile(setUXProfile);
  }, []);

  const handlePersonaChange = (persona) => {
    setAgePersona(persona);
  };

  const handleQuickDemoLogin = (profileType) => {
    if (profileType === 'senior') {
      const user = {
        id: 'user-senior-1',
        name: 'Savitri Devi',
        phone: '+91 98450 11223',
        role: 'passenger',
        age: 65,
        persona: 'senior',
        accessibility: true,
        walletBalance: 750,
        streak: 12
      };
      setAuthUser(user);
      navigate('/passenger/home');
    } else if (profileType === 'genz') {
      const user = {
        id: 'user-genz-1',
        name: 'Rahul Varma',
        phone: '+91 98765 43210',
        role: 'passenger',
        age: 22,
        persona: 'genz',
        walletBalance: 420,
        streak: 18,
        carbonKarma: 480
      };
      setAuthUser(user);
      navigate('/passenger/home');
    } else if (profileType === 'visitor') {
      const user = {
        id: 'user-visitor-1',
        name: 'Sophie Martin',
        nationality: '🇫🇷 France',
        language: 'en',
        hotel: 'The Taj Connemara, Chennai',
        role: 'visitor',
        age: 34
      };
      setAuthUser(user);
      navigate('/visitor/explore');
    } else if (profileType === 'employee') {
      const user = {
        id: 'EMP-9921',
        name: 'Officer EMP-9921',
        dept: 'Operations',
        role: 'employee',
        roleTitle: 'Operations Controller',
        clearance: 'Level 3'
      };
      setAuthUser(user);
      navigate('/employee/dashboard');
    }
  };

  const isSenior = uxProfile.mode === UX_MODES.SENIOR;
  const isGenZ = uxProfile.mode === UX_MODES.GENZ;

  return (
    <div style={{
      minHeight: '100vh',
      background: isGenZ
        ? 'radial-gradient(circle at 50% 15%, rgba(0, 240, 255, 0.18) 0%, rgba(176, 38, 255, 0.12) 40%, #050711 80%)'
        : isSenior
        ? '#03060c'
        : 'radial-gradient(circle at 50% 10%, rgba(30, 58, 138, 0.3) 0%, rgba(10, 15, 30, 0.98) 75%)',
      color: '#f8fafc',
      padding: '30px 20px 80px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-main, Inter, sans-serif)',
      transition: 'all 0.3s ease'
    }}>
      {/* 1. TOP INTERACTIVE AGE / PERSONA SWITCHER HEADER */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '36px',
        padding: isSenior ? '16px 20px' : '12px 20px',
        background: isSenior ? '#0f172a' : 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        borderRadius: '18px',
        border: isSenior ? '2px solid #fbbf24' : isGenZ ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isGenZ ? '0 0 20px rgba(0, 240, 255, 0.2)' : '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        {/* Logo Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: isSenior ? '44px' : '36px',
            height: isSenior ? '44px' : '36px',
            borderRadius: '10px',
            background: isGenZ ? 'linear-gradient(135deg, #00f0ff, #b026ff)' : isSenior ? '#fbbf24' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSenior ? '#000' : '#fff',
            fontWeight: 900
          }}>
            <Navigation size={isSenior ? 24 : 20} />
          </div>
          <div>
            <span style={{ fontSize: isSenior ? '1.4rem' : '1.15rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              TransitOne
            </span>
            <span style={{ fontSize: '0.72rem', color: isGenZ ? '#00f0ff' : isSenior ? '#fbbf24' : '#60a5fa', marginLeft: '6px', fontWeight: 700 }}>
              {isSenior ? '👵 SIMPLE ACCESSIBLE MODE' : isGenZ ? '⚡ GEN-Z CYBERPUNK MODE' : '🇮🇳 UNIFIED URBAN TRANSIT'}
            </span>
          </div>
        </div>

        {/* Persona Switcher Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
            SELECT EXPERIENCE:
          </span>

          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '999px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            gap: '4px'
          }}>
            <button
              onClick={() => handlePersonaChange('senior')}
              title="Senior Mode: Big Text, High Contrast, Voice Readout"
              style={{
                background: isSenior ? '#fbbf24' : 'transparent',
                color: isSenior ? '#000' : '#cbd5e1',
                border: 'none',
                borderRadius: '999px',
                padding: isSenior ? '8px 16px' : '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              👵 Senior (Simple)
            </button>

            <button
              onClick={() => handlePersonaChange('genz')}
              title="Gen-Z Mode: Neon Cyberpunk, Streaks, Gamified Carbon"
              style={{
                background: isGenZ ? 'linear-gradient(135deg, #00f0ff, #b026ff)' : 'transparent',
                color: isGenZ ? '#000' : '#cbd5e1',
                border: 'none',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ⚡ Gen-Z (Vibrant)
            </button>

            <button
              onClick={() => handlePersonaChange('standard')}
              title="Standard Modern Transit Interface"
              style={{
                background: (!isSenior && !isGenZ) ? '#3b82f6' : 'transparent',
                color: (!isSenior && !isGenZ) ? '#fff' : '#cbd5e1',
                border: 'none',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              💼 Standard
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <div style={{ textAlign: 'center', maxWidth: '840px', marginBottom: isSenior ? '36px' : '44px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '9999px',
          background: isGenZ
            ? 'rgba(0, 240, 255, 0.15)'
            : isSenior
            ? 'rgba(251, 191, 36, 0.2)'
            : 'rgba(59, 130, 246, 0.12)',
          border: isGenZ ? '1px solid #00f0ff' : isSenior ? '1px solid #fbbf24' : '1px solid rgba(59, 130, 246, 0.3)',
          color: isGenZ ? '#00f0ff' : isSenior ? '#fbbf24' : '#60a5fa',
          fontSize: '0.86rem',
          fontWeight: 700,
          marginBottom: '18px'
        }}>
          <Sparkles size={16} />
          {isSenior
            ? 'Simple, High-Contrast & Senior-Friendly Public Transport'
            : isGenZ
            ? '🚀 Next-Gen AI Multi-Modal Transit Grid'
            : 'Unified Public Transport & Urban Mobility Platform'}
        </div>

        <h1 style={{
          fontSize: isSenior ? 'clamp(2.4rem, 5vw, 3.4rem)' : 'clamp(2.5rem, 5.5vw, 4rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '16px',
          color: '#ffffff'
        }}>
          {isSenior ? (
            <span>Public Transit Made <span style={{ color: '#fbbf24' }}>Simple & Clear</span></span>
          ) : isGenZ ? (
            <span>The Dopest Way to <span className="gradient-text">Move Across India</span></span>
          ) : (
            <span>Welcome to <span className="gradient-text">TransitOne</span></span>
          )}
        </h1>

        <p style={{
          fontSize: isSenior ? '1.25rem' : '1.15rem',
          color: isSenior ? '#f8fafc' : '#94a3b8',
          lineHeight: 1.6,
          margin: '0 auto',
          maxWidth: '700px'
        }}>
          {isSenior
            ? 'One easy tap for all Bus, Metro, and Auto tickets. Large readable directions and instant audio guidance for daily peace of mind.'
            : isGenZ
            ? 'Unified QR ticketing, real-time automated delay reroutes, carbon karma rewards & voice AI across Metro, Bus, and Electric Feeders.'
            : 'Experience frictionless multi-modal journeys with single-ticket QR booking, automated delay rerouting, and real-time operations dispatch.'}
        </p>
      </div>

      {/* 3. LIVE ECOSYSTEM STATS BANNER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '1080px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: isSenior ? '#0f172a' : 'rgba(15, 23, 42, 0.75)',
          border: isGenZ ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '16px',
          textAlign: 'center',
          boxShadow: isGenZ ? '0 0 15px rgba(0, 240, 255, 0.1)' : 'none'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>DAILY RIDERSHIP</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#3b82f6', marginTop: '2px' }}>1.4M+</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Unified QR journeys</div>
        </div>

        <div style={{
          background: isSenior ? '#0f172a' : 'rgba(15, 23, 42, 0.75)',
          border: isGenZ ? '1px solid rgba(57, 255, 20, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '16px',
          textAlign: 'center',
          boxShadow: isGenZ ? '0 0 15px rgba(57, 255, 20, 0.1)' : 'none'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>ON-TIME PERFORMANCE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399', marginTop: '2px' }}>96.4%</div>
          <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Live Metro & Bus Grid</div>
        </div>

        <div style={{
          background: isSenior ? '#0f172a' : 'rgba(15, 23, 42, 0.75)',
          border: isGenZ ? '1px solid rgba(255, 0, 127, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '16px',
          textAlign: 'center',
          boxShadow: isGenZ ? '0 0 15px rgba(255, 0, 127, 0.1)' : 'none'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>CO2 SAVINGS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isGenZ ? '#ff007f' : '#fbbf24', marginTop: '2px' }}>4.8 kg</div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Saved per commute</div>
        </div>

        <div style={{
          background: isSenior ? '#0f172a' : 'rgba(15, 23, 42, 0.75)',
          border: isGenZ ? '1px solid rgba(176, 38, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '16px',
          textAlign: 'center',
          boxShadow: isGenZ ? '0 0 15px rgba(176, 38, 255, 0.1)' : 'none'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>LANGUAGES</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a855f7', marginTop: '2px' }}>9 Regional</div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Voice AI + Text</div>
        </div>
      </div>

      {/* 4. THE 3 ECOSYSTEM PRODUCT GATEWAY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 360px))',
        gap: '24px',
        width: '100%',
        maxWidth: '1140px',
        marginBottom: '44px',
        justifyContent: 'center'
      }}>
        {/* Product 1: Passenger App */}
        <div
          onClick={() => navigate('/passenger/home')}
          style={{
            background: isSenior
              ? '#0a0e1a'
              : isGenZ
              ? 'linear-gradient(180deg, rgba(13, 22, 50, 0.9) 0%, rgba(5, 7, 17, 0.95) 100%)'
              : 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: isSenior
              ? '3px solid #60a5fa'
              : isGenZ
              ? '1px solid #00f0ff'
              : '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '22px',
            padding: '30px 24px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: isGenZ ? '0 12px 35px rgba(0, 240, 255, 0.2)' : '0 12px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = isSenior ? '#60a5fa' : isGenZ ? '#00f0ff' : 'rgba(59, 130, 246, 0.3)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
          }} />

          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Bus size={30} color="#60a5fa" />
            </div>

            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#60a5fa',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}>
              MODULE 1 · DOMESTIC COMMUTERS
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Passenger App
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
              {isSenior
                ? 'Large text route planner, 1-click booking for your usual commute, and clear voice instructions.'
                : '1-Click Usual Commute booking, universal QR pass for Metro + Bus, and live automatic delay rerouting.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Zap size={15} color="#3b82f6" /> 1-Tap Usual Commute Booking
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Navigation size={15} color="#10b981" /> Live Re-Routing on Delays
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Sparkles size={15} color="#a855f7" /> Voice AI Assistant
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: isSenior ? '16px' : '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: isSenior ? '1.1rem' : '0.96rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
            }}
          >
            Launch Passenger App <ArrowRight size={18} />
          </button>
        </div>

        {/* Product 2: Visitor Experience */}
        <div
          onClick={() => navigate('/visitor/welcome')}
          style={{
            background: isSenior
              ? '#0a0e1a'
              : isGenZ
              ? 'linear-gradient(180deg, rgba(30, 20, 10, 0.9) 0%, rgba(10, 8, 5, 0.95) 100%)'
              : 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: isSenior
              ? '3px solid #fbbf24'
              : isGenZ
              ? '1px solid #fbbf24'
              : '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '22px',
            padding: '30px 24px',
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
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = isSenior ? '#fbbf24' : 'rgba(245, 158, 11, 0.3)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
          }} />

          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Compass size={30} color="#fbbf24" />
            </div>

            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}>
              MODULE 2 · TOURISTS & VISITORS
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Visitor Experience
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Explore India with confidence. Step-by-step guided journeys, bilingual translations, and 24/7 tourist safety SOS.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Globe size={15} color="#f59e0b" /> 9 Languages + Native Audio
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <MapPin size={15} color="#10b981" /> "Take Me Back to Hotel" 1-Click
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Shield size={15} color="#06b6d4" /> 24/7 Tourist SOS & Help Center
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: isSenior ? '16px' : '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: isSenior ? '1.1rem' : '0.96rem',
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

        {/* Product 3: Employee Operations Portal */}
        <div
          onClick={() => navigate('/employee/login')}
          style={{
            background: isSenior
              ? '#0a0e1a'
              : isGenZ
              ? 'linear-gradient(180deg, rgba(20, 10, 35, 0.9) 0%, rgba(5, 5, 12, 0.95) 100%)'
              : 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
            border: isSenior
              ? '3px solid #34d399'
              : isGenZ
              ? '1px solid #b026ff'
              : '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '22px',
            padding: '30px 24px',
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
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = isSenior ? '#34d399' : 'rgba(16, 185, 129, 0.3)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #10b981, #34d399)'
          }} />

          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Shield size={30} color="#34d399" />
            </div>

            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#34d399',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}>
              MODULE 3 · STAFF & NOC OPERATORS
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Employee Portal
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Desktop-first network operations desk. Live GPS telematics, headway dispatching, safety incident desk, and service alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Radio size={15} color="#34d399" /> Real-Time Telematics & GPS Map
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Sliders size={15} color="#60a5fa" /> Headway & Fleet Dispatch Desk
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <Layers size={15} color="#fbbf24" /> Incident Response & Service Alerts
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: isSenior ? '16px' : '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: isSenior ? '1.1rem' : '0.96rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
            }}
          >
            NOC Staff Portal ➔
          </button>
        </div>
      </div>

      {/* 5. 1-CLICK INSTANT TEST DEMO ACCOUNTS BAR */}
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
          ⚡ INSTANT 1-CLICK DEMO EVALUATION PROFILES
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          <button
            onClick={() => handleQuickDemoLogin('senior')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              color: '#fbbf24',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>👵 Savitri Devi (65)</div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>Senior Accessible Commuter</div>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('genz')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#06b6d4',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>⚡ Rahul Varma (22)</div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>Gen-Z Tech Park Commuter</div>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('visitor')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>🇫🇷 Sophie Martin</div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>International Tourist in India</div>
          </button>

          <button
            onClick={() => handleQuickDemoLogin('employee')}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>🛡️ NOC Controller (EMP-9921)</div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>Operations Control Desk</div>
          </button>
        </div>
      </div>
    </div>
  );
}
