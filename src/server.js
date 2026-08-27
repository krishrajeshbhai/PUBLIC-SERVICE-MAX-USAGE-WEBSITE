const express = require('express');
const cors = require('cors');
const db = require('./db');
const { searchJourneys, getCrowdLevel } = require('./journeyPlanner');
const { getTicketLiveStatus, simulateDelay } = require('./delayService');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Helper to parse JourneyOption ID
function parseJourneyOptionId(id) {
  const match = id.match(/^jo-(fastest|cheapest|least_walking|accessible)-(stop-\d+)-(stop-\d+)-/);
  if (!match) return null;
  return {
    type: match[1],
    originStopId: match[2],
    destinationStopId: match[3]
  };
}

// 1. GET /api/stops - List all stops
app.get('/api/stops', (req, res) => {
  try {
    const stops = db.getStops();
    res.json(stops);
  } catch (error) {
    console.error("Error fetching stops:", error);
    res.status(500).json({ error: "Failed to fetch stops" });
  }
});

// 2. POST /api/journeys/search - Search ranked options
app.post('/api/journeys/search', (req, res) => {
  try {
    const { originStopId, destinationStopId, prefs = {} } = req.body;
    if (!originStopId || !destinationStopId) {
      return res.status(400).json({ error: "originStopId and destinationStopId are required" });
    }

    const stops = db.getStops();
    const stopIds = stops.map(s => s.id);
    if (!stopIds.includes(originStopId) || !stopIds.includes(destinationStopId)) {
      return res.status(400).json({ error: "Invalid stop ID(s) provided" });
    }

    const delayEvents = db.getDelayEvents();
    const options = searchJourneys(originStopId, destinationStopId, prefs, delayEvents);

    res.json({ options });
  } catch (error) {
    console.error("Error running journey search:", error);
    res.status(500).json({ error: "Failed to calculate journey options" });
  }
});

// 3. POST /api/tickets/book - Book a ticket
app.post('/api/tickets/book', (req, res) => {
  try {
    const { userId, journeyOptionId } = req.body;
    if (!userId || !journeyOptionId) {
      return res.status(400).json({ error: "userId and journeyOptionId are required" });
    }

    // Parse the ID to reconstruct parameters and find option
    const parsed = parseJourneyOptionId(journeyOptionId);
    if (!parsed) {
      return res.status(400).json({ error: "Invalid journeyOptionId format" });
    }

    const { type, originStopId, destinationStopId } = parsed;
    const delayEvents = db.getDelayEvents();
    const searchOptions = searchJourneys(
      originStopId, 
      destinationStopId, 
      { accessible: type === 'accessible' }, 
      delayEvents
    );

    // Find the matching option
    const chosenOption = searchOptions.find(opt => opt.type === type);
    if (!chosenOption) {
      return res.status(404).json({ error: "Journey option no longer available or valid" });
    }

    // Get user's wallet
    const wallets = db.getWallets();
    let wallet = wallets.find(w => w.userId === userId);
    if (!wallet) {
      // If user doesn't have a wallet, initialize it with default balance of 500
      wallet = { userId, balance: 500 };
      wallets.push(wallet);
    }

    if (wallet.balance < chosenOption.totalCost) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // Deduct balance
    wallet.balance -= chosenOption.totalCost;
    db.saveWallets(wallets);

    // Create ticket
    const ticketId = `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTicket = {
      id: ticketId,
      journeyOptionId,
      userId,
      status: "active",
      createdAt: new Date().toISOString(),
      journeyOption: chosenOption
    };

    const tickets = db.getTickets();
    tickets.push(newTicket);
    db.saveTickets(tickets);

    // Record transaction
    const txn = {
      id: `txn-${Date.now()}`,
      userId,
      amount: -chosenOption.totalCost,
      ticketId,
      timestamp: new Date().toISOString()
    };

    const txns = db.getWalletTxns();
    txns.push(txn);
    db.saveWalletTxns(txns);

    // Prepare response according to A5 contract: { ticket: Ticket, walletBalance: number }
    // Note: omit helper journeyOption property if we want pure Ticket layout, or keep it.
    // The contract lists Ticket as { id, journeyOptionId, userId, status, createdAt }.
    // Let's return the exact contract properties on Ticket, but keep journeyOption for live updates.
    res.json({
      ticket: {
        id: newTicket.id,
        journeyOptionId: newTicket.journeyOptionId,
        userId: newTicket.userId,
        status: newTicket.status,
        createdAt: newTicket.createdAt
      },
      walletBalance: wallet.balance
    });
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ error: "Failed to book ticket" });
  }
});

// 4. GET /api/wallet/:userId - Get wallet balance and history
app.get('/api/wallet/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const wallets = db.getWallets();
    let wallet = wallets.find(w => w.userId === userId);
    
    if (!wallet) {
      wallet = { userId, balance: 500 };
      wallets.push(wallet);
      db.saveWallets(wallets);
    }

    const txns = db.getWalletTxns().filter(t => t.userId === userId);
    
    res.json({
      balance: wallet.balance,
      transactions: txns
    });
  } catch (error) {
    console.error("Error fetching wallet info:", error);
    res.status(500).json({ error: "Failed to retrieve wallet information" });
  }
});

// 5. GET /api/tickets/:ticketId/live - Poll ticket progress and alerts
app.get('/api/tickets/:ticketId/live', (req, res) => {
  try {
    const { ticketId } = req.params;
    const tickets = db.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const status = getTicketLiveStatus(ticket);
    res.json(status);
  } catch (error) {
    console.error("Error updating live ticket status:", error);
    res.status(500).json({ error: "Failed to fetch live journey updates" });
  }
});

// 6. POST /api/simulate/delay - Demo trigger button to inject delays
app.post('/api/simulate/delay', (req, res) => {
  try {
    const { lineId, fromStopId, toStopId, delayMinutes } = req.body;
    if (!lineId || !fromStopId || !toStopId || delayMinutes === undefined) {
      return res.status(400).json({ error: "lineId, fromStopId, toStopId, and delayMinutes are required" });
    }

    const affectedTicketIds = simulateDelay(lineId, fromStopId, toStopId, parseInt(delayMinutes));
    res.json({ affectedTicketIds });
  } catch (error) {
    console.error("Error simulating delay:", error);
    res.status(500).json({ error: "Failed to execute delay simulation" });
  }
});

// 7. GET /api/lines/:lineId/crowd - Get crowd indicator level
app.get('/api/lines/:lineId/crowd', (req, res) => {
  try {
    const { lineId } = req.params;
    const crowdLevel = getCrowdLevel(lineId);
    res.json({ crowdLevel });
  } catch (error) {
    console.error("Error fetching crowd level:", error);
    res.status(500).json({ error: "Failed to fetch crowd status" });
  }
});

// Reset endpoint - useful for testing and demos
app.post('/api/reset', (req, res) => {
  try {
    db.resetDb();
    res.json({ message: "Database reset to initial seed values" });
  } catch (error) {
    console.error("Error resetting database:", error);
    res.status(500).json({ error: "Failed to reset database" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`TransitOne Backend listening on port ${PORT}`);
});
