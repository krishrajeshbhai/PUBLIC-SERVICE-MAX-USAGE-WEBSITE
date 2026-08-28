// uxProfileStore.js - Adaptive Age & Persona UX State Manager

export const UX_MODES = {
  STANDARD: 'standard',
  SENIOR: 'senior', // Aged/Senior: Large readable fonts, high contrast, clean, voice first, no clutter
  GENZ: 'genz',     // GenZ: Cyberpunk neon vibrant accents, streak counters, eco gamification, animated badges
};

const DEFAULT_PROFILE = {
  mode: UX_MODES.STANDARD,
  fontSize: 'medium', // small, medium, large, xlarge
  highContrast: false,
  theme: 'dark', // 'dark', 'cyberpunk', 'contrast', 'emerald', 'sunset'
  voiceEnabled: true,
  autoReadOut: true,
  reducedMotion: false,
};

const DB_KEY = 'transitone_ux_profile_v4';

function loadProfileFromStorage() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error loading UX profile:", e);
  }
  return { ...DEFAULT_PROFILE };
}

let currentProfile = loadProfileFromStorage();
const listeners = new Set();

function saveProfileToStorage() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(currentProfile));
  } catch (e) {
    console.warn("Error saving UX profile:", e);
  }
}

export function getUXProfile() {
  return { ...currentProfile };
}

export function updateUXProfile(updates) {
  currentProfile = { ...currentProfile, ...updates };
  saveProfileToStorage();
  listeners.forEach(cb => cb(currentProfile));
  applyBodyClasses();
}

export function resetUXProfileToDefault() {
  currentProfile = { ...DEFAULT_PROFILE };
  saveProfileToStorage();
  listeners.forEach(cb => cb(currentProfile));
  applyBodyClasses();
}

export function subscribeUXProfile(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setAgePersona(persona) {
  if (persona === 'senior') {
    updateUXProfile({
      mode: UX_MODES.SENIOR,
      fontSize: 'large',
      highContrast: true,
      theme: 'contrast',
      voiceEnabled: true,
      autoReadOut: true
    });
    applyTheme('contrast');
  } else if (persona === 'genz') {
    updateUXProfile({
      mode: UX_MODES.GENZ,
      fontSize: 'medium',
      highContrast: false,
      theme: 'cyberpunk',
      voiceEnabled: true,
      autoReadOut: false
    });
    applyTheme('cyberpunk');
  } else {
    updateUXProfile({
      mode: UX_MODES.STANDARD,
      fontSize: 'medium',
      highContrast: false,
      theme: 'dark',
      voiceEnabled: true,
      autoReadOut: false
    });
    applyTheme('dark');
  }
}

export function toggleSimplifiedMode() {
  const isSenior = currentProfile.mode !== UX_MODES.SENIOR;
  setAgePersona(isSenior ? 'senior' : 'standard');
}

export function applyTheme(themeName) {
  if (typeof document === 'undefined') return;
  document.body.className = document.body.className.replace(/theme-\S+/g, '');
  if (themeName) {
    document.body.classList.add(`theme-${themeName}`);
  }
}

export function initThemeFromUrlOrUser(user = null) {
  if (typeof window === 'undefined') return;
  
  // 1. Check if URL has `?persona=...` or `?theme=...`
  const params = new URLSearchParams(window.location.search);
  const urlPersona = params.get('persona');
  const urlTheme = params.get('theme');

  if (urlPersona) {
    setAgePersona(urlPersona.toLowerCase().trim());
    return;
  }

  if (urlTheme) {
    const validTheme = urlTheme.toLowerCase().trim();
    updateUXProfile({ theme: validTheme });
    applyTheme(validTheme);
    return;
  }

  // 2. If user is logged in, infer age persona from age or saved profile
  if (user) {
    if (user.age && user.age > 50 || user.accessibility) {
      setAgePersona('senior');
      return;
    }
    if (user.age && user.age <= 28) {
      setAgePersona('genz');
      return;
    }
    if (user.persona) {
      setAgePersona(user.persona);
      return;
    }
  }

  // 3. Re-apply current saved profile
  applyBodyClasses();
  if (currentProfile.theme) {
    applyTheme(currentProfile.theme);
  }
}

function applyBodyClasses() {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('ux-mode-senior', 'ux-mode-genz', 'ux-mode-standard', 'ux-mode-simplified');

    if (currentProfile.mode === UX_MODES.SENIOR) {
      document.body.classList.add('ux-mode-senior', 'ux-mode-simplified');
    } else if (currentProfile.mode === UX_MODES.GENZ) {
      document.body.classList.add('ux-mode-genz');
    } else {
      document.body.classList.add('ux-mode-standard');
    }

    if (currentProfile.highContrast) {
      document.body.classList.add('ux-high-contrast');
    } else {
      document.body.classList.remove('ux-high-contrast');
    }

    if (currentProfile.fontSize) {
      document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
      document.body.classList.add(`font-${currentProfile.fontSize}`);
    }
  }
}

