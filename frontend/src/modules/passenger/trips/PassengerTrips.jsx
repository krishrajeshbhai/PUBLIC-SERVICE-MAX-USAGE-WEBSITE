import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2, Clock, XCircle, ArrowRight, Download, Leaf, QrCode, Bus, Train, Footprints } from 'lucide-react';

export default function PassengerTrips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'upcoming' | 'completed' | 'cancelled'

  const trips = {
    active: [
      {
        id: 'tkt-active-101',
        from: 'Central Station',
        to: 'Tech Park',
        date: 'Today, 08:30 AM',
        modes: ['Walk', 'Bus 201', 'Metro Purple'],
        duration: '42 min',
        fare: '₹28',
        co2: '420g',
        status: 'In Progress'
      }
    ],
    upcoming: [
      {
        id: 'tkt-sched-202',
        from: 'Tech Park',
        to: 'Central Station',
        date: 'Today, 05:45 PM',
        modes: ['Metro Purple', 'Bus 201', 'Walk'],
        duration: '40 min',
        fare: '₹28',
        co2: '420g',
        status: 'Scheduled'
      }
    ],
    completed: [
      {
        id: 'tkt-comp-892',
        from: 'Central Station',
        to: 'Majestic',
        date: 'Yesterday, 09:15 AM',
        modes: ['Metro Purple', 'Walk'],
        duration: '18 min',
        fare: '₹15',
        co2: '280g',
        status: 'Completed'
      },
      {
        id: 'tkt-comp-890',
        from: 'Majestic',
        to: 'Indiranagar',
        date: '26 Aug 2026',
        modes: ['Metro Purple'],
        duration: '22 min',
        fare: '₹20',
        co2: '350g',
        status: 'Completed'
      }
    ],
    cancelled: [
      {
        id: 'tkt-canc-109',
        from: 'Indiranagar',
        to: 'Halasuru',
        date: '24 Aug 2026',
        modes: ['Metro Purple'],
        duration: '6 min',
        fare: '₹10 (Refunded)',
        status: 'Cancelled'
      }
    ]
  };

  const list = trips[activeTab] || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
          My Commute Trips
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          Manage your active journey, scheduled routines, and past trip receipts.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'active', label: '🟢 Active Trip', count: trips.active.length },
          { id: 'upcoming', label: 'Upcoming', count: trips.upcoming.length },
          { id: 'completed', label: 'Completed', count: trips.completed.length },
          { id: 'cancelled', label: 'Cancelled', count: trips.cancelled.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '1px 6px',
              borderRadius: '999px',
              fontSize: '0.72rem'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Trips List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            No {activeTab} trips found.
          </div>
        ) : (
          list.map(t => (
            <div
              key={t.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#60a5fa' }}>{t.id}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.date}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t.from} <ArrowRight size={16} color="#94a3b8" /> {t.to}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  <span>Modes: <strong>{t.modes.join(' ➔ ')}</strong></span>
                  {t.duration && <span>Duration: <strong>{t.duration}</strong></span>}
                  {t.fare && <span style={{ color: '#34d399', fontWeight: 700 }}>{t.fare}</span>}
                  {t.co2 && (
                    <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Leaf size={13} /> {t.co2} Saved
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {activeTab === 'active' && (
                  <button
                    onClick={() => navigate(`/passenger/tickets?ticketId=${t.id}`)}
                    className="btn-primary"
                    style={{ borderRadius: '10px', padding: '10px 18px', fontSize: '0.88rem' }}
                  >
                    <QrCode size={16} /> Open Live Ticket
                  </button>
                )}
                {activeTab === 'completed' && (
                  <button
                    onClick={() => alert(`Receipt downloaded for ${t.id}`)}
                    className="btn-secondary"
                    style={{ borderRadius: '10px', padding: '10px 16px', fontSize: '0.85rem' }}
                  >
                    <Download size={15} /> Receipt
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
