import React from 'react';
import { Outlet } from 'react-router-dom';
// Changed from '../components/Sidebar' to './Sidebar'
import Sidebar from './Sidebar'; 
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-container" style={{ display: 'flex' }}>
      <Sidebar />
      <main className="admin-content" style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;