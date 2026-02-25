import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Layout & Components
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import DashboardHome from './pages/DashboardHome';
import NewsManager from './pages/NewsManager';
import CareersManager from './pages/CareersManager';
import HeroManager from './pages/HeroManager';
import VisionManager from './pages/VisionManager';
import PillarsManager from './pages/PillarsManager';
import AboutManager from './pages/AboutManager';
import SectorsManager from './pages/SectorsManager';
import TeamManager from './pages/TeamManager';
import SustainabilityManager from './pages/SustainabilityManager';
import CommunityManager from './pages/CommunityManager';
import SettingsManager from './pages/SettingsManager';
import Login from './pages/Login'; 
import HomeBusinessManager from './pages/HomeBusinessManager';
import ExpertiseManager from './pages/ExpertiseManager'; 
import MessagesManager from './pages/MessagesManager'; // <-- 1. New Import Added

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="messages" element={<MessagesManager />} /> {/* <-- 2. New Route Added */}
          
          {/* Home Page Group */}
          <Route path="home/hero" element={<HeroManager />} />
          <Route path="home/vision" element={<VisionManager />} />
          <Route path="home/pillars" element={<PillarsManager />} />
          <Route path="home/businesses" element={<HomeBusinessManager />} /> 

          {/* Community Group */}
          <Route path="community/settings" element={<CommunityManager />} />
          <Route path="news" element={<NewsManager />} />

          {/* About Page Group */}
          <Route path="about/general" element={<AboutManager />} />
          <Route path="about/team" element={<TeamManager />} />

          {/* Other Routes */}
          <Route path="sectors" element={<SectorsManager />} />
          <Route path="expertise" element={<ExpertiseManager />} />
          <Route path="careers" element={<CareersManager />} />
          <Route path="sustainability" element={<SustainabilityManager />} />
          <Route path="settings" element={<SettingsManager />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;