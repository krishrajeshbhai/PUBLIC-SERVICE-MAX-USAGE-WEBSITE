import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, X, Bot, User, Sparkles, Volume2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { t } from '../../i18n/i18n';

export default function VoiceAssistant({ onTicketBooked }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hello! I am TransitOne AI Assistant. Speak or type your request (e.g., 'Book bus ticket', 'Where is my bus?', 'Check wallet balance')." }
  ]);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setIsOpen(true);
      } catch (e) {
        console.warn("Speech recognition start error:", e);
      }
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || transcript;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setTranscript('');

    try {
      // Process voice intent with backend/mock engine
      const res = await api.processVoiceIntent(query);

      if (res.requiresConfirmation) {
        setPendingConfirmation(res);
        const botResponse = `I found a booking option. ${res.summary}. Should I proceed?`;
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse, isConfirmation: true }]);
        speakText(botResponse);
      } else {
        const botResponse = res.summary;
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
        speakText(botResponse);

        // Perform contextual navigation action based on intent
        if (res.intent === 'SHOW_WALLET') {
          setTimeout(() => navigate('/wallet'), 1200);
        } else if (res.intent === 'TRACK_JOURNEY' || res.intent === 'REROUTE_JOURNEY') {
          setTimeout(() => navigate('/results'), 1200);
        } else if (res.intent === 'SEARCH_TRANSPORT') {
          setTimeout(() => navigate('/'), 1200);
        }
      }
    } catch (err) {
      const errMsg = "I couldn't process that command. Please try again.";
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: errMsg }]);
      speakText(errMsg);
    }
  };

  const confirmAction = async () => {
    if (!pendingConfirmation) return;
    try {
      // Execute high-risk booking
      const bookRes = await api.bookTicket('user-1', 'jo-fastest-stop-1-stop-2', null);
      if (onTicketBooked) {
        onTicketBooked(bookRes.ticket.id, bookRes.walletBalance);
      }
      const successMsg = `🎉 Booking confirmed! Ticket ID: ${bookRes.ticket.id}. Opening live ticket now...`;
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: successMsg }]);
      speakText(successMsg);
      setPendingConfirmation(null);
      setTimeout(() => {
        navigate(`/ticket/${bookRes.ticket.id}`);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      const failMsg = `Booking failed: ${err.message}`;
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: failMsg }]);
      speakText(failMsg);
      setPendingConfirmation(null);
    }
  };

  const cancelAction = () => {
    setPendingConfirmation(null);
    const cancelMsg = "Action cancelled. How else can I assist you?";
    setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: cancelMsg }]);
    speakText(cancelMsg);
  };

  const quickActions = [
    { label: '🎫 My Ticket', query: 'Show my active ticket' },
    { label: '📍 Track Bus', query: 'Track my bus location' },
    { label: '💳 Wallet Balance', query: 'What is my wallet balance?' },
    { label: '🚌 Book Journey', query: 'Book a bus ticket to Bangalore' }
  ];

  return (
    <>
      {/* Floating Trigger Microphone Button */}
      <button
        onClick={toggleListening}
        className={isListening ? 'mic-listening' : ''}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(59, 130, 246, 0.5)',
          transition: 'all 0.3s ease'
        }}
      >
        {isListening ? (
          <>
            <Mic size={22} color="#ffffff" className="pulse-alert" />
            <span>Listening...</span>
          </>
        ) : (
          <>
            <Sparkles size={22} color="#ffffff" />
            <span>{t('voiceAssistant')}</span>
          </>
        )}
      </button>

      {/* Slide-over Assistant Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid var(--border-subtle)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '12px', display: 'flex' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>TransitOne Voice AI</h3>
                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="live-indicator" style={{ width: '6px', height: '6px' }}></span> Realtime Task Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px'
                }}
              >
                {m.sender === 'bot' && (
                  <div style={{ background: '#3b82f6', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} color="#fff" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    fontSize: '0.92rem',
                    lineHeight: '1.4',
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* High-Risk Action Confirmation Gate */}
            {pendingConfirmation && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '14px',
                padding: '16px',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem' }}>
                  <ShieldAlert size={18} />
                  <span>High-Risk Action Confirmation</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: '8px 0 14px 0' }}>
                  {pendingConfirmation.summary}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={confirmAction} className="btn-primary" style={{ flex: 1, padding: '8px' }}>
                    <CheckCircle2 size={16} /> Confirm
                  </button>
                  <button onClick={cancelAction} className="btn-secondary" style={{ flex: 1, padding: '8px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Chips */}
          <div style={{ padding: '10px 20px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qa.query)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  borderRadius: '9999px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0, 0, 0, 0.2)' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(transcript);
              }}
              style={{ display: 'flex', gap: '10px' }}
            >
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Type or speak a command..."
                style={{
                  flex: 1,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={toggleListening}
                style={{
                  background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <Mic size={18} />
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '12px 18px' }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
