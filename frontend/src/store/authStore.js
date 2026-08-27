// authStore.js - Authentication & User Session State Manager
import { initThemeFromUrlOrUser, resetUXProfileToDefault } from './uxProfileStore';

function loadStoredUser() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('transitone_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'user-1' || parsed.id === 'user-guest') {
          localStorage.removeItem('transitone_auth_user');
          return null;
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Error reading auth from localStorage", e);
    }
  }
  return null;
}

let currentUser = loadStoredUser();
const listeners = new Set();

// Synchronize theme on startup
if (typeof window !== 'undefined') {
  initThemeFromUrlOrUser(currentUser);
}

export function getAuthUser() {
  return currentUser ? { ...currentUser } : null;
}

export function isAuthenticated() {
  return !!currentUser;
}

export function setAuthUser(user) {
  currentUser = user;
  if (typeof window !== 'undefined' && window.localStorage) {
    if (user) {
      localStorage.setItem('transitone_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('transitone_auth_user');
    }
  }

  // Update visual theme according to user profile or reset to default
  initThemeFromUrlOrUser(currentUser);

  listeners.forEach(cb => cb(currentUser));
}

export function subscribeAuth(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function logoutUser() {
  setAuthUser(null);
  resetUXProfileToDefault();
}
