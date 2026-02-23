import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { getExpertiseData, saveExpertiseData, uploadFile } from '../services/contentService';

const ExpertiseManager = () => {
  const [formData, setFormData] = useState({ sectionTitle: '', sectionSubtitle: '', items: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getExpertiseData();
      // Ensure items array exists even if database returns null
      setFormData({
        sectionTitle: data.sectionTitle || '',
        sectionSubtitle: data.sectionSubtitle || '',
        items: data.items || []
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to load Expertise data' });
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { title: '', description: '', image: '' }]
    });
  };

  const removeItem = (index) => {
    if (window.confirm("Are you sure you want to remove this expertise? Remember to click 'Save Changes' after!")) {
      const updated = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: updated });
    }
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus({ type: 'info', message: 'Uploading image...' });
    try {
      // Using your generic uploadFile function from contentService
      const { url } = await uploadFile(file, 'expertise');
      handleItemChange(index, 'image', url);
      setStatus({ type: 'success', message: 'Image uploaded successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Image upload failed' });
    } finally {
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveExpertiseData(formData);
      setStatus({ type: 'success', message: 'Expertise section saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Expertise Manager...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Expertise Manager</h2>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status.message && (
        <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px', padding: '10px', borderRadius: '4px', background: status.type === 'error' ? '#fed7d7' : status.type === 'success' ? '#c6f6d5' : '#e2e8f0', color: status.type === 'error' ? '#9b2c2c' : status.type === 'success' ? '#22543d' : '#2d3748' }}>
          {status.message}
        </div>
      )}

      {/* Section Header Editor */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h3>Section Header</h3>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
        <input type="text" name="sectionTitle" value={formData.sectionTitle} onChange={handleTextChange} style={{ width: '100%', marginBottom: '15px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subtitle</label>
        <textarea name="sectionSubtitle" value={formData.sectionSubtitle} onChange={handleTextChange} style={{ width: '100%', padding: '10px', minHeight: '80px', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      {/* Expertise Items List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Expertise Items ({formData.items.length})</h3>
        <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: '#d3121b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Expertise
        </button>
      </div>

      {formData.items.map((item, index) => (
        <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button onClick={() => removeItem(index)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}>
            <Trash2 size={20} />
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Expertise Title</label>
              <input type="text" value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="e.g., Agribusiness Innovation" />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} style={{ width: '100%', padding: '10px', minHeight: '80px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Detail the expertise here..." />
            </div>
            
            <div style={{ background: '#fff', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Representative Image or Icon</label>
              {item.image && <img src={item.image} alt="preview" style={{ height: '80px', objectFit: 'contain', marginBottom: '10px', display: 'block', borderRadius: '4px' }} />}
              <input type="file" onChange={(e) => handleFileUpload(e, index)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpertiseManager;