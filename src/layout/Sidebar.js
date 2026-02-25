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
  HeartHandshake,
  Building,
  Star,
  X,
  Mail // <-- Added the Mail icon here!
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  // Helper function to close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="admin-logo">SG</div>
        <span className="brand-name">Sethmo Admin</span>
        
        {/* Mobile Close Button */}
        <button className="close-sidebar-btn" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Main</p>
        
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* --- ADDED INBOX LINK --- */}
        <NavLink to="/messages" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
          <Mail size={20} />
          <span>Inbox</span>
        </NavLink>

        <p className="nav-label">Content Management</p>

        {/* 1. Home Page Group */}
        <div className="nav-group">
          <div className="nav-group-label">
            <Home size={18} />
            <span>Home Page</span>
          </div>
          <div className="nav-sub-items">
            <NavLink to="/home/hero" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <Image size={16} />
              <span>Hero Section</span>
            </NavLink>
            <NavLink to="/home/vision" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <Eye size={16} />
              <span>Vision Section</span>
            </NavLink>
            <NavLink to="/home/pillars" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <ShieldCheck size={16} />
              <span>7 Strategic Pillars</span>
            </NavLink>
            <NavLink to="/home/businesses" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <Building size={16} />
              <span>Our Businesses</span>
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
            <NavLink to="/community/settings" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <Settings size={16} />
              <span>Page Banner & Impact</span>
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
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
            <NavLink to="/about/general" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <Settings size={16} />
              <span>General Info</span>
            </NavLink>
            <NavLink to="/about/team" className={({ isActive }) => isActive ? "nav-item sub-item active" : "nav-item sub-item"} onClick={handleLinkClick}>
              <Users size={16} />
              <span>Team Members</span>
            </NavLink>
          </div>
        </div>

        {/* 4. Other Sectors */}
        <NavLink to="/sectors" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
          <Layers size={20} />
          <span>Sectors / Services</span>
        </NavLink>

        {/* 5. Expertise */}
        <NavLink to="/expertise" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
          <Star size={20} />
          <span>Our Expertise</span>
        </NavLink>

        <NavLink to="/careers" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
          <Briefcase size={20} />
          <span>Careers</span>
        </NavLink>

        <NavLink to="/sustainability" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
          <Leaf size={20} />
          <span>Sustainability</span>
        </NavLink>

        <p className="nav-label">System</p>

        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={handleLinkClick}>
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