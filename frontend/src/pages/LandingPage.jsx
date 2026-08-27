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
        borderRadius: '24px',
        overflow: 'hidden',
        marginTop: '24px',
        marginBottom: '48px',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(90deg, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.6) 60%, rgba(9, 13, 22, 0.2) 100%), url('/transit_hero_bg.png') center/cover no-repeat`,
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ maxWidth: '680px', padding: '48px', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            color: '#60a5fa',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <Sparkles size={16} /> India's First Unified Multi-Modal Transit Engine
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
            Travel Smarter Across <span className="gradient-text">Metro, Bus & Rail</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '32px' }}>
            One Search. One Dynamic Ticket. One Wallet. Automated real-time delay notifications with one-tap alternative route switching.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {authUser ? (
              <button onClick={handleStartSearch} className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                <Zap size={20} /> Open Passenger Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
                  <LogIn size={20} /> Login & Start Traveling
                </button>
                <button onClick={() => navigate('/register')} className="btn-secondary" style={{ padding: '16px 28px', fontSize: '1.05rem', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}>
                  <UserPlus size={20} /> Create Account
                </button>
              </>
            )}
            <button onClick={handleStartVisitor} className="btn-secondary" style={{ padding: '16px 28px', fontSize: '1.05rem', background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}>
              <Globe size={20} /> Foreign Tourist Guide
            </button>
          </div>
        </div>
      </div>

      {/* Live Statistics Ribbon */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#60a5fa' }}>1.4M+</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Passengers</div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>98.4%</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>On-Time Network Rating</div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c084fc' }}>12.4 Tons</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>CO₂ Footprint Saved</div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b' }}>4 Operators</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unified under 1 QR Ticket</div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '12px' }}>One Platform, Three Experiences</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Designed to adapt seamlessly to domestic commuters, international visitors, and transport operations staff.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Card 1: Passenger Experience */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Navigation size={26} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Passenger App</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '20px' }}>
                1-click daily commute, ranked routes (Fastest, Cheapest, Least Walking, Eco), live ticket updates, and commute streak rewards.
              </p>
            </div>
            <button onClick={handleStartSearch} className="btn-primary" style={{ width: '100%' }}>
              {authUser ? 'Launch Passenger App' : 'Login to Access App'} <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Foreign Visitor Experience */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Globe size={26} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Visitor Experience</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '20px' }}>
                Explore heritage attractions, compare 80%+ savings over cabs, get localized conductor phrase advice, and download offline itineraries.
              </p>
            </div>
            <button onClick={handleStartVisitor} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              Explore Tourist Guide <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Employee Operations Portal */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Shield size={26} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Employee Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '20px' }}>
                Real-time fleet telemetry, network health monitoring, incident management desk, and delay alert publishing to passenger tickets.
              </p>
            </div>
            <button onClick={() => navigate('/employee-login')} className="btn-warning" style={{ width: '100%', justifyContent: 'center' }}>
              Staff Portal Access <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
