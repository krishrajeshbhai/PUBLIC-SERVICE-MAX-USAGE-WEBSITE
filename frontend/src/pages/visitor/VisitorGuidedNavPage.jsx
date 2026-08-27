import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, CheckCircle, Volume2, Globe, QrCode } from 'lucide-react';
import { api } from '../../services/api';
import { t } from '../../i18n/i18n';

export default function VisitorGuidedNavPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [showTranslatorCard, setShowTranslatorCard] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAttractionDetail(id);
        setAttraction(res);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [id]);

  if (!attraction) {
    return (
      <div style={{ maxWidth: '1280px', margin: '60px auto', textAlign: 'center' }}>
        <h2>Loading Guided Navigation Engine...</h2>
      </div>
    );
  }

  const steps = attraction.guidedSteps || [];
  const currentStep = steps[stepIndex] || steps[0];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      <button onClick={() => navigate(`/visitor/attraction/${id}`)} className="btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Exit Guided Navigation
      </button>

      {/* Navigation Step Deck Card */}
      <div className="glass-panel" style={{ padding: '36px', border: '2px solid #06b6d4', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span className="badge badge-accessible" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
            {t('step')} {stepIndex + 1} OF {steps.length}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>
            ⏱ Est. {currentStep.duration}
          </span>
        </div>

        {/* Step Title */}
        <h1 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#ffffff' }}>
          {currentStep.title}
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '32px' }}>
          {currentStep.detail}
        </p>

        {/* Local Language Conductor Helper Card */}
        <div style={{
          padding: '20px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px dashed rgba(6, 182, 212, 0.5)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase', marginBottom: '6px' }}>
            🗣 SHOW TO CONDUCTOR / STATION STAFF
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'sans-serif' }}>
            "{attraction.name} செல்லும் பேருந்து நிறுத்தத்தை காட்டவும்"
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            (Translation: Please guide me towards the bus stop for {attraction.name})
          </div>
        </div>

        {/* Navigation Step Controls */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
            disabled={stepIndex === 0}
            className="btn-secondary"
            style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
          >
            <ChevronLeft size={20} /> Previous Step
          </button>

          {stepIndex < steps.length - 1 ? (
            <button
              onClick={() => setStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              className="btn-primary"
              style={{ flex: 1, padding: '14px', justifyContent: 'center', background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
            >
              Next Step <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/visitor')}
              className="btn-primary"
              style={{ flex: 1, padding: '14px', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <CheckCircle size={20} /> Arrived at Destination!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
