import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation, Sparkles, Zap, Globe, Shield, Bot, Eye, ArrowRight, CheckCircle2, Heart, ShieldCheck, Footprints, Bus, Train, LogIn, UserPlus } from 'lucide-react';
import { t } from '../i18n/i18n';
import { getAuthUser } from '../store/authStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  const handleStartSearch = () => {
    if (authUser) {
      navigate('/search');
    } else {
      navigate('/login');
    }
  };

  const handleStartVisitor = () => {
    if (authUser) {
      navigate('/visitor');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        borderRadius: '32px',
        overflow: 'hidden',
        marginTop: '24px',
        marginBottom: '48px',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(90deg, rgba(7, 10, 19, 0.96) 0%, rgba(7, 10, 19, 0.75) 55%, rgba(7, 10, 19, 0.3) 100%), url('/transit_hero_bg.png') center/cover no-repeat`,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{ maxWidth: '720px', padding: '56px', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.25)',
            border: '1px solid rgba(59, 130, 246, 0.55)',
            color: '#60a5fa',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '24px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          }}>
            <Sparkles size={16} /> India's Next-Gen Unified Multi-Modal AI Engine
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: '22px' }}>
            Travel Seamlessly Across <span className="gradient-text">Metro, Bus & Rail</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: '1.65', marginBottom: '36px', fontWeight: 400 }}>
            One Dynamic Search. Instant Unified Ticket. 100% Automated Wallet Sync with Real-Time Reroute Switching.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {authUser ? (
              <button onClick={handleStartSearch} className="btn-primary" style={{ padding: '18px 36px', fontSize: '1.1rem' }}>
                <Zap size={22} /> Launch Commuter App
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '18px 36px', fontSize: '1.1rem' }}>
                  <LogIn size={22} /> Passenger Login
                </button>
                <button onClick={() => navigate('/register')} className="btn-secondary" style={{ padding: '18px 30px', fontSize: '1.1rem', background: 'rgba(16, 185, 129, 0.18)', borderColor: 'rgba(16, 185, 129, 0.5)', color: '#34d399' }}>
                  <UserPlus size={22} /> Register Free
                </button>
              </>
            )}
            <button onClick={handleStartVisitor} className="btn-secondary" style={{ padding: '18px 30px', fontSize: '1.1rem', background: 'rgba(6, 182, 212, 0.18)', borderColor: 'rgba(6, 182, 212, 0.5)', color: '#22d3ee' }}>
              <Globe size={22} /> Tourist Experience
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Station Departure Cards */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="#38bdf8" /> Popular Express Commute Hubs
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to auto-launch route search</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { from: 'Central Station', to: 'Tech Park', time: '24 mins', fare: '₹28', icon: <Train size={20} color="#a855f7" /> },
            { from: 'Residency Road', to: 'MG Road', time: '14 mins', fare: '₹14', icon: <Bus size={20} color="#3b82f6" /> },
            { from: 'Central Station', to: 'Majestic', time: '10 mins', fare: '₹0 (Walk)', icon: <Footprints size={20} color="#34d399" /> },
            { from: 'Cubbon Park', to: 'Indiranagar', time: '12 mins', fare: '₹22', icon: <Train size={20} color="#a855f7" /> }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(authUser ? `/results?origin=stop-1&destination=stop-2` : '/login')}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>{item.from} ➔ {item.to}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.time}</div>
                </div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: item.fare.includes('0') ? '#34d399' : '#60a5fa' }}>
                {item.fare}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Network Stats */}
      <div className="glass-panel" style={{ padding: '28px 36px', marginBottom: '56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#60a5fa' }}>1.4M+</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Daily Active Commuters</div>
        </div>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#34d399' }}>98.9%</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>On-Time Routing Precision</div>
        </div>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#c084fc' }}>14.8 Tons</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>CO₂ Emissions Reduced</div>
        </div>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f59e0b' }}>₹0 Fare</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Free Walking Route Guarantee</div>
        </div>
      </div>

      {/* Portal Showcase Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', textAlign: 'center', marginBottom: '12px' }}>Tailored Portals for Every Mobility Need</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 44px auto', fontSize: '1.05rem' }}>
          Seamless experience designed for daily commuters, foreign visitors, and transport operations staff.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Card 1: Passenger Portal */}
          <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
                <Navigation size={28} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Passenger Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Ranked journey search, unified QR ticket issuance, auto-deduct wallet sync, and live delay reroute prompts.
              </p>
            </div>
            <button onClick={handleStartSearch} className="btn-primary" style={{ width: '100%' }}>
              {authUser ? 'Launch Passenger App' : 'Login to Access App'} <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Foreign Visitor Portal */}
          <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
                <Globe size={28} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Visitor Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Explore UNESCO heritage spots, compare 80%+ cab fare savings, offline transit maps, and local conductor phrases.
              </p>
            </div>
            <button onClick={handleStartVisitor} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              Explore Tourist Guide <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 3: Employee Operations Portal */}
          <div className="glass-panel" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>
                <Shield size={28} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Employee Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Real-time fleet telemetry, network congestion monitor, incident logging desk, and passenger ticket delay triggers.
              </p>
            </div>
            <button onClick={() => navigate('/employee-login')} className="btn-warning" style={{ width: '100%', justifyContent: 'center' }}>
              Staff Portal Access <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
