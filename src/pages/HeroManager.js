import React, { useState, useEffect } from 'react';
import { Save, Video, Image, Type, Link2, Palette } from 'lucide-react';
import { getHeroSettings, updateHeroSettings, uploadHeroFile } from '../services/contentService';

const HeroManager = () => {
  const [formData, setFormData] = useState({
    mediaType: 'video', // 'video' or 'image'
    videoUrl: '',
    imageUrl: '',
    button1Text: 'Explore Our Sectors',
    button1Link: '/services',
    button2Text: 'Partner With Us',
    button2Link: '/contact',
    overlayColor: 'linear-gradient(to bottom, rgba(4,64,102,0.2), rgba(4,64,102,0.8))'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getHeroSettings();
        setFormData(data);
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMediaTypeChange = (type) => {
    setFormData({ ...formData, mediaType: type });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setStatus({ type: 'info', message: 'Uploading...' });
      const { url } = await uploadHeroFile(file);
      // Update the appropriate URL field
      setFormData({ ...formData, [type === 'video' ? 'videoUrl' : 'imageUrl']: url });
      setStatus({ type: 'success', message: 'File uploaded successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Upload failed' });
    } finally {
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHeroSettings(formData);
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  if (loading) return <div className="loading">Loading hero settings...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hero Section Manager</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status.message && (
        <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px' }}>
          {status.message}
        </div>
      )}

      <div className="table-container" style={{ padding: '30px' }}>

        {/* Media Type Toggle */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px' }}>Media Type</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={formData.mediaType === 'video'}
                onChange={() => handleMediaTypeChange('video')}
              /> Video Background
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={formData.mediaType === 'image'}
                onChange={() => handleMediaTypeChange('image')}
              /> Image Background
            </label>
          </div>
        </div>

        {/* Video Settings (shown only if mediaType === 'video') */}
        {formData.mediaType === 'video' && (
          <>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video size={20} color="#d3121b" /> Background Video
            </h3>

            {/* Upload Option */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px' }}>Upload New Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'video')}
                style={{ display: 'block', width: '100%', fontSize: '14px' }}
              />
            </div>

            {/* Video URL Option */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Video URL (if already hosted)</label>
              <input
                type="text"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://example.com/video.mp4"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>

            {/* Video Preview */}
            {formData.videoUrl && (
              <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', height: '200px', background: '#000' }}>
                <video
                  src={formData.videoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  controls
                  muted
                />
              </div>
            )}
          </>
        )}

        {/* Image Settings (shown only if mediaType === 'image') */}
        {formData.mediaType === 'image' && (
          <>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Image size={20} color="#d3121b" /> Background Image
            </h3>

            {/* Upload Option */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '15px' }}>Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'image')}
                style={{ display: 'block', width: '100%', fontSize: '14px' }}
              />
            </div>

            {/* Image URL Option */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', height: '200px', background: '#000' }}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </>
        )}

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '30px 0' }} />

        {/* Button Settings */}
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Type size={20} color="#d3121b" /> Button Content & Links
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Primary Button */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              <Type size={16} style={{ marginRight: '5px' }} /> Primary Button Text
            </label>
            <input
              type="text"
              name="button1Text"
              value={formData.button1Text}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <label style={{ display: 'block', fontWeight: '600', marginTop: '15px', marginBottom: '8px' }}>
              <Link2 size={16} style={{ marginRight: '5px' }} /> Primary Button Link
            </label>
            <input
              type="text"
              name="button1Link"
              value={formData.button1Link}
              onChange={handleChange}
              placeholder="/services"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>

          {/* Secondary Button */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              <Type size={16} style={{ marginRight: '5px' }} /> Secondary Button Text
            </label>
            <input
              type="text"
              name="button2Text"
              value={formData.button2Text}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <label style={{ display: 'block', fontWeight: '600', marginTop: '15px', marginBottom: '8px' }}>
              <Link2 size={16} style={{ marginRight: '5px' }} /> Secondary Button Link
            </label>
            <input
              type="text"
              name="button2Link"
              value={formData.button2Link}
              onChange={handleChange}
              placeholder="/contact"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '30px 0' }} />

        {/* Overlay Color */}
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Palette size={20} color="#d3121b" /> Overlay Gradient
        </h3>
        <div>
          <input
            type="text"
            name="overlayColor"
            value={formData.overlayColor}
            onChange={handleChange}
            placeholder="linear-gradient(...)"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
            Use a CSS gradient or color value. Example: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroManager;