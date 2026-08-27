const http = require('http');
const db = require('./db');

// Set port and sim speed for testing
process.env.PORT = 3001;
process.env.SIM_SPEED = 60; // 1 second real time = 1 minute journey time

// Reset the DB to start from a clean seeded state
db.resetDb();

// Start the server
require('./server');

const BASE_OPTIONS = {
  hostname: 'localhost',
  port: 3001,
  headers: {
    'Content-Type': 'application/json'
  }
};

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      ...BASE_OPTIONS,
      method,
      path
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== TRANSITONE BACKEND VERIFICATION LOG ===");

  try {
    // 1. GET /api/stops
    console.log("\n1. Testing GET /api/stops...");
    const stopsRes = await request('GET', '/api/stops');
    if (stopsRes.statusCode !== 200) throw new Error(`Stops status was ${stopsRes.statusCode}`);
    if (!Array.isArray(stopsRes.body) || stopsRes.body.length === 0) throw new Error("Stops must be a non-empty array");
    console.log(`✅ Success: Found ${stopsRes.body.length} stops.`);
    console.log(`   Sample stop: ${stopsRes.body[0].name} (${stopsRes.body[0].id})`);

    // 2. POST /api/journeys/search
    console.log("\n2. Testing POST /api/journeys/search...");
    const searchBody = {
      originStopId: 'stop-10', // Majestic
      destinationStopId: 'stop-5' // Indiranagar
    };
    const searchRes = await request('POST', '/api/journeys/search', searchBody);
    if (searchRes.statusCode !== 200) throw new Error(`Search status was ${searchRes.statusCode}`);
    const { options } = searchRes.body;
    if (!Array.isArray(options) || options.length === 0) throw new Error("Search must return journey options");
    console.log(`✅ Success: Found ${options.length} journey options.`);
    options.forEach(opt => {
      console.log(`   - Option type: "${opt.type}", duration: ${opt.totalMinutes} mins, cost: ₹${opt.totalCost}, walking: ${opt.totalWalkMeters}m`);
      opt.segments.forEach((seg, idx) => {
        console.log(`     Segment ${idx}: ${seg.mode} from ${seg.fromStopId} to ${seg.toStopId} (${seg.minutes} mins)`);
      });
    });

    // 3. POST /api/tickets/book
    console.log("\n3. Testing POST /api/tickets/book...");
    const fastestOption = options.find(o => o.type === 'fastest');
    if (!fastestOption) throw new Error("Could not find a 'fastest' journey option");

    const bookBody = {
      userId: 'user-1',
      journeyOptionId: fastestOption.id
    };
    const bookRes = await request('POST', '/api/tickets/book', bookBody);
    if (bookRes.statusCode !== 200) throw new Error(`Book status was ${bookRes.statusCode}`);
    const { ticket, walletBalance } = bookRes.body;
    if (!ticket || !ticket.id) throw new Error("Booking response missing ticket information");
    console.log(`✅ Success: Ticket booked successfully.`);
    console.log(`   Ticket ID: ${ticket.id}`);
    console.log(`   Wallet Balance: ₹${walletBalance} (Expected: 500 - ${fastestOption.totalCost} = ${500 - fastestOption.totalCost})`);
    if (walletBalance !== 500 - fastestOption.totalCost) {
      throw new Error(`Wallet balance mismatch! Got: ${walletBalance}`);
    }

    // 4. GET /api/wallet/:userId
    console.log("\n4. Testing GET /api/wallet/user-1...");
    const walletRes = await request('GET', '/api/wallet/user-1');
    if (walletRes.statusCode !== 200) throw new Error(`Wallet status was ${walletRes.statusCode}`);
    console.log(`✅ Success: Wallet balance is ₹${walletRes.body.balance}`);
    console.log(`   Transaction history length: ${walletRes.body.transactions.length}`);

    // 5. GET /api/tickets/:ticketId/live (Initial Status)
    console.log("\n5. Testing GET /api/tickets/:ticketId/live (Initial Status)...");
    const liveRes1 = await request('GET', `/api/tickets/${ticket.id}/live`);
    if (liveRes1.statusCode !== 200) throw new Error(`Live status 1 status was ${liveRes1.statusCode}`);
    console.log(`✅ Success: Ticket live status:`);
    console.log(`   Status: ${liveRes1.body.status}`);
    console.log(`   Current Segment Index: ${liveRes1.body.currentSegmentIndex}`);
    if (liveRes1.body.status !== 'active') throw new Error("Ticket status should be 'active'");

    // 6. POST /api/simulate/delay (Simulate delay affecting Purple Line segment)
    console.log("\n6. Testing POST /api/simulate/delay...");
    // Let's inject a 15-minute delay on the Purple Line between Majestic and Vidhana Soudha
    const delayBody = {
      lineId: 'line-purple',
      fromStopId: 'stop-10',
      toStopId: 'stop-9',
      delayMinutes: 15
    };
    const delayRes = await request('POST', '/api/simulate/delay', delayBody);
    if (delayRes.statusCode !== 200) throw new Error(`Delay simulation status was ${delayRes.statusCode}`);
    console.log(`✅ Success: Injected 15 mins delay.`);
    console.log(`   Affected ticket IDs returned:`, delayRes.body.affectedTicketIds);
    if (!delayRes.body.affectedTicketIds.includes(ticket.id)) {
      throw new Error(`Our booked ticket ${ticket.id} should have been affected by this delay!`);
    }

    // 7. GET /api/tickets/:ticketId/live (After Delay Status)
    console.log("\n7. Testing GET /api/tickets/:ticketId/live (After Delay / Rerouted Status)...");
    const liveRes2 = await request('GET', `/api/tickets/${ticket.id}/live`);
    if (liveRes2.statusCode !== 200) throw new Error(`Live status 2 status was ${liveRes2.statusCode}`);
    console.log(`✅ Success: Live status updated:`);
    console.log(`   Status: ${liveRes2.body.status}`);
    console.log(`   Alert: "${liveRes2.body.alert}"`);
    if (liveRes2.body.status !== 'rerouted') throw new Error("Ticket status should have transitioned to 'rerouted'");
    if (!liveRes2.body.rerouted) throw new Error("Rerouted journey option should be present on ticket");
    console.log(`   Rerouted Option details:`);
    console.log(`     Type: "${liveRes2.body.rerouted.type}"`);
    console.log(`     New total minutes (including delay): ${liveRes2.body.rerouted.totalMinutes} mins`);
    console.log(`     New segments:`);
    liveRes2.body.rerouted.segments.forEach((seg, idx) => {
      console.log(`       Segment ${idx}: ${seg.mode} from ${seg.fromStopId} to ${seg.toStopId} (${seg.minutes} mins)`);
    });

    // 8. GET /api/lines/:lineId/crowd
    console.log("\n8. Testing GET /api/lines/line-purple/crowd...");
    const crowdRes = await request('GET', '/api/lines/line-purple/crowd');
    if (crowdRes.statusCode !== 200) throw new Error(`Crowd status was ${crowdRes.statusCode}`);
    console.log(`✅ Success: line-purple crowd level is: "${crowdRes.body.crowdLevel}"`);

    console.log("\n=============================================");
    console.log("ALL BACKEND TEST CASES PASSED SUCCESSFULLY!");
    console.log("=============================================");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ VERIFICATION TEST FAILED!");
    console.error(error);
    process.exit(1);
  }
}

// Small pause to allow server to start, then run tests
setTimeout(runTests, 100);
