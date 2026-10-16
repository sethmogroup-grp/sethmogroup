import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { Menu } from 'lucide-react'; // Import the Hamburger icon
import logoDark from '../assets/sethmo-logo.png';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="admin-container">
      {/* Mobile Top Bar - Only visible on small screens */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoDark} alt="Sethmo Group" style={{ height: '48px', width: 'auto', marginRight: '10px' }} />
          <span className="brand-name">Admin</span>
        </div>
        <button className="hamburger-btn" onClick={() => setIsMobileOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Dark Overlay when sidebar is open on mobile */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* Pass the state to the Sidebar */}
      <Sidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
      
      <main className="admin-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;