import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { getFullBleedData, saveFullBleedData, uploadFullBleedFile } from '../services/contentService';

const FullBleedManager = () => {
  const [formData, setFormData] = useState({
    image: '',
    eyebrow: '',
    title: '',
    linkText: '',
    linkUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getFullBleedData();
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus({ type: 'info', message: 'Uploading image...' });
    try {
      const { url } = await uploadFullBleedFile(file);
      setFormData((prev) => ({ ...prev, image: url }));
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
      await saveFullBleedData(formData);
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
        <h2>Home "Full-Width Showcase" Manager</h2>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status.message && <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px' }}>{status.message}</div>}

      <p style={{ color: '#718096', fontSize: '13px', marginBottom: '15px' }}>
        This image fills the full width of the screen edge-to-edge on the homepage, right below
        the Sethmo Group Promises section. Use a wide image (similar shape to the sample supplied),
        roughly 2500px wide by 850px tall, for the best result.
      </p>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Full-Width Image</label>
        {formData.image && (
          <img src={formData.image} alt="preview" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', marginBottom: '10px', display: 'block', borderRadius: '4px' }} />
        )}
        <input type="file" onChange={handleFileUpload} />

        <div style={{ marginTop: '20px' }}>
          <label>Eyebrow Text (optional, small text above the title)</label>
          <input type="text" name="eyebrow" value={formData.eyebrow} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

          <label>Title (optional, overlaid on the image)</label>
          <input type="text" name="title" value={formData.title} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

          <label>Button Text (optional)</label>
          <input type="text" name="linkText" value={formData.linkText} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

          <label>Link URL (optional — where the whole banner links to, e.g. /services)</label>
          <input type="text" name="linkUrl" value={formData.linkUrl} onChange={handleTextChange} style={{ width: '100%', padding: '8px' }} />
        </div>
      </div>
    </div>
  );
};

export default FullBleedManager;
