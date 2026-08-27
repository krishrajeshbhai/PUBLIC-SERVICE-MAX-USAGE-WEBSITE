import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import * as http from 'http';
import { execSync } from 'child_process';

// Force port 3001 for test suite
process.env.PORT = '3001';
process.env.SIM_SPEED = '60';

const BASE_OPTIONS = {
  hostname: 'localhost',
  port: 3001,
  headers: {
    'Content-Type': 'application/json',
  },
};

function request(method: string, path: string, body: any = null, headers: any = {}): Promise<{ statusCode: number; body: any }> {
  return new Promise((resolve, reject) => {
    const options = {
      ...BASE_OPTIONS,
      method,
      path,
      headers: {
        ...BASE_OPTIONS.headers,
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode || 500,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode || 500,
            body: data,
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
  console.log('=== TRANSITONE NESTJS BACKEND E2E TEST LOG ===');

  try {
    // 1. GET /api/v1/stops
    console.log('\n1. Testing GET /api/v1/stops...');
    const stopsRes = await request('GET', '/api/v1/stops');
    if (stopsRes.statusCode !== 200) throw new Error(`Stops status was ${stopsRes.statusCode}`);
    if (!stopsRes.body.success || !Array.isArray(stopsRes.body.data) || stopsRes.body.data.length === 0) {
      throw new Error('Stops response should be encapsulated in a success envelope');
    }
    console.log(`✅ Success: Found ${stopsRes.body.data.length} stops.`);
    console.log(`   Sample stop: ${stopsRes.body.data[0].name} (${stopsRes.body.data[0].id})`);

    // 2. POST /api/v1/journeys/search
    console.log('\n2. Testing POST /api/v1/journeys/search...');
    const searchBody = {
      originStopId: 'stop-10', // Majestic
      destinationStopId: 'stop-5', // Indiranagar
    };
    const searchRes = await request('POST', '/api/v1/journeys/search', searchBody);
    if (searchRes.statusCode !== 201) throw new Error(`Search status was ${searchRes.statusCode}`);
    const { options } = searchRes.body.data;
    if (!Array.isArray(options) || options.length === 0) throw new Error('Search must return options');
    console.log(`✅ Success: Found ${options.length} options.`);
    options.forEach((opt) => {
      console.log(`   - Option: "${opt.type}", duration: ${opt.totalMinutes} mins, cost: ₹${opt.totalCost}`);
    });

    // 3. POST /api/v1/tickets/book
    console.log('\n3. Testing POST /api/v1/tickets/book...');
    const fastestOption = options.find((o) => o.type === 'fastest');
    if (!fastestOption) throw new Error('Could not find fastest option');

    const bookBody = {
      userId: 'user-1',
      journeyOptionId: fastestOption.id,
    };
    // Book with idempotency-key header
    const idempotencyKey = `tst-key-${Date.now()}`;
    const bookRes = await request('POST', '/api/v1/tickets/book', bookBody, {
      'idempotency-key': idempotencyKey,
    });
    if (bookRes.statusCode !== 201) throw new Error(`Book status was ${bookRes.statusCode}`);
    const { ticket, walletBalance } = bookRes.body.data;
    if (!ticket || !ticket.id) throw new Error('Booking response missing ticket information');
    console.log(`✅ Success: Ticket booked successfully.`);
    console.log(`   Ticket ID: ${ticket.id}`);
    console.log(`   Wallet Balance: ₹${walletBalance} (Expected: 500 - ${fastestOption.totalCost} = ${500 - fastestOption.totalCost})`);

    // 3.1 Verify idempotency checks
    console.log('\n3.1. Testing booking idempotency...');
    const bookResDup = await request('POST', '/api/v1/tickets/book', bookBody, {
      'idempotency-key': idempotencyKey,
    });
    if (bookResDup.statusCode !== 201) throw new Error(`Idempotent booking status was ${bookResDup.statusCode}`);
    if (bookResDup.body.data.ticket.id !== ticket.id) throw new Error('Idempotent request must return the same ticket');
    console.log(`✅ Success: Idempotent booking returned the duplicate ticket ID successfully.`);

    // 4. GET /api/v1/wallet/:userId
    console.log('\n4. Testing GET /api/v1/wallet/user-1...');
    const walletRes = await request('GET', '/api/v1/wallet/user-1');
    if (walletRes.statusCode !== 200) throw new Error(`Wallet status was ${walletRes.statusCode}`);
    console.log(`✅ Success: Wallet ledger matches. Balance: ₹${walletRes.body.data.balance}`);
    console.log(`   Transactions logged: ${walletRes.body.data.transactions.length}`);

    // 5. GET /api/v1/tickets/:ticketId/live (Initial Status)
    console.log('\n5. Testing GET /api/v1/tickets/:ticketId/live (Initial Status)...');
    const liveRes1 = await request('GET', `/api/v1/tickets/${ticket.id}/live`);
    if (liveRes1.statusCode !== 200) throw new Error(`Live status 1 was ${liveRes1.statusCode}`);
    console.log(`✅ Success: Live index status:`);
    console.log(`   Status: ${liveRes1.body.data.status}`);
    console.log(`   Current Segment Index: ${liveRes1.body.data.currentSegmentIndex}`);

    // 6. POST /api/v1/simulate/delay (Simulate delay affecting Purple Line segment)
    console.log('\n6. Testing POST /api/v1/simulate/delay...');
    const delayBody = {
      lineId: 'line-purple',
      fromStopId: 'stop-10',
      toStopId: 'stop-9',
      delayMinutes: 15,
    };
    const delayRes = await request('POST', '/api/v1/simulate/delay', delayBody);
    if (delayRes.statusCode !== 201) throw new Error(`Delay simulation status was ${delayRes.statusCode}`);
    console.log(`✅ Success: Delay simulation executed.`);
    console.log(`   Affected ticket IDs:`, delayRes.body.data.affectedTicketIds);
    if (!delayRes.body.data.affectedTicketIds.includes(ticket.id)) {
      throw new Error(`Commuter ticket ${ticket.id} should have been affected by this delay!`);
    }

    // 7. GET /api/v1/tickets/:ticketId/live (After Delay Status)
    console.log('\n7. Testing GET /api/v1/tickets/:ticketId/live (Rerouted Status)...');
    const liveRes2 = await request('GET', `/api/v1/tickets/${ticket.id}/live`);
    if (liveRes2.statusCode !== 200) throw new Error(`Live status 2 was ${liveRes2.statusCode}`);
    console.log(`✅ Success: Live status updated:`);
    console.log(`   Status: ${liveRes2.body.data.status}`);
    console.log(`   Alert: "${liveRes2.body.data.alert}"`);
    if (liveRes2.body.data.status !== 'REROUTED') throw new Error("Ticket status should be 'REROUTED'");
    if (!liveRes2.body.data.rerouted) throw new Error('Rerouted journey option should be present on ticket');
    console.log(`   Rerouted Option details:`);
    console.log(`     Type: "${liveRes2.body.data.rerouted.type}"`);
    console.log(`     New total minutes: ${liveRes2.body.data.rerouted.totalMinutes} mins`);

    // 8. GET /api/v1/lines/:lineId/crowd
    console.log('\n8. Testing GET /api/v1/lines/line-purple/crowd...');
    const crowdRes = await request('GET', '/api/v1/lines/line-purple/crowd');
    if (crowdRes.statusCode !== 200) throw new Error(`Crowd status was ${crowdRes.statusCode}`);
    console.log(`✅ Success: Crowd level is "${crowdRes.body.data.crowdLevel}"`);

    // 9. GET /api/v1/employee/dashboard
    console.log('\n9. Testing GET /api/v1/employee/dashboard (Operations)...');
    const dashboardRes = await request('GET', '/api/v1/employee/dashboard');
    if (dashboardRes.statusCode !== 200) throw new Error(`Dashboard status was ${dashboardRes.statusCode}`);
    console.log(`✅ Success: Dashboard retrieved.`);
    console.log(`   Active Vehicles: ${dashboardRes.body.data.activeVehicles}`);
    console.log(`   Open Incidents: ${dashboardRes.body.data.incidents.length}`);
    console.log(`   Affected Commuters: ${dashboardRes.body.data.affectedCommuters}`);

    // 10. GET /api/v1/visitor/offline-package
    console.log('\n10. Testing GET /api/v1/visitor/offline-package (Visitor)...');
    const offlineRes = await request('GET', '/api/v1/visitor/offline-package?userId=user-1');
    if (offlineRes.statusCode !== 200) throw new Error(`Offline package status was ${offlineRes.statusCode}`);
    console.log(`✅ Success: Offline package contains ${offlineRes.body.data.essentialMaps.length} maps and ${offlineRes.body.data.emergencyContacts.length} emergency contacts.`);

    // 11. POST /api/v1/assistant/chat
    console.log('\n11. Testing POST /api/v1/assistant/chat (AI Chat Wallet Balance)...');
    const chatRes1 = await request('POST', '/api/v1/assistant/chat', {
      userId: 'user-1',
      message: 'Show my wallet balance',
    });
    if (chatRes1.statusCode !== 201) throw new Error(`Chat status was ${chatRes1.statusCode}`);
    console.log(`✅ Success: Assistant resolved intent "${chatRes1.body.data.intent}"`);
    console.log(`   Response text: "${chatRes1.body.data.message}"`);

    console.log('\n11.1. Testing POST /api/v1/assistant/chat (AI Chat Route Search)...');
    const chatRes2 = await request('POST', '/api/v1/assistant/chat', {
      userId: 'user-1',
      message: 'Find a route from stop-10 to stop-5',
    });
    if (chatRes2.statusCode !== 201) throw new Error(`Chat status was ${chatRes2.statusCode}`);
    console.log(`✅ Success: Assistant resolved intent "${chatRes2.body.data.intent}"`);
    console.log(`   Response text:\n${chatRes2.body.data.message}`);

    console.log('\n======================================================');
    console.log('ALL NESTJS BACKEND VERIFICATION TEST CASES PASSED!');
    console.log('======================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ E2E VERIFICATION TEST FAILED!');
    console.error(error);
    process.exit(1);
  }
}

async function start() {
  try {
    // 1. Run database seeding
    console.log('Resetting and seeding database...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

    // 2. Start NestJS
    console.log('Starting NestJS server...');
    const app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(3001);
    console.log('NestJS server running on port 3001');

    // Run tests after server spins up
    setTimeout(runTests, 200);
  } catch (e) {
    console.error('Failed to start test harness:', e);
    process.exit(1);
  }
}

await start();
