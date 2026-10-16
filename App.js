import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Layout & Components
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute, { RequirePermission } from './components/ProtectedRoute';
import { AuthProvider } from './services/AuthContext';

// Pages
import DashboardHome from './pages/DashboardHome';
import NewsManager from './pages/NewsManager';
import CareersManager from './pages/CareersManager';
import HeroManager from './pages/HeroManager';
import PillarsManager from './pages/PillarsManager';
import AboutManager from './pages/AboutManager';
import SectorsManager from './pages/SectorsManager';
import TeamManager from './pages/TeamManager';
import SustainabilityPageManager from './pages/SustainabilityPageManager';
import EmployeesPageManager from './pages/EmployeesPageManager';
import AgendaBannerManager from './pages/AgendaBannerManager';
import FooterManager from './pages/FooterManager';
import CareersPageManager from './pages/CareersPageManager';
import CommunityManager from './pages/CommunityManager';
import SocialImpactManager from './pages/SocialImpactManager';
import SettingsManager from './pages/SettingsManager';
import Login from './pages/Login'; 
import ResetPassword from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import UsersManager from './pages/UsersManager';
import NewsletterSender from './pages/NewsletterSender';
import FootprintManager from './pages/FootprintManager';
import CustomerCentricManager from './pages/CustomerCentricManager';
import BusinessFocusManager from './pages/BusinessFocusManager';
import SubsidiariesManager from './pages/SubsidiariesManager';
import HighlightsManager from './pages/HighlightsManager';
import NewsletterManager from './pages/NewsletterManager';
import AboutPageManager from './pages/AboutPageManager';
import PromisesManager from './pages/PromisesManager';
import FullBleedManager from './pages/FullBleedManager';
import NewsBannerManager from './pages/NewsBannerManager';
import ExpertiseManager from './pages/ExpertiseManager'; 
import MessagesManager from './pages/MessagesManager'; // <-- 1. New Import Added

// Wraps a page so only roles holding the permission can open it (the server checks again on every request)
const guard = (perm, page) => <RequirePermission perm={perm}>{page}</RequirePermission>;

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
          <Route path="messages" element={guard('inbox:read', <MessagesManager />)} /> {/* <-- 2. New Route Added */}
          
          {/* Everyone */}
          <Route path="profile" element={<ProfilePage />} />

          {/* Communications */}
          <Route path="newsletters/send" element={guard('newsletter:send', <NewsletterSender />)} />

          {/* Super Admin only */}
          <Route path="users" element={guard('users:manage', <UsersManager />)} />

          {/* Home Page Group */}
          <Route path="home/hero" element={guard('media:manage', <HeroManager />)} />
          <Route path="home/pillars" element={guard('site:manage', <PillarsManager />)} />
          <Route path="home/footprint" element={guard('site:manage', <FootprintManager />)} />
          <Route path="home/customer-centric" element={guard('site:manage', <CustomerCentricManager />)} />
          <Route path="home/business-focus" element={guard('site:manage', <BusinessFocusManager />)} />
          <Route path="home/subsidiaries" element={guard('site:manage', <SubsidiariesManager />)} />
          <Route path="home/highlights" element={guard('news:manage', <HighlightsManager />)} />
          <Route path="home/newsletter" element={guard('site:manage', <NewsletterManager />)} />
          <Route path="about/page" element={guard('site:manage', <AboutPageManager />)} />
          <Route path="home/promises" element={guard('site:manage', <PromisesManager />)} />
          <Route path="home/full-bleed" element={guard('media:manage', <FullBleedManager />)} />
          <Route path="home/news-banner" element={guard('news:manage', <NewsBannerManager />)} />

          {/* Community Group */}
          <Route path="community/settings" element={guard('community:manage', <CommunityManager />)} />
          <Route path="news" element={guard('news:manage', <NewsManager />)} />

          {/* Social Impact Group */}
          <Route path="social-impact/goodness-programme" element={guard('community:manage', <SocialImpactManager />)} />

          {/* About Page Group */}
          <Route path="about/general" element={guard('site:manage', <AboutManager />)} />
          <Route path="about/team" element={guard('site:manage', <TeamManager />)} />

          {/* Other Routes */}
          <Route path="sectors" element={guard('site:manage', <SectorsManager />)} />
          <Route path="expertise" element={guard('site:manage', <ExpertiseManager />)} />
          <Route path="careers" element={guard('site:manage', <CareersManager />)} />
          <Route path="sustainability" element={guard('site:manage', <SustainabilityPageManager />)} />
          <Route path="employees" element={guard('site:manage', <EmployeesPageManager />)} />
          <Route path="agenda-banner" element={guard('site:manage', <AgendaBannerManager />)} />
          <Route path="footer" element={guard('settings:manage', <FooterManager />)} />
          <Route path="careers-page" element={guard('site:manage', <CareersPageManager />)} />
          <Route path="settings" element={guard('settings:manage', <SettingsManager />)} /> 
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;