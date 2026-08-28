import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../../services/api';

export default function EmployeeReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployeeReports();
      setReportData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeframe]);

  const handleExportCSV = () => {
    if (!reportData) return;
    const rows = [
      ["Line", "On-Time %", "Daily Riders", "Avg Delay (Mins)", "Trips", "Status"],
      ...reportData.linePerformance.map(l => [l.line, `${l.otp}%`, l.riders, l.avgDelay, l.trips, l.status])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TransitOne_Operations_Report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !reportData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: '12px', color: '#fbbf24' }} />
        <h2>Generating Operational Performance Reports...</h2>
      </div>
    );
  }

  const overview = reportData?.overview || {
    networkOTP: 96.4,
    avgDelayMins: 3.8,
    dailyRidership: 482150,
    totalFleetActive: 1482,
    incidentsToday: 4,
    avgResolutionMins: 22
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={26} color="#10b981" />
            Operational Analytics & Performance Reports
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Executive on-time performance (OTP), delay root cause breakdowns, and multi-modal ridership metrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.84rem' }}
          >
            <option value="today">Today (Live Shift)</option>
            <option value="weekly">Past 7 Days</option>
            <option value="monthly">Monthly Aggregate</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            <FileSpreadsheet size={15} color="#34d399" /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: '0.84rem', padding: '8px 14px' }}
          >
            <Printer size={15} /> Print
          </button>
        </div>
      </div>

      {/* Overview Stat Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>NETWORK OTP %</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {overview.networkOTP}%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>Target: 95.0%</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>AVERAGE CORRIDOR DELAY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {overview.avgDelayMins}m
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>-0.4m from yesterday</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>DAILY RIDERSHIP</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>
            {overview.dailyRidership ? overview.dailyRidership.toLocaleString() : '482,150'}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#34d399', marginTop: '2px' }}>+8.4% monthly growth</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>AVG INCIDENT RESOLUTION</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
            {overview.avgResolutionMins}m
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>NOC Response SLA: 30m</div>
        </div>
      </div>

      {/* Main Grid: Line-by-Line OTP Table (Left) + Delay Causes Breakdown (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(340px, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Line Performance Table */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: '#fff' }}>
            Transit Line Punctuality & Volume Breakdown
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.74rem', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '12px 10px' }}>LINE / SERVICE</th>
                  <th style={{ padding: '12px 10px' }}>OTP %</th>
                  <th style={{ padding: '12px 10px' }}>PASSENGERS</th>
                  <th style={{ padding: '12px 10px' }}>AVG DELAY</th>
                  <th style={{ padding: '12px 10px' }}>TRIPS</th>
                  <th style={{ padding: '12px 10px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(reportData?.linePerformance || []).map((line, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 10px', fontWeight: 700, color: '#fff' }}>
                      {line.line}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: line.otp >= 95 ? '#34d399' : '#fbbf24', minWidth: '45px' }}>
                          {line.otp}%
                        </span>
                        <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${line.otp}%`, height: '100%', background: line.otp >= 95 ? '#10b981' : '#f59e0b' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', color: '#cbd5e1' }}>
                      {line.riders.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 10px', color: '#94a3b8' }}>
                      {line.avgDelay}m
                    </td>
                    <td style={{ padding: '14px 10px', color: '#94a3b8' }}>
                      {line.trips}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: line.status === 'Excellent' ? 'rgba(16, 185, 129, 0.15)' : line.status === 'Good' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: line.status === 'Excellent' ? '#34d399' : line.status === 'Good' ? '#60a5fa' : '#fbbf24'
                      }}>
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delay Causes Distribution */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: '#fff' }}>
            Delay Root Cause Analysis
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(reportData?.delayCauses || []).map((cause, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{cause.cause}</span>
                  <span style={{ fontWeight: 800, color: '#fbbf24' }}>{cause.percent}% ({cause.count} incidents)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${cause.percent}%`,
                      height: '100%',
                      background: idx === 0 ? '#ef4444' : idx === 1 ? '#f59e0b' : idx === 2 ? '#3b82f6' : '#a855f7'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
