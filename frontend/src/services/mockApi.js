// mockApi.js - Extended mock data engine for TransitOne

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

const VISITOR_ATTRACTIONS = [
  {
    id: "attr-1",
    name: "Mahabalipuram Shore Temple",
    category: "History",
    city: "Tamil Nadu",
    tagline: "UNESCO World Heritage ancient rock-cut architecture",
    image: "🏛️",
    pubDuration: "1h 45m",
    pubCost: 120,
    taxiDuration: "1h 10m",
    taxiCost: 1400,
    co2SavedKg: 4.8,
    description: "Built in the 8th century AD, these carved granite structural temples overlook the Bay of Bengal.",
    guidedSteps: [
      { stepNum: 1, title: "Board Metro Blue Line", detail: "Take Metro from Central Station to Koyambedu Station", duration: "25 min" },
      { stepNum: 2, title: "Walk to Bus Bay 4", detail: "Follow the yellow directional signs to Outstation Bus Stop 102X", duration: "5 min" },
      { stepNum: 3, title: "Board Express Bus 102X", detail: "Destination is Mahabalipuram East. Show QR ticket to conductor.", duration: "65 min" },
      { stepNum: 4, title: "Walk to Shore Temple", detail: "Enjoy scenic coastal path straight to main entrance.", duration: "10 min" }
    ]
  },
  {
    id: "attr-2",
    name: "Taj Mahal & Agra Fort",
    category: "History",
    city: "Agra, UP",
    tagline: "Iconic white marble mausoleum and Mughal fortress",
    image: "🕌",
    pubDuration: "2h 10m",
    pubCost: 280,
    taxiDuration: "2h 45m",
    taxiCost: 2500,
    co2SavedKg: 8.2,
    description: "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of Emperor Shah Jahan.",
    guidedSteps: [
      { stepNum: 1, title: "Take Gatimaan Express", detail: "Board from New Delhi station platform 3 to Agra Cantt", duration: "1h 40m" },
      { stepNum: 2, title: "Electric Auto Shuttle", detail: "Eco-friendly zero-emission electric shuttle direct to Taj West Gate", duration: "20 min" },
      { stepNum: 3, title: "Ticket Scan & Entry", detail: "Scan your TransitOne universal QR code at high-speed turnstiles", duration: "10 min" }
    ]
  },
  {
    id: "attr-3",
    name: "Mysore Palace",
    category: "Culture",
    city: "Mysuru",
    tagline: "Grand royal residence illuminated with 100,000 bulbs",
    image: "🛕",
    pubDuration: "2h 30m",
    pubCost: 190,
    taxiDuration: "3h 00m",
    taxiCost: 2800,
    co2SavedKg: 7.5,
    description: "The official residence of the Wadiyar dynasty, showcasing Indo-Saracenic grandeur.",
    guidedSteps: [
      { stepNum: 1, title: "Vande Bharat Express", detail: "Fast rail connection from KSR Bengaluru to Mysuru Junction", duration: "1h 50m" },
      { stepNum: 2, title: "City Bus Line 201A", detail: "Board right outside main station gate to Palace Circle", duration: "15 min" }
    ]
  },
  {
    id: "attr-4",
    name: "Covelong Beach & Surfing School",
    category: "Beaches",
    city: "Kovalam",
    tagline: "Pristine golden sands & coastal watersports hub",
    image: "🏖️",
    pubDuration: "1h 15m",
    pubCost: 85,
    taxiDuration: "1h 00m",
    taxiCost: 1100,
    co2SavedKg: 3.9,
    description: "Popular beach village famed for surf schools, fishing harbor, and coastal cafes.",
    guidedSteps: [
      { stepNum: 1, title: "Coastal Shuttle Bus 99", detail: "Direct air-conditioned bus along East Coast Road", duration: "60 min" },
      { stepNum: 2, title: "Walk to Beach Promenade", detail: "Follow palm avenue direct to surf station", duration: "15 min" }
    ]
  }
];

let state = {
  wallets: { "user-1": 500 },
  tickets: {},
  walletTxns: [
    { id: 'txn-101', userId: 'user-1', amount: -28, ticketId: 'tkt-prev-1', timestamp: new Date(Date.now() - 86400000).toISOString(), title: 'Office → Home Commute' },
    { id: 'txn-102', userId: 'user-1', amount: 200, ticketId: null, timestamp: new Date(Date.now() - 172800000).toISOString(), title: 'UPI Top-Up' }
  ],
  delays: [],
  incidents: [
    { id: "INC-8291", title: "Signal Failure on Purple Line", severity: "Medium", status: "INVESTIGATING", affectedPassengers: 1824, line: "Purple Line", startedAt: "14:42" },
    { id: "INC-8292", title: "Heavy Road Congestion MG Road", severity: "Low", status: "MONITORING", affectedPassengers: 620, line: "Bus 201", startedAt: "16:15" }
  ],
  alerts: [
    { id: "ALT-1", line: "Purple Line", severity: "Warning", message: "10-minute delay due to track maintenance work near Cubbon Park.", timestamp: "10 mins ago" }
  ],
  vehicles: [
    { id: "BUS-421", line: "Bus 201", driver: "R. Sharma", status: "active", speed: "34 km/h", locationName: "Residency Road" },
    { id: "BUS-422", line: "Bus 201", driver: "K. Patel", status: "delayed", speed: "12 km/h", locationName: "MG Road Junction" },
    { id: "MTR-108", line: "Purple Line", driver: "Auto-Control", status: "active", speed: "58 km/h", locationName: "Trinity Station" },
    { id: "MTR-204", line: "Green Line", driver: "Auto-Control", status: "active", speed: "62 km/h", locationName: "Jayanagar" }
  ]
};

export const mockApi = {
  async getStops() {
    await new Promise(r => setTimeout(r, 60));
    return STOPS;
  },

  async searchJourneys(originStopId, destinationStopId, prefs = {}) {
    await new Promise(r => setTimeout(r, 150));
    const busDelay = state.delays.find(d => d.lineId === 'line-bus-201');

    const options = [
      {
        id: `jo-fastest-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "fastest",
        totalMinutes: busDelay ? 36 + busDelay.delayMinutes : 24,
        totalCost: 20,
        totalWalkMeters: 450,
        co2SavedGrams: 420,
        segments: [
          { mode: "walk", fromStopId: originStopId, toStopId: "stop-1", minutes: 5, cost: 0, crowdLevel: "green" },
          { mode: "bus", lineId: "line-bus-201", fromStopId: "stop-1", toStopId: "stop-4", minutes: busDelay ? 14 + busDelay.delayMinutes : 14, cost: 10, crowdLevel: "yellow" },
          { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: destinationStopId, minutes: 5, cost: 10, crowdLevel: "green" }
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
          { mode: "walk", fromStopId: originStopId, toStopId: "stop-3", minutes: 8, cost: 0, crowdLevel: "green" },
          { mode: "bus", lineId: "line-bus-201", fromStopId: "stop-3", toStopId: destinationStopId, minutes: 24, cost: 10, crowdLevel: "yellow" }
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
          { mode: "metro", lineId: "line-purple", fromStopId: originStopId === "stop-1" ? "stop-10" : originStopId, toStopId: "stop-4", minutes: 8, cost: 15, crowdLevel: "green" },
          { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: destinationStopId, minutes: 20, cost: 10, crowdLevel: "green" }
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
          { mode: "bus", lineId: "line-bus-201", fromStopId: originStopId, toStopId: destinationStopId, minutes: 30, cost: 20, crowdLevel: "green" }
        ]
      });
    }

    return { options };
  },

  async bookTicket(userId, journeyOptionId, chosenOption = null) {
    await new Promise(r => setTimeout(r, 120));
    const currentBalance = state.wallets[userId] ?? 500;
    const cost = chosenOption ? chosenOption.totalCost : 20;

    if (currentBalance < cost) {
      throw new Error("Insufficient wallet balance. Recharge your wallet to book this ticket.");
    }

    const newBalance = currentBalance - cost;
    state.wallets[userId] = newBalance;

    const ticketId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
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
      timestamp: new Date().toISOString(),
      title: 'Ticket Booking'
    };
    state.walletTxns.unshift(txn);

    return { ticket, walletBalance: newBalance };
  },

  async getWallet(userId = "user-1") {
    await new Promise(r => setTimeout(r, 60));
    return {
      balance: state.wallets[userId] ?? 500,
      transactions: state.walletTxns.filter(t => t.userId === userId)
    };
  },

  async topUpWallet(userId = "user-1", amount = 100) {
    await new Promise(r => setTimeout(r, 100));
    const currentBalance = state.wallets[userId] ?? 500;
    const newBalance = currentBalance + amount;
    state.wallets[userId] = newBalance;

    const txn = {
      id: `txn-${Date.now()}`,
      userId,
      amount: +amount,
      ticketId: null,
      timestamp: new Date().toISOString(),
      title: 'Wallet Recharge'
    };
    state.walletTxns.unshift(txn);

    return { balance: newBalance, transactions: state.walletTxns };
  },

  async getLiveTicketStatus(ticketId) {
    await new Promise(r => setTimeout(r, 60));
    const ticket = state.tickets[ticketId];
    if (!ticket) {
      return { status: "active", currentSegmentIndex: 0 };
    }

    if (ticket.status === "rerouted") {
      return {
        status: "rerouted",
        currentSegmentIndex: 1,
        alert: "⚠️ Bus 201 delayed by 15 mins due to heavy traffic. Auto-Rerouted via Metro Green & Purple Line (saving 8 mins vs waiting).",
        rerouted: ticket.reroutedOption
      };
    }

    return {
      status: ticket.status || "active",
      currentSegmentIndex: 0,
      alert: null
    };
  },

  async simulateDelay(lineId, fromStopId, toStopId, delayMinutes) {
    await new Promise(r => setTimeout(r, 100));

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

    state.alerts.unshift({
      id: `ALT-${Date.now()}`,
      line: lineId,
      severity: "High",
      message: `Delay of ${delayMinutes} minutes reported on line ${lineId}. Rerouting passengers.`,
      timestamp: "Just now"
    });

    return { affectedTicketIds };
  },

  async getVisitorAttractions(category = "All") {
    await new Promise(r => setTimeout(r, 50));
    if (category === "All") return VISITOR_ATTRACTIONS;
    return VISITOR_ATTRACTIONS.filter(a => a.category.toLowerCase() === category.toLowerCase());
  },

  async getAttractionDetail(id) {
    await new Promise(r => setTimeout(r, 50));
    return VISITOR_ATTRACTIONS.find(a => a.id === id) || VISITOR_ATTRACTIONS[0];
  },

  async getEmployeeOpsData() {
    await new Promise(r => setTimeout(r, 60));
    return {
      activeVehiclesCount: 1482,
      delayedCount: 23 + state.delays.length,
      cancelledCount: 4,
      criticalIncidentsCount: state.incidents.length,
      networkHealth: { normalPercent: 92, delayedPercent: 7, criticalPercent: 1 },
      incidents: state.incidents,
      alerts: state.alerts
    };
  },

  async publishServiceAlert(line, severity, message) {
    await new Promise(r => setTimeout(r, 100));
    const newAlert = {
      id: `ALT-${Date.now()}`,
      line,
      severity,
      message,
      timestamp: "Just now"
    };
    state.alerts.unshift(newAlert);
    return { success: true, alert: newAlert };
  },

  async getEmployeeVehicles() {
    await new Promise(r => setTimeout(r, 50));
    return state.vehicles;
  },

  // Voice AI intent parser mock logic
  async processVoiceIntent(queryText) {
    await new Promise(r => setTimeout(r, 200));
    const q = queryText.toLowerCase();

    if (q.includes('book') || q.includes('ticket') || q.includes('buy')) {
      return {
        intent: 'BOOK_TICKET',
        requiresConfirmation: true,
        summary: 'Confirm booking for Bus 201 / Purple Line journey',
        payload: { cost: 20, destination: 'Tech Park', mode: 'Bus + Metro' }
      };
    }
    if (q.includes('track') || q.includes('where is') || q.includes('bus') || q.includes('metro')) {
      return {
        intent: 'TRACK_JOURNEY',
        requiresConfirmation: false,
        summary: 'Bus 201 is currently 1.2 km away (ETA 4 minutes)',
        payload: { eta: '4 min', status: 'On time', speed: '32 km/h' }
      };
    }
    if (q.includes('wallet') || q.includes('balance') || q.includes('money')) {
      const w = await this.getWallet();
      return {
        intent: 'SHOW_WALLET',
        requiresConfirmation: false,
        summary: `Your available TransitOne wallet balance is ₹${w.balance}.00`,
        payload: { balance: w.balance }
      };
    }
    if (q.includes('reroute') || q.includes('delay') || q.includes('alternate')) {
      return {
        intent: 'REROUTE_JOURNEY',
        requiresConfirmation: false,
        summary: 'Switched to Metro Purple Line (saves 12 mins)',
        payload: { savedMinutes: 12 }
      };
    }

    return {
      intent: 'SEARCH_TRANSPORT',
      requiresConfirmation: false,
      summary: `Found 3 top multi-modal public routes for "${queryText}"`,
      payload: { query: queryText }
    };
  },

  // Auth Endpoints
  async login(email, password) {
    await new Promise(r => setTimeout(r, 120));
    return {
      user: {
        id: `user-${Date.now()}`,
        name: email.split('@')[0] || 'Passenger User',
        email,
        role: 'passenger',
        country: 'India',
        preferences: { cheapest: true, fastest: true },
        token: `mock-passenger-jwt-${Date.now()}`
      }
    };
  },

  async register(userData) {
    await new Promise(r => setTimeout(r, 150));
    const isVisitor = userData.country && userData.country.toLowerCase() !== 'india';
    return {
      user: {
        id: `user-${Date.now()}`,
        name: userData.name || 'New Commuter',
        email: userData.email || 'commuter@transitone.in',
        role: isVisitor ? 'visitor' : 'passenger',
        country: userData.country || 'India',
        language: userData.language || 'en',
        preferences: userData.preferences || {},
        accessibility: userData.accessibility || false,
        token: `mock-registered-jwt-${Date.now()}`
      }
    };
  },

  async employeeLogin(staffId, dept, securityPin) {
    await new Promise(r => setTimeout(r, 150));
    if (!staffId || !securityPin) {
      throw new Error("Invalid Staff ID or Security PIN");
    }
    return {
      user: {
        id: staffId,
        name: `Officer ${staffId}`,
        role: 'employee',
        dept: dept || 'Operations',
        token: `mock-employee-jwt-${Date.now()}`
      }
    };
  }
};

