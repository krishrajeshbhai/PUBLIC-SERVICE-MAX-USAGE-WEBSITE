import { mockApi } from './mockApi';

export let USE_MOCK_API = true;

export function setUseMockApi(val) {
  USE_MOCK_API = val;
}

const BASE_URL = '/api';

export const api = {
  async getStops() {
    if (USE_MOCK_API) return mockApi.getStops();
    const res = await fetch(`${BASE_URL}/stops`);
    if (!res.ok) throw new Error(`Failed to fetch stops: ${res.statusText}`);
    return res.json();
  },

  async searchJourneys(originStopId, destinationStopId, prefs = {}) {
    if (USE_MOCK_API) return mockApi.searchJourneys(originStopId, destinationStopId, prefs);
    const res = await fetch(`${BASE_URL}/journeys/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originStopId, destinationStopId, prefs })
    });
    if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
    return res.json();
  },

  async bookTicket(userId, journeyOptionId, chosenOption = null) {
    if (USE_MOCK_API) return mockApi.bookTicket(userId, journeyOptionId, chosenOption);
    const res = await fetch(`${BASE_URL}/tickets/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, journeyOptionId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Booking failed: ${res.statusText}`);
    }
    const data = await res.json();
    if (chosenOption && !data.ticket.journeyOption) {
      data.ticket.journeyOption = chosenOption;
    }
    return data;
  },

  async getWallet(userId = 'user-1') {
    if (USE_MOCK_API) return mockApi.getWallet(userId);
    const res = await fetch(`${BASE_URL}/wallet/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch wallet: ${res.statusText}`);
    return res.json();
  },

  async topUpWallet(userId = 'user-1', amount = 100) {
    if (USE_MOCK_API) return mockApi.topUpWallet(userId, amount);
    const res = await fetch(`${BASE_URL}/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount })
    });
    if (!res.ok) throw new Error(`Top-up failed: ${res.statusText}`);
    return res.json();
  },

  async getLiveTicketStatus(ticketId) {
    if (USE_MOCK_API) return mockApi.getLiveTicketStatus(ticketId);
    const res = await fetch(`${BASE_URL}/tickets/${ticketId}/live`);
    if (!res.ok) throw new Error(`Failed to fetch live ticket status: ${res.statusText}`);
    return res.json();
  },

  async simulateDelay(lineId, fromStopId, toStopId, delayMinutes) {
    if (USE_MOCK_API) return mockApi.simulateDelay(lineId, fromStopId, toStopId, delayMinutes);
    const res = await fetch(`${BASE_URL}/simulate/delay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineId, fromStopId, toStopId, delayMinutes })
    });
    if (!res.ok) throw new Error(`Simulation failed: ${res.statusText}`);
    return res.json();
  },

  async getVisitorAttractions(category) {
    if (USE_MOCK_API) return mockApi.getVisitorAttractions(category);
    const res = await fetch(`${BASE_URL}/visitor/attractions?category=${category || ''}`);
    if (!res.ok) return mockApi.getVisitorAttractions(category);
    return res.json();
  },

  async getAttractionDetail(id) {
    if (USE_MOCK_API) return mockApi.getAttractionDetail(id);
    const res = await fetch(`${BASE_URL}/visitor/attractions/${id}`);
    if (!res.ok) return mockApi.getAttractionDetail(id);
    return res.json();
  },

  async getEmployeeOpsData() {
    if (USE_MOCK_API) return mockApi.getEmployeeOpsData();
    const res = await fetch(`${BASE_URL}/employee/ops`);
    if (!res.ok) return mockApi.getEmployeeOpsData();
    return res.json();
  },

  async publishServiceAlert(line, severity, message) {
    if (USE_MOCK_API) return mockApi.publishServiceAlert(line, severity, message);
    const res = await fetch(`${BASE_URL}/employee/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line, severity, message })
    });
    if (!res.ok) return mockApi.publishServiceAlert(line, severity, message);
    return res.json();
  },

  async getEmployeeVehicles() {
    if (USE_MOCK_API) return mockApi.getEmployeeVehicles();
    const res = await fetch(`${BASE_URL}/employee/vehicles`);
    if (!res.ok) return mockApi.getEmployeeVehicles();
    return res.json();
  },

  async processVoiceIntent(queryText) {
    if (USE_MOCK_API) return mockApi.processVoiceIntent(queryText);
    const res = await fetch(`${BASE_URL}/assistant/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText })
    });
    if (!res.ok) return mockApi.processVoiceIntent(queryText);
    return res.json();
  },

  async login(email, password) {
    if (USE_MOCK_API) return mockApi.login(email, password);
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return mockApi.login(email, password);
    return res.json();
  },

  async register(userData) {
    if (USE_MOCK_API) return mockApi.register(userData);
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) return mockApi.register(userData);
    return res.json();
  },

  async employeeLogin(staffId, dept, securityPin) {
    if (USE_MOCK_API) return mockApi.employeeLogin(staffId, dept, securityPin);
    const res = await fetch(`${BASE_URL}/auth/employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, dept, securityPin })
    });
    if (!res.ok) return mockApi.employeeLogin(staffId, dept, securityPin);
    return res.json();
  }
};

