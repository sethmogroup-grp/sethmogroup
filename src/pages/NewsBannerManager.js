import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { getNewsBanner, saveNewsBanner } from '../services/contentService';

const NewsBannerManager = () => {
  const [formData, setFormData] = useState({
    title: 'Press Releases and News',
    subtitle: 'Recent News and Events',
    linkText: 'SEE ALL',
    linkUrl: '/news',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getNewsBanner();
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNewsBanner(formData);
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
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Home "Press Releases & News" Banner</h2>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status.message && <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px' }}>{status.message}</div>}

      <p style={{ color: '#718096', fontSize: '13px', marginBottom: '15px' }}>
        This navy banner sits on the homepage right below the "Our Businesses — See All" link and
        takes visitors to the News &amp; Press page. It uses the same blue as the site footer.
      </p>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

        <label>Subtitle</label>
        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleTextChange} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

        <label>Link URL</label>
        <input type="text" name="linkUrl" value={formData.linkUrl} onChange={handleTextChange} style={{ width: '100%', padding: '8px' }} />
      </div>
    </div>
  );
};

export default NewsBannerManager;
