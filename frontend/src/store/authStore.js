// authStore.js - Authentication & User Session State Manager

const DEFAULT_GUEST_USER = {
  id: 'user-1',
  name: 'Demo Passenger',
  email: 'passenger@transitone.in',
  role: 'passenger', // 'passenger' | 'visitor' | 'employee'
  country: 'India',
  preferences: { cheapest: false, fastest: true, eco: true, walking: 'moderate' },
  accessibility: false,
  token: 'mock-jwt-token-12345'
};

function loadStoredUser() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('transitone_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Error reading auth from localStorage", e);
    }
  }
  return DEFAULT_GUEST_USER;
}

let currentUser = loadStoredUser();
const listeners = new Set();

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
  listeners.forEach(cb => cb(currentUser));
}

export function subscribeAuth(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function logoutUser() {
  setAuthUser(null);
}
