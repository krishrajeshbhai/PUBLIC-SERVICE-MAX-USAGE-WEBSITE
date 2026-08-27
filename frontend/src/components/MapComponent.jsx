import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom colored DivIcons for Leaflet markers
function createCustomIcon(color = '#3b82f6', label = '', isLarge = false) {
  const size = isLarge ? 28 : 18;
  const html = `
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

// Helper component to auto-fit map view to markers/polylines
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [coords, map]);
  return null;
}

export default function MapComponent({ stops = [], journeyOption = null, isRerouted = false, height = '450px' }) {
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

        {activeCoords.length > 0 && <ChangeMapView coords={activeCoords} />}

        {/* Render all stop markers */}
        {stops.map((stop) => {
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
      </MapContainer>
    </div>
  );
}
