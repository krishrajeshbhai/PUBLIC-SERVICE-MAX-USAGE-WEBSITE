import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Compass, MapPin, Clock, DollarSign, Bus, Train, Footprints, ShieldCheck, ArrowRight, ArrowLeft, Volume2, Globe, Heart } from 'lucide-react';
import { TOURIST_DESTINATIONS } from '../explore/VisitorExplore';

export default function VisitorDestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('how_to_get_there'); // 'about' | 'how_to_get_there' | 'nearby'
  const [speaking, setSpeaking] = useState(false);

  const dest = TOURIST_DESTINATIONS.find(d => d.id === id) || TOURIST_DESTINATIONS[0];

  const handleAudioGuide = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      setSpeaking(true);
      const text = `${dest.name}. ${dest.description}. Entry fee is ${dest.entryFee}. The best way to reach here is by taking ${dest.transitSummary}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio speech synthesis not supported on this browser.");
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/visitor/explore')}
        style={{
          background: 'none',
          border: 'none',
          color: '#fbbf24',
          fontSize: '0.9rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={18} /> Back to All Attractions
      </button>

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        height: '320px',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '28px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <img
          src={dest.image}
          alt={dest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '32px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.9)',
            color: '#000',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 800,
            width: 'fit-content',
            marginBottom: '10px'
          }}>
            {dest.tag}
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', margin: 0 }}>
            {dest.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '0.88rem', color: '#cbd5e1' }}>
            <span>⭐ {dest.rating} Rating</span>
            <span>•</span>
            <span>📍 {dest.nearestStation}</span>
            <span>•</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>{dest.safetyScore}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '28px',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'how_to_get_there', label: '🚌 How to Get There' },
          { id: 'about', label: '📖 About & History' },
          { id: 'nearby', label: '📍 Nearby Places' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === tab.id ? '#fbbf24' : '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: How to Get There (Recommended Public Transport Journey) */}
      {activeTab === 'how_to_get_there' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge" style={{ background: '#f59e0b', color: '#000', fontWeight: 800 }}>
                RECOMMENDED TOURIST PUBLIC ROUTE
              </span>
              <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 800 }}>
                Total Fare: {dest.fare}
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
              Direct Express Transit via {dest.transitSummary}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '20px' }}>
              Safe, air-conditioned public transportation with verified English/Tamil signage and tourist passenger assistance.
            </p>

            {/* Timeline preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <Footprints size={18} color="#94a3b8" />
                <span style={{ color: '#fff', fontWeight: 600 }}>Step 1: Walk to Thiruvanmiyur Bus Terminal (350m)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <Bus size={18} color="#3b82f6" />
                <span style={{ color: '#fff', fontWeight: 600 }}>Step 2: Board Bus 588 / 201 Express (Direct to Mahabalipuram)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <Footprints size={18} color="#94a3b8" />
                <span style={{ color: '#fff', fontWeight: 600 }}>Step 3: 3 min scenic walk along Shore Temple Rd to monument gate</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate(`/visitor/journey/${dest.id}`)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)'
              }}
            >
              Start Step-by-Step Guided Navigation <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: About & History */}
      {activeTab === 'about' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>Monument Overview & Visitor Guide</h3>
            <button
              onClick={handleAudioGuide}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Volume2 size={16} /> {speaking ? 'Stop Audio Guide' : 'Listen to Audio Guide'}
            </button>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {dest.description} Built during the Pallava dynasty under King Narasimhavarman II, this complex of sanctuaries represents the pinnacle of early South Indian Dravidian stone temple engineering.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ENTRY TICKET FEE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{dest.entryFee}</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>OPENING HOURS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{dest.timings}</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DRESS CODE / GUIDELINE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>Casual / Footwear Removal at inner sanctum</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nearby Places */}
      {activeTab === 'nearby' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Nearby Attractions Along This Route</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>Arjuna's Penance (Giant Rock Relief)</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>400m from Shore Temple · Free Entry</div>
              </div>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>5 min walk</span>
            </div>

            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff' }}>Pancha Rathas (Five Chariots)</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>1.2 km south · Included in Shore Temple ticket</div>
              </div>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>Auto / Walk</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
