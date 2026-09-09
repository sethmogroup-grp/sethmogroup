import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { getHomeBusinessData, saveHomeBusinessData, uploadHomeBusinessFile } from '../services/contentService';

const HomeBusinessManager = () => {
  const [formData, setFormData] = useState({ sectionTitle: '', sectionSubtitle: '', businesses: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getHomeBusinessData();
      setFormData(data);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBusinessChange = (index, field, value) => {
    const updated = [...formData.businesses];
    updated[index][field] = value;
    setFormData({ ...formData, businesses: updated });
  };

  const addBusiness = () => {
    setFormData({
      ...formData,
      businesses: [...formData.businesses, { id: `sector-${Date.now()}`, title: '', logo: '', image: '' }]
    });
  };

  const removeBusiness = (index) => {
    const updated = formData.businesses.filter((_, i) => i !== index);
    setFormData({ ...formData, businesses: updated });
  };

  const handleFileUpload = async (e, index, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus({ type: 'info', message: 'Uploading file...' });
    try {
      const { url } = await uploadHomeBusinessFile(file);
      handleBusinessChange(index, field, url);
      setStatus({ type: 'success', message: 'Upload successful!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Upload failed' });
    } finally {
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHomeBusinessData(formData);
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Home "Our Businesses" Manager</h2>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status.message && <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px' }}>{status.message}</div>}

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h3>Section Header</h3>
        <label>Title</label>
        <input type="text" name="sectionTitle" value={formData.sectionTitle} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <label>Subtitle</label>
        <textarea name="sectionSubtitle" value={formData.sectionSubtitle} onChange={handleTextChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Business Tiles ({formData.businesses.length})</h3>
        <button onClick={addBusiness} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: '#d3121b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Business
        </button>
      </div>

      {formData.businesses.map((biz, index) => (
        <div key={index} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button onClick={() => removeBusiness(index)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}>
            <Trash2 size={20} />
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
            <div>
              <label>ID (Used for tabs, e.g., 'agro')</label>
              <input type="text" value={biz.id} onChange={(e) => handleBusinessChange(index, 'id', e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Title</label>
              <input type="text" value={biz.title} onChange={(e) => handleBusinessChange(index, 'title', e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            
            {/* Logo Upload */}
            <div style={{ background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Logo Image</label>
              {biz.logo && <img src={biz.logo} alt="logo" style={{ height: '40px', objectFit: 'contain', marginBottom: '10px', display: 'block', background: '#000', padding: '5px' }} />}
              <input type="file" onChange={(e) => handleFileUpload(e, index, 'logo')} />
            </div>

            {/* Background Image Upload */}
            <div style={{ background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Background Image</label>
              {biz.image && <img src={biz.image} alt="bg" style={{ height: '60px', width: '100%', objectFit: 'cover', marginBottom: '10px', display: 'block' }} />}
              <input type="file" onChange={(e) => handleFileUpload(e, index, 'image')} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeBusinessManager;