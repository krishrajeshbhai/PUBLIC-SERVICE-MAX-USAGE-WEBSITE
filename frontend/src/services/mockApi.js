// mockApi.js - In-memory mock engine strictly following Contract A5

const STOPS = [
  { id: "stop-1", name: "Central Station", lat: 12.9716, lng: 77.5946, noStairs: true },
  { id: "stop-2", name: "Tech Park", lat: 12.9816, lng: 77.6046, noStairs: true },
  { id: "stop-3", name: "Residency Road", lat: 12.9616, lng: 77.5846, noStairs: true },
  { id: "stop-4", name: "MG Road", lat: 12.9736, lng: 77.6116, noStairs: true },
  { id: "stop-5", name: "Indiranagar", lat: 12.9786, lng: 77.6406, noStairs: true },
  { id: "stop-6", name: "Halasuru", lat: 12.9756, lng: 77.6256, noStairs: true },
  { id: "stop-7", name: "Trinity", lat: 12.9730, lng: 77.6170, noStairs: true },
  { id: "stop-8", name: "Cubbon Park", lat: 12.9790, lng: 77.5980, noStairs: true },
  { id: "stop-9", name: "Vidhana Soudha", lat: 12.9796, lng: 77.5906, noStairs: false },
  { id: "stop-10", name: "Majestic", lat: 12.9766, lng: 77.5726, noStairs: true },
  { id: "stop-11", name: "City Market", lat: 12.9606, lng: 77.5736, noStairs: true },
  { id: "stop-12", name: "Jayanagar", lat: 12.9296, lng: 77.5806, noStairs: true },
  { id: "stop-13", name: "JP Nagar", lat: 12.9100, lng: 77.5850, noStairs: true },
  { id: "stop-14", name: "Banashankari", lat: 12.9150, lng: 77.5730, noStairs: true },
  { id: "stop-15", name: "Malleshwaram", lat: 12.9900, lng: 77.5700, noStairs: true }
];

const LINES = [
  { id: "line-purple", name: "Purple Line", mode: "metro", color: "#8b5cf6", stopIds: ["stop-10", "stop-9", "stop-8", "stop-4", "stop-7", "stop-6", "stop-5"] },
  { id: "line-green", name: "Green Line", mode: "metro", color: "#10b981", stopIds: ["stop-15", "stop-10", "stop-11", "stop-12", "stop-14", "stop-13"] },
  { id: "line-bus-201", name: "Bus 201", mode: "bus", color: "#3b82f6", stopIds: ["stop-1", "stop-3", "stop-4", "stop-2", "stop-5"] },
  { id: "line-bus-500", name: "Bus 500", mode: "bus", color: "#f97316", stopIds: ["stop-14", "stop-12", "stop-1", "stop-2", "stop-15"] }
];

let state = {
  wallets: { "user-1": 500 },
  tickets: {},
  walletTxns: [],
  delays: []
};

// Helper: Calculate distance in meters between two lat/lng points
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const mockApi = {
  // 1. GET /api/stops
  async getStops() {
    await new Promise(r => setTimeout(r, 80));
    return STOPS;
  },

  // 2. POST /api/journeys/search
  async searchJourneys(originStopId, destinationStopId, prefs = {}) {
    await new Promise(r => setTimeout(r, 200));

    const origin = STOPS.find(s => s.id === originStopId) || STOPS[0];
    const destination = STOPS.find(s => s.id === destinationStopId) || STOPS[1];

    // Check for active delay on Bus 201
    const busDelay = state.delays.find(d => d.lineId === 'line-bus-201');

    // Generate ranked journey options based on requested stops
    const options = [
      {
        id: `jo-fastest-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "fastest",
        totalMinutes: busDelay ? 36 + busDelay.delayMinutes : 24,
        totalCost: 20,
        totalWalkMeters: 450,
        co2SavedGrams: 420,
        segments: [
          {
            mode: "walk",
            fromStopId: originStopId,
            toStopId: "stop-1",
            minutes: 5,
            cost: 0,
            crowdLevel: "green"
          },
          {
            mode: "bus",
            lineId: "line-bus-201",
            fromStopId: "stop-1",
            toStopId: "stop-4",
            minutes: busDelay ? 14 + busDelay.delayMinutes : 14,
            cost: 10,
            crowdLevel: "yellow"
          },
          {
            mode: "metro",
            lineId: "line-purple",
            fromStopId: "stop-4",
            toStopId: destinationStopId,
            minutes: 5,
            cost: 10,
            crowdLevel: "green"
          }
        ]
      },
      {
        id: `jo-cheapest-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "cheapest",
        totalMinutes: 32,
        totalCost: 10,
        totalWalkMeters: 800,
        co2SavedGrams: 350,
        segments: [
          {
            mode: "walk",
            fromStopId: originStopId,
            toStopId: "stop-3",
            minutes: 8,
            cost: 0,
            crowdLevel: "green"
          },
          {
            mode: "bus",
            lineId: "line-bus-201",
            fromStopId: "stop-3",
            toStopId: destinationStopId,
            minutes: 24,
            cost: 10,
            crowdLevel: "yellow"
          }
        ]
      },
      {
        id: `jo-least_walking-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "least_walking",
        totalMinutes: 28,
        totalCost: 25,
        totalWalkMeters: 180,
        co2SavedGrams: 510,
        segments: [
          {
            mode: "metro",
            lineId: "line-purple",
            fromStopId: originStopId === "stop-1" ? "stop-10" : originStopId,
            toStopId: "stop-4",
            minutes: 8,
            cost: 15,
            crowdLevel: "green"
          },
          {
            mode: "metro",
            lineId: "line-purple",
            fromStopId: "stop-4",
            toStopId: destinationStopId,
            minutes: 20,
            cost: 10,
            crowdLevel: "green"
          }
        ]
      }
    ];

    if (prefs.accessible) {
      options.push({
        id: `jo-accessible-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "accessible",
        totalMinutes: 30,
        totalCost: 20,
        totalWalkMeters: 300,
        co2SavedGrams: 460,
        segments: [
          {
            mode: "bus",
            lineId: "line-bus-201",
            fromStopId: originStopId,
            toStopId: destinationStopId,
            minutes: 30,
            cost: 20,
            crowdLevel: "green"
          }
        ]
      });
    }

    return { options };
  },

  // 3. POST /api/tickets/book
  async bookTicket(userId, journeyOptionId, chosenOption = null) {
    await new Promise(r => setTimeout(r, 150));

    const currentBalance = state.wallets[userId] ?? 500;
    const cost = chosenOption ? chosenOption.totalCost : 20;

    if (currentBalance < cost) {
      throw new Error("Insufficient wallet balance");
    }

    const newBalance = currentBalance - cost;
    state.wallets[userId] = newBalance;

    const ticketId = `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ticket = {
      id: ticketId,
      journeyOptionId,
      userId,
      status: "active",
      createdAt: new Date().toISOString(),
      journeyOption: chosenOption || {
        id: journeyOptionId,
        type: "fastest",
        totalMinutes: 24,
        totalCost: cost,
        totalWalkMeters: 450,
        co2SavedGrams: 420,
        segments: [
          { mode: "walk", fromStopId: "stop-1", toStopId: "stop-3", minutes: 5, cost: 0, crowdLevel: "green" },
          { mode: "bus", lineId: "line-bus-201", fromStopId: "stop-3", toStopId: "stop-4", minutes: 14, cost: 10, crowdLevel: "yellow" },
          { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: "stop-2", minutes: 5, cost: 10, crowdLevel: "green" }
        ]
      }
    };

    state.tickets[ticketId] = ticket;

    const txn = {
      id: `txn-${Date.now()}`,
      userId,
      amount: -cost,
      ticketId,
      timestamp: new Date().toISOString()
    };
    state.walletTxns.unshift(txn);

    return {
      ticket: {
        id: ticket.id,
        journeyOptionId: ticket.journeyOptionId,
        userId: ticket.userId,
        status: ticket.status,
        createdAt: ticket.createdAt,
        journeyOption: ticket.journeyOption
      },
      walletBalance: newBalance
    };
  },

  // 4. GET /api/wallet/:userId
  async getWallet(userId = "user-1") {
    await new Promise(r => setTimeout(r, 80));
    return {
      balance: state.wallets[userId] ?? 500,
      transactions: state.walletTxns.filter(t => t.userId === userId)
    };
  },

  // 5. GET /api/tickets/:ticketId/live
  async getLiveTicketStatus(ticketId) {
    await new Promise(r => setTimeout(r, 80));
    const ticket = state.tickets[ticketId];
    if (!ticket) {
      return { status: "active", currentSegmentIndex: 0 };
    }

    if (ticket.status === "rerouted") {
      return {
        status: "rerouted",
        currentSegmentIndex: 1,
        alert: "⚠️ Bus 201 delayed by 15 mins due to heavy traffic. Rerouted via Metro Green & Purple Line (saving 8 mins vs waiting).",
        rerouted: ticket.reroutedOption
      };
    }

    return {
      status: ticket.status || "active",
      currentSegmentIndex: 0,
      alert: null
    };
  },

  // 6. POST /api/simulate/delay
  async simulateDelay(lineId, fromStopId, toStopId, delayMinutes) {
    await new Promise(r => setTimeout(r, 150));

    state.delays.push({ lineId, fromStopId, toStopId, delayMinutes, createdAt: new Date() });

    const affectedTicketIds = [];
    Object.keys(state.tickets).forEach(tId => {
      const ticket = state.tickets[tId];
      if (ticket.status === "active") {
        ticket.status = "rerouted";
        ticket.reroutedOption = {
          id: `jo-rerouted-${Date.now()}`,
          type: "fastest",
          totalMinutes: 31,
          totalCost: 20,
          totalWalkMeters: 380,
          co2SavedGrams: 490,
          segments: [
            { mode: "walk", fromStopId: "stop-1", toStopId: "stop-10", minutes: 8, cost: 0, crowdLevel: "green" },
            { mode: "metro", lineId: "line-purple", fromStopId: "stop-10", toStopId: "stop-4", minutes: 11, cost: 10, crowdLevel: "green" },
            { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: "stop-2", minutes: 12, cost: 10, crowdLevel: "yellow" }
          ]
        };
        affectedTicketIds.push(tId);
      }
    });

    return { affectedTicketIds };
  },

  // 7. GET /api/lines/:lineId/crowd
  async getCrowdLevel(lineId) {
    await new Promise(r => setTimeout(r, 50));
    const map = {
      'line-purple': 'green',
      'line-green': 'yellow',
      'line-bus-201': 'red',
      'line-bus-500': 'yellow'
    };
    return { crowdLevel: map[lineId] || 'green' };
  }
};
