const db = require('./db');
const { searchJourneys } = require('./journeyPlanner');

function getTicketLiveStatus(ticket) {
  if (ticket.status === 'completed') {
    return {
      status: 'completed',
      currentSegmentIndex: -1
    };
  }

  const journey = ticket.journeyOption;
  if (!journey || !journey.segments || journey.segments.length === 0) {
    return {
      status: ticket.status,
      currentSegmentIndex: 0
    };
  }

  // Speed factor: 60 means 1 second real-time = 1 minute journey time.
  const SIM_SPEED = process.env.SIM_SPEED ? parseFloat(process.env.SIM_SPEED) : 60;
  const elapsedMs = Date.now() - new Date(ticket.createdAt).getTime();
  const elapsedMinutes = (elapsedMs / 1000) * (SIM_SPEED / 60);

  let cumulativeTime = 0;
  let currentSegmentIndex = -1;

  for (let i = 0; i < journey.segments.length; i++) {
    cumulativeTime += journey.segments[i].minutes;
    if (elapsedMinutes <= cumulativeTime) {
      currentSegmentIndex = i;
      break;
    }
  }

  // If elapsed time has exceeded the entire journey duration
  if (currentSegmentIndex === -1 && elapsedMinutes > cumulativeTime) {
    ticket.status = 'completed';
    const tickets = db.getTickets();
    const idx = tickets.findIndex(t => t.id === ticket.id);
    if (idx !== -1) {
      tickets[idx].status = 'completed';
      db.saveTickets(tickets);
    }
    return {
      status: 'completed',
      currentSegmentIndex: -1
    };
  }

  return {
    status: ticket.status,
    currentSegmentIndex: Math.max(0, currentSegmentIndex),
    alert: ticket.alert || undefined,
    rerouted: ticket.reroutedJourneyOption || undefined
  };
}

function isSegmentAffected(segment, lineId, fromStopId, toStopId) {
  if (segment.mode !== 'metro' && segment.mode !== 'bus') return false;
  if (segment.lineId !== lineId) return false;

  const lines = db.getLines();
  const line = lines.find(l => l.id === lineId);
  if (!line) return false;

  const fromIdx = line.stopIds.indexOf(segment.fromStopId);
  const toIdx = line.stopIds.indexOf(segment.toStopId);
  const delayFromIdx = line.stopIds.indexOf(fromStopId);
  const delayToIdx = line.stopIds.indexOf(toStopId);

  if (fromIdx === -1 || toIdx === -1 || delayFromIdx === -1 || delayToIdx === -1) {
    return false;
  }

  // Check if the delay edge lies within the boarding and alighting stops of this segment
  const minIdx = Math.min(fromIdx, toIdx);
  const maxIdx = Math.max(fromIdx, toIdx);
  const delayMinIdx = Math.min(delayFromIdx, delayToIdx);
  const delayMaxIdx = Math.max(delayFromIdx, delayToIdx);

  return (delayMinIdx >= minIdx && delayMaxIdx <= maxIdx && Math.abs(delayMaxIdx - delayMinIdx) === 1);
}

function simulateDelay(lineId, fromStopId, toStopId, delayMinutes) {
  const segmentKey = `${lineId}+${fromStopId}+${toStopId}`;
  
  // Store the delay event
  const newEvent = {
    id: `delay-${Date.now()}`,
    segmentKey,
    lineId,
    fromStopId,
    toStopId,
    delayMinutes,
    createdAt: new Date().toISOString()
  };

  const delayEvents = [...db.getDelayEvents(), newEvent];
  db.saveDelayEvents(delayEvents);

  // Find active tickets that are affected
  const tickets = db.getTickets();
  const stops = db.getStops();
  const lines = db.getLines();
  
  const affectedTicketIds = [];
  const updatedTickets = tickets.map(ticket => {
    if (ticket.status !== 'active') return ticket;

    // Get current live index
    const liveStatus = getTicketLiveStatus(ticket);
    if (liveStatus.status === 'completed' || liveStatus.currentSegmentIndex === -1) {
      return ticket;
    }

    const segments = ticket.journeyOption.segments;
    let affected = false;

    // We check from the current segment to the end
    for (let i = liveStatus.currentSegmentIndex; i < segments.length; i++) {
      if (isSegmentAffected(segments[i], lineId, fromStopId, toStopId)) {
        affected = true;
        break;
      }
    }

    if (!affected) return ticket;

    // Ticket is affected! We need to reroute
    affectedTicketIds.push(ticket.id);

    const SIM_SPEED = process.env.SIM_SPEED ? parseFloat(process.env.SIM_SPEED) : 60;
    const elapsedMs = Date.now() - new Date(ticket.createdAt).getTime();
    const elapsedMinutes = (elapsedMs / 1000) * (SIM_SPEED / 60);

    const currentSegment = segments[liveStatus.currentSegmentIndex];
    
    // Calculate elapsed time in the current segment
    let elapsedMinutesInCurrentSegment = elapsedMinutes;
    for (let j = 0; j < liveStatus.currentSegmentIndex; j++) {
      elapsedMinutesInCurrentSegment -= segments[j].minutes;
    }

    // Reroute from start stop if passenger just started this segment, otherwise from destination stop
    const rerouteStartStopId = (elapsedMinutesInCurrentSegment < 1.0)
      ? currentSegment.fromStopId
      : currentSegment.toStopId;

    const finalDestinationStopId = segments[segments.length - 1].toStopId;

    const line = lines.find(l => l.id === lineId) || { name: lineId };
    const fromStop = stops.find(s => s.id === fromStopId) || { name: fromStopId };
    const toStop = stops.find(s => s.id === toStopId) || { name: toStopId };

    // Run search for new routes with the updated delay events list
    const isAccessibleType = ticket.journeyOption.type === 'accessible';
    const searchOptions = searchJourneys(
      rerouteStartStopId,
      finalDestinationStopId,
      { accessible: isAccessibleType },
      delayEvents
    );

    // Pick the option that matches the original preference type, or fallback to the first option
    let chosenOption = searchOptions.find(opt => opt.type === ticket.journeyOption.type) || searchOptions[0];

    if (chosenOption) {
      ticket.status = 'rerouted';
      ticket.reroutedJourneyOption = chosenOption;
      ticket.alert = `Delay on ${line.name} near ${toStop.name}. Rerouted to destination via ${chosenOption.type} path.`;
    } else {
      ticket.status = 'rerouted';
      ticket.alert = `Delay on ${line.name} near ${toStop.name}. No alternative transit route found.`;
    }

    return ticket;
  });

  if (affectedTicketIds.length > 0) {
    db.saveTickets(updatedTickets);
  }

  return affectedTicketIds;
}

module.exports = {
  getTicketLiveStatus,
  simulateDelay
};
