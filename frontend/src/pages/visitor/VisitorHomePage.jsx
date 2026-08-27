import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, MapPin, Bus, Train, ArrowRight, Globe, HelpCircle, Download } from 'lucide-react';
import { api } from '../../services/api';
import { t } from '../../i18n/i18n';

export default function VisitorHomePage() {
  const navigate = useNavigate();
  const [attractions, setAttractions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'History', 'Culture', 'Beaches'];

  useEffect(() => {
    async function loadAttractions() {
      setLoading(true);
      try {
        const data = await api.getVisitorAttractions(activeCategory);
        setAttractions(data);
      } catch (e) {
        console.error("Failed to load visitor attractions:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAttractions();
  }, [activeCategory]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.1)', fontSize: '0.82rem', fontWeight: 700, color: '#22d3ee', marginBottom: '16px' }}>
          <Globe size={16} /> FOREIGN VISITOR & TOURIST GUIDE
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '14px', lineHeight: 1.15 }}>
          {t('welcomeVisitor')}
        </h1>
        <p style={{ color: '#e2e8f0', fontSize: '1.1rem', maxWidth: '720px', margin: 0 }}>
          {t('visitorSubtitle')}. Enjoy 80% cost savings compared to taxis with step-by-step guided instructions in your language.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat === 'All' ? '🌐 All Destinations' : cat === 'History' ? '🏛️ History & Heritage' : cat === 'Culture' ? '🛕 Culture & Palaces' : '🏖️ Beaches'}
          </button>
        ))}
      </div>

      {/* Attractions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
        {attractions.map(item => (
          <div
            key={item.id}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span style={{ fontSize: '2.5rem' }}>{item.image}</span>
                <span className="badge badge-accessible">{item.category}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{item.name}</h3>
              <div style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {item.city}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>
                {item.description}
              </p>

              {/* Transport vs Taxi Price Comparison Pill */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>PUBLIC TRANSIT</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>₹{item.pubCost}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱ {item.pubDuration}</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '10px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>TAXI FARE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{item.taxiCost}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱ {item.taxiDuration}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/visitor/attraction/${item.id}`)}
              className="btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}
            >
              Explore Public Route <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
