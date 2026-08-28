import React from 'react';

export default function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = '#3b82f6',
  accentColor = '#3b82f6',
  onClick
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = accentColor;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${accentColor}, transparent)`
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor
          }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        {subtitle && (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {subtitle}
          </span>
        )}
        {badgeText && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: badgeColor,
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '2px 8px',
            borderRadius: '6px',
            border: `1px solid rgba(255, 255, 255, 0.1)`
          }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
