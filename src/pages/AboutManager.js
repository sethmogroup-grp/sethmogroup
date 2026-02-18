import React, { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { getAboutData, saveAboutData } from '../services/contentService';
import './AboutManager.css'; 

const AboutManager = () => {
  const [formData, setFormData] = useState({
    summaryTitle: '',
    summaryText1: '',
    summaryText2: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutData();
        setFormData({
          summaryTitle: data.summaryTitle || '',
          summaryText1: data.summaryText1 || '',
          summaryText2: data.summaryText2 || ''
        });
      } catch (err) {
        setStatus('Error loading about data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      await saveAboutData(formData);
      setStatus('Saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      setStatus('Error saving data');
    }
  };

  if (loading) return <div className="loading-state">Loading About Content...</div>;

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">About Us Manager</h1>
          <p className="page-subtitle">Update the executive summary and company history.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save All Changes
        </button>
      </div>

      {status && (
        <div className={`status-badge ${status.includes('Error') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}

      <div className="form-card" style={{ padding: '30px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: '#d3121b' }}>
          <FileText size={20} /> Executive Summary Content
        </h3>

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Main Title</label>
          <input 
            type="text" 
            name="summaryTitle" 
            value={formData.summaryTitle} 
            onChange={handleChange} 
            placeholder="e.g. Executive Summary"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
          />
        </div>

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Summary Paragraph 1</label>
          <textarea 
            name="summaryText1" 
            value={formData.summaryText1} 
            onChange={handleChange} 
            rows="5"
            placeholder="Focus on the group's vision and sectors..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.6' }} 
          />
        </div>

        <div className="input-group">
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Summary Paragraph 2</label>
          <textarea 
            name="summaryText2" 
            value={formData.summaryText2} 
            onChange={handleChange} 
            rows="5"
            placeholder="Focus on principles like integrity and 'Inspired By You'..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.6' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default AboutManager;