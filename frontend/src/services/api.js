import { mockApi } from './mockApi';

export let USE_MOCK_API = true;
const listeners = new Set();

export function getUseMockApi() {
  return USE_MOCK_API;
}

export function setUseMockApi(val) {
  USE_MOCK_API = val;
  listeners.forEach(cb => cb(USE_MOCK_API));
}

export function subscribeMockApi(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const BASE_URL = '/api/v1';

function unwrapResponse(json) {
  if (json && typeof json === 'object' && 'success' in json && 'data' in json && json.data !== undefined) {
    return json.data;
  }
  return json;
}

export const api = {
  async getStops() {
    if (USE_MOCK_API) return mockApi.getStops();
    try {
      const res = await fetch(`${BASE_URL}/stops`);
      if (!res.ok) return mockApi.getStops();
      const raw = await res.json();
      const data = unwrapResponse(raw);
      return Array.isArray(data) ? data : mockApi.getStops();
    } catch (e) {
      console.warn("Express API offline, using mockApi fallback");
      return mockApi.getStops();
    }
  },

  async searchJourneys(originStopId, destinationStopId, prefs = {}) {
    if (USE_MOCK_API) return mockApi.searchJourneys(originStopId, destinationStopId, prefs);
    try {
      const res = await fetch(`${BASE_URL}/journeys/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originStopId, destinationStopId, prefs })
      });
      if (!res.ok) return mockApi.searchJourneys(originStopId, destinationStopId, prefs);
      const raw = await res.json();
      const data = unwrapResponse(raw);
      return data && data.options ? data : mockApi.searchJourneys(originStopId, destinationStopId, prefs);
    } catch (e) {
      console.warn("Express API offline, using mockApi fallback");
      return mockApi.searchJourneys(originStopId, destinationStopId, prefs);
    }
  },

  async bookTicket(userId, journeyOptionId, chosenOption = null) {
    if (USE_MOCK_API) return mockApi.bookTicket(userId, journeyOptionId, chosenOption);
    try {
      const res = await fetch(`${BASE_URL}/tickets/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, journeyOptionId, chosenOption })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.error) throw new Error(err.error);
        return mockApi.bookTicket(userId, journeyOptionId, chosenOption);
      }
      const raw = await res.json();
      const data = unwrapResponse(raw);
      if (chosenOption && (!data.ticket || !data.ticket.journeyOption)) {
        if (data.ticket) data.ticket.journeyOption = chosenOption;
      }
      return data;
    } catch (e) {
      if (e.message && e.message.includes('balance')) throw e;
      console.warn("Express API offline, using mockApi fallback");
      return mockApi.bookTicket(userId, journeyOptionId, chosenOption);
    }
  },

  async getWallet(userId = 'user-1') {
    if (USE_MOCK_API) return mockApi.getWallet(userId);
    try {
      const res = await fetch(`${BASE_URL}/wallet/${userId}`);
      if (!res.ok) return mockApi.getWallet(userId);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      console.warn("Express API offline, using mockApi fallback");
      return mockApi.getWallet(userId);
    }
  },

  async topUpWallet(userId = 'user-1', amount = 100) {
    if (USE_MOCK_API) return mockApi.topUpWallet(userId, amount);
    try {
      const res = await fetch(`${BASE_URL}/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (!res.ok) return mockApi.topUpWallet(userId, amount);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      console.warn("Express API offline, using mockApi fallback");
      return mockApi.topUpWallet(userId, amount);
    }
  },

  async getLiveTicketStatus(ticketId) {
    if (USE_MOCK_API) return mockApi.getLiveTicketStatus(ticketId);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/live`);
      if (!res.ok) return mockApi.getLiveTicketStatus(ticketId);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.getLiveTicketStatus(ticketId);
    }
  },

  async simulateDelay(lineId, fromStopId, toStopId, delayMinutes) {
    if (USE_MOCK_API) return mockApi.simulateDelay(lineId, fromStopId, toStopId, delayMinutes);
    try {
      const res = await fetch(`${BASE_URL}/simulate/delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, fromStopId, toStopId, delayMinutes })
      });
      if (!res.ok) return mockApi.simulateDelay(lineId, fromStopId, toStopId, delayMinutes);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.simulateDelay(lineId, fromStopId, toStopId, delayMinutes);
    }
  },

  async getVisitorAttractions(category) {
    if (USE_MOCK_API) return mockApi.getVisitorAttractions(category);
    try {
      const res = await fetch(`${BASE_URL}/visitor/attractions?category=${category || ''}`);
      if (!res.ok) return mockApi.getVisitorAttractions(category);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.getVisitorAttractions(category);
    }
  },

  async getAttractionDetail(id) {
    if (USE_MOCK_API) return mockApi.getAttractionDetail(id);
    try {
      const res = await fetch(`${BASE_URL}/visitor/attractions/${id}`);
      if (!res.ok) return mockApi.getAttractionDetail(id);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.getAttractionDetail(id);
    }
  },

  async getEmployeeOpsData() {
    if (USE_MOCK_API) return mockApi.getEmployeeOpsData();
    try {
      const res = await fetch(`${BASE_URL}/employee/ops`);
      if (!res.ok) return mockApi.getEmployeeOpsData();
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.getEmployeeOpsData();
    }
  },

  async publishServiceAlert(line, severity, message) {
    if (USE_MOCK_API) return mockApi.publishServiceAlert(line, severity, message);
    try {
      const res = await fetch(`${BASE_URL}/employee/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, severity, message })
      });
      if (!res.ok) return mockApi.publishServiceAlert(line, severity, message);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.publishServiceAlert(line, severity, message);
    }
  },

  async getEmployeeVehicles() {
    if (USE_MOCK_API) return mockApi.getEmployeeVehicles();
    try {
      const res = await fetch(`${BASE_URL}/employee/vehicles`);
      if (!res.ok) return mockApi.getEmployeeVehicles();
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.getEmployeeVehicles();
    }
  },

  async processVoiceIntent(queryText) {
    if (USE_MOCK_API) return mockApi.processVoiceIntent(queryText);
    try {
      const res = await fetch(`${BASE_URL}/assistant/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      if (!res.ok) return mockApi.processVoiceIntent(queryText);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.processVoiceIntent(queryText);
    }
  },

  async login(email, password) {
    if (USE_MOCK_API) return mockApi.login(email, password);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.message) throw new Error(err.message);
        return mockApi.login(email, password);
      }
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      if (e.message && e.message.includes('Invalid')) throw e;
      return mockApi.login(email, password);
    }
  },

  async register(userData) {
    if (USE_MOCK_API) return mockApi.register(userData);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.message) throw new Error(err.message);
        return mockApi.register(userData);
      }
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      if (e.message && e.message.includes('already')) throw e;
      return mockApi.register(userData);
    }
  },

  async employeeLogin(staffId, dept, securityPin) {
    if (USE_MOCK_API) return mockApi.employeeLogin(staffId, dept, securityPin);
    try {
      const res = await fetch(`${BASE_URL}/auth/employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, dept, securityPin })
      });
      if (!res.ok) return mockApi.employeeLogin(staffId, dept, securityPin);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.employeeLogin(staffId, dept, securityPin);
    }
  },

  async confirmReroute(ticketId) {
    if (USE_MOCK_API) return mockApi.confirmReroute(ticketId);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/reroute/confirm`, { method: 'POST' });
      if (!res.ok) return mockApi.confirmReroute(ticketId);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.confirmReroute(ticketId);
    }
  },

  async rejectReroute(ticketId) {
    if (USE_MOCK_API) return mockApi.rejectReroute(ticketId);
    try {
      const res = await fetch(`${BASE_URL}/tickets/${ticketId}/reroute/reject`, { method: 'POST' });
      if (!res.ok) return mockApi.rejectReroute(ticketId);
      const raw = await res.json();
      return unwrapResponse(raw);
    } catch (e) {
      return mockApi.rejectReroute(ticketId);
    }
  }
};
