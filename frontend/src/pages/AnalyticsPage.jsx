import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Award, Layers, Users, Zap, Leaf } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#c084fc',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '12px'
        }}>
          <Award size={14} /> Passenger · Operator · City Platform
        </div>
        <h1 style={{ fontSize: '2.2rem' }}>
          City Insights & <span className="gradient-text">Gamification Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time transit network health, mode share distribution, and carbon offset tracking</p>
      </div>

      {/* Gamification Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(88, 28, 135, 0.4) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '16px',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Award size={36} color="#fff" />
          </div>
          <div>
            <span className="badge" style={{ background: '#34d399', color: '#000', fontWeight: 800, marginBottom: '6px' }}>
              COMMUTER BADGE LEVEL 3
            </span>
            <h2 style={{ fontSize: '1.4rem' }}>Green Transit Pioneer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              14 Completed Trips · 9.2 kg Total CO₂ Offset · 98% On-Time Reroute Adoption
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STREAK</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>7 Days 🔥</div>
          </div>
          <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RANK</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#60a5fa' }}>Top 5% 🏆</div>
          </div>
        </div>
      </div>

      {/* Grid of City Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Card 1: Multi-modal Mode Share */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#3b82f6" /> Multi-Modal Mode Share
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Metro Lines (Purple / Green)</span>
                <strong style={{ color: '#a855f7' }}>48%</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '48%', height: '100%', background: '#a855f7' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>City Bus Network (Bus 201/500)</span>
                <strong style={{ color: '#3b82f6' }}>34%</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '34%', height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>First / Last Mile Walking</span>
                <strong style={{ color: '#10b981' }}>18%</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Delay & Reroute Effectiveness */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#f59e0b" /> Real-Time Reroute Engine Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVG REROUTE DETECT TIME</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>&lt; 2.4 sec</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TIME SAVED / REROUTE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>8.5 mins</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CROWD SMOOTHING</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#60a5fa' }}>-24% Peak</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SYSTEM ACCURACY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>99.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pitch Architecture Close Diagram */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={22} color="#60a5fa" /> The TransitOne Vision & Architecture
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Unifying urban transportation across three synchronized operational layers
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 800, marginBottom: '8px' }}>
              <Users size={18} /> 1. PASSENGER LAYER
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Single search, unified digital QR ticket, mobility wallet with auto-deduction, and zero-latency live reroute alerts.
            </p>
          </div>

          <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 800, marginBottom: '8px' }}>
              <Zap size={18} /> 2. OPERATOR LAYER
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Real-time delay simulation, crowd density indicators (🟢🟡🔴), dynamic load re-balancing, and schedule sync.
            </p>
          </div>

          <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 800, marginBottom: '8px' }}>
              <Leaf size={18} /> 3. CITY ANALYTICS LAYER
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Corridor bottleneck detection, multi-modal mode share heatmaps, carbon reduction analytics, and urban transit planning data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
