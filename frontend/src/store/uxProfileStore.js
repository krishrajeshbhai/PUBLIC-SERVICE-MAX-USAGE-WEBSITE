// uxProfileStore.js - Adaptive UX state manager

const UX_MODES = {
  STANDARD: 'standard',
  SIMPLIFIED: 'simplified', // Senior / accessible mode
};

let currentProfile = {
  mode: UX_MODES.STANDARD,
  fontSize: 'medium', // small, medium, large, xlarge
  highContrast: false,
  voiceEnabled: true,
  autoReadOut: true,
  reducedMotion: false,
};

const listeners = new Set();

export function getUXProfile() {
  return { ...currentProfile };
}

export function updateUXProfile(updates) {
  currentProfile = { ...currentProfile, ...updates };
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
    highContrast: newMode === UX_MODES.SIMPLIFIED
  });
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
  }
}
