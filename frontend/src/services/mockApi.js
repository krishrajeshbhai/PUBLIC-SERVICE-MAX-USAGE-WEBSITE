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

const DB_KEYS = {
  WALLETS: 'transitone_wallets_v3',
  TICKETS: 'transitone_tickets_v3',
  TXNS: 'transitone_txns_v3',
  DELAYS: 'transitone_delays_v3'
};

function loadStateFromStorage() {
  try {
    const rawWallets = localStorage.getItem(DB_KEYS.WALLETS);
    const rawTickets = localStorage.getItem(DB_KEYS.TICKETS);
    const rawTxns = localStorage.getItem(DB_KEYS.TXNS);
    const rawDelays = localStorage.getItem(DB_KEYS.DELAYS);

    return {
      wallets: rawWallets ? JSON.parse(rawWallets) : { "user-1": 500, "user-passenger": 500 },
      tickets: rawTickets ? JSON.parse(rawTickets) : {},
      walletTxns: rawTxns ? JSON.parse(rawTxns) : [
        { id: 'txn-101', userId: 'user-1', amount: -28, ticketId: 'tkt-prev-1', timestamp: new Date(Date.now() - 86400000).toISOString(), title: 'Office → Home Commute' },
        { id: 'txn-102', userId: 'user-1', amount: 200, ticketId: null, timestamp: new Date(Date.now() - 172800000).toISOString(), title: 'UPI Top-Up' }
      ],
      delays: rawDelays ? JSON.parse(rawDelays) : [],
      routes: [
        { id: "line-purple", name: "Purple Line Metro", mode: "metro", color: "#a855f7", frequencyMins: 4, activeVehicles: 4, onTimePercent: 97.4, status: "warning", alertCount: 1, currentDelay: "10 min", stopsCount: 6, depot: "Baiyappanahalli Terminal" },
        { id: "line-green", name: "Green Line Metro", mode: "metro", color: "#10b981", frequencyMins: 5, activeVehicles: 3, onTimePercent: 99.1, status: "normal", alertCount: 0, currentDelay: "On Time", stopsCount: 5, depot: "Peenya Depot" },
        { id: "line-bus-201", name: "Bus 201 Express", mode: "bus", color: "#3b82f6", frequencyMins: 8, activeVehicles: 6, onTimePercent: 88.5, status: "delayed", alertCount: 1, currentDelay: "15 min", stopsCount: 8, depot: "Central Bus Depot #2" },
        { id: "line-bus-500", name: "Bus 500 Outer Ring", mode: "bus", color: "#f97316", frequencyMins: 10, activeVehicles: 8, onTimePercent: 94.2, status: "normal", alertCount: 0, currentDelay: "On Time", stopsCount: 10, depot: "Silk Board Depot" },
        { id: "line-airport", name: "Airport Metro Direct", mode: "metro", color: "#06b6d4", frequencyMins: 12, activeVehicles: 2, onTimePercent: 99.6, status: "normal", alertCount: 0, currentDelay: "On Time", stopsCount: 4, depot: "Airport Terminal Station" }
      ],
      incidents: [
        {
          id: "INC-8291",
          title: "Signal Failure on Purple Line",
          severity: "High",
          status: "INVESTIGATING",
          affectedPassengers: 1824,
          line: "Purple Line",
          location: "Cubbon Park → Trinity",
          startedAt: "14:42",
          expectedResolution: "15:45",
          reportedBy: "NOC Automation System",
          description: "Signaling glitch detected at Interlocking Section 4B causing automated emergency speed restriction.",
          mitigationPlan: "Metro speed reduced to 25 km/h. Parallel Bus 201 shuttles deployed.",
          alternativesAvailable: true
        },
        {
          id: "INC-8292",
          title: "Heavy Road Congestion MG Road",
          severity: "Medium",
          status: "MONITORING",
          affectedPassengers: 620,
          line: "Bus 201",
          location: "MG Road Junction",
          startedAt: "16:15",
          expectedResolution: "17:30",
          reportedBy: "Dispatcher R. Menon",
          description: "Peak hour bottleneck causing 15 min bus bunching along corridor.",
          mitigationPlan: "Rerouting subsequent feeder buses via Cubbon Road loop.",
          alternativesAvailable: true
        },
        {
          id: "INC-8293",
          title: "Escalator Maintenance at Central Station",
          severity: "Low",
          status: "MITIGATING",
          affectedPassengers: 410,
          line: "Central Station",
          location: "Platform 2 Concourse",
          startedAt: "13:00",
          expectedResolution: "16:00",
          reportedBy: "Station Master Verma",
          description: "Periodic mechanical lubrication and sensor realignment.",
          mitigationPlan: "Elevator 3 and Ramp A priority assigned for wheelchair & senior commuters.",
          alternativesAvailable: false
        },
        {
          id: "INC-8288",
          title: "Overhead Catenary Tension Re-calibration",
          severity: "Medium",
          status: "RESOLVED",
          affectedPassengers: 950,
          line: "Green Line",
          location: "Jayanagar",
          startedAt: "10:15",
          expectedResolution: "11:20",
          resolvedAt: "11:18",
          reportedBy: "Power Grid Sub-team",
          description: "Routine voltage adjustment completed with zero trip cancellations.",
          mitigationPlan: "Completed and tested normal.",
          alternativesAvailable: false
        }
      ],
      alerts: [
        {
          id: "ALT-1",
          line: "Purple Line",
          severity: "High",
          message: "10-minute delay due to track maintenance and signaling work near Cubbon Park.",
          expectedDelay: "10-15 mins",
          operator: "Metro Control Division",
          reachCount: 3420,
          status: "Active",
          timestamp: "10 mins ago"
        },
        {
          id: "ALT-2",
          line: "Bus 201",
          severity: "Medium",
          message: "Traffic congestion at MG Road. Commuters are advised to take Purple Line Metro for faster travel.",
          expectedDelay: "15 mins",
          operator: "City Bus Dispatch",
          reachCount: 1890,
          status: "Active",
          timestamp: "25 mins ago"
        }
      ],
      vehicles: [
        { id: "BUS-421", line: "Bus 201", mode: "bus", driver: "R. Sharma", status: "active", speed: "34 km/h", locationName: "Residency Road", lat: 12.9616, lng: 77.5846, batteryFuel: "84%", passengerLoad: "62%", capacity: 60, lastPing: "Just now", depot: "Depot 2" },
        { id: "BUS-422", line: "Bus 201", mode: "bus", driver: "K. Patel", status: "delayed", speed: "12 km/h", locationName: "MG Road Junction", lat: 12.9736, lng: 77.6116, batteryFuel: "71%", passengerLoad: "88%", capacity: 60, lastPing: "12s ago", depot: "Depot 2" },
        { id: "BUS-423", line: "Bus 500", mode: "bus", driver: "A. Fernandes", status: "active", speed: "41 km/h", locationName: "Indiranagar 100ft Rd", lat: 12.9786, lng: 77.6406, batteryFuel: "92%", passengerLoad: "45%", capacity: 60, lastPing: "5s ago", depot: "Silk Board" },
        { id: "BUS-424", line: "Bus 500", mode: "bus", driver: "S. Rao", status: "maintenance", speed: "0 km/h", locationName: "Central Workshop", lat: 12.9606, lng: 77.5736, batteryFuel: "100%", passengerLoad: "0%", capacity: 60, lastPing: "3m ago", depot: "Silk Board" },
        { id: "MTR-108", line: "Purple Line", mode: "metro", driver: "Auto-Control (Staff: M. Ali)", status: "active", speed: "58 km/h", locationName: "Trinity Station", lat: 12.9730, lng: 77.6170, batteryFuel: "100% (Grid)", passengerLoad: "74%", capacity: 950, lastPing: "Just now", depot: "Purple Depot" },
        { id: "MTR-109", line: "Purple Line", mode: "metro", driver: "Auto-Control (Staff: D. Sen)", status: "delayed", speed: "22 km/h", locationName: "Cubbon Park", lat: 12.9790, lng: 77.5980, batteryFuel: "100% (Grid)", passengerLoad: "91%", capacity: 950, lastPing: "8s ago", depot: "Purple Depot" },
        { id: "MTR-204", line: "Green Line", mode: "metro", driver: "Auto-Control (Staff: V. Nair)", status: "active", speed: "62 km/h", locationName: "Jayanagar", lat: 12.9296, lng: 77.5806, batteryFuel: "100% (Grid)", passengerLoad: "52%", capacity: 950, lastPing: "Just now", depot: "Peenya Depot" },
        { id: "MTR-205", line: "Green Line", mode: "metro", driver: "Auto-Control (Staff: G. Joshi)", status: "active", speed: "56 km/h", locationName: "JP Nagar", lat: 12.9100, lng: 77.5850, batteryFuel: "100% (Grid)", passengerLoad: "48%", capacity: 950, lastPing: "4s ago", depot: "Peenya Depot" },
        { id: "SHU-01", line: "Tech Park Shuttle", mode: "electric", driver: "P. Yadav", status: "active", speed: "28 km/h", locationName: "Tech Park Bay 1", lat: 12.9816, lng: 77.6046, batteryFuel: "68%", passengerLoad: "35%", capacity: 25, lastPing: "Just now", depot: "Eco-Hub" },
        { id: "SHU-02", line: "Central Feeder", mode: "electric", driver: "N. Kumar", status: "active", speed: "30 km/h", locationName: "Majestic Gate 3", lat: 12.9766, lng: 77.5726, batteryFuel: "89%", passengerLoad: "60%", capacity: 25, lastPing: "15s ago", depot: "Eco-Hub" }
      ],
      stations: [
        { id: "stop-1", name: "Central Station", crowdLevel: "High", activePlatforms: 4, liftsWorking: "3/3", escalatorsWorking: "4/4", influxPerHour: 4200, wheelchairReady: true, status: "Normal" },
        { id: "stop-2", name: "Tech Park", crowdLevel: "Medium", activePlatforms: 2, liftsWorking: "2/2", escalatorsWorking: "2/2", influxPerHour: 2800, wheelchairReady: true, status: "Normal" },
        { id: "stop-3", name: "Residency Road", crowdLevel: "Low", activePlatforms: 2, liftsWorking: "1/1", escalatorsWorking: "2/2", influxPerHour: 1100, wheelchairReady: true, status: "Normal" },
        { id: "stop-4", name: "MG Road", crowdLevel: "High", activePlatforms: 2, liftsWorking: "2/2", escalatorsWorking: "3/4", influxPerHour: 3900, wheelchairReady: true, status: "Warning" },
        { id: "stop-5", name: "Indiranagar", crowdLevel: "Medium", activePlatforms: 2, liftsWorking: "2/2", escalatorsWorking: "2/2", influxPerHour: 2400, wheelchairReady: true, status: "Normal" },
        { id: "stop-10", name: "Majestic Terminal", crowdLevel: "Critical", activePlatforms: 6, liftsWorking: "4/4", escalatorsWorking: "5/6", influxPerHour: 6500, wheelchairReady: true, status: "Crowded" }
      ]
    };
  } catch (e) {
    return {
      wallets: { "user-1": 500, "user-passenger": 500 },
      tickets: {},
      walletTxns: [],
      delays: [],
      routes: [],
      incidents: [],
      alerts: [],
      vehicles: [],
      stations: []
    };
  }
}

let state = loadStateFromStorage();

function saveStateToStorage() {
  try {
    localStorage.setItem(DB_KEYS.WALLETS, JSON.stringify(state.wallets));
    localStorage.setItem(DB_KEYS.TICKETS, JSON.stringify(state.tickets));
    localStorage.setItem(DB_KEYS.TXNS, JSON.stringify(state.walletTxns));
    localStorage.setItem(DB_KEYS.DELAYS, JSON.stringify(state.delays));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5000;
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const mockApi = {
  async getStops() {
    await new Promise(r => setTimeout(r, 60));
    return STOPS;
  },

  async searchJourneys(originStopId, destinationStopId, prefs = {}) {
    await new Promise(r => setTimeout(r, 150));
    const origin = STOPS.find(s => s.id === originStopId) || STOPS[0];
    const destination = STOPS.find(s => s.id === destinationStopId) || STOPS[1];

    const distMeters = getDistanceMeters(origin.lat, origin.lng, destination.lat, destination.lng);
    const distKm = Math.max(1, distMeters / 1000);

    const busDelay = state.delays.find(d => d.lineId === 'line-bus-201');

    // Dynamic Fare & Time Calculations based on segment sum (Walk = ₹0)
    const fastestMins = Math.round(12 + distKm * 2.8) + (busDelay ? busDelay.delayMinutes : 0);
    const cheapestMins = Math.round(18 + distKm * 3.5);
    const leastWalkingMins = Math.round(15 + distKm * 2.5);

    const busFare = Math.round(12 + distKm * 2.0);
    const metroFare = Math.round(16 + distKm * 2.5);

    const options = [
      {
        id: `jo-fastest-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "fastest",
        totalMinutes: fastestMins,
        totalCost: busFare + metroFare, // Walk (₹0) + Bus + Metro
        totalWalkMeters: Math.round(300 + distKm * 30),
        co2SavedGrams: Math.round(distKm * 85),
        segments: [
          { mode: "walk", fromStopId: originStopId, toStopId: "stop-1", minutes: 5, cost: 0, crowdLevel: "green" },
          { mode: "bus", lineId: "line-bus-201", fromStopId: "stop-1", toStopId: "stop-4", minutes: Math.round(fastestMins * 0.6), cost: busFare, crowdLevel: "yellow" },
          { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: destinationStopId, minutes: Math.round(fastestMins * 0.4), cost: metroFare, crowdLevel: "green" }
        ]
      },
      {
        id: `jo-cheapest-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "cheapest",
        totalMinutes: cheapestMins,
        totalCost: busFare,
        totalWalkMeters: Math.round(600 + distKm * 50),
        co2SavedGrams: Math.round(distKm * 70),
        segments: [
          { mode: "walk", fromStopId: originStopId, toStopId: "stop-3", minutes: 8, cost: 0, crowdLevel: "green" },
          { mode: "bus", lineId: "line-bus-201", fromStopId: "stop-3", toStopId: destinationStopId, minutes: cheapestMins - 8, cost: busFare, crowdLevel: "yellow" }
        ]
      },
      {
        id: `jo-least_walking-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "least_walking",
        totalMinutes: leastWalkingMins,
        totalCost: metroFare + metroFare,
        totalWalkMeters: 180,
        co2SavedGrams: Math.round(distKm * 95),
        segments: [
          { mode: "metro", lineId: "line-purple", fromStopId: originStopId === "stop-1" ? "stop-10" : originStopId, toStopId: "stop-4", minutes: Math.round(leastWalkingMins * 0.4), cost: metroFare, crowdLevel: "green" },
          { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: destinationStopId, minutes: Math.round(leastWalkingMins * 0.6), cost: metroFare, crowdLevel: "green" }
        ]
      }
    ];

    // Add 100% Free Walking Route option
    options.push({
      id: `jo-walk-${originStopId}-${destinationStopId}-${Date.now()}`,
      type: "walk_only",
      totalMinutes: Math.round(distKm * 12),
      totalCost: 0,
      totalWalkMeters: Math.round(distMeters),
      co2SavedGrams: Math.round(distKm * 120),
      segments: [
        { mode: "walk", fromStopId: originStopId, toStopId: destinationStopId, minutes: Math.round(distKm * 12), cost: 0, crowdLevel: "green" }
      ]
    });

    if (prefs.accessible) {
      options.push({
        id: `jo-accessible-${originStopId}-${destinationStopId}-${Date.now()}`,
        type: "accessible",
        totalMinutes: leastWalkingMins + 4,
        totalCost: busFare,
        totalWalkMeters: 220,
        co2SavedGrams: Math.round(distKm * 90),
        segments: [
          { mode: "bus", lineId: "line-bus-201", fromStopId: originStopId, toStopId: destinationStopId, minutes: leastWalkingMins + 4, cost: busFare, crowdLevel: "green" }
        ]
      });
    }

    return { options };
  },

  async bookTicket(userId, journeyOptionId, chosenOption = null) {
    await new Promise(r => setTimeout(r, 120));
    const currentBalance = state.wallets[userId] !== undefined ? state.wallets[userId] : 500;
    
    // Calculate total cost strictly from chosen option segments (Walk = ₹0)
    let cost = 0;
    if (chosenOption) {
      if (typeof chosenOption.totalCost === 'number') {
        cost = chosenOption.totalCost;
      } else {
        cost = (chosenOption.segments || []).reduce((acc, s) => acc + (s.mode === 'walk' ? 0 : (s.cost || 0)), 0);
      }
    }

    if (currentBalance < cost) {
      throw new Error(`Insufficient wallet balance (Available: ₹${currentBalance}). Required ₹${cost}. Please recharge your wallet.`);
    }

    const newBalance = currentBalance - cost;
    state.wallets[userId] = newBalance;

    const ticketId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticketOption = chosenOption ? { ...chosenOption, totalCost: cost } : {
      id: journeyOptionId,
      type: "fastest",
      totalMinutes: 24,
      totalCost: cost,
      totalWalkMeters: 450,
      co2SavedGrams: 420,
      segments: [
        { mode: "walk", fromStopId: "stop-1", toStopId: "stop-3", minutes: 5, cost: 0, crowdLevel: "green" },
        { mode: "bus", lineId: "line-bus-201", fromStopId: "stop-3", toStopId: "stop-4", minutes: 14, cost: Math.round(cost * 0.5), crowdLevel: "yellow" },
        { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: "stop-2", minutes: 5, cost: cost - Math.round(cost * 0.5), crowdLevel: "green" }
      ]
    };

    const ticket = {
      id: ticketId,
      journeyOptionId,
      userId,
      status: "active",
      totalCost: cost,
      createdAt: new Date().toISOString(),
      journeyOption: ticketOption
    };

    state.tickets[ticketId] = ticket;

    const txn = {
      id: `txn-${Date.now()}`,
      userId,
      amount: -cost,
      ticketId,
      timestamp: new Date().toISOString(),
      title: cost === 0 ? `Free Walk Journey (${ticketId})` : `Unified Ticket Booking (${ticketId})`
    };
    state.walletTxns.unshift(txn);

    saveStateToStorage();

    return { ticket, walletBalance: newBalance };
  },

  async getWallet(userId = "user-1") {
    await new Promise(r => setTimeout(r, 60));
    if (state.wallets[userId] === undefined) {
      state.wallets[userId] = 500;
      saveStateToStorage();
    }
    return {
      balance: state.wallets[userId],
      currency: "INR",
      transactions: state.walletTxns.filter(t => t.userId === userId || userId === 'user-1')
    };
  },

  async topUpWallet(userId = "user-1", amount = 100) {
    await new Promise(r => setTimeout(r, 100));
    const currentBalance = state.wallets[userId] !== undefined ? state.wallets[userId] : 500;
    const newBalance = currentBalance + Number(amount);
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
    saveStateToStorage();

    return { balance: newBalance, transactions: state.walletTxns };
  },

  async getLiveTicketStatus(ticketId) {
    await new Promise(r => setTimeout(r, 60));
    const ticket = state.tickets[ticketId];
    if (!ticket) {
      return { status: "active", currentSegmentIndex: 0, ticket: null };
    }

    if (ticket.status === "delay_detected") {
      return {
        status: "delay_detected",
        currentSegmentIndex: 1,
        alert: "⚠️ Bus 201 is delayed by 15 minutes due to heavy traffic. An alternative route via Metro Purple Line is available that saves 12 minutes!",
        alternativeOption: ticket.alternativeOption,
        ticket: ticket,
        journeyOption: ticket.journeyOption
      };
    }

    if (ticket.status === "rerouted") {
      return {
        status: "rerouted",
        currentSegmentIndex: 1,
        alert: "✅ Switched to Metro Purple Line alternative route (Saved 12 minutes).",
        rerouted: ticket.reroutedOption || ticket.journeyOption,
        ticket: ticket,
        journeyOption: ticket.reroutedOption || ticket.journeyOption
      };
    }

    return {
      status: ticket.status || "active",
      currentSegmentIndex: 0,
      alert: null,
      ticket: ticket,
      journeyOption: ticket.journeyOption
    };
  },

  async topUpWallet(userId = "user-1", amount = 100) {
    await new Promise(r => setTimeout(r, 100));
    const currentBalance = state.wallets[userId] !== undefined ? state.wallets[userId] : 500;
    const newBalance = currentBalance + Number(amount);
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
      return { status: "active", currentSegmentIndex: 0, ticket: null };
    }

    if (ticket.status === "delay_detected") {
      return {
        status: "delay_detected",
        currentSegmentIndex: 1,
        alert: "⚠️ Bus 201 is delayed by 15 minutes due to heavy traffic. An alternative route via Metro Purple Line is available that saves 12 minutes!",
        alternativeOption: ticket.alternativeOption,
        ticket: ticket,
        journeyOption: ticket.journeyOption
      };
    }

    if (ticket.status === "rerouted") {
      return {
        status: "rerouted",
        currentSegmentIndex: 1,
        alert: "✅ Switched to Metro Purple Line alternative route (Saved 12 minutes).",
        rerouted: ticket.reroutedOption || ticket.journeyOption,
        ticket: ticket,
        journeyOption: ticket.reroutedOption || ticket.journeyOption
      };
    }

    return {
      status: ticket.status || "active",
      currentSegmentIndex: 0,
      alert: null,
      ticket: ticket,
      journeyOption: ticket.journeyOption
    };
  },

  async simulateDelay(lineId, fromStopId, toStopId, delayMinutes) {
    await new Promise(r => setTimeout(r, 100));

    state.delays.push({ lineId, fromStopId, toStopId, delayMinutes, createdAt: new Date() });

    const affectedTicketIds = [];
    Object.keys(state.tickets).forEach(tId => {
      const ticket = state.tickets[tId];
      if (ticket.status === "active") {
        ticket.status = "delay_detected";
        ticket.alternativeOption = {
          id: `jo-rerouted-${Date.now()}`,
          type: "fastest",
          totalMinutes: 22,
          totalCost: (ticket.journeyOption ? ticket.journeyOption.totalCost : 32),
          totalWalkMeters: 380,
          co2SavedGrams: 490,
          segments: [
            { mode: "walk", fromStopId: "stop-1", toStopId: "stop-10", minutes: 6, cost: 0, crowdLevel: "green" },
            { mode: "metro", lineId: "line-purple", fromStopId: "stop-10", toStopId: "stop-4", minutes: 8, cost: 16, crowdLevel: "green" },
            { mode: "metro", lineId: "line-purple", fromStopId: "stop-4", toStopId: "stop-2", minutes: 8, cost: 16, crowdLevel: "yellow" }
          ]
        };
        affectedTicketIds.push(tId);
      }
    });

    state.alerts.unshift({
      id: `ALT-${Date.now()}`,
      line: lineId,
      severity: "High",
      message: `Delay of ${delayMinutes} minutes reported on ${lineId}. Alternative routes computed.`,
      timestamp: "Just now"
    });

    return { affectedTicketIds };
  },

  async confirmReroute(ticketId) {
    await new Promise(r => setTimeout(r, 100));
    const ticket = state.tickets[ticketId];
    if (ticket && ticket.alternativeOption) {
      ticket.status = "rerouted";
      ticket.reroutedOption = ticket.alternativeOption;
    }
    return { success: true, ticket };
  },

  async rejectReroute(ticketId) {
    await new Promise(r => setTimeout(r, 100));
    const ticket = state.tickets[ticketId];
    if (ticket) {
      ticket.status = "active";
      delete ticket.alternativeOption;
    }
    return { success: true, ticket };
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
    const activeIncidents = state.incidents.filter(i => i.status !== 'RESOLVED');
    const delayedVehicles = state.vehicles.filter(v => v.status === 'delayed');
    return {
      activeVehiclesCount: 1482,
      delayedCount: 23 + state.delays.length + delayedVehicles.length,
      cancelledCount: 4,
      criticalIncidentsCount: activeIncidents.length,
      networkHealth: {
        normalPercent: Math.max(75, 95 - activeIncidents.length * 3 - state.delays.length * 2),
        delayedPercent: Math.min(20, 4 + delayedVehicles.length * 2 + state.delays.length * 2),
        criticalPercent: Math.min(10, 1 + activeIncidents.filter(i => i.severity === 'High').length)
      },
      routes: state.routes || [],
      incidents: state.incidents || [],
      alerts: state.alerts || [],
      vehicles: state.vehicles || [],
      stations: state.stations || []
    };
  },

  async getEmployeeVehicles() {
    await new Promise(r => setTimeout(r, 50));
    return [...state.vehicles];
  },

  async updateVehicleDriver(vehicleId, driver, status) {
    await new Promise(r => setTimeout(r, 80));
    const v = state.vehicles.find(item => item.id === vehicleId);
    if (v) {
      if (driver) v.driver = driver;
      if (status) v.status = status;
      v.lastPing = "Just now";
    }
    return { success: true, vehicle: v };
  },

  async getEmployeeRoutes() {
    await new Promise(r => setTimeout(r, 50));
    return [...(state.routes || [])];
  },

  async updateRouteHeadway(routeId, frequencyMins) {
    await new Promise(r => setTimeout(r, 60));
    const rObj = (state.routes || []).find(r => r.id === routeId);
    if (rObj) {
      rObj.frequencyMins = Number(frequencyMins);
    }
    return { success: true, route: rObj };
  },

  async getEmployeeIncidents() {
    await new Promise(r => setTimeout(r, 50));
    return [...(state.incidents || [])];
  },

  async updateIncidentStatus(incidentId, status, note = '') {
    await new Promise(r => setTimeout(r, 80));
    const inc = state.incidents.find(i => i.id === incidentId);
    if (inc) {
      inc.status = status;
      if (status === 'RESOLVED') {
        inc.resolvedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (note) {
        inc.mitigationPlan = note;
      }
    }
    return { success: true, incident: inc };
  },

  async createIncident(incidentData) {
    await new Promise(r => setTimeout(r, 100));
    const newInc = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: incidentData.title || "Operations Incident",
      severity: incidentData.severity || "Medium",
      status: "INVESTIGATING",
      affectedPassengers: Number(incidentData.affectedPassengers) || 850,
      line: incidentData.line || "Purple Line",
      location: incidentData.location || "Transit Network",
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedResolution: incidentData.expectedResolution || "Within 45 mins",
      reportedBy: incidentData.reportedBy || "NOC Controller",
      description: incidentData.description || "",
      mitigationPlan: incidentData.mitigationPlan || "Standard response protocol initiated.",
      alternativesAvailable: !!incidentData.alternativesAvailable
    };
    state.incidents.unshift(newInc);
    return { success: true, incident: newInc };
  },

  async getEmployeeAlerts() {
    await new Promise(r => setTimeout(r, 50));
    return [...(state.alerts || [])];
  },

  async publishServiceAlert(line, severity, message, expectedDelay = '15 mins') {
    await new Promise(r => setTimeout(r, 100));
    const newAlert = {
      id: `ALT-${Date.now()}`,
      line,
      severity,
      message,
      expectedDelay,
      operator: "Network Operations Center",
      reachCount: Math.floor(1200 + Math.random() * 3500),
      status: "Active",
      timestamp: "Just now"
    };
    state.alerts.unshift(newAlert);
    return { success: true, alert: newAlert };
  },

  async revokeServiceAlert(alertId) {
    await new Promise(r => setTimeout(r, 60));
    const alt = state.alerts.find(a => a.id === alertId);
    if (alt) {
      alt.status = "Expired / Revoked";
    }
    return { success: true, alert: alt };
  },

  async getEmployeeStations() {
    await new Promise(r => setTimeout(r, 50));
    return [...(state.stations || [])];
  },

  async getEmployeeReports() {
    await new Promise(r => setTimeout(r, 70));
    return {
      overview: {
        networkOTP: 96.4,
        avgDelayMins: 3.8,
        dailyRidership: 482150,
        totalFleetActive: 1482,
        incidentsToday: state.incidents.length,
        avgResolutionMins: 22
      },
      linePerformance: [
        { line: "Purple Line Metro", otp: 97.4, riders: 215000, avgDelay: 2.1, trips: 340, status: "Good" },
        { line: "Green Line Metro", otp: 99.1, riders: 165000, avgDelay: 1.2, trips: 280, status: "Excellent" },
        { line: "Bus 201 Express", otp: 88.5, riders: 62000, avgDelay: 8.4, trips: 190, status: "Delayed" },
        { line: "Bus 500 Outer Ring", otp: 94.2, riders: 38000, avgDelay: 4.1, trips: 140, status: "Good" },
        { line: "Airport Metro Direct", otp: 99.6, riders: 2150, avgDelay: 0.5, trips: 64, status: "Excellent" }
      ],
      delayCauses: [
        { cause: "Road Traffic Bottleneck", percent: 42, count: 28 },
        { cause: "Signaling & Interlocking", percent: 26, count: 17 },
        { cause: "Passenger Overcrowding", percent: 18, count: 12 },
        { cause: "Mechanical / Rolling Stock", percent: 9, count: 6 },
        { cause: "Weather / Rain", percent: 5, count: 3 }
      ]
    };
  },

  async processEmployeeCommand(commandText) {
    await new Promise(r => setTimeout(r, 120));
    const q = (commandText || '').toLowerCase().trim();

    if (q.includes('delayed') || q.includes('delay') || q.includes('traffic')) {
      const delayed = state.vehicles.filter(v => v.status === 'delayed');
      return {
        action: 'SHOW_DELAYED',
        title: 'Delayed Fleet Units',
        summary: `Found ${delayed.length} delayed vehicle(s) across network. Bus 201 on MG Road is experiencing a 15-minute delay.`,
        data: delayed
      };
    }

    if (q.includes('incident') || q.includes('critical') || q.includes('alert')) {
      const active = state.incidents.filter(i => i.status !== 'RESOLVED');
      return {
        action: 'SHOW_INCIDENTS',
        title: 'Active Incident Summary',
        summary: `There are currently ${active.length} active incident(s) requiring NOC oversight. Purple Line signal failure affects ~1,824 passengers.`,
        data: active
      };
    }

    if (q.includes('purple') || q.includes('metro')) {
      return {
        action: 'ROUTE_STATUS',
        title: 'Metro Operations Status',
        summary: 'Purple Line OTP is 97.4% (speed restricted near Cubbon Park). Green Line operating normally at 99.1% OTP.',
        data: state.routes.filter(r => r.mode === 'metro')
      };
    }

    if (q.includes('fleet') || q.includes('vehicle') || q.includes('bus')) {
      return {
        action: 'FLEET_STATUS',
        title: 'Fleet Deployment Summary',
        summary: `1,482 total vehicles active. ${state.vehicles.filter(v => v.status === 'active').length} tracked in live zone.`,
        data: state.vehicles
      };
    }

    return {
      action: 'GENERAL_INFO',
      title: 'Operations Network Intelligence',
      summary: `Processed query "${commandText}". Network operational health is 92% normal with 2 active incidents under mitigation.`,
      data: null
    };
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

  // Auth State Store & Pre-seeded Accounts
  users: {
    'passenger@transitone.in': {
      id: 'user-101',
      name: 'Rahul Sharma',
      email: 'passenger@transitone.in',
      password: 'Password@123',
      role: 'passenger',
      country: 'India',
      language: 'en',
      age: 28,
      accessibility: false,
      token: 'jwt-mock-passenger-token-101'
    },
    'senior@transitone.in': {
      id: 'user-102',
      name: 'Savitri Devi',
      email: 'senior@transitone.in',
      password: 'Password@123',
      role: 'passenger',
      country: 'India',
      language: 'hi',
      age: 65,
      accessibility: true,
      token: 'jwt-mock-senior-token-102'
    },
    'tourist@transitone.in': {
      id: 'user-103',
      name: 'Sophie Martin',
      email: 'tourist@transitone.in',
      password: 'Password@123',
      role: 'visitor',
      country: 'France',
      language: 'fr',
      age: 34,
      accessibility: false,
      token: 'jwt-mock-tourist-token-103'
    }
  },

  async login(email, password) {
    await new Promise(r => setTimeout(r, 120));
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    const key = email.trim().toLowerCase();
    const existing = this.users[key];

    if (!existing || existing.password !== password) {
      throw new Error("Invalid email or password.");
    }

    return { user: { ...existing } };
  },

  async register(userData) {
    await new Promise(r => setTimeout(r, 150));
    if (!userData.email || !userData.password) {
      throw new Error("Email and password are required.");
    }

    const key = userData.email.trim().toLowerCase();
    if (this.users[key]) {
      throw new Error("Email is already registered. Please log in.");
    }

    const isVisitor = userData.country && userData.country.toLowerCase() !== 'india';
    const ageNum = userData.age ? parseInt(userData.age, 10) : undefined;
    const isSenior = ageNum !== undefined && ageNum > 50;

    const newUser = {
      id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name || 'Commuter',
      email: key,
      password: userData.password,
      role: isVisitor ? 'visitor' : 'passenger',
      country: userData.country || 'India',
      language: userData.language || 'en',
      age: ageNum,
      accessibility: isSenior ? true : !!userData.accessibility,
      preferences: userData.preferences || {},
      token: `jwt-registered-token-${Date.now()}`
    };

    this.users[key] = newUser;
    return { user: { ...newUser } };
  },

  async employeeLogin(staffId, dept = 'Operations', securityPin = '9921', roleTitle = 'Operations Controller') {
    await new Promise(r => setTimeout(r, 150));
    if (!staffId || !securityPin) {
      throw new Error("Staff ID and Security PIN are required.");
    }
    const cleanPin = securityPin.trim();
    if (cleanPin !== '9921' && cleanPin !== '1234' && cleanPin !== '0000') {
      throw new Error("Invalid Staff Credentials or Security PIN. (Demo PIN: 9921)");
    }
    const cleanId = staffId.trim().toUpperCase();
    return {
      user: {
        id: cleanId,
        name: `Officer ${cleanId}`,
        email: `${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}@transit.gov.in`,
        role: 'employee',
        roleTitle: roleTitle || 'Operations Controller',
        dept: dept || 'Network Operations Center',
        clearanceLevel: 'Level 3 - Operations Command',
        shift: '08:00 - 18:00 (Active Shift)',
        terminal: 'NOC Station #04',
        token: `mock-employee-jwt-${Date.now()}`
      }
    };
  }
};


