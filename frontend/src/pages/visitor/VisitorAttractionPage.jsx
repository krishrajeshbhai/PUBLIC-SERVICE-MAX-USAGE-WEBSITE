import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, MapPin, Bus, Train, Footprints, ShieldCheck, HelpCircle, Download, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { t } from '../../i18n/i18n';

export default function VisitorAttractionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await api.getAttractionDetail(id);
        setAttraction(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleDownloadOffline = () => {
    if (attraction) {
      localStorage.setItem(`offline_journey_${attraction.id}`, JSON.stringify(attraction));
      setDownloaded(true);
    }
  };

  if (loading || !attraction) {
    return (
      <div style={{ maxWidth: '1280px', margin: '60px auto', textAlign: 'center' }}>
        <div className="live-indicator" style={{ width: 24, height: 24, marginBottom: 16 }}></div>
        <h2>Loading Visitor Route Details...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      <button onClick={() => navigate('/visitor')} className="btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Visitor Explorer
      </button>

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="badge badge-accessible" style={{ marginBottom: '10px' }}>{attraction.category}</span>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{attraction.name}</h1>
            <p style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> {attraction.city} · {attraction.tagline}
            </p>
          </div>
          <button
            onClick={handleDownloadOffline}
            className="btn-secondary"
            style={{ color: downloaded ? '#10b981' : 'var(--text-main)' }}
          >
            {downloaded ? <CheckCircle2 size={18} color="#10b981" /> : <Download size={18} />}
            {downloaded ? 'Downloaded Offline' : 'Download Offline Itinerary'}
          </button>
        </div>
      </div>

      {/* "Explain My Journey" Cultural AI Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HelpCircle size={24} color="#c084fc" />
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{t('explainJourney')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Cultural, boarding & local conductor tips for international travelers</p>
            </div>
          </div>
          <button onClick={() => setExplainOpen(!explainOpen)} className="btn-secondary">
            {explainOpen ? 'Hide Tip' : 'Show Explanation'}
          </button>
        </div>

        {explainOpen && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.92rem', lineHeight: '1.6', color: '#e2e8f0' }}>
            💡 <strong>Conductor Assistance Tip:</strong> Public buses may display destination boards written in Tamil or Hindi script. Simply present your TransitOne QR ticket on your phone to the conductor upon boarding. They will notify you 1 stop prior to arrival!
          </div>
        )}
      </div>

      {/* Guided Steps Timeline */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Step-by-Step Public Transit Itinerary</h3>

        <div className="timeline-track">
          {attraction.guidedSteps.map((s, idx) => (
            <div key={idx} className="timeline-step">
              <div className="timeline-node" style={{ borderColor: '#06b6d4' }}></div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase' }}>
                    {t('step')} {s.stepNum} OF {attraction.guidedSteps.length}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱ {s.duration}</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{s.title}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate(`/visitor/guided/${attraction.id}`)}
          className="btn-primary"
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', fontSize: '1.05rem' }}
        >
          <Compass size={20} /> {t('guidedNav')}
        </button>
      </div>
    </div>
  );
}
