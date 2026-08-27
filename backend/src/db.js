const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const STOPS_FILE = path.join(__dirname, '..', 'data', 'stops.json');
const LINES_FILE = path.join(__dirname, '..', 'data', 'lines.json');
const WALK_EDGES_FILE = path.join(__dirname, '..', 'data', 'walkEdges.json');

function initDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error("Corrupted database file. Re-seeding.", e);
    }
  }

  // Load seeds
  const stops = JSON.parse(fs.readFileSync(STOPS_FILE, 'utf8'));
  const lines = JSON.parse(fs.readFileSync(LINES_FILE, 'utf8'));
  const walkEdges = JSON.parse(fs.readFileSync(WALK_EDGES_FILE, 'utf8'));

  const initialData = {
    stops,
    lines,
    walkEdges,
    wallets: [
      { userId: "user-1", balance: 500 }
    ],
    tickets: [],
    walletTxns: [],
    delayEvents: []
  };

  saveDb(initialData);
  return initialData;
}

let dbCache = null;

function getDb() {
  if (!dbCache) {
    dbCache = initDb();
  }
  return dbCache;
}

function saveDb(data) {
  dbCache = data;
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function resetDb() {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
  }
  dbCache = null;
  return getDb();
}

module.exports = {
  getDb,
  saveDb,
  resetDb,
  getStops: () => getDb().stops,
  getLines: () => getDb().lines,
  getWalkEdges: () => getDb().walkEdges,
  getWallets: () => getDb().wallets,
  getTickets: () => getDb().tickets,
  getWalletTxns: () => getDb().walletTxns,
  getDelayEvents: () => getDb().delayEvents,
  
  saveTickets: (tickets) => {
    const db = getDb();
    db.tickets = tickets;
    saveDb(db);
  },
  saveWallets: (wallets) => {
    const db = getDb();
    db.wallets = wallets;
    saveDb(db);
  },
  saveWalletTxns: (txns) => {
    const db = getDb();
    db.walletTxns = txns;
    saveDb(db);
  },
  saveDelayEvents: (events) => {
    const db = getDb();
    db.delayEvents = events;
    saveDb(db);
  }
};
