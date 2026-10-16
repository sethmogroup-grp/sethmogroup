import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { getPromisesData, savePromisesData, uploadPromiseFile } from '../services/contentService';

const PromisesManager = () => {
  const [formData, setFormData] = useState({
    titleTop: 'SETHMO GROUP',
    titleBottom: 'promises',
    sectionSubtitle: '',
    promises: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPromisesData();
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

  const handlePromiseChange = (index, field, value) => {
    const updated = [...formData.promises];
    updated[index][field] = value;
    setFormData({ ...formData, promises: updated });
  };

  const addPromise = () => {
    setFormData({
      ...formData,
      promises: [
        ...formData.promises,
        { id: `promise-${Date.now()}`, line1: '', line2: '', image: '' },
      ],
    });
  };

  const removePromise = (index) => {
    const updated = formData.promises.filter((_, i) => i !== index);
    setFormData({ ...formData, promises: updated });
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus({ type: 'info', message: 'Uploading image...' });
    try {
      const { url } = await uploadPromiseFile(file);
      handlePromiseChange(index, 'image', url);
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
      await savePromisesData(formData);
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
        <h2>Home "Sethmo Group Promises" Manager</h2>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status.message && <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px' }}>{status.message}</div>}

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h3>Section Header</h3>
        <label>Top Line (e.g. "SETHMO GROUP")</label>
        <input type="text" name="titleTop" value={formData.titleTop} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <label>Bottom Line (e.g. "promises")</label>
        <input type="text" name="titleBottom" value={formData.titleBottom} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <label>Subtitle</label>
        <textarea name="sectionSubtitle" value={formData.sectionSubtitle} onChange={handleTextChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Promise Tiles ({formData.promises.length})</h3>
        <button onClick={addPromise} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: '#F58634', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Promise
        </button>
      </div>

      <p style={{ color: '#718096', fontSize: '13px', marginBottom: '15px' }}>
        Note: every background image uploaded here automatically gets the Sethmo brand watermark
        pattern applied on top of it at 80% transparency on the live website — you do not need to
        add the watermark yourself.
      </p>

      {formData.promises.map((item, index) => (
        <div key={index} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button onClick={() => removePromise(index)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}>
            <Trash2 size={20} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
            <div>
              <label>Line 1 (e.g. "To be Honest")</label>
              <input type="text" value={item.line1} onChange={(e) => handlePromiseChange(index, 'line1', e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Line 2 / Bold word (e.g. "always.")</label>
              <input type="text" value={item.line2} onChange={(e) => handlePromiseChange(index, 'line2', e.target.value)} style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Background Image</label>
              {item.image && <img src={item.image} alt="bg" style={{ height: '90px', width: '100%', objectFit: 'cover', marginBottom: '10px', display: 'block', borderRadius: '4px' }} />}
              <input type="file" onChange={(e) => handleFileUpload(e, index)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromisesManager;
