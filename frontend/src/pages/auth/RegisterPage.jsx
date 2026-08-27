import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Globe, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Heart, Accessibility, Zap, DollarSign, Leaf, Footprints } from 'lucide-react';
import { api } from '../../services/api';
import { setAuthUser } from '../../store/authStore';
import { LANGUAGES, setLanguage } from '../../i18n/i18n';
import { updateUXProfile, initThemeFromUrlOrUser } from '../../store/uxProfileStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    initThemeFromUrlOrUser(null);
  }, []);

  // Form State across 5 steps
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    country: 'India',
    language: 'en',
    preferences: {
      walking: 'moderate',
      cheapest: true,
      fastest: true,
      eco: true
    },
    accessibility: false
  });

  const isSenior = parseInt(formData.age, 10) > 50;

  const countries = [
    { code: 'IN', name: 'India' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States' },
    { code: 'JP', name: 'Japan' },
    { code: 'GB', name: 'United Kingdom' }
  ];

  const handleRegisterComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      setLanguage(formData.language);

      if (isSenior) {
        updateUXProfile({
          mode: 'simplified',
          fontSize: 'large',
          highContrast: true
        });
      }

      const res = await api.register({
        ...formData,
        accessibility: isSenior ? true : formData.accessibility
      });
      
      setAuthUser(res.user);

      if (res.user.role === 'visitor') {
        navigate('/visitor');
      } else {
        navigate('/search');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto', padding: '0 24px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        {/* Wizard Header Progress Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>
              STEP {step} OF 5
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {step === 1 ? 'Personal Info & Age' : step === 2 ? 'Country / Region' : step === 3 ? 'Language' : step === 4 ? 'Preferences' : 'Complete'}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / 5) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.88rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* STEP 1: Name, Contact & Age */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Create Your Account</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Basic details & age for automatic UX adaptation</p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>YOUR NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>MOBILE / EMAIL</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com or +91..."
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>CREATE PASSWORD</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="•••••••• (Min 6 chars)"
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            {/* AGE INPUT */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>YOUR AGE</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 54"
                min="1"
                max="120"
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            {isSenior && (
              <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)', marginBottom: '24px', color: '#fef08a', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Heart size={20} color="#f59e0b" />
                <span>👵 <strong>Senior Citizen Mode Detected (Age &gt; 50).</strong> 50% Concession & Step-Free routing will be auto-enabled!</span>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              disabled={!formData.name.trim() || !formData.email.trim() || !formData.password.trim()}
            >
              Continue to Step 2 <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Country / Region */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Country / Region</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>TransitOne tailors the UI to domestic vs international visitors</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {countries.map(c => (
                <button
                  key={c.code}
                  onClick={() => setFormData({ ...formData, country: c.name })}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: formData.country === c.name ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: formData.country === c.name ? '2px solid #3b82f6' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{c.name}</span>
                  {formData.country === c.name && <CheckCircle2 size={16} color="#60a5fa" />}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary" style={{ flex: 1 }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Language Preference */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Preferred Language</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Interface and voice assistant will communicate in this language</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setFormData({ ...formData, language: lang.code })}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: formData.language === lang.code ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: formData.language === lang.code ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{lang.flag} {lang.name}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(4)} className="btn-primary" style={{ flex: 1 }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Travel Preferences */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Travel Preferences</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Tailor journey ranking algorithms to your priorities</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {/* Accessibility Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Accessibility size={20} color="#22d3ee" />
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Step-Free / Elevator Preference</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isSenior ? true : formData.accessibility}
                    disabled={isSenior}
                    onChange={(e) => setFormData({ ...formData, accessibility: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Cheapest Preference */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DollarSign size={20} color="#34d399" />
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Prioritize Lowest Fares</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.preferences.cheapest}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, cheapest: e.target.checked } })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Eco Friendly */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Leaf size={20} color="#10b981" />
                  <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Maximize CO₂ Savings</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.preferences.eco}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, eco: e.target.checked } })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(3)} className="btn-secondary" style={{ flex: 1 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(5)} className="btn-primary" style={{ flex: 1 }}>
                Review & Finish <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Complete & Review */}
        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={32} color="#34d399" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Setup Complete!</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Your profile is configured as <strong>{formData.country !== 'India' ? 'Foreign Tourist (Visitor Mode)' : 'Domestic Commuter'}</strong>.
            </p>

            {isSenior && (
              <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)', marginBottom: '24px', color: '#fef08a', fontSize: '0.85rem' }}>
                👵 Senior Citizen Benefits Activated: 50% Concession on Metro & Bus + Large Text
              </div>
            )}

            <button
              onClick={handleRegisterComplete}
              className="btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
              disabled={loading}
            >
              {loading ? 'Launching TransitOne...' : 'Start Exploring TransitOne'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
