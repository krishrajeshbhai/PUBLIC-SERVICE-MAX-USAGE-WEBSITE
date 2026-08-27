const db = require('./db');

function getCrowdLevel(lineId) {
  if (!lineId) return 'green';
  const levels = {
    'line-purple': 'red',
    'line-green': 'yellow',
    'line-bus-201': 'green',
    'line-bus-500': 'yellow'
  };
  return levels[lineId] || 'green';
}

function buildGraph() {
  const stops = db.getStops();
  const lines = db.getLines();
  const walkEdges = db.getWalkEdges();

  const stopsMap = {};
  stops.forEach(s => {
    stopsMap[s.id] = s;
  });

  const graph = {};
  stops.forEach(s => {
    graph[s.id] = [];
  });

  // 1. Add transit edges
  lines.forEach(line => {
    const { id: lineId, mode, stopIds, hopMinutes, hopCosts, noStairs } = line;
    for (let i = 0; i < stopIds.length - 1; i++) {
      const fromStopId = stopIds[i];
      const toStopId = stopIds[i + 1];
      const minutes = hopMinutes[i];
      const cost = hopCosts[i];

      const fromStop = stopsMap[fromStopId];
      const toStop = stopsMap[toStopId];

      const edgeNoStairs = noStairs && 
        (fromStop ? fromStop.noStairs !== false : true) && 
        (toStop ? toStop.noStairs !== false : true);

      graph[fromStopId].push({
        fromStopId,
        toStopId,
        minutes,
        cost,
        mode,
        lineId,
        noStairs: edgeNoStairs
      });
    }
  });

  // 2. Add walking edges (bidirectional)
  walkEdges.forEach(edge => {
    const { fromStopId, toStopId, distanceMeters, minutes } = edge;

    if (graph[fromStopId] && graph[toStopId]) {
      const fromStop = stopsMap[fromStopId];
      const toStop = stopsMap[toStopId];

      const walkNoStairs = 
        (fromStop ? fromStop.noStairs !== false : true) && 
        (toStop ? toStop.noStairs !== false : true);

      graph[fromStopId].push({
        fromStopId,
        toStopId,
        minutes,
        cost: 0,
        mode: 'walk',
        lineId: null,
        distanceMeters,
        noStairs: walkNoStairs
      });

      graph[toStopId].push({
        fromStopId: toStopId,
        toStopId: fromStopId,
        minutes,
        cost: 0,
        mode: 'walk',
        lineId: null,
        distanceMeters,
        noStairs: walkNoStairs
      });
    }
  });

  return graph;
}

function getEdgeMinutes(edge, delayEvents = []) {
  if (edge.mode === 'walk' || !edge.lineId) {
    return edge.minutes;
  }
  const delay = delayEvents.find(d => 
    (d.lineId === edge.lineId && d.fromStopId === edge.fromStopId && d.toStopId === edge.toStopId) ||
    (d.segmentKey === `${edge.lineId}-${edge.fromStopId}-${edge.toStopId}`) ||
    (d.segmentKey === `${edge.lineId}+${edge.fromStopId}+${edge.toStopId}`)
  );
  return delay ? edge.minutes + delay.delayMinutes : edge.minutes;
}

function dijkstra(graph, startStopId, endStopId, type, delayEvents = []) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = [];

  const stops = Object.keys(graph);
  stops.forEach(stopId => {
    distances[stopId] = Infinity;
    previous[stopId] = null;
  });

  distances[startStopId] = 0;
  pq.push({ id: startStopId, dist: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u } = pq.shift();

    if (u === endStopId) break;
    if (distances[u] === Infinity) break;

    if (visited.has(u)) continue;
    visited.add(u);

    const neighbors = graph[u] || [];
    for (const edge of neighbors) {
      const v = edge.toStopId;

      if (type === 'accessible' && !edge.noStairs) {
        continue;
      }

      const minutes = getEdgeMinutes(edge, delayEvents);
      let edgeWeight = 0;

      if (type === 'fastest' || type === 'accessible') {
        edgeWeight = minutes;
      } else if (type === 'cheapest') {
        edgeWeight = edge.cost * 1000 + minutes;
      } else if (type === 'least_walking') {
        const walkingPenalty = (edge.mode === 'walk') ? minutes * 50 : 0;
        edgeWeight = minutes + walkingPenalty;
      }

      const alt = distances[u] + edgeWeight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = edge;
        pq.push({ id: v, dist: alt });
      }
    }
  }

  if (distances[endStopId] === Infinity) {
    return null;
  }

  const pathEdges = [];
  let curr = endStopId;
  while (curr !== startStopId) {
    const edge = previous[curr];
    if (!edge) break;
    pathEdges.unshift(edge);
    curr = edge.fromStopId;
  }

  return pathEdges;
}

function groupEdgesIntoSegments(pathEdges, delayEvents = []) {
  if (!pathEdges || pathEdges.length === 0) return [];

  const segments = [];
  let currentSegment = null;

  for (const edge of pathEdges) {
    const minutes = getEdgeMinutes(edge, delayEvents);
    const cost = edge.cost;

    if (!currentSegment) {
      currentSegment = {
        mode: edge.mode,
        lineId: edge.lineId || undefined,
        fromStopId: edge.fromStopId,
        toStopId: edge.toStopId,
        minutes: minutes,
        cost: cost,
        crowdLevel: getCrowdLevel(edge.lineId)
      };
    } else {
      const sameMode = (edge.mode === currentSegment.mode);
      const sameLine = (edge.lineId === currentSegment.lineId);

      if (sameMode && sameLine) {
        currentSegment.toStopId = edge.toStopId;
        currentSegment.minutes += minutes;
        currentSegment.cost += cost;
      } else {
        segments.push(currentSegment);
        currentSegment = {
          mode: edge.mode,
          lineId: edge.lineId || undefined,
          fromStopId: edge.fromStopId,
          toStopId: edge.toStopId,
          minutes: minutes,
          cost: cost,
          crowdLevel: getCrowdLevel(edge.lineId)
        };
      }
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

function computeJourneyStats(segments, pathEdges) {
  let totalMinutes = 0;
  let totalCost = 0;
  let totalWalkMeters = 0;
  let totalDistanceKm = 0;

  segments.forEach(seg => {
    totalMinutes += seg.minutes;
    totalCost += seg.cost;
  });

  pathEdges.forEach(edge => {
    if (edge.mode === 'walk') {
      const dist = edge.distanceMeters || (edge.minutes * 80); // Fallback: 80m per minute
      totalWalkMeters += dist;
      totalDistanceKm += dist / 1000;
    } else if (edge.mode === 'metro') {
      totalDistanceKm += edge.minutes * 0.75; // Estimate 45 km/h
    } else if (edge.mode === 'bus') {
      totalDistanceKm += edge.minutes * 0.4;  // Estimate 24 km/h
    }
  });

  const co2SavedGrams = Math.round(totalDistanceKm * 120);

  return { totalMinutes, totalCost, totalWalkMeters, co2SavedGrams };
}

function searchJourneys(originStopId, destinationStopId, prefs = {}, delayEvents = []) {
  const graph = buildGraph();
  const types = [];

  if (prefs.accessible) {
    types.push('accessible');
  } else {
    types.push('fastest', 'cheapest', 'least_walking');
  }

  const options = [];
  types.forEach(type => {
    const pathEdges = dijkstra(graph, originStopId, destinationStopId, type, delayEvents);
    if (pathEdges) {
      const segments = groupEdgesIntoSegments(pathEdges, delayEvents);
      const stats = computeJourneyStats(segments, pathEdges);
      options.push({
        id: `jo-${type}-${originStopId}-${destinationStopId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type,
        ...stats,
        segments
      });
    }
  });

  // Deduplicate options
  const seen = new Set();
  const dedupedOptions = [];
  options.forEach(opt => {
    const sig = opt.segments.map(s => `${s.mode}-${s.lineId || 'none'}-${s.fromStopId}-${s.toStopId}`).join('|');
    if (!seen.has(sig)) {
      seen.add(sig);
      dedupedOptions.push(opt);
    }
  });

  return dedupedOptions;
}

module.exports = {
  buildGraph,
  searchJourneys,
  getCrowdLevel
};
