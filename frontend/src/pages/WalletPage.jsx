import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, ArrowDownRight, ArrowUpRight, History, Leaf, Shield, User } from 'lucide-react';
import { api } from '../services/api';

export default function WalletPage({ walletBalance, onWalletUpdated, mockApiChanged }) {
  const [walletData, setWalletData] = useState({ balance: walletBalance ?? 500, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      setLoading(true);
      try {
        const res = await api.getWallet('user-1');
        setWalletData(res);
        if (onWalletUpdated) onWalletUpdated(res.balance);
      } catch (err) {
        console.error("Wallet fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, [mockApiChanged]);

  const handleTopUp = (amount) => {
    const newBal = walletData.balance + amount;
    const newTxn = {
      id: `txn-topup-${Date.now()}`,
      userId: 'user-1',
      amount: amount,
      ticketId: 'TOPUP',
      timestamp: new Date().toISOString()
    };

    const updated = {
      balance: newBal,
      transactions: [newTxn, ...walletData.transactions]
    };

    setWalletData(updated);
    if (onWalletUpdated) onWalletUpdated(newBal);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wallet size={28} color="#10b981" /> Mobility Wallet & Pass
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Single automated balance for Bus, Metro, and Micromobility</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Wallet Balance & Actions Card */}
        <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CURRENT BALANCE
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                ₹{walletData.balance}
              </div>
            </div>
            <span className="badge" style={{ background: '#10b981', color: '#000', padding: '4px 10px' }}>
              AUTO-DEDUCT ACTIVE
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            User ID: <strong style={{ color: '#fff' }}>user-1</strong> · Auto-debit verified across 4 transit operators
          </div>

          {/* Quick Top Up */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} color="#10b981" /> Quick Top-Up Balance
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[100, 200, 500].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleTopUp(amt)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontWeight: 700, color: '#34d399' }}
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Eco Impact Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <User size={24} color="#60a5fa" />
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Commuter Eco Profile</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level 3 Commuter</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CO₂ SAVED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Leaf size={18} /> 4.2 kg
              </div>
            </div>
            <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TRIPS COMPLETED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa' }}>
                {walletData.transactions.length > 0 ? walletData.transactions.length : 3}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            🌱 You saved 4.2kg CO₂ by choosing multi-modal transit over private vehicle travel this month!
          </div>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="glass-panel" style={{ marginTop: '32px', padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={20} color="#3b82f6" /> Wallet Transaction History
        </h3>

        {walletData.transactions.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px' }}>
            No recent wallet transactions. Book a journey or add funds to see history.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>TRANSACTION ID</th>
                  <th style={{ padding: '12px 16px' }}>TYPE / TICKET</th>
                  <th style={{ padding: '12px 16px' }}>TIMESTAMP</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {walletData.transactions.map((t) => {
                  const isDebit = t.amount < 0;
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#e5e7eb' }}>{t.id}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isDebit ? <ArrowUpRight size={16} color="#ef4444" /> : <ArrowDownRight size={16} color="#10b981" />}
                          {t.ticketId === 'TOPUP' ? 'Wallet Credit' : `Ticket Deduction (${t.ticketId})`}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {new Date(t.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: isDebit ? '#ef4444' : '#34d399' }}>
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
