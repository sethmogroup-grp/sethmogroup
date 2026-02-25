import React, { useState, useEffect } from 'react';
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
  Mail // Added the Mail icon
} from 'lucide-react';
import { getDashboardStats, getMessages } from '../services/contentService';
import './DashboardHome.css';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    newsCount: 0,
    jobsCount: 0,
    teamCount: 0,
    recentActivity: []
  });
  const [unreadCount, setUnreadCount] = useState(0); // State for unread messages
  const [loading, setLoading] = useState(true);

  // Fetch both Stats AND Messages at the same time
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, messagesData] = await Promise.all([
          getDashboardStats(),
          getMessages()
        ]);
        
        setStats(statsData);
        
        // Filter out only the messages that haven't been read yet
        const unread = messagesData.filter(m => !m.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Navigation Helper
  const goTo = (path) => navigate(path);

  if (loading) return (
    <div className="admin-loader-container">
      <div className="admin-loader"></div>
      <p>Syncing System Overview...</p>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* 1. Welcome Header */}
      <div className="dash-header-modern">
        <div>
          <h1 className="dash-title">System <span className="text-red">Overview</span></h1>
          <p className="dash-subtitle">Welcome back. Here is what’s happening across Sethmo Group today.</p>
        </div>
        <div className="header-time">
          <Clock size={16} />
          <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="stats-container-modern">
        <div className="metric-card" onClick={() => goTo('/news')}>
          <div className="metric-icon blue"><FileText size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">News Articles</span>
            <h2 className="metric-value">{stats.newsCount}</h2>
          </div>
        </div>

        <div className="metric-card" onClick={() => goTo('/careers')}>
          <div className="metric-icon red"><Briefcase size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Open Positions</span>
            <h2 className="metric-value">{stats.jobsCount.toString().padStart(2, '0')}</h2>
          </div>
        </div>

        <div className="metric-card" onClick={() => goTo('/about/team')}>
          <div className="metric-icon yellow"><Users size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Team Members</span>
            <h2 className="metric-value">{stats.teamCount}</h2>
          </div>
        </div>

        {/* THE NEW UNREAD MESSAGES CARD */}
        <div className="metric-card" onClick={() => goTo('/messages')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon green"><Mail size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Unread Messages</span>
            <h2 className="metric-value text-green">{unreadCount}</h2>
          </div>
        </div>

        {/* THE RESTORED SYSTEM STATUS CARD */}
        <div className="metric-card">
          <div className="metric-icon green"><Activity size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">System Status</span>
            <h2 className="metric-value text-green">Live</h2>
          </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="dash-grid-main">
        {/* Recent Activity Table */}
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

        {/* Quick Actions Card */}
        <div className="dash-card shortcuts-card">
          <div className="card-header-modern">
            <h3>Quick Actions</h3>
          </div>
          <div className="shortcut-buttons">
            <button className="shortcut-btn" onClick={() => goTo('/messages')}>
              <Mail size={18} />
              <span>Check Inbox</span>
            </button>
            <button className="shortcut-btn" onClick={() => goTo('/news')}>
              <PlusCircle size={18} />
              <span>Post News</span>
            </button>
            <button className="shortcut-btn" onClick={() => goTo('/about/team')}>
              <UserPlus size={18} />
              <span>Add Team Member</span>
            </button>
            <button className="shortcut-btn" onClick={() => goTo('/home/hero')}>
              <Layout size={18} />
              <span>Update Hero</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;