import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Briefcase, 
  Leaf, 
  LogOut, 
  Settings,
  Home, 
  Image, 
  Eye, 
  Info, 
  Layers, 
  Users,
  ShieldCheck,
  HeartHandshake 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  // Handle Secure Logout
  const handleLogout = () => {
    // Clear JWT and Session data
    localStorage.removeItem('token');
    // Force redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="admin-logo">SG</div>
        <span className="brand-name">Sethmo Admin</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Main</p>
        
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <p className="nav-label">Content Management</p>

        {/* 1. Home Page Group */}
        <div className="nav-group">
          <div className="nav-group-label">
            <Home size={18} />
            <span>Home Page</span>
          </div>
          <div className="nav-sub-items">
            <NavLink to="/home/hero" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <Image size={16} />
              <span>Hero Section</span>
            </NavLink>
            <NavLink to="/home/vision" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <Eye size={16} />
              <span>Vision Section</span>
            </NavLink>
            <NavLink to="/home/pillars" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <ShieldCheck size={16} />
              <span>7 Strategic Pillars</span>
            </NavLink>
          </div>
        </div>

        {/* 2. Community & News Group */}
        <div className="nav-group">
          <div className="nav-group-label">
            <HeartHandshake size={18} />
            <span>Community</span>
          </div>
          <div className="nav-sub-items">
            <NavLink to="/community/settings" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <Settings size={16} />
              <span>Page Banner & Impact</span>
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <Newspaper size={16} />
              <span>News & Blog Feed</span>
            </NavLink>
          </div>
        </div>

        {/* 3. About Page Group */}
        <div className="nav-group">
          <div className="nav-group-label">
            <Info size={18} />
            <span>About Page</span>
          </div>
          <div className="nav-sub-items">
            <NavLink to="/about/general" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <Settings size={16} />
              <span>General Info</span>
            </NavLink>
            <NavLink to="/about/team" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"}>
              <Users size={16} />
              <span>Team Members</span>
            </NavLink>
          </div>
        </div>

        {/* 4. Other Sectors */}
        <NavLink to="/sectors" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Layers size={20} />
          <span>Sectors / Services</span>
        </NavLink>

        <NavLink to="/careers" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Briefcase size={20} />
          <span>Careers</span>
        </NavLink>

        <NavLink to="/sustainability" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Leaf size={20} />
          <span>Sustainability</span>
        </NavLink>

        <p className="nav-label">System</p>

        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;