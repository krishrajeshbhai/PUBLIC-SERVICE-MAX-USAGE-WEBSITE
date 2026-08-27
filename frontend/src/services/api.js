import { mockApi } from './mockApi';

// Set USE_MOCK_API to false to send requests directly to Express backend (http://localhost:3000/api)
export let USE_MOCK_API = false;

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

  async getCrowdLevel(lineId) {
    if (USE_MOCK_API) return mockApi.getCrowdLevel(lineId);
    const res = await fetch(`${BASE_URL}/lines/${lineId}/crowd`);
    if (!res.ok) throw new Error(`Failed to fetch crowd level: ${res.statusText}`);
    return res.json();
  }
};
