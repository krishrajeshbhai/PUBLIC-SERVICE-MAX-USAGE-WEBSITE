// liveLocationStore.js - Real-Time User Location, Navigation Engine, & Proximity Tracking

let watchId = null;
let simulationTimer = null;

const DEFAULT_STATE = {
  isTracking: false,
  isPaused: false,
  isSimulated: false,
  permissionStatus: 'prompt', // 'prompt' | 'granted' | 'denied' | 'unsupported'
  
  // User coordinates & telemetry
  userLocation: {
    lat: 12.9716, // Central Station default
    lng: 77.5946,
    accuracy: 10,
    speed: 0, // km/h
    heading: 0,
    timestamp: Date.now()
  },
  
  // Navigation progress & state
  currentSegmentIndex: 0,
  currentStepProgress: 0, // 0 - 100%
  overallProgress: 0, // 0 - 100%
  remainingDistanceMeters: 0,
  remainingDurationMinutes: 0,
  nearestStop: null,
  upcomingSegment: null,
  
  // Milestone alerts & notifications
  activeNotification: null, // { type, message, timestamp }
  notificationHistory: [],
  
  // Off-route deviation state
  isOffRoute: false,
  deviationDistanceMeters: 0,
  deviationAlert: null,
  
  // Active journey references
  activeJourney: null,
  stopsList: [],
  userBreadcrumbs: [] // Array of [lat, lng]
};

let state = { ...DEFAULT_STATE };
const listeners = new Set();

function emit() {
  const snapshot = getState();
  listeners.forEach(cb => cb(snapshot));
}

export function getState() {
  return {
    ...state,
    userLocation: { ...state.userLocation },
    userBreadcrumbs: [...state.userBreadcrumbs]
  };
}

export function subscribeLocation(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Haversine distance calculator between 2 coordinates in meters
export function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Speak notification aloud using SpeechSynthesis
export function speakNotification(text) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
}

// Push a contextual notification with sound/speech
function triggerNotification(type, message, speak = true) {
  const notification = { type, message, timestamp: Date.now() };
  state.activeNotification = notification;
  state.notificationHistory.unshift(notification);
  if (state.notificationHistory.length > 20) state.notificationHistory.pop();
  
  if (speak) speakNotification(message);
  emit();

  // Auto-dismiss after 6 seconds
  setTimeout(() => {
    if (state.activeNotification && state.activeNotification.timestamp === notification.timestamp) {
      state.activeNotification = null;
      emit();
    }
  }, 6000);
}

// Calculate nearest stop, active segment progress, and milestone detection
function updateNavigationProgress(lat, lng) {
  if (!state.activeJourney || !state.activeJourney.segments || state.activeJourney.segments.length === 0) {
    return;
  }

  const segments = state.activeJourney.segments;
  const stops = state.stopsList;

  // 1. Find nearest stop in the city
  let minStopDist = Infinity;
  let closestStop = null;
  stops.forEach(s => {
    if (s && typeof s.lat === 'number' && typeof s.lng === 'number') {
      const d = getHaversineDistance(lat, lng, s.lat, s.lng);
      if (d < minStopDist) {
        minStopDist = d;
        closestStop = { ...s, distanceMeters: d };
      }
    }
  });
  state.nearestStop = closestStop;

  // 2. Evaluate current active segment
  const currentSeg = segments[state.currentSegmentIndex] || segments[0];
  const fromStop = stops.find(s => s.id === currentSeg.fromStopId);
  const toStop = stops.find(s => s.id === currentSeg.toStopId);

  if (fromStop && toStop) {
    const distToTargetStop = getHaversineDistance(lat, lng, toStop.lat, toStop.lng);
    const totalSegDist = getHaversineDistance(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng) || 1;
    
    // Check off-route deviation (> 250 meters from straight path connecting from -> to)
    const distFromStart = getHaversineDistance(lat, lng, fromStop.lat, fromStop.lng);
    const deviation = Math.max(0, (distFromStart + distToTargetStop) - totalSegDist);

    if (deviation > 300 && distToTargetStop > 150) {
      if (!state.isOffRoute) {
        state.isOffRoute = true;
        state.deviationDistanceMeters = Math.round(deviation);
        triggerNotification(
          'deviation',
          `⚠️ Route deviation detected: You are ${Math.round(deviation)}m off the planned route. Recalculating alternative path...`,
          true
        );
      }
    } else {
      if (state.isOffRoute) {
        state.isOffRoute = false;
        state.deviationDistanceMeters = 0;
        triggerNotification('info', '✓ Back on planned journey path.', false);
      }
    }

    // Step progress
    const segProgress = Math.min(100, Math.max(0, Math.round(((totalSegDist - distToTargetStop) / totalSegDist) * 100)));
    state.currentStepProgress = segProgress;

    // Segment milestone arrival detection
    if (distToTargetStop <= 45) {
      if (state.currentSegmentIndex < segments.length - 1) {
        state.currentSegmentIndex += 1;
        const nextSeg = segments[state.currentSegmentIndex];
        const nextTarget = stops.find(s => s.id === nextSeg.toStopId);
        
        triggerNotification(
          'milestone',
          `You have reached ${toStop.name}! Next: ${nextSeg.mode.toUpperCase()} to ${nextTarget ? nextTarget.name : 'next stop'}.`,
          true
        );
      } else {
        // Final destination reached!
        state.overallProgress = 100;
        triggerNotification('arrival', `🎉 You have arrived at your destination: ${toStop.name}!`, true);
      }
    } else if (distToTargetStop <= 160 && distToTargetStop > 100) {
      triggerNotification(
        'proximity',
        `Your ${currentSeg.mode === 'bus' ? 'bus stop' : 'station'} (${toStop.name}) is ~2 minutes away (${distToTargetStop}m ahead).`,
        false
      );
    }
  }

  // 3. Compute remaining total distance & duration
  let remainingMeters = 0;
  let remainingMins = 0;
  for (let i = state.currentSegmentIndex; i < segments.length; i++) {
    const seg = segments[i];
    const sFrom = stops.find(s => s.id === seg.fromStopId);
    const sTo = stops.find(s => s.id === seg.toStopId);
    if (sFrom && sTo) {
      if (i === state.currentSegmentIndex) {
        remainingMeters += getHaversineDistance(lat, lng, sTo.lat, sTo.lng);
        remainingMins += Math.round(seg.minutes * ((100 - state.currentStepProgress) / 100));
      } else {
        remainingMeters += getHaversineDistance(sFrom.lat, sFrom.lng, sTo.lat, sTo.lng);
        remainingMins += seg.minutes || 5;
      }
    }
  }

  state.remainingDistanceMeters = remainingMeters;
  state.remainingDurationMinutes = Math.max(1, remainingMins);
  state.upcomingSegment = segments[state.currentSegmentIndex + 1] || null;

  const totalSteps = segments.length;
  state.overallProgress = Math.min(100, Math.round(((state.currentSegmentIndex + (state.currentStepProgress / 100)) / totalSteps) * 100));
}

// 1. Start Live GPS Location Tracking
export function startLiveLocationTracking(journeyOption, stops = []) {
  state.activeJourney = journeyOption;
  state.stopsList = stops;
  state.isTracking = true;
  state.isPaused = false;
  state.isSimulated = false;

  // Initialize starting position at origin stop if available
  if (journeyOption && journeyOption.segments && journeyOption.segments.length > 0) {
    const originStop = stops.find(s => s.id === journeyOption.segments[0].fromStopId);
    if (originStop) {
      state.userLocation.lat = originStop.lat;
      state.userLocation.lng = originStop.lng;
    }
  }

  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    state.permissionStatus = 'granted';

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (state.isPaused || state.isSimulated) return;

        const { latitude, longitude, accuracy, speed, heading } = pos.coords;
        state.userLocation = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 10,
          speed: speed ? Math.round(speed * 3.6) : 0, // km/h
          heading: heading || 0,
          timestamp: Date.now()
        };

        state.userBreadcrumbs.push([latitude, longitude]);
        if (state.userBreadcrumbs.length > 50) state.userBreadcrumbs.shift();

        updateNavigationProgress(latitude, longitude);
        emit();
      },
      (err) => {
        console.warn("Geolocation error (falling back to simulation mode):", err);
        state.permissionStatus = 'denied';
        startSimulationPlayback(journeyOption, stops);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    state.permissionStatus = 'unsupported';
    startSimulationPlayback(journeyOption, stops);
  }

  triggerNotification('info', 'Live GPS Journey Navigation Activated 📍', true);
  emit();
}

// 2. Stop Live Tracking
export function stopLiveLocationTracking() {
  if (watchId !== null && typeof navigator !== 'undefined') {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (simulationTimer) {
    clearInterval(simulationTimer);
    simulationTimer = null;
  }

  state.isTracking = false;
  state.isPaused = false;
  state.isSimulated = false;
  state.activeNotification = null;
  state.isOffRoute = false;
  emit();
}

// 3. Pause / Resume Tracking
export function togglePauseTracking() {
  state.isPaused = !state.isPaused;
  if (state.isPaused) {
    triggerNotification('info', 'Navigation tracking paused.', false);
  } else {
    triggerNotification('info', 'Navigation tracking resumed.', false);
  }
  emit();
}

// 4. Interactive Simulation Playback (For Demo & Testing)
export function startSimulationPlayback(journeyOption, stops = []) {
  if (simulationTimer) clearInterval(simulationTimer);

  state.activeJourney = journeyOption;
  state.stopsList = stops;
  state.isTracking = true;
  state.isPaused = false;
  state.isSimulated = true;
  state.isOffRoute = false;

  const waypoints = [];
  if (journeyOption && journeyOption.segments) {
    journeyOption.segments.forEach(seg => {
      const from = stops.find(s => s.id === seg.fromStopId);
      const to = stops.find(s => s.id === seg.toStopId);
      if (from && to) {
        // Interpolate 5 micro-steps between each stop
        for (let i = 0; i <= 5; i++) {
          const ratio = i / 5;
          waypoints.push({
            lat: from.lat + (to.lat - from.lat) * ratio,
            lng: from.lng + (to.lng - from.lng) * ratio,
            speed: seg.mode === 'walk' ? 4.5 : seg.mode === 'bus' ? 28 : 45
          });
        }
      }
    });
  }

  let stepIdx = 0;
  if (waypoints.length > 0) {
    state.userLocation.lat = waypoints[0].lat;
    state.userLocation.lng = waypoints[0].lng;
    updateNavigationProgress(waypoints[0].lat, waypoints[0].lng);
    emit();
  }

  simulationTimer = setInterval(() => {
    if (state.isPaused) return;

    stepIdx++;
    if (stepIdx < waypoints.length) {
      const pt = waypoints[stepIdx];
      state.userLocation = {
        lat: pt.lat,
        lng: pt.lng,
        accuracy: 5,
        speed: pt.speed,
        heading: 90,
        timestamp: Date.now()
      };
      state.userBreadcrumbs.push([pt.lat, pt.lng]);
      updateNavigationProgress(pt.lat, pt.lng);
      emit();
    } else {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
  }, 2500); // Progress every 2.5 seconds

  triggerNotification('info', 'Live Journey Simulation Mode Active 🚗', false);
  emit();
}

// 5. Test Route Deviation (Intentionally jumps user 400m off course)
export function simulateOffRouteDeviation() {
  if (state.userLocation) {
    const deviatedLat = state.userLocation.lat + 0.004; // ~450m offset
    const deviatedLng = state.userLocation.lng + 0.004;
    state.userLocation.lat = deviatedLat;
    state.userLocation.lng = deviatedLng;
    state.userBreadcrumbs.push([deviatedLat, deviatedLng]);
    updateNavigationProgress(deviatedLat, deviatedLng);
    emit();
  }
}

// 6. Recalculate & Correct Route
export function recalculateAlternativeRoute() {
  state.isOffRoute = false;
  state.deviationDistanceMeters = 0;
  triggerNotification('milestone', '⚡ Route Recalculated: Re-routed via direct connection!', true);
  emit();
}

// 7. Context Getter for Voice AI Assistant
export function getAssistantLocationContext() {
  const currentSeg = state.activeJourney && state.activeJourney.segments
    ? state.activeJourney.segments[state.currentSegmentIndex]
    : null;

  return {
    isTracking: state.isTracking,
    latitude: state.userLocation.lat,
    longitude: state.userLocation.lng,
    speed: state.userLocation.speed,
    nearestStop: state.nearestStop ? state.nearestStop.name : 'Central Station',
    currentSegmentMode: currentSeg ? currentSeg.mode : 'walking',
    remainingDistance: state.remainingDistanceMeters,
    remainingMinutes: state.remainingDurationMinutes,
    overallProgress: state.overallProgress,
    isOffRoute: state.isOffRoute,
    currentStepText: currentSeg
      ? `Step ${state.currentSegmentIndex + 1}: ${currentSeg.mode.toUpperCase()} from ${currentSeg.fromStopId} to ${currentSeg.toStopId}`
      : 'At departure point'
  };
}
