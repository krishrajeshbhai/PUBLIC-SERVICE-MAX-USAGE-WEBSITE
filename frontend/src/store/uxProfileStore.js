// uxProfileStore.js - Adaptive UX & Theme State Manager

const UX_MODES = {
  STANDARD: 'standard',
  SIMPLIFIED: 'simplified', // Senior / accessible mode
};

const DEFAULT_PROFILE = {
  mode: UX_MODES.STANDARD,
  fontSize: 'medium', // small, medium, large, xlarge
  highContrast: false,
  theme: 'dark',
  voiceEnabled: true,
  autoReadOut: true,
  reducedMotion: false,
};

let currentProfile = { ...DEFAULT_PROFILE };
const listeners = new Set();

export function getUXProfile() {
  return { ...currentProfile };
}

export function updateUXProfile(updates) {
  currentProfile = { ...currentProfile, ...updates };
  listeners.forEach(cb => cb(currentProfile));
  applyBodyClasses();
}

export function resetUXProfileToDefault() {
  currentProfile = { ...DEFAULT_PROFILE };
  listeners.forEach(cb => cb(currentProfile));
  applyBodyClasses();
}

export function subscribeUXProfile(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function toggleSimplifiedMode() {
  const newMode = currentProfile.mode === UX_MODES.STANDARD ? UX_MODES.SIMPLIFIED : UX_MODES.STANDARD;
  updateUXProfile({
    mode: newMode,
    fontSize: newMode === UX_MODES.SIMPLIFIED ? 'large' : 'medium',
    highContrast: newMode === UX_MODES.SIMPLIFIED,
    theme: newMode === UX_MODES.SIMPLIFIED ? 'contrast' : (currentProfile.theme || 'dark')
  });
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
  
  // 1. Check if webpage has a URL query parameter `?theme=...`
  const params = new URLSearchParams(window.location.search);
  const urlTheme = params.get('theme');

  if (urlTheme) {
    const validTheme = urlTheme.toLowerCase().trim();
    updateUXProfile({ theme: validTheme });
    applyTheme(validTheme);
    return;
  }

  // 2. If user is logged in, apply user's saved account theme
  if (user) {
    const userTheme = user.theme || (user.age && user.age > 50 ? 'contrast' : 'dark');
    const isSenior = (user.age && user.age > 50) || user.accessibility;
    updateUXProfile({
      mode: isSenior ? UX_MODES.SIMPLIFIED : UX_MODES.STANDARD,
      fontSize: isSenior ? 'large' : 'medium',
      highContrast: isSenior,
      theme: userTheme
    });
    applyTheme(userTheme);
    return;
  }

  // 3. Unauthenticated default
  resetUXProfileToDefault();
  applyTheme('dark');
}

function applyBodyClasses() {
  if (typeof document !== 'undefined') {
    if (currentProfile.mode === UX_MODES.SIMPLIFIED) {
      document.body.classList.add('ux-mode-simplified');
    } else {
      document.body.classList.remove('ux-mode-simplified');
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
