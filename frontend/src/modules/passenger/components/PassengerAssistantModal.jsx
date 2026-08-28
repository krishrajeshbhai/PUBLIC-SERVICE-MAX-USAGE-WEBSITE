import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, X, Send, Sparkles, Navigation, Clock, CreditCard, RefreshCw, MapPin } from 'lucide-react';
import { api } from '../../../services/api';
import { getAssistantLocationContext } from '../../../store/liveLocationStore';

export default function PassengerAssistantModal({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hi Abhiraj! Where do you need to commute today? You can tap any quick action or ask in voice/text.'
    }
  ]);
  const [isListening, setIsListening] = useState(false);

  const locContext = getAssistantLocationContext();

  const quickPrompts = [
    { label: '📍 Where am I right now?', query: 'Where am I right now?', action: () => {} },
    { label: '🚌 Find a bus to college', query: 'Find a bus to college', action: () => navigate('/passenger/search?origin=stop-1&destination=stop-2') },
    { label: '⚡ Book my usual journey', query: 'Book my usual journey', action: () => navigate('/passenger/results?origin=stop-1&destination=stop-2') },
    { label: '🎫 Show my active ticket', query: 'Show my active ticket', action: () => navigate('/passenger/tickets') },
    { label: '💳 How much is in my wallet?', query: 'How much is in my wallet?', action: () => navigate('/passenger/wallet') }
  ];

  const handleSend = (text) => {
    const userText = text || query;
    if (!userText.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setQuery('');

    // AI Location Context Aware Response logic
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const currentLoc = getAssistantLocationContext();
      let reply = "I've checked your live transit status.";

      if (lower.includes('where am i') || lower.includes('location') || lower.includes('position')) {
        if (currentLoc.isTracking) {
          reply = `📍 You are currently near ${currentLoc.nearestStop} traveling at ${currentLoc.speed} km/h. Remaining distance to your destination is ${
            currentLoc.remainingDistance > 1000
              ? `${(currentLoc.remainingDistance / 1000).toFixed(1)} km`
              : `${currentLoc.remainingDistance} m`
          } (ETA: ~${currentLoc.remainingMinutes} mins).`;
        } else {
          reply = "📍 You are currently at Central Station Concourse (Lat: 12.9716, Lng: 77.5946). Start live GPS navigation on your ticket screen for continuous turn-by-turn guidance!";
        }
      } else if (lower.includes('college') || lower.includes('bus') || lower.includes('route')) {
        reply = "Found Bus 201 and Purple Line Metro to College. Transfer at MG Road (42 min, ₹28). Opening journey options now!";
        setTimeout(() => {
          onClose();
          navigate('/passenger/search?origin=stop-1&destination=stop-2');
        }, 1200);
      } else if (lower.includes('ticket')) {
        reply = "Opening your active digital QR ticket.";
        setTimeout(() => {
          onClose();
          navigate('/passenger/tickets');
        }, 1000);
      } else if (lower.includes('wallet') || lower.includes('balance') || lower.includes('money')) {
        reply = "Your wallet balance is ₹482.00 with Auto-Deduct active.";
        setTimeout(() => {
          onClose();
          navigate('/passenger/wallet');
        }, 1000);
      } else if (lower.includes('step') || lower.includes('next') || lower.includes('far')) {
        if (currentLoc.isTracking) {
          reply = `Current navigation step: ${currentLoc.currentStepText}. You are approximately ${currentLoc.remainingDistance}m from your destination.`;
        } else {
          reply = "Step 1: Walk to Bus Stop (120m). Step 2: Board Bus 201 to MG Road.";
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  };

  const toggleMic = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTimeout(() => {
        handleSend("Where am I right now?");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(30, 41, 59, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              padding: '6px',
              borderRadius: '10px'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>Commuter AI Assistant</h3>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {locContext.isTracking ? `📍 Live GPS Synced (${locContext.nearestStop})` : 'Real-time voice & text commute intelligence'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat History */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '0.9rem',
                lineHeight: 1.45,
                background: m.sender === 'user' ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff'
              }}
            >
              {m.text}
            </div>
          ))}

          {isListening && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '10px 14px',
              borderRadius: '14px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="live-indicator" style={{ width: 8, height: 8 }}></span>
              Listening to your voice... (say "Where am I right now?")
            </div>
          )}
        </div>

        {/* Quick Commute Chips */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                handleSend(p.query);
                p.action();
              }}
              style={{
                whiteSpace: 'nowrap',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Mic */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#090d16'
        }}>
          <button
            onClick={toggleMic}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isListening ? '#ef4444' : 'rgba(59, 130, 246, 0.2)',
              border: `1px solid ${isListening ? '#ef4444' : 'rgba(59, 130, 246, 0.4)'}`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isListening ? "Stop Listening" : "Speak Now"}
          >
            <Mic size={18} color={isListening ? '#fff' : '#60a5fa'} />
          </button>

          <input
            type="text"
            placeholder="Ask anything about your commute..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />

          <button
            onClick={() => handleSend(query)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#2563eb',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
