import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, ArrowDownRight, ArrowUpRight, History, Leaf, Shield, CheckCircle2 } from 'lucide-react';
import { api } from '../../../services/api';

export default function PassengerWallet() {
  const [balance, setBalance] = useState(500);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallet() {
      try {
        const res = await api.getWallet('user-1');
        if (res) {
          setBalance(res.balance);
          setTransactions(res.transactions || []);
        }
      } catch (e) {
        console.warn("Error fetching wallet data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadWallet();
  }, []);

  const handleTopUp = (amount) => {
    const newBal = balance + amount;
    const newTxn = {
      id: `txn-topup-${Date.now()}`,
      userId: 'user-1',
      amount: amount,
      ticketId: 'TOPUP',
      timestamp: new Date().toISOString()
    };
    setBalance(newBal);
    setTransactions([newTxn, ...transactions]);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
          Commuter Mobility Wallet
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
          One universal balance auto-deducted seamlessly across all metro, bus, and feeder rides.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Balance Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AVAILABLE COMMUTE BALANCE
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                ₹{balance}
              </div>
            </div>
            <span className="badge" style={{ background: '#10b981', color: '#000', fontWeight: 800 }}>
              AUTO-DEBIT ENABLED
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>
            Auto-deducts lowest fare upon QR validation at turnstiles and bus tap-ins.
          </div>

          {/* Quick Recharge */}
          <div style={{ paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Quick Top-Up
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[100, 200, 500].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleTopUp(amt)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', color: '#34d399', fontWeight: 700, borderRadius: '10px' }}
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Eco Carbon Savings Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Leaf size={24} color="#34d399" />
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>Commuter Carbon Impact</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL CO₂ SAVED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>9.2 kg</div>
            </div>
            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TRANSIT RIDES</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa' }}>14 Trips</div>
            </div>
          </div>

          <div style={{
            fontSize: '0.82rem',
            color: '#94a3b8',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            🌱 By commuting via Bus & Metro instead of private car, you saved 9.2 kg CO₂ this month!
          </div>
        </div>
      </div>

      {/* Transaction History Log */}
      <div className="glass-panel" style={{ marginTop: '28px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="#3b82f6" /> Wallet Activity & Fare Deductions
        </h3>

        {transactions.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '0.88rem', textAlign: 'center', padding: '24px' }}>
            No recent wallet transactions.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px' }}>TRANSACTION ID</th>
                  <th style={{ padding: '10px 14px' }}>TYPE</th>
                  <th style={{ padding: '10px 14px' }}>DATE / TIME</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => {
                  const isDebit = t.amount < 0;
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#cbd5e1' }}>{t.id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isDebit ? <ArrowUpRight size={15} color="#ef4444" /> : <ArrowDownRight size={15} color="#10b981" />}
                          {t.ticketId === 'TOPUP' ? 'Wallet Recharge' : `Ride Deduction (${t.ticketId})`}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                        {new Date(t.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: isDebit ? '#ef4444' : '#34d399' }}>
                        {isDebit ? `-₹${Math.abs(t.amount)}` : `+₹${t.amount}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
