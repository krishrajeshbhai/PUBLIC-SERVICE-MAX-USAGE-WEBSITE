import React from 'react';

export default function DynamicQRCode({ ticketId = 'TX-10029', fare = 32, userName = 'Passenger', size = 110 }) {
  // Simple deterministic pattern generator based on string seed
  const seed = `${ticketId}-${fare}-${userName}`;
  const gridCount = 9;
  
  const cells = [];
  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      // Corner finder patterns
      const isCornerTL = r < 3 && c < 3;
      const isCornerTR = r < 3 && c >= gridCount - 3;
      const isCornerBL = r >= gridCount - 3 && c < 3;
      
      let isFilled = false;
      if (isCornerTL || isCornerTR || isCornerBL) {
        // Outer box or inner dot for finder pattern
        const inOuterTL = (r === 0 || r === 2 || c === 0 || c === 2) && r < 3 && c < 3;
        const inOuterTR = (r === 0 || r === 2 || c === gridCount - 3 || c === gridCount - 1) && r < 3 && c >= gridCount - 3;
        const inOuterBL = (r === gridCount - 3 || r === gridCount - 1 || c === 0 || c === 2) && r >= gridCount - 3 && c < 3;
        const isCenterDot = (r === 1 && c === 1) || (r === 1 && c === gridCount - 2) || (r === gridCount - 2 && c === 1);
        isFilled = inOuterTL || inOuterTR || inOuterBL || isCenterDot;
      } else {
        const charCode = seed.charCodeAt((r * gridCount + c) % seed.length);
        isFilled = (charCode + r * 7 + c * 13) % 2 === 0;
      }
      
      cells.push({ r, c, isFilled });
    }
  }

  const cellSize = size / gridCount;

  return (
    <div style={{
      background: '#ffffff',
      padding: '10px',
      borderRadius: '12px',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cells.map((cell, idx) => (
          cell.isFilled && (
            <rect
              key={idx}
              x={cell.c * cellSize}
              y={cell.r * cellSize}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#0f172a"
              rx={1.5}
            />
          )
        ))}
      </svg>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
        ₹{fare} · {ticketId.slice(0, 10)}
      </div>
    </div>
  );
}
