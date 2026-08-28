import React, { useState } from 'react';
import { X, Terminal, Send, Zap, Radio, AlertTriangle, Bus, ShieldCheck, CheckCircle2, CornerDownLeft } from 'lucide-react';
import { api } from '../../../services/api';

export default function EmployeeAssistantModal({ onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      id: 'init-1',
      sender: 'system',
      title: 'TransitOne NOC Operations Assistant v3.4',
      text: 'Online. Ready for operations queries, fleet lookup, and incident mitigation commands.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    "Show delayed routes",
    "Show active incidents",
    "Inspect Purple Line Metro status",
    "Check fleet units in service",
    "Broadcast 15 min delay on Purple Line"
  ];

  const handleExecute = async (commandText) => {
    const textToRun = commandText || query;
    if (!textToRun.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToRun,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      if (textToRun.toLowerCase().includes('broadcast')) {
        await api.publishServiceAlert('Purple Line', 'High', 'Automated Command: 15-minute delay reported. Alternative routes calculated.');
        await api.simulateDelay('line-bus-201', 'stop-1', 'stop-3', 15);
      }

      const res = await api.processEmployeeCommand(textToRun);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'system',
        title: res.title || 'Operations Response',
        text: res.summary || 'Command processed.',
        data: res.data,
        action: res.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => [...prev, botMsg]);
    } catch (e) {
      setHistory(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'system',
        title: 'Error',
        text: 'Failed to process command. ' + e.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#090e1a',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '680px',
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        color: '#f8fafc',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              padding: '6px 10px',
              borderRadius: '8px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 800
            }}>
              <Terminal size={14} /> OPS COMMAND
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
              TransitOne Operations Intelligence Desk
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Prompts Ribbon */}
        <div style={{
          padding: '10px 16px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleExecute(p)}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#93c5fd',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚡ {p}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {history.map(msg => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
                background: msg.sender === 'user' ? 'rgba(37, 99, 235, 0.35)' : 'rgba(255, 255, 255, 0.04)',
                border: msg.sender === 'user' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 16px'
              }}
            >
              {msg.title && (
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#60a5fa', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={13} /> {msg.title}
                </div>
              )}
              <div style={{ fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.45 }}>
                {msg.text}
              </div>
              {msg.data && Array.isArray(msg.data) && (
                <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  {msg.data.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ color: '#cbd5e1', marginBottom: '2px' }}>
                      • {item.id || item.name} : {item.title || item.status || item.driver}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
                {msg.time}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.82rem', color: '#94a3b8' }}>
              Querying operations telemetry...
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleExecute(); }}
          style={{
            padding: '14px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.8)',
            display: 'flex',
            gap: '10px'
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type operations command (e.g. 'Show delayed routes', 'Broadcast delay on Bus 201')..."
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.88rem'
            }}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              border: 'none',
              padding: '0 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={15} /> Execute
          </button>
        </form>
      </div>
    </div>
  );
}
