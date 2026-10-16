import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Briefcase,
  Activity,
  Clock,
  ChevronRight,
  PlusCircle,
  Layout,
  UserPlus,
  Mail,
  Eye,
  UserCheck,
  Timer,
  MousePointerClick,
  MailPlus,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import {
  getDashboardStats,
  getMessages,
  getAnalyticsSummary,
  getRecentVisits
} from '../services/contentService';
import { LineAreaChart, BarChart, HBarList, Donut, COLORS } from '../components/Charts';
import { useAuth } from '../services/AuthContext';
import './DashboardHome.css';

/* ---------- small formatting helpers ---------- */
const fmtDuration = (s = 0) => {
  s = Math.round(s);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}m ${r}s` : `${m}m`;
};

const fmtShortDate = (key) => {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const fmtHour = (h) => `${String(h).padStart(2, '0')}:00`;

const countryName = (code) => {
  if (!code || code === 'Unknown') return 'Unknown';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch (e) {
    return code;
  }
};

const timeAgo = (iso) => {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// "▲ 12% vs yesterday" helper
const Delta = ({ now, before }) => {
  if (!before && !now) return <span className="delta flat">No traffic yet</span>;
  if (!before) return <span className="delta up"><TrendingUp size={13} /> {now} new vs yesterday</span>;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return <span className="delta flat">Same as yesterday</span>;
  return (
    <span className={`delta ${pct > 0 ? 'up' : 'down'}`}>
      {pct > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(pct)}% vs yesterday
    </span>
  );
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { can } = useAuth(); // each role only loads and sees what it is allowed to
  const [stats, setStats] = useState({ newsCount: 0, jobsCount: 0, teamCount: 0, recentActivity: [] });
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [visits, setVisits] = useState([]);
  const [analyticsError, setAnalyticsError] = useState('');
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    // allSettled: if analytics is down the rest of the dashboard still loads
    const [statsRes, msgRes, anaRes, visitRes] = await Promise.allSettled([
      getDashboardStats(),
      can('inbox:read') ? getMessages() : Promise.resolve([]),
      can('analytics:view') ? getAnalyticsSummary(days) : Promise.resolve(null),
      can('analytics:view') ? getRecentVisits(12) : Promise.resolve([])
    ]);

    if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    else console.error('Dashboard stats error:', statsRes.reason);

    if (msgRes.status === 'fulfilled') setMessages(msgRes.value);

    if (anaRes.status === 'fulfilled') {
      setAnalytics(anaRes.value);
      setAnalyticsError('');
    } else {
      console.error('Analytics error:', anaRes.reason);
      setAnalyticsError('Website analytics could not be loaded. Make sure the server has been updated and restarted.');
    }

    if (visitRes.status === 'fulfilled') setVisits(visitRes.value);

    setUpdatedAt(new Date());
    setLoading(false);
    setRefreshing(false);
  }, [days, can]);

  // Load on mount / when the date range changes, then refresh every 30 seconds
  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), 30000);
    return () => clearInterval(timer);
  }, [load]);

  const goTo = (path) => navigate(path);

  if (loading) return (
    <div className="admin-loader-container">
      <div className="admin-loader"></div>
      <p>Syncing System Overview...</p>
    </div>
  );

  const a = analytics;
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const latestMessages = messages.slice(0, 5);
  const nowHour = a ? Number(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', hour12: false, timeZone: a.timezone })) % 24 : null;

  return (
    <div className="dashboard-wrapper">
      {/* 1. Welcome Header */}
      <div className="dash-header-modern">
        <div>
          <h1 className="dash-title">System <span className="text-accent">Overview</span></h1>
          <p className="dash-subtitle">Welcome back. Here is what’s happening across Sethmo Group today.</p>
        </div>
        <div className="header-actions">
          <div className="live-pill" title="The dashboard refreshes itself every 30 seconds">
            <span className={`live-dot ${refreshing ? 'pulse' : ''}`} />
            Live{updatedAt ? ` · ${updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : ''}
            <button className="refresh-btn" onClick={() => load(true)} aria-label="Refresh now">
              <RefreshCw size={14} className={refreshing ? 'spin-icon' : ''} />
            </button>
          </div>
          <div className="header-time">
            <Clock size={16} />
            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* 2. Website traffic - today */}
      {can('analytics:view') && (
        <div className="section-title-row">
          <h2 className="section-title">Website Traffic <span>· Today</span></h2>
        </div>
      )}

      {can('analytics:view') && analyticsError && <div className="dash-alert">{analyticsError}</div>}

      {a && (
        <div className="stats-container-modern">
          <div className="metric-card tall">
            <div className="metric-icon orange"><Eye size={24} /></div>
            <div className="metric-info">
              <span className="metric-label">Visits Today</span>
              <h2 className="metric-value">{a.today.views}</h2>
              <Delta now={a.today.views} before={a.yesterday.views} />
            </div>
          </div>

          <div className="metric-card tall">
            <div className="metric-icon navy"><UserCheck size={24} /></div>
            <div className="metric-info">
              <span className="metric-label">Unique Visitors</span>
              <h2 className="metric-value">{a.today.visitors}</h2>
              <Delta now={a.today.visitors} before={a.yesterday.visitors} />
            </div>
          </div>

          <div className="metric-card tall">
            <div className="metric-icon orange"><Timer size={24} /></div>
            <div className="metric-info">
              <span className="metric-label">Avg. Time on Site</span>
              <h2 className="metric-value">{fmtDuration(a.today.avgSeconds)}</h2>
              <span className="delta flat">{fmtDuration(a.period.avgSeconds)} avg · last {a.days} days</span>
            </div>
          </div>

          <div className="metric-card tall">
            <div className="metric-icon navy"><MousePointerClick size={24} /></div>
            <div className="metric-info">
              <span className="metric-label">Engagement Rate</span>
              <h2 className="metric-value">{a.period.engagementRate}%</h2>
              <span className="delta flat">Stayed 10s+ or scrolled 50%+</span>
            </div>
          </div>

          <div className="metric-card tall" onClick={() => goTo('/messages')}>
            <div className="metric-icon orange"><Mail size={24} /></div>
            <div className="metric-info">
              <span className="metric-label">Unread Messages</span>
              <h2 className="metric-value">{unreadCount}</h2>
              <span className="delta flat">{a.today.messages} new today</span>
            </div>
          </div>

          <div className="metric-card tall" onClick={() => goTo('/home/newsletter')}>
            <div className="metric-icon navy"><MailPlus size={24} /></div>
            <div className="metric-info">
              <span className="metric-label">Newsletter Sign-ups</span>
              <h2 className="metric-value">{a.today.subscribers}</h2>
              <span className="delta flat">{a.inbox.totalSubscribers} subscribers in total</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Graphs */}
      {a && (
        <>
          <div className="section-title-row">
            <h2 className="section-title">Trends <span>· Last {a.days} days</span></h2>
            <div className="range-switch">
              {[7, 14, 30].map((d) => (
                <button key={d} className={days === d ? 'active' : ''} onClick={() => setDays(d)}>{d}D</button>
              ))}
            </div>
          </div>

          <div className="charts-grid">
            <div className="dash-card span-2">
              <div className="card-header-modern">
                <h3>Visits &amp; Visitors</h3>
                <span className="card-note">{a.period.views} visits · {a.period.visitors} unique visitors</span>
              </div>
              <LineAreaChart
                data={a.daily}
                xKey="date"
                formatX={fmtShortDate}
                formatTip={(k) => new Date(k + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                series={[
                  { key: 'views', label: 'Visits (page views)', color: COLORS.orange },
                  { key: 'visitors', label: 'Unique visitors', color: COLORS.navy }
                ]}
              />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>Today by Hour</h3><span className="card-note">{a.timezone}</span></div>
              <BarChart
                data={a.hourly}
                xKey="hour"
                yKey="views"
                label="Visits"
                formatX={fmtHour}
                highlight={nowHour}
                width={380}
                height={300}
              />
            </div>

            <div className="dash-card span-2">
              <div className="card-header-modern">
                <h3>Messages &amp; Newsletter Sign-ups</h3>
                <span className="card-note">{a.period.messages} messages · {a.period.subscribers} sign-ups</span>
              </div>
              <LineAreaChart
                data={a.daily}
                xKey="date"
                formatX={fmtShortDate}
                height={220}
                formatTip={(k) => new Date(k + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                series={[
                  { key: 'messages', label: 'Contact messages', color: COLORS.orange },
                  { key: 'subscribers', label: 'Newsletter sign-ups', color: COLORS.navy }
                ]}
              />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>New vs Returning</h3></div>
              <Donut
                centerLabel="Visitors"
                items={[
                  { name: 'New visitors', value: a.visitorTypes.new },
                  { name: 'Returning', value: a.visitorTypes.returning }
                ].filter((i) => i.value > 0)}
              />
            </div>
          </div>

          <div className="charts-grid three">
            <div className="dash-card">
              <div className="card-header-modern"><h3>Top Pages</h3></div>
              <HBarList items={a.topPages} formatName={(p) => (p === '/' ? 'Home  ( / )' : p)} suffix=" views" />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>Devices</h3></div>
              <Donut centerLabel="Visits" items={a.devices.map((d) => ({ name: d.name, value: d.views }))} />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>Where Visitors Come From</h3></div>
              <HBarList items={a.referrers} color={COLORS.navy} suffix=" visits" />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>Countries</h3></div>
              <HBarList items={a.countries} formatName={countryName} suffix=" visits" />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>Browsers</h3></div>
              <HBarList items={a.browsers} color={COLORS.navy} suffix=" visits" />
            </div>

            <div className="dash-card">
              <div className="card-header-modern"><h3>Operating Systems</h3></div>
              <Donut centerLabel="Visits" items={a.systems.map((d) => ({ name: d.name, value: d.views }))} />
            </div>
          </div>
        </>
      )}

      {/* 4. Visitor details */}
      {a && (
        <div className="dash-card visitors-card">
          <div className="card-header-modern">
            <h3>Latest Visitors</h3>
            <span className="card-note">Anonymous · no names or IP addresses are stored</span>
          </div>
          <div className="modern-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Page</th>
                  <th>Device</th>
                  <th>Country</th>
                  <th>Source</th>
                  <th>Time on page</th>
                  <th>Scrolled</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {visits.length > 0 ? visits.map((v) => (
                  <tr key={v._id}>
                    <td title={new Date(v.createdAt).toLocaleString()}>{timeAgo(v.createdAt)}</td>
                    <td className="font-bold">{v.path}</td>
                    <td>{v.device} · {v.browser} <span className="muted">({v.os})</span></td>
                    <td>{v.country ? countryName(v.country) : (v.timezone ? v.timezone.split('/').pop().replace(/_/g, ' ') : '—')}</td>
                    <td>{v.referrerHost || 'Direct'}</td>
                    <td>{v.duration ? fmtDuration(v.duration) : '—'}</td>
                    <td>{v.maxScroll ? `${v.maxScroll}%` : '—'}</td>
                    <td><span className={`type-pill ${v.newVisitor ? 'new' : ''}`}>{v.newVisitor ? 'New' : 'Returning'}</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center-empty">No visits recorded yet. Open the public website and they will appear here within seconds.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Content */}
      {can('news:manage') || can('site:manage') ? (<>
      <div className="section-title-row">
        <h2 className="section-title">Content</h2>
      </div>
      <div className="stats-container-modern">
        <div className="metric-card" onClick={() => can('news:manage') && goTo('/news')}>
          <div className="metric-icon blue"><FileText size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">News Articles</span>
            <h2 className="metric-value">{stats.newsCount}</h2>
          </div>
        </div>

        <div className="metric-card" onClick={() => can('site:manage') && goTo('/careers')}>
          <div className="metric-icon orange"><Briefcase size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Open Positions</span>
            <h2 className="metric-value">{(stats.jobsCount || 0).toString().padStart(2, '0')}</h2>
          </div>
        </div>

        <div className="metric-card" onClick={() => can('site:manage') && goTo('/about/team')}>
          <div className="metric-icon yellow"><Users size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Team Members</span>
            <h2 className="metric-value">{stats.teamCount}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green"><Activity size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">System Status</span>
            <h2 className="metric-value text-green">Live</h2>
          </div>
        </div>
      </div>
      </>) : null}

      {/* 6. Inbox preview + activity + shortcuts */}
      <div className="dash-grid-main">
        <div className="dash-column">
          {can('inbox:read') && (
          <div className="dash-card inbox-preview">
            <div className="card-header-modern">
              <h3>Latest Messages</h3>
              <button className="view-all-btn" onClick={() => goTo('/messages')}>Open Inbox <ChevronRight size={14} /></button>
            </div>
            {latestMessages.length > 0 ? (
              <ul className="msg-preview-list">
                {latestMessages.map((m) => (
                  <li key={m._id} className={m.isRead ? '' : 'unread'} onClick={() => goTo('/messages')}>
                    <div className="msg-avatar">{(m.name || '?').charAt(0).toUpperCase()}</div>
                    <div className="msg-text">
                      <strong>{m.name}</strong>
                      <span>{m.subject || 'No Subject'}</span>
                    </div>
                    <div className="msg-meta">
                      {m.type === 'newsletter' && <em className="msg-tag">Newsletter</em>}
                      <small>{timeAgo(m.createdAt)}</small>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center-empty">No messages yet.</p>
            )}
          </div>
          )}

          {can('logs:view') && (
          <div className="dash-card recent-activity">
            <div className="card-header-modern">
              <h3>Recent Content Updates</h3>
              <button className="view-all-btn">Activity Log <ChevronRight size={14} /></button>
            </div>
            <div className="modern-table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Source</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity && stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((log, i) => (
                      <tr key={i}>
                        <td className="font-bold">{log.action}</td>
                        <td><span className="source-pill">{log.source}</span></td>
                        <td>{log.time}</td>
                        <td><span className="status-indicator active">Live</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center-empty">No recent logs found. Start editing to see activity.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dash-card shortcuts-card">
          <div className="card-header-modern">
            <h3>Quick Actions</h3>
          </div>
          <div className="shortcut-buttons">
            {can('inbox:read') && (
            <button className="shortcut-btn" onClick={() => goTo('/messages')}>
              <Mail size={18} />
              <span>Check Inbox</span>
            </button>
            )}
            {can('news:manage') && (
            <button className="shortcut-btn" onClick={() => goTo('/news')}>
              <PlusCircle size={18} />
              <span>Post News</span>
            </button>
            )}
            {can('site:manage') && (
            <button className="shortcut-btn" onClick={() => goTo('/about/team')}>
              <UserPlus size={18} />
              <span>Add Team Member</span>
            </button>
            )}
            {can('media:manage') && (
            <button className="shortcut-btn" onClick={() => goTo('/home/hero')}>
              <Layout size={18} />
              <span>Update Hero</span>
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
