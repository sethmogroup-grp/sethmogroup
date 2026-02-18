import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, FileText, Upload, Trash2 } from 'lucide-react';
import { getVisionData, saveVisionData } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';

const VisionManager = () => {
  const [formData, setFormData] = useState({
    missionText: '',
    visionText: '',
    tagline: '',
    imageUrl: ''
  });
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVisionData();
        setFormData(data);
        setPreview(data.imageUrl);
      } catch (err) {
        setStatus('Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, imageUrl: base64 });
        setPreview(base64);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to process image.");
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setPreview('');
  };

  const handleSave = async () => {
    try {
      await saveVisionData(formData);
      setStatus('Saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      setStatus('Error saving data');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vision Section Manager</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      {status && <div className={`badge badge-${status.includes('Error') ? 'error' : 'success'}`} style={{ marginBottom: '20px' }}>{status}</div>}

      <div className="table-container" style={{ padding: '30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          
          {/* Left Col: Text Inputs */}
          <div>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#d3121b" /> Text Content
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Mission Statement</label>
              <textarea name="missionText" value={formData.missionText} onChange={handleChange} rows="4" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Vision Statement</label>
              <textarea name="visionText" value={formData.visionText} onChange={handleChange} rows="4" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Tagline</label>
              <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          {/* Right Col: Image Upload Gallery */}
          <div>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ImageIcon size={20} color="#d3121b" /> Side Image
            </h3>

            <input 
              type="file" 
              id="vision-upload" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />

            <div style={{ 
              width: '100%', 
              height: '250px', 
              borderRadius: '12px', 
              border: '2px dashed #e2e8f0',
              overflow: 'hidden',
              position: 'relative',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }} onClick={() => document.getElementById('vision-upload').click()}>
              
              {preview ? (
                <>
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', bottom: '10px', right: '10px', 
                    display: 'flex', gap: '10px' 
                  }}>
                    <button onClick={(e) => { e.stopPropagation(); document.getElementById('vision-upload').click(); }} 
                      className="btn btn-primary" style={{ padding: '8px', fontSize: '12px' }}>Change</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} 
                      className="btn btn-outline" style={{ padding: '8px', background: 'white', color: 'red', borderColor: 'red' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={40} color="#cbd5e0" />
                  <p style={{ marginTop: '10px', color: '#718096', fontWeight: '600' }}>Click to Upload</p>
                  <small style={{ color: '#a0aec0' }}>JPG, PNG (Max 2MB)</small>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisionManager;