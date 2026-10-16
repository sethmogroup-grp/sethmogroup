import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, Briefcase, Leaf, LogOut, Settings, Home, Image, Info, Layers, Users,
  ShieldCheck, HeartHandshake, Building, Star, Sparkles, GalleryHorizontal, Megaphone, X, Mail,
  Footprints, Smile, Network, LayoutGrid, MailPlus, FileText, UsersRound, PhoneCall, BriefcaseBusiness,
  Send, UserCircle, UserCog
} from 'lucide-react';
import { getUnreadCount } from '../services/contentService';
import { useAuth } from '../services/AuthContext';
import logoLight from '../assets/sethmo-logo-light.png';
import './Sidebar.css';
import './SidebarUser.css';

/**
 * The menu is described as data. `perm` = the permission a user's role must hold to SEE the link
 * (a string, or a list meaning "any of these"). Links without `perm` are for every logged-in user.
 * This only tidies the menu - the server blocks the real requests.
 */
const MENU = [
  { label: 'Main', items: [
    { to: '/', icon: LayoutDashboard, text: 'Dashboard', end: true },
    { to: '/messages', icon: Mail, text: 'Inbox', perm: 'inbox:read', badge: true },
    { to: '/newsletters/send', icon: Send, text: 'Send Newsletter', perm: 'newsletter:send' },
    { to: '/profile', icon: UserCircle, text: 'My Profile' },
  ] },
  { label: 'Content Management', items: [
    { group: 'Home Page', icon: Home, children: [
      { to: '/home/hero', icon: Image, text: 'Hero Section', perm: 'media:manage' },
      { to: '/home/pillars', icon: ShieldCheck, text: '7 Strategic Pillars', perm: 'site:manage' },
      { to: '/home/promises', icon: Sparkles, text: 'Sethmo Group Promises', perm: 'site:manage' },
      { to: '/home/full-bleed', icon: GalleryHorizontal, text: 'Full-Width Banner', perm: 'media:manage' },
      { to: '/home/footprint', icon: Footprints, text: 'Footprint · Vision · Mission', perm: 'site:manage' },
      { to: '/home/customer-centric', icon: Smile, text: 'Customer Centric', perm: 'site:manage' },
      { to: '/home/business-focus', icon: Building, text: 'Business Focus (3D)', perm: 'site:manage' },
      { to: '/home/subsidiaries', icon: Network, text: 'Subsidiaries', perm: 'site:manage' },
      { to: '/home/news-banner', icon: Megaphone, text: 'Press & News Banner', perm: 'news:manage' },
      { to: '/home/highlights', icon: LayoutGrid, text: 'Sethmo Highlights', perm: 'news:manage' },
      { to: '/home/newsletter', icon: MailPlus, text: 'Newsletter Subscribe', perm: 'site:manage' },
    ] },
    { group: 'Community', icon: HeartHandshake, children: [
      { to: '/community/settings', icon: Settings, text: 'Page Banner & Impact', perm: 'community:manage' },
      { to: '/news', icon: Newspaper, text: 'News & Blog Feed', perm: 'news:manage' },
    ] },
    { group: 'Social Impact', icon: Sparkles, children: [
      { to: '/social-impact/goodness-programme', icon: HeartHandshake, text: 'The Goodness Programme', perm: 'community:manage' },
    ] },
    { group: 'About Page', icon: Info, children: [
      { to: '/about/page', icon: FileText, text: 'About Us Page', perm: 'site:manage' },
      { to: '/about/general', icon: Settings, text: 'General Info (legacy)', perm: 'site:manage' },
      { to: '/about/team', icon: Users, text: 'Team Members (legacy)', perm: 'site:manage' },
    ] },
    { to: '/sectors', icon: Layers, text: 'Sectors / Services', perm: 'site:manage' },
    { to: '/expertise', icon: Star, text: 'Our Expertise', perm: 'site:manage' },
    { to: '/careers', icon: Briefcase, text: 'Careers', perm: 'site:manage' },
    { to: '/sustainability', icon: Leaf, text: 'Sustainability', perm: 'site:manage' },
    { to: '/footer', icon: PhoneCall, text: 'Footer & Contact', perm: 'settings:manage' },
    { to: '/agenda-banner', icon: Leaf, text: 'Agenda 2037 Banner', perm: 'site:manage' },
    { to: '/employees', icon: UsersRound, text: 'Employees Page', perm: 'site:manage' },
    { to: '/careers-page', icon: BriefcaseBusiness, text: 'Careers Topics Page', perm: 'site:manage' },
  ] },
  { label: 'System', items: [
    { to: '/users', icon: UserCog, text: 'Users & Roles', perm: 'users:manage' },
    { to: '/settings', icon: Settings, text: 'Settings', perm: 'settings:manage' },
  ] },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { user, can, canAny, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const seesInbox = can('inbox:read');

  // Keep the Inbox badge fresh: every 30s, and instantly when the Inbox page changes something
  useEffect(() => {
    if (!seesInbox) return undefined;
    let alive = true;
    const load = async () => {
      try {
        const data = await getUnreadCount();
        if (alive) setUnread(data.count || 0);
      } catch (e) { /* badge is optional - ignore network errors */ }
    };
    load();
    const timer = setInterval(load, 30000);
    window.addEventListener('sg:inbox-updated', load);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('sg:inbox-updated', load); };
  }, [seesInbox]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Helper function to close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  const allowed = (perm) => !perm || (Array.isArray(perm) ? canAny(...perm) : can(perm));

  const renderLink = (item, sub = false) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) => `nav-item${sub ? ' sub-item' : ''}${isActive ? ' active' : ''}`}
        onClick={handleLinkClick}
      >
        <Icon size={sub ? 16 : 20} />
        <span>{item.text}</span>
        {item.badge && unread > 0 && <span className="nav-badge">{unread > 99 ? '99+' : unread}</span>}
      </NavLink>
    );
  };

  const renderSection = (section) => {
    const nodes = section.items
      .map((item) => {
        if (item.group) {
          const kids = item.children.filter((c) => allowed(c.perm));
          if (kids.length === 0) return null;
          const GroupIcon = item.icon;
          return (
            <div className="nav-group" key={item.group}>
              <div className="nav-group-label"><GroupIcon size={18} /><span>{item.group}</span></div>
              <div className="nav-sub-items">{kids.map((c) => renderLink(c, true))}</div>
            </div>
          );
        }
        return allowed(item.perm) ? renderLink(item) : null;
      })
      .filter(Boolean);

    if (nodes.length === 0) return null; // hide a heading when nothing under it is allowed
    return (
      <React.Fragment key={section.label}>
        <p className="nav-label">{section.label}</p>
        {nodes}
      </React.Fragment>
    );
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img className="admin-logo-img" src={logoLight} alt="Sethmo Group" />
        <span className="brand-name">Admin</span>

        {/* Mobile Close Button */}
        <button className="close-sidebar-btn" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">{MENU.map(renderSection)}</nav>

      <div className="sidebar-footer">
        {user && (
          <NavLink to="/profile" className="sidebar-user" onClick={handleLinkClick} title="Open my profile">
            <span className="sidebar-user-avatar">{(user.name || user.email || '?').charAt(0).toUpperCase()}</span>
            <span className="sidebar-user-text">
              <strong>{user.name || user.email}</strong>
              <small>{user.roleLabel}</small>
            </span>
          </NavLink>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
