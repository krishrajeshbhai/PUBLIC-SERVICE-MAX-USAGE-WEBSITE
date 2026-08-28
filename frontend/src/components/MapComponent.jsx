import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom colored DivIcons for Leaflet markers
function createCustomIcon(color = '#3b82f6', label = '', isLarge = false, isUser = false) {
  const size = isUser ? 32 : isLarge ? 28 : 18;
  const html = isUser ? `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: pulseGlow 2s infinite;"></div>
      <div style="width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; border: 3px solid #ffffff; box-shadow: 0 0 14px #3b82f6; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; z-index: 2;">
        📍
      </div>
    </div>
  ` : `
    <div style="
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 12px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 10px;
    ">
      ${label}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

const LINE_COLORS = {
  'line-purple': '#a855f7',
  'line-green': '#10b981',
  'line-bus-201': '#3b82f6',
  'line-bus-500': '#f97316',
  'walk': '#94a3b8'
};

// Helper component to auto-fit map view to markers/polylines or center on user
function ChangeMapView({ coords, userLoc, isTracking }) {
  const map = useMap();
  useEffect(() => {
    if (isTracking && userLoc && typeof userLoc.lat === 'number' && typeof userLoc.lng === 'number') {
      map.setView([userLoc.lat, userLoc.lng], 15, { animate: true });
    } else if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [coords, userLoc, isTracking, map]);
  return null;
}

export default function MapComponent({
  stops = [],
  journeyOption = null,
  isRerouted = false,
  height = '450px',
  userLocation = null,
  isTracking = false,
  userBreadcrumbs = [],
  isOffRoute = false
}) {
  const defaultCenter = [12.9716, 77.5946]; // Bangalore central default

  // Build segments polyline data
  const polylineSegments = [];
  const activeCoords = [];

  if (journeyOption && journeyOption.segments && stops.length > 0) {
    journeyOption.segments.forEach((seg, idx) => {
      const from = stops.find(s => s.id === seg.fromStopId);
      const to = stops.find(s => s.id === seg.toStopId);
      if (from && to) {
        const color = LINE_COLORS[seg.lineId] || (seg.mode === 'walk' ? LINE_COLORS.walk : '#3b82f6');
        const isWalk = seg.mode === 'walk';
        polylineSegments.push({
          positions: [[from.lat, from.lng], [to.lat, to.lng]],
          color: isRerouted ? '#f59e0b' : color,
          dashArray: isWalk ? '8, 8' : isRerouted ? '4, 4' : null,
          weight: isRerouted ? 6 : 5,
          mode: seg.mode,
          lineId: seg.lineId,
          fromName: from.name,
          toName: to.name,
          minutes: seg.minutes
        });
        activeCoords.push([from.lat, from.lng]);
        activeCoords.push([to.lat, to.lng]);
      }
    });
  }

  // Get origin & destination stop IDs if available
  let originStopId = null;
  let destStopId = null;
  if (journeyOption && journeyOption.segments && journeyOption.segments.length > 0) {
    originStopId = journeyOption.segments[0].fromStopId;
    destStopId = journeyOption.segments[journeyOption.segments.length - 1].toStopId;
  }

  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView coords={activeCoords} userLoc={userLocation} isTracking={isTracking} />

        {/* Render all stop markers */}
        {stops.filter(stop => stop && typeof stop.lat === 'number' && typeof stop.lng === 'number').map((stop) => {
          const isOrigin = stop.id === originStopId;
          const isDest = stop.id === destStopId;
          const isSelected = activeCoords.some(c => c[0] === stop.lat && c[1] === stop.lng);

          let color = '#3b82f6';
          let label = '';
          let isLarge = false;

          if (isOrigin) {
            color = '#10b981';
            label = 'A';
            isLarge = true;
          } else if (isDest) {
            color = '#ef4444';
            label = 'B';
            isLarge = true;
          } else if (isSelected) {
            color = '#f59e0b';
          }

          return (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={createCustomIcon(color, label, isLarge)}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#fff' }}>{stop.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>ID: {stop.id}</p>
                  {stop.noStairs && (
                    <span style={{ fontSize: '0.7rem', color: '#22d3ee', display: 'inline-block', marginTop: '4px' }}>
                      ♿ Wheelchair Accessible (No Stairs)
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Route Polylines */}
        {polylineSegments.map((seg, i) => (
          <Polyline
            key={i}
            positions={seg.positions}
            pathOptions={{
              color: seg.color,
              weight: seg.weight,
              dashArray: seg.dashArray,
              opacity: 0.9
            }}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <strong style={{ color: seg.color }}>
                  {seg.mode.toUpperCase()} {seg.lineId ? `(${seg.lineId})` : ''}
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#e5e7eb' }}>
                  {seg.fromName} ➔ {seg.toName} ({seg.minutes} mins)
                </p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* User GPS Breadcrumb Trail */}
        {userBreadcrumbs && userBreadcrumbs.length > 1 && (
          <Polyline
            positions={userBreadcrumbs}
            pathOptions={{
              color: '#38bdf8',
              weight: 4,
              opacity: 0.7,
              dashArray: '4, 6'
            }}
          />
        )}

        {/* Live User Location GPS Marker with Pulsing Halo */}
        {userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number' && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy || 20}
              pathOptions={{
                color: isOffRoute ? '#ef4444' : '#3b82f6',
                fillColor: isOffRoute ? '#ef4444' : '#3b82f6',
                fillOpacity: 0.2,
                weight: 1
              }}
            />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#3b82f6', '', true, true)}
              zIndexOffset={1000}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <div style={{ fontWeight: 800, color: '#38bdf8' }}>📍 Your Live Location</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
                    Speed: {userLocation.speed || 0} km/h
                  </div>
                  {isOffRoute && (
                    <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.78rem', marginTop: '4px' }}>
                      ⚠️ Off planned route
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
