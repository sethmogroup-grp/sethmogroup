import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/contentService';
import { Save, Globe, Mail, Share2, ShieldCheck, Lock } from 'lucide-react'; // Added icons
import { changeMyPassword } from '../services/accountService';
import { useAuth } from '../services/AuthContext';
import './SettingsManager.css';

const SettingsManager = () => {
  const { user, updateUser } = useAuth();
  const [config, setConfig] = useState({
    companyEmail: '',
    contactPhone: '',
    officeAddress: '',
    socialLinks: { linkedin: '', facebook: '', twitter: '' },
    siteTitle: '',
    seoDescription: ''
  });
  
  // Separate state for password management
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSettings().then(data => setConfig(data));
  }, []);

  const handleSave = async () => {
    try {
      setStatus('Saving configurations...');
      await saveSettings(config);
      setStatus('Success: Settings updated!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error: Save failed');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus('Error: New passwords do not match');
      return;
    }

    try {
      setStatus('Updating password...');
      // Changes the password of the account you are logged in with (the old code was pinned to
      // localhost and to one fixed admin email)
      const data = await changeMyPassword(passwordData.currentPassword, passwordData.newPassword);
      updateUser(user, data.token); // keep this session signed in
      setStatus('Success: Password changed!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus(`Error: ${err.message || 'Connection failed'}`);
    }
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure global brand details and SEO metadata.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Settings
        </button>
      </div>

      {status && <div className={`status-badge ${status.includes('Error') ? 'error' : 'success'}`}>{status}</div>}

      <div className="settings-grid">
        {/* Security / Change Password Card */}
        <div className="settings-card security-card">
          <div className="card-header"><ShieldCheck size={18} /> <h3>Security</h3></div>
          <form onSubmit={handlePasswordChange}>
            <div className="input-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={passwordData.currentPassword} 
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                required
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={passwordData.newPassword} 
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="settings-card">
          <div className="card-header"><Mail size={18} /> <h3>Contact Details</h3></div>
          <div className="input-group">
            <label>Support Email</label>
            <input type="text" value={config.companyEmail} onChange={(e) => setConfig({...config, companyEmail: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Office Address</label>
            <textarea value={config.officeAddress} onChange={(e) => setConfig({...config, officeAddress: e.target.value})} />
          </div>
        </div>

        {/* Social Links Card */}
        <div className="settings-card">
          <div className="card-header"><Share2 size={18} /> <h3>Social Presence</h3></div>
          <div className="input-group">
            <label>LinkedIn URL</label>
            <input type="text" value={config.socialLinks.linkedin} onChange={(e) => setConfig({...config, socialLinks: {...config.socialLinks, linkedin: e.target.value}})} />
          </div>
          <div className="input-group">
            <label>Facebook URL</label>
            <input type="text" value={config.socialLinks.facebook} onChange={(e) => setConfig({...config, socialLinks: {...config.socialLinks, facebook: e.target.value}})} />
          </div>
        </div>

        {/* SEO Card */}
        <div className="settings-card">
          <div className="card-header"><Globe size={18} /> <h3>SEO & Branding</h3></div>
          <div className="input-group">
            <label>Site Title</label>
            <input type="text" value={config.siteTitle} onChange={(e) => setConfig({...config, siteTitle: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Meta Description</label>
            <textarea value={config.seoDescription} onChange={(e) => setConfig({...config, seoDescription: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;