import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');
  
  // Clear tables in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.rewardTransaction.deleteMany();
  await prisma.rewardWallet.deleteMany();
  await prisma.savedPlace.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.journeySegment.deleteMany();
  await prisma.journey.deleteMany();
  await prisma.fare.deleteMany();
  await prisma.vehicleLocation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding default User & Wallet...');
  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      name: 'John Commuter',
      email: 'john@commuter.com',
      phone: '+919999999999',
      role: 'PASSENGER',
      visitorStatus: 'NONE',
    },
  });

  await prisma.wallet.create({
    data: {
      userId: user.id,
      balance: 500,
      currency: 'INR',
    },
  });

  console.log('Seeding Operators...');
  const metroOperator = await prisma.operator.create({
    data: {
      id: 'op-metro',
      name: 'Namma Metro',
      code: 'METRO',
      contactEmail: 'ops@metro.in',
    },
  });

  const busOperator = await prisma.operator.create({
    data: {
      id: 'op-bus',
      name: 'BMTC Bus Service',
      code: 'BUS',
      contactEmail: 'ops@bus.in',
    },
  });

  console.log('Seeding Stops...');
  const stopsPath = path.join(__dirname, '..', '..', 'prototype-express', 'data', 'stops.json');
  const stops = JSON.parse(fs.readFileSync(stopsPath, 'utf8'));
  for (const s of stops) {
    await prisma.stop.create({
      data: {
        id: s.id,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        noStairs: s.noStairs !== false,
      },
    });
  }

  console.log('Seeding Routes & RouteStops...');
  const linesPath = path.join(__dirname, '..', '..', 'prototype-express', 'data', 'lines.json');
  const lines = JSON.parse(fs.readFileSync(linesPath, 'utf8'));
  for (const line of lines) {
    // Determine operator based on route type/mode
    const operatorId = line.mode === 'metro' ? 'op-metro' : 'op-bus';
    
    await prisma.route.create({
      data: {
        id: line.id,
        operatorId,
        shortName: line.name,
        longName: `${line.name} Directional Route`,
        type: line.mode,
        color: line.color,
        noStairs: line.noStairs !== false,
      },
    });

    // Seed individual hops inside RouteStop
    const stopIds = line.stopIds;
    const hopMinutes = line.hopMinutes;
    const hopCosts = line.hopCosts;

    for (let i = 0; i < stopIds.length; i++) {
      // Find hop travel details (consecutive stops)
      // Since hopMinutes has length stopIds.length - 1, we map index to i
      const minutes = i < hopMinutes.length ? hopMinutes[i] : 3;
      const cost = i < hopCosts.length ? hopCosts[i] : 5;

      await prisma.routeStop.create({
        data: {
          routeId: line.id,
          stopId: stopIds[i],
          stopSequence: i + 1,
          hopMinutes: minutes,
          hopCost: cost,
        },
      });
    }

    // Create a mock default Trip & Schedule for the route to simulate live schedule checking
    const tripId = `trip-${line.id}-0800`;
    await prisma.trip.create({
      data: {
        id: tripId,
        routeId: line.id,
        serviceId: 'DAILY_0800',
        headsign: `${line.name} Bound`,
        directionId: 0,
      },
    });

    // Populate schedules
    let cumulativeMinutes = 0;
    for (let i = 0; i < stopIds.length; i++) {
      const arrHours = 8 + Math.floor(cumulativeMinutes / 60);
      const arrMins = cumulativeMinutes % 60;
      const arrivalTime = `${String(arrHours).padStart(2, '0')}:${String(arrMins).padStart(2, '0')}:00`;
      
      // Stop dwell time 1 min
      const depMins = cumulativeMinutes + 1;
      const depHours = 8 + Math.floor(depMins / 60);
      const departureTime = `${String(depHours).padStart(2, '0')}:${String(depMins).padStart(2, '0')}:00`;

      await prisma.schedule.create({
        data: {
          tripId,
          stopId: stopIds[i],
          arrivalTime,
          departureTime,
          stopSequence: i + 1,
        },
      });

      cumulativeMinutes += i < hopMinutes.length ? hopMinutes[i] + 1 : 4;
    }
  }

  console.log('Seeding Fares...');
  // Seed basic point-to-point fares for transit stops on same line
  for (const line of lines) {
    const operatorId = line.mode === 'metro' ? 'op-metro' : 'op-bus';
    const stopIds = line.stopIds;
    const hopCosts = line.hopCosts;

    for (let i = 0; i < stopIds.length; i++) {
      let currentFareSum = 0;
      for (let j = i + 1; j < stopIds.length; j++) {
        currentFareSum += hopCosts[j - 1];
        
        // Check if fare pair already exists (since bidirectional might be processed)
        const existing = await prisma.fare.findUnique({
          where: {
            sourceStopId_destinationStopId: {
              sourceStopId: stopIds[i],
              destinationStopId: stopIds[j],
            },
          },
        });

        if (!existing) {
          await prisma.fare.create({
            data: {
              operatorId,
              sourceStopId: stopIds[i],
              destinationStopId: stopIds[j],
              price: currentFareSum,
              mode: line.mode,
            },
          });
        }
      }
    }
  }

  // Create a copy of the walkEdges.json file in the config folder for runtime access
  console.log('Copying walking edges configuration...');
  const walkPathSrc = path.join(__dirname, '..', '..', 'prototype-express', 'data', 'walkEdges.json');
  const configDir = path.join(__dirname, '..', 'src', 'common', 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.copyFileSync(walkPathSrc, path.join(configDir, 'walkEdges.json'));

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
