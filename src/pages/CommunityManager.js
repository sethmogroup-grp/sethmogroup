import React, { useState, useEffect } from 'react';
import { getCommunitySettings, saveCommunitySettings } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';
import './CommunityManager.css'; // New dedicated CSS

const CommunityManager = () => {
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroSubtext: "",
    impactHeading: "",
    impactBody1: "",
    impactBody2: "",
    projectsLink: "",
    impactImage: ""
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommunitySettings()
      .then(data => {
        if (data) setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleImage = async (file) => {
    if (file) {
      const base64 = await convertToBase64(file);
      handleChange('impactImage', base64);
    }
  };

  const handleSave = async () => {
    try {
      setStatus('Updating Community Page...');
      await saveCommunitySettings(settings);
      setStatus('Success: Community settings updated!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error: Failed to save settings');
    }
  };

  if (loading) return <div className="admin-loader">Syncing Community Settings...</div>;

  return (
    <div className="comm-mgr-container">
      <div className="mgr-header">
        <div className="mgr-title-box">
          <h1 className="mgr-title">Community & Impact</h1>
          <p className="mgr-subtitle">Manage your Thapelo Foundation narrative and page visuals.</p>
        </div>
        <button className="mgr-btn-save" onClick={handleSave}>Publish Changes</button>
      </div>

      {status && (
        <div className={`mgr-status-alert ${status.includes('Error') ? 'err' : 'success'}`}>
          {status}
        </div>
      )}

      <div className="comm-editor-layout">
        {/* HERO SECTION */}
        <div className="comm-editor-card">
          <div className="card-badge">Banner Settings</div>
          <div className="input-group-full">
            <label>Hero Title (Use '&' for Red text split)</label>
            <input 
              type="text" 
              value={settings.heroTitle} 
              onChange={(e) => handleChange('heroTitle', e.target.value)} 
              placeholder="e.g. Community & Insights"
            />
          </div>
          <div className="input-group-full">
            <label>Hero Subtext</label>
            <textarea 
              rows="2" 
              value={settings.heroSubtext} 
              onChange={(e) => handleChange('heroSubtext', e.target.value)} 
            />
          </div>
        </div>

        {/* IMPACT SECTION */}
        <div className="comm-editor-card">
          <div className="card-badge">Impact Narrative (Thapelo Foundation)</div>
          <div className="impact-grid-editor">
            <div className="impact-image-upload">
              <label>Featured Impact Image</label>
              <div className="impact-preview-container">
                {settings.impactImage ? (
                  <img src={settings.impactImage} alt="Impact" />
                ) : (
                  <div className="img-placeholder">Upload Image</div>
                )}
              </div>
              <input type="file" onChange={(e) => handleImage(e.target.files[0])} className="file-input-custom" />
            </div>

            <div className="impact-text-fields">
              <div className="input-group-full">
                <label>Impact Heading</label>
                <input 
                  type="text" 
                  value={settings.impactHeading} 
                  onChange={(e) => handleChange('impactHeading', e.target.value)} 
                />
              </div>
              <div className="input-group-full">
                <label>Narrative Paragraph 1</label>
                <textarea 
                  rows="3" 
                  value={settings.impactBody1} 
                  onChange={(e) => handleChange('impactBody1', e.target.value)} 
                />
              </div>
              <div className="input-group-full">
                <label>Narrative Paragraph 2</label>
                <textarea 
                  rows="3" 
                  value={settings.impactBody2} 
                  onChange={(e) => handleChange('impactBody2', e.target.value)} 
                />
              </div>
              <div className="input-group-full">
                <label>Projects Button URL</label>
                <input 
                  type="text" 
                  value={settings.projectsLink} 
                  onChange={(e) => handleChange('projectsLink', e.target.value)} 
                  placeholder="/projects"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;