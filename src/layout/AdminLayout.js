import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { Menu } from 'lucide-react'; // Import the Hamburger icon
import './AdminLayout.css';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="admin-container">
      {/* Mobile Top Bar - Only visible on small screens */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="admin-logo" style={{ marginRight: '10px' }}>SG</div>
          <span className="brand-name" style={{ color: '#1a1f2c' }}>Sethmo Admin</span>
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