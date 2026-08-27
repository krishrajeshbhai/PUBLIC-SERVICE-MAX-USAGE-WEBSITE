import React, { useState, useEffect } from 'react';
import { Settings, Palette, Eye, Heart, CheckCircle2, User, Camera, ShieldCheck, Mail, Globe, Accessibility, Volume2, Save, Sparkles } from 'lucide-react';
import { getUXProfile, updateUXProfile, toggleSimplifiedMode, subscribeUXProfile, applyTheme } from '../store/uxProfileStore';
import { getAuthUser, setAuthUser, subscribeAuth } from '../store/authStore';

export default function SettingsPage() {
  const [authUser, setAuthUserState] = useState(getAuthUser());
  const [uxProfile, setProfileState] = useState(getUXProfile());

  // Section 1: Account Information State
  const [name, setName] = useState(authUser ? authUser.name : 'Rahul Sharma');
  const [email, setEmail] = useState(authUser ? authUser.email : 'passenger@transitone.in');
  const [age, setAge] = useState(authUser && authUser.age ? authUser.age : '28');
  const [country, setCountry] = useState(authUser ? authUser.country : 'India');
  const [language, setLanguage] = useState(authUser ? authUser.language : 'en');
  const [avatar, setAvatar] = useState(authUser && authUser.avatar ? authUser.avatar : '👨‍💼');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Section 2 & 3: Utility & Appearance State
  const [theme, setTheme] = useState(uxProfile.theme || localStorage.getItem('transitone_theme') || 'dark');
  const [fontScale, setFontScale] = useState(uxProfile.fontSize || 'medium');
  const [seniorAlertVisible, setSeniorAlertVisible] = useState(uxProfile.mode === 'simplified');

  useEffect(() => {
    const unsubAuth = subscribeAuth((user) => {
      setAuthUserState(user);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setAge(user.age || '28');
        setCountry(user.country || 'India');
        setLanguage(user.language || 'en');
        if (user.avatar) setAvatar(user.avatar);
      }
    });

    const unsubUX = subscribeUXProfile((p) => {
      setProfileState(p);
      setSeniorAlertVisible(p.mode === 'simplified');
    });

    return () => {
      unsubAuth();
      unsubUX();
    };
  }, []);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    const ageNum = age ? parseInt(age, 10) : undefined;
    const isSenior = ageNum !== undefined && ageNum > 50;

    const updatedUser = {
      ...(authUser || {}),
      name: name.trim(),
      email: email.trim(),
      age: ageNum,
      country,
      language,
      avatar: customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar,
      accessibility: isSenior ? true : (authUser ? authUser.accessibility : false)
    };

    setAuthUser(updatedUser);

    // Auto-update Senior Citizen Mode if age changed > 50
    if (isSenior) {
      updateUXProfile({
        mode: 'simplified',
        fontSize: 'large',
        highContrast: true
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('transitone_theme', newTheme);
    updateUXProfile({ theme: newTheme });
    applyTheme(newTheme);
  };

  const handleFontChange = (scale) => {
    setFontScale(scale);
    updateUXProfile({ fontSize: scale });
  };

  const handleSeniorToggle = () => {
    toggleSimplifiedMode();
  };

  const presetAvatars = ['👨‍💼', '👵', '👩‍🦰', '👮', '🧑‍💻', '🎓', '🏖️', '🚀'];

  const themes = [
    { id: 'dark', name: '🌌 Dark Midnight', desc: 'Sleek dark glassmorphism (Default)' },
    { id: 'cyberpunk', name: '⚡ Cyberpunk Neon', desc: 'Vibrant neon blue & purple glow' },
    { id: 'emerald', name: '🌱 Emerald Eco', desc: 'Soothing eco-green palette' },
    { id: 'sunset', name: '🌅 Sunset Amber', desc: 'Warm amber & deep gold accents' },
    { id: 'contrast', name: '👁 High Contrast', desc: 'Maximum legibility for low vision' }
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={28} color="#60a5fa" /> Preferences & System Settings
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage account details, utility accessibility, and visual appearance themes</p>
      </div>

      {savedSuccess && (
        <div style={{
          padding: '14px 20px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.92rem'
        }}>
          <CheckCircle2 size={20} /> Account information and profile settings updated successfully!
        </div>
      )}

      {/* SECTION 1: ACCOUNT INFORMATION (PROFILE DETAILS) */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={22} color="#60a5fa" /> Section 1: Account Information & Profile Details
          </h2>
          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
            {authUser ? authUser.role.toUpperCase() : 'PASSENGER'}
          </span>
        </div>

        <form onSubmit={handleSaveAccount}>
          {/* Avatar Selector */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
              PROFILE PICTURE & AVATAR
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {/* Active Avatar Preview Badge */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                boxShadow: 'var(--shadow-glow)',
                border: '3px solid #ffffff',
                overflow: 'hidden'
              }}>
                {avatar.startsWith('http') ? (
                  <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{avatar}</span>
                )}
              </div>

              {/* Preset Icon Selector */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Choose Preset Avatar:</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {presetAvatars.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setAvatar(emoji);
                        setCustomAvatarUrl('');
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: '1.3rem',
                        borderRadius: 'var(--radius-sm)',
                        background: avatar === emoji ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                        border: avatar === emoji ? '2px solid #3b82f6' : '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Photo URL Input */}
            <div style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Or paste custom Image URL:
              </label>
              <input
                type="text"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  if (e.target.value.trim()) setAvatar(e.target.value.trim());
                }}
                placeholder="https://example.com/avatar.jpg"
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  padding: '10px 14px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>EMAIL OR MOBILE</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>AGE (AGE &gt; 50 TRIGGERS SENIOR MODE)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>COUNTRY / REGION</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
              >
                <option value="India">India 🇮🇳</option>
                <option value="France">France 🇫🇷</option>
                <option value="Germany">Germany 🇩🇪</option>
                <option value="United States">United States 🇺🇸</option>
                <option value="Japan">Japan 🇯🇵</option>
                <option value="United Kingdom">United Kingdom 🇬🇧</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
            <Save size={18} /> Save Profile Details
          </button>
        </form>
      </div>

      {/* SECTION 2: UTILITY (SENIOR MODE & ACCESSIBILITY FEATURES) */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Eye size={22} color="#f59e0b" /> Section 2: Utility & Senior Accessibility Mode
          </h2>
          <span className="badge" style={{ background: uxProfile.mode === 'simplified' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)', color: uxProfile.mode === 'simplified' ? '#000' : '#fff' }}>
            {uxProfile.mode === 'simplified' ? 'SENIOR ACTIVE' : 'STANDARD'}
          </span>
        </div>

        {/* Senior Citizen Concession Alert Banner */}
        {seniorAlertVisible && (
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
            border: '2px solid #f59e0b',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            gap: '14px'
          }}>
            <div style={{ background: '#f59e0b', padding: '10px', borderRadius: '50%', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={22} color="#000" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b', marginBottom: '4px' }}>
                👵 SENIOR CITIZEN MODE ACTIVATED
              </div>
              <ul style={{ margin: '6px 0 0 16px', fontSize: '0.88rem', color: '#fef08a', lineHeight: '1.6' }}>
                <li><strong>50% Concession Subsidy:</strong> Automatic 50% discount applied across all Metro & Bus routes.</li>
                <li><strong>Step-Free Priority Routing:</strong> Elevator & wheelchair ramp routes prioritized.</li>
                <li><strong>Large Typography:</strong> Enlarged legibility buttons & clean interface.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Mode Selector Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          <button
            type="button"
            onClick={() => { if (uxProfile.mode === 'simplified') toggleSimplifiedMode(); }}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              background: uxProfile.mode === 'standard' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: uxProfile.mode === 'standard' ? '2px solid #3b82f6' : '1px solid var(--border-subtle)',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>🚀 Standard Mode</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Full multi-modal commuter dashboard</div>
          </button>

          <button
            type="button"
            onClick={() => { if (uxProfile.mode === 'standard') toggleSimplifiedMode(); }}
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              background: uxProfile.mode === 'simplified' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: uxProfile.mode === 'simplified' ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
              color: '#fff',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b', marginBottom: '4px' }}>👵 Senior Citizen Mode</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Uncluttered interface, large text & 50% concession</div>
          </button>
        </div>

        {/* Font Scale Picker */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
            TYPOGRAPHY & FONT SCALE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {['small', 'medium', 'large', 'xlarge'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleFontChange(s)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: fontScale === s ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: fontScale === s ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: APPEARANCE (COLOR SCHEMES & THEMES) */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Palette size={22} color="#c084fc" /> Section 3: Appearance & Color Schemes
          </h2>
          <span className="badge" style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc' }}>
            THEME: {theme.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {themes.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleThemeChange(t.id)}
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-sm)',
                background: theme === t.id ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: theme === t.id ? '2px solid #c084fc' : '1px solid var(--border-subtle)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '1.02rem', fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.desc}</div>
              </div>
              {theme === t.id && <CheckCircle2 size={22} color="#c084fc" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
