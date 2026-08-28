import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Flag, Clock, Hotel, Compass, ArrowRight, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { setAuthUser } from '../../../store/authStore';
import { setLanguage, LANGUAGES } from '../../../i18n/i18n';

export default function VisitorOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [nationality, setNationality] = useState('🇺🇸 United States');
  const [language, setLanguageChoice] = useState('en');
  const [duration, setDuration] = useState('1 Week');
  const [hotel, setHotel] = useState('The Taj Connemara, Chennai');
  const [preferences, setPreferences] = useState(['Culture & History', 'Food', 'Beaches']);

  const nationalities = [
    '🇺🇸 United States', '🇬🇧 United Kingdom', '🇫🇷 France', '🇩🇪 Germany',
    '🇯🇵 Japan', '🇰🇷 South Korea', '🇦🇺 Australia', '🇨🇦 Canada', '🇪🇸 Spain', '🇮🇳 Domestic Visitor'
  ];

  const durations = ['3 Days', '1 Week', '2 Weeks', '1 Month', 'Longer'];

  const hotels = [
    'The Taj Connemara, Chennai',
    'ITC Grand Chola, Guindy',
    'The Leela Palace, MRC Nagar',
    'Radisson Blu Hotel GRT, Chennai',
    'Custom / Airbnb Apartment'
  ];

  const categories = [
    { id: 'Culture & History', label: '🏛 Culture & History' },
    { id: 'Beaches', label: '🏖 Beaches & Coast' },
    { id: 'Food', label: '🍛 Food & Street Eats' },
    { id: 'Temples', label: '🛕 Temples & Heritage' },
    { id: 'Nature', label: '🏔 Nature & Parks' },
    { id: 'Shopping', label: '🛍 Shopping & Silk' }
  ];

  const togglePref = (id) => {
    if (preferences.includes(id)) {
      setPreferences(preferences.filter(p => p !== id));
    } else {
      setPreferences([...preferences, id]);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      if (currentStep === 2) {
        setLanguage(language);
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Save visitor user profile
      const visitorUser = {
        id: 'user-visitor-1',
        name: 'International Explorer',
        role: 'visitor',
        nationality,
        language,
        duration,
        hotel,
        preferences
      };
      setAuthUser(visitorUser);
      setLanguage(language);
      navigate('/visitor/explore');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.15) 0%, rgba(10, 15, 26, 0.98) 70%)',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        padding: '36px 32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Step Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, marginBottom: '8px' }}>
            <span>STEP {currentStep} OF 5</span>
            <span>{Math.round((currentStep / 5) * 100)}% COMPLETE</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${(currentStep / 5) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Step 1: Nationality */}
        {currentStep === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🌍</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>What is your nationality?</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>We customize embassy assistance & tourist guidelines for you.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', marginBottom: '24px' }}>
              {nationalities.map(n => (
                <button
                  key={n}
                  onClick={() => setNationality(n)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: nationality === n ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: nationality === n ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{n}</span>
                  {nationality === n && <CheckCircle2 size={18} color="#fbbf24" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Preferred Language */}
        {currentStep === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🗣️</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>Select your language</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>Step-by-step transit instructions and audio explanations will be in this language.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguageChoice(l.code)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: language === l.code ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: language === l.code ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{l.flag}</span>
                  <span style={{ fontSize: '0.85rem' }}>{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Travel Duration */}
        {currentStep === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>⏳</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>How long is your visit?</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>We will optimize transit passes and itinerary pacing.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: duration === d ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: duration === d ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{d}</span>
                  {duration === d && <CheckCircle2 size={18} color="#fbbf24" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Accommodation / Hotel */}
        {currentStep === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🏨</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>Where are you staying?</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>Your "Take Me Back to Hotel" 1-click button will always bring you safely back here.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {hotels.map(h => (
                <button
                  key={h}
                  onClick={() => setHotel(h)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: hotel === h ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: hotel === h ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{h}</span>
                  {hotel === h && <CheckCircle2 size={18} color="#fbbf24" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Travel Preferences */}
        {currentStep === 5 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>✨</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>What would you like to explore?</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>Select all that interest you for customized public transport routes.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {categories.map(c => {
                const active = preferences.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => togglePref(c.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: active ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: active ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: active ? '#fbbf24' : '#cbd5e1',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Next / Finish Button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
          }}
        >
          {currentStep === 5 ? 'Launch Visitor Dashboard 🚀' : 'Next Step'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
