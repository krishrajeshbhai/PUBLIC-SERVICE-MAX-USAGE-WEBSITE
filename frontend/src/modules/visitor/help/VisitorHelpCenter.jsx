import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, MapPin, Ticket, Navigation, Hotel, Languages, ShieldAlert, PhoneCall, ArrowRight, QrCode, CheckCircle2 } from 'lucide-react';
import { getAuthUser } from '../../../store/authStore';

export default function VisitorHelpCenter() {
  const navigate = useNavigate();
  const [user] = useState(getAuthUser() || { hotel: 'The Taj Connemara, Chennai', nationality: '🇺🇸 United States' });
  const [activeModal, setActiveModal] = useState(null); // 'where_am_i' | 'translation' | 'emergency' | 'hotel'

  const emergencyContacts = [
    { label: 'Tourist Police Helpline', number: '1363', desc: 'Toll-free 24/7 multi-language tourist police assistance' },
    { label: 'National Emergency Response', number: '112', desc: 'Police, Fire, and Medical Unified SOS' },
    { label: 'Ambulance Emergency', number: '108', desc: 'State medical ambulance dispatch' },
    { label: 'US Consulate General Chennai', number: '+91 44 2857 4000', desc: 'American citizen emergency support' }
  ];

  const translationCards = [
    {
      english: "Please let me know when we reach Mahabalipuram Shore Temple.",
      tamil: "மகாபலிபுரம் கடற்கரை கோவில் வந்ததும் எனக்கு தயவுசெய்து சொல்லுங்கள்.",
      pronunciation: "Mahabalipuram kadarkarai kovil vanthadhum enakku thayavu seidhu sollungal."
    },
    {
      english: "Where is the nearest Metro station?",
      tamil: "அருகிலுள்ள மெட்ரோ நிலையம் எங்கு உள்ளது?",
      pronunciation: "Arugilulla metro nilaiyam engu ulladhu?"
    },
    {
      english: "Please take me to The Taj Connemara Hotel.",
      tamil: "தயவுசெய்து என்னை தாஜ் கன்னெமரா ஹோட்டலுக்கு அழைத்துச் செல்லுங்கள்.",
      pronunciation: "Thayavu seidhu ennai Taj Connemara hotelukku azhaithu sellungal."
    },
    {
      english: "How much is the bus ticket to Central Station?",
      tamil: "சென்ட்ரல் நிலையத்திற்கு பேருந்து கட்டணம் எவ்வளவு?",
      pronunciation: "Central nilaiyathirku perundhu kattanam evvalavu?"
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '999px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '10px'
        }}>
          <ShieldAlert size={14} /> 24/7 International Tourist Safety System
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Visitor Assistance & Help Center
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px' }}>
          Instant safety tools, hotel return routing, driver translation cards, and emergency hotlines.
        </p>
      </div>

      {/* Grid of 6 Core Help Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* 1. Where am I */}
        <div
          onClick={() => setActiveModal('where_am_i')}
          className="glass-panel"
          style={{
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            background: 'rgba(15, 23, 42, 0.85)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <MapPin size={26} color="#60a5fa" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>📍 Where am I?</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            GPS pinpoint & nearest verified landmarks with safety radius.
          </p>
        </div>

        {/* 2. Show My Ticket */}
        <div
          onClick={() => navigate('/visitor/journey/dest-1')}
          className="glass-panel"
          style={{
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'rgba(15, 23, 42, 0.85)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Ticket size={26} color="#fbbf24" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>🎫 Show My Ticket</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            Instant offline-ready QR pass for buses, metro, and monuments.
          </p>
        </div>

        {/* 3. Find Station */}
        <div
          onClick={() => navigate('/visitor/map')}
          className="glass-panel"
          style={{
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'rgba(15, 23, 42, 0.85)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Navigation size={26} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>🚉 Find Station</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            Compass direction to the closest metro entrance or bus stop.
          </p>
        </div>

        {/* 4. Find My Hotel */}
        <div
          onClick={() => setActiveModal('hotel')}
          className="glass-panel"
          style={{
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            background: 'rgba(15, 23, 42, 0.85)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Hotel size={26} color="#c084fc" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>🏨 Find My Hotel</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            1-click return transit directions to <strong>{user.hotel || 'The Taj Connemara'}</strong>.
          </p>
        </div>

        {/* 5. Translation for Driver */}
        <div
          onClick={() => setActiveModal('translation')}
          className="glass-panel"
          style={{
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            background: 'rgba(15, 23, 42, 0.85)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Languages size={26} color="#22d3ee" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>🗣 Translation Cards</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            Show full-screen Tamil/Hindi transit phrases directly to drivers.
          </p>
        </div>

        {/* 6. Emergency Assistance */}
        <div
          onClick={() => setActiveModal('emergency')}
          className="glass-panel"
          style={{
            padding: '24px',
            cursor: 'pointer',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <ShieldAlert size={26} color="#ef4444" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fca5a5', margin: '0 0 6px 0' }}>🆘 Emergency SOS</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
            Tourist Police helpline 1363 & 1-tap embassy emergency call.
          </p>
        </div>
      </div>

      {/* Modal 1: Where Am I */}
      {activeModal === 'where_am_i' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '28px', background: '#0f172a' }}>
            <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>📍 Your Current Location</h3>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.1rem' }}>Central Station Bus Concourse, Chennai</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>Coordinates: 13.0827° N, 80.2707° E · Accuracy: ±5m</div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
              You are currently inside the monitored tourist security zone. Uniformed tourist help desk is 40 meters to your east.
            </p>
            <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {/* Modal 2: Hotel Return Route */}
      {activeModal === 'hotel' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '28px', background: '#0f172a' }}>
            <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>🏨 Return Route to Your Hotel</h3>
            <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid #a855f7', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '1.1rem' }}>{user.hotel}</div>
              <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '6px' }}>
                Recommended: <strong>Metro Blue Line to Thousand Lights Station</strong> (12 mins, ₹20)
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal(null);
                navigate('/visitor/journey/dest-1');
              }}
              className="btn-primary"
              style={{ width: '100%', marginBottom: '10px' }}
            >
              Start Guided Return Route
            </button>
            <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {/* Modal 3: Translation Cards */}
      {activeModal === 'translation' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '560px', width: '100%', padding: '28px', background: '#0f172a', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#fff', margin: '0 0 6px 0' }}>🗣 Show This to Bus Driver / Auto Driver</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Large font local language phrases designed to show on your screen</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {translationCards.map((c, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '6px' }}>🇬🇧 {c.english}</div>
                  <div style={{ color: '#fbbf24', fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>🇮🇳 {c.tamil}</div>
                  <div style={{ color: '#34d399', fontSize: '0.78rem', fontStyle: 'italic' }}>Pronounce: "{c.pronunciation}"</div>
                </div>
              ))}
            </div>

            <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {/* Modal 4: Emergency Contacts */}
      {activeModal === 'emergency' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '28px', background: '#0f172a', border: '2px solid #ef4444' }}>
            <h3 style={{ color: '#ef4444', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={22} /> Emergency Helpline Directory
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Tap any number to initiate an immediate emergency call</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {emergencyContacts.map((c, i) => (
                <a
                  key={i}
                  href={`tel:${c.number.replace(/\s/g, '')}`}
                  style={{
                    textDecoration: 'none',
                    padding: '14px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{c.label}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{c.desc}</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '8px' }}>
                    {c.number}
                  </span>
                </a>
              ))}
            </div>

            <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
