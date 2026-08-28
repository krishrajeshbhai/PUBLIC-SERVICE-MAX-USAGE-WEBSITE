import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Map,
  GitBranch,
  Bus,
  AlertTriangle,
  Radio,
  Building2,
  BarChart3,
  Settings,
  Terminal,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bell,
  RefreshCw
} from 'lucide-react';
import { getAuthUser, logoutUser } from '../../store/authStore';
import { api } from '../../services/api';
import EmployeeAssistantModal from './components/EmployeeAssistantModal';

export default function EmployeeShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(
    getAuthUser() || {
      id: 'EMP-9921',
      name: 'Officer EMP-9921',
      roleTitle: 'Operations Controller',
      dept: 'Network Operations Center',
      clearanceLevel: 'Level 3 - Command'
    }
  );
  const [showAssistant, setShowAssistant] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [incidentCount, setIncidentCount] = useState(2);
  const [alertCount, setAlertCount] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await api.getEmployeeOpsData();
        if (data) {
          setIncidentCount(data.criticalIncidentsCount || (data.incidents ? data.incidents.length : 2));
          setAlertCount(data.alerts ? data.alerts.length : 2);
        }
      } catch (e) {
        console.warn("Could not refresh operational counts:", e);
      }
    }
    loadCounts();
  }, [location.pathname]);

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { path: '/employee/dashboard', label: 'Operations Desk', icon: Activity }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { path: '/employee/network', label: 'Live Network Map', icon: Map },
        { path: '/employee/routes', label: 'Route Timetables', icon: GitBranch },
        { path: '/employee/vehicles', label: 'Fleet Telemetry', icon: Bus },
        { path: '/employee/stations', label: 'Station Monitors', icon: Building2 }
      ]
    },
    {
      group: 'MANAGEMENT',
      items: [
        { path: '/employee/incidents', label: 'Incident Desk', icon: AlertTriangle, badge: incidentCount > 0 ? incidentCount : null, badgeColor: '#ef4444' },
        { path: '/employee/alerts', label: 'Service Alerts', icon: Radio, badge: alertCount > 0 ? alertCount : null, badgeColor: '#f59e0b' }
      ]
    },
    {
      group: 'ANALYTICS',
      items: [
        { path: '/employee/reports', label: 'KPI & Reports', icon: BarChart3 }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { path: '/employee/settings', label: 'NOC Settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/employee/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#070b14',
      color: '#f8fafc',
      fontFamily: 'var(--font-main, Inter, sans-serif)'
    }}>
      {/* Professional Operations Sidebar */}
      <aside style={{
        width: collapsed ? '74px' : '260px',
        background: '#0b1120',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        zIndex: 950,
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0
      }}>
        {/* Sidebar Header / Logo */}
        <div style={{
          padding: '18px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '10px'
        }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <Shield size={20} color="#000" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  TransitOne
                </div>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  OPERATIONS NOC
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} color="#000" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#94a3b8',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {!collapsed && (
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  padding: '4px 12px',
                  marginBottom: '4px'
                }}>
                  {group.group}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: collapsed ? '10px' : '9px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: isActive ? '#ffffff' : '#94a3b8',
                        background: isActive ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                        border: isActive ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} color={isActive ? '#fbbf24' : 'currentColor'} />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span style={{
                          background: item.badgeColor || '#ef4444',
                          color: '#fff',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '999px'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Profile Card */}
        <div style={{
          padding: '14px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.25)'
        }}>
          {!collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {user.id ? user.id.slice(0, 3) : 'EMP'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {user.name || user.id}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 600 }}>
                    {user.roleTitle || 'Controller'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <Link
                  to="/"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 600
                  }}
                  title="Return to Main Ecosystem Hub"
                >
                  <ArrowLeft size={13} /> Main Hub
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={13} /> Exit
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                title="Sign Out Staff"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Operations Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Professional Top Bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          background: 'rgba(11, 17, 32, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Left Info: System status indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#34d399'
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              LIVE TELEMETRY: ACTIVE
            </div>

            <div style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'monospace'
            }}>
              <span>UTC+5:30 (IST):</span>
              <strong style={{ color: '#fff' }}>{currentTime}</strong>
            </div>

            <div style={{
              display: 'inline-block',
              fontSize: '0.74rem',
              color: '#fbbf24',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              NOC DESK #04 · {user.dept || 'Operations'}
            </div>
          </div>

          {/* Right Controls: Ops Assistant & Notification Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowAssistant(true)}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Terminal size={14} />
              <span>Ops Command AI</span>
            </button>

            <Link
              to="/employee/alerts"
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <Radio size={14} />
              <span>Broadcast Alert</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px 32px 60px 32px' }}>
          {children}
        </main>
      </div>

      {/* Operations Assistant Command Bar Modal */}
      {showAssistant && (
        <EmployeeAssistantModal
          onClose={() => setShowAssistant(false)}
          onNavigate={(path) => {
            setShowAssistant(false);
            navigate(path);
          }}
        />
      )}
    </div>
  );
}
