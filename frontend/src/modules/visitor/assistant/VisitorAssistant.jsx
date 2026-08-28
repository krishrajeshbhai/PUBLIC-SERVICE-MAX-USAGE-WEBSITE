import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Mic, Send, Sparkles, Compass, MapPin, Globe, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { getAssistantLocationContext } from '../../../store/liveLocationStore';

export default function VisitorAssistant() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste & Welcome to India! 🇮🇳 I am your TransitOne Travel Guide. How can I assist your journey today? You can ask in English, French, German, Japanese, or any of our 9 supported languages.'
    }
  ]);

  const locContext = getAssistantLocationContext();

  const travelPrompts = [
    { label: '📍 Where am I right now?', query: 'Where am I right now?' },
    { label: '✈️ How do I get to the Airport?', query: 'How do I get to Chennai International Airport?' },
    { label: '🧭 What should I explore now?', query: 'What are the top attractions near me today?' },
    { label: '🏨 Take me to my hotel', query: 'How do I get back to The Taj Connemara Hotel?' },
    { label: '🗣 Translate: Where is the bus?', query: 'Translate "Where is the bus to Mahabalipuram?" to Tamil' }
  ];

  const handleSend = (text) => {
    const userText = text || query;
    if (!userText.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setQuery('');

    // Travel Guide AI Persona responses with Live GPS Location context
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const currentLoc = getAssistantLocationContext();
      let reply = "I am checking the official tourist transit network for you...";

      if (lower.includes('where am i') || lower.includes('location') || lower.includes('position')) {
        if (currentLoc.isTracking) {
          reply = `📍 You are currently near ${currentLoc.nearestStop} (Lat: ${currentLoc.latitude.toFixed(4)}, Lng: ${currentLoc.longitude.toFixed(4)}). You are traveling at ${currentLoc.speed} km/h. Remaining distance to monument/stop: ${
            currentLoc.remainingDistance > 1000
              ? `${(currentLoc.remainingDistance / 1000).toFixed(1)} km`
              : `${currentLoc.remainingDistance} m`
          } (~${currentLoc.remainingMinutes} mins away).`;
        } else {
          reply = "📍 You are currently near Central Station Concourse in Chennai. You are inside the monitored tourist security zone. Uniformed tourist help desks are nearby!";
        }
      } else if (lower.includes('airport')) {
        reply = "To reach Chennai International Airport (MAA): Take the Metro Blue Line direct to Chennai Airport Metro Station (24 mins, ₹40). Elevators connect directly to Terminal 2 Departures!";
      } else if (lower.includes('explore') || lower.includes('attraction')) {
        reply = "I recommend visiting the 7th-century UNESCO Shore Temple at Mahabalipuram! Take Bus 588 Express from Thiruvanmiyur (1h 45m). Would you like me to open the guided journey?";
      } else if (lower.includes('hotel') || lower.includes('taj')) {
        reply = "Your hotel is The Taj Connemara on Binny Road. Take the Metro Blue Line to Thousand Lights Station, then a 4-minute walk. You are 15 minutes away.";
      } else if (lower.includes('translate')) {
        reply = "Here is the Tamil phrase for the driver: 'மகாபலிபுரம் செல்லும் பேருந்து எங்கே உள்ளது?' (Pronounced: Mahabalipuram sellum perundhu engey ulladhu?). You can also open the Translation Cards tab!";
      } else if (lower.includes('pass') || lower.includes('ticket')) {
        reply = "Your Tourist Mobility Pass #TOURIST-PASS-9821-IND is valid for unlimited Bus & Metro rides today. Tap 'Help & SOS' to view the QR code.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        handleSend("Where am I right now?");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '999px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '10px'
        }}>
          <Sparkles size={14} /> AI International Travel Companion
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Travel Guide Assistant
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '4px' }}>
          {locContext.isTracking ? `📍 Synced with Live GPS · Nearest Landmark: ${locContext.nearestStop}` : 'Ask directions, monument history, local customs, transit tips, and driver translations.'}
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass-panel" style={{
        padding: '24px',
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '24px',
        marginBottom: '20px'
      }}>
        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '20px',
          maxHeight: '400px'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '14px 18px',
                borderRadius: '16px',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                background: m.sender === 'user' ? '#d97706' : 'rgba(255, 255, 255, 0.05)',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(245, 158, 11, 0.2)',
                color: '#fff'
              }}
            >
              {m.text}
            </div>
          ))}

          {isListening && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="live-indicator" style={{ width: 8, height: 8, background: '#f59e0b' }}></span>
              Listening to your travel question... (say "Where am I right now?")
            </div>
          )}
        </div>

        {/* Quick Travel Prompts */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '14px'
        }}>
          {travelPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.query)}
              style={{
                whiteSpace: 'nowrap',
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fbbf24',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#090d16',
          padding: '10px 14px',
          borderRadius: '16px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <button
            onClick={toggleMic}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isListening ? '#ef4444' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${isListening ? '#ef4444' : 'rgba(245, 158, 11, 0.4)'}`,
              color: isListening ? '#fff' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Mic size={20} />
          </button>

          <input
            type="text"
            placeholder="Ask your travel guide anything about India..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />

          <button
            onClick={() => handleSend(query)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#d97706',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
