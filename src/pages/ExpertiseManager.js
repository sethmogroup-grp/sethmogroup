import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DownloadCloud } from 'lucide-react';
import { getExpertiseData, saveExpertiseData, uploadExpertiseFile } from '../services/contentService';

// WE PUT THE DATA DIRECTLY HERE SO THE ADMIN PANEL CAN FIND IT!
const hardcodedSectors = [
  {
    slug: "branding",
    title: "Branding & Design",
    description: "Comprehensive corporate branding solutions that define your identity. From visual strategy to physical assets, we make your brand unforgettable.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
    details: "We offer branding of all kinds to suit diverse business needs. Our expertise spans corporate identity creation, vehicle branding, indoor and outdoor signage, and a wide range of promotional materials designed to ensure a consistent and professional image across all touchpoints."
  },
  {
    slug: "agriculture",
    title: "Agribusiness",
    description: "Sustainable farming and agricultural solutions focused on food security, empowering local farmers, and producing high-quality yields.",
    image: "https://images.unsplash.com/photo-1625246333195-5840507997ab?auto=format&fit=crop&q=80&w=1000",
    details: "We leverage modern farming techniques to maximize yield while preserving the environment. Our agribusiness division supports local farmers with resources, training, and market access."
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    description: "State-of-the-art production facilities delivering reliable, high-standard goods that meet essential consumer and industrial needs.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
    details: "Our manufacturing plants are equipped with the latest technology to ensure efficiency and quality control. We produce a wide range of consumer goods, adhering to strict international standards."
  },
  {
    slug: "printing",
    title: "Commercial Printing",
    description: "Your premier destination for Large Format printing, Embroidery, T-Shirt printing, and high-volume corporate solutions.",
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1000",
    details: "Our printing division is equipped for versatility and precision. We specialize in Large Format printing for banners and billboards, professional Embroidery for corporate and casual wear, and high-quality T-Shirt printing. We also handle a variety of other printing needs including business cards, flyers, and brochures."
  },
  {
    slug: "hospitality",
    title: "Hospitality",
    description: "Exceptional guest experiences through our premium accommodations and service-oriented ventures, redefining comfort and luxury.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    details: "We operate premium hospitality venues that prioritize guest comfort and experience. Our portfolio includes luxury accommodation, conference facilities, and fine dining."
  },
  {
    slug: "finance",
    title: "Finance & Capital",
    description: "Strategic financial services and investment solutions designed to foster economic growth and support sustainable business expansion.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
    details: "Our financial arm provides capital solutions, investment advice, and strategic planning for businesses looking to scale. We focus on sustainable investments that drive economic growth."
  },
  {
    slug: "logistics",
    title: "Shipping & Logistics",
    description: "Efficient global and regional supply chain solutions, ensuring timely delivery and secure handling of cargo across borders.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000",
    details: "With a fleet of modern vehicles and strategic partnerships, we offer end-to-end logistics solutions. We handle customs clearing, warehousing, and last-mile delivery across the region."
  },
  {
    slug: "mining",
    title: "Mining",
    description: "Responsible extraction and resource management, adhering to safety standards while driving industrial development and local value.",
    image: "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&q=80&w=1000",
    details: "We are committed to responsible mining practices. Our operations prioritize safety, environmental stewardship, and community engagement, ensuring that our resource extraction benefits the local economy."
  }
];

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
      setFormData({
        sectionTitle: data.sectionTitle || 'Our Expertise',
        sectionSubtitle: data.sectionSubtitle || 'Delivering world-class solutions across multiple industries.',
        items: data.items || []
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to load Expertise data' });
    } finally {
      setLoading(false);
    }
  };

  // --- TEMPORARY SYNC FUNCTION ---
  const handleSyncData = () => {
    if (window.confirm("This will overwrite your current list with the data from content.js. Proceed?")) {
      const formattedItems = hardcodedSectors.map(sector => ({
        slug: sector.slug || '',
        title: sector.title || '',
        description: sector.description || '',
        details: sector.details || '',
        image: sector.image || ''
      }));

      setFormData(prev => ({
        ...prev,
        items: formattedItems
      }));
      setStatus({ type: 'info', message: 'Data synced to screen. Click "Save Changes" to push to database.' });
    }
  };
  // ---------------------------------

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
      items: [...formData.items, { slug: '', title: '', description: '', details: '', image: '' }]
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
      const { url } = await uploadExpertiseFile(file);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Sectors & Expertise Manager</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          
          {/* THE SYNC BUTTON */}
          <button onClick={handleSyncData} className="btn" style={{ background: '#3182ce', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            <DownloadCloud size={18} /> Sync Initial Data
          </button>
          
          <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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
        <h3>Sector Items ({formData.items.length})</h3>
        <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: '#d3121b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Sector
        </button>
      </div>

      {formData.items.map((item, index) => (
        <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0', position: 'relative' }}>
          <button onClick={() => removeItem(index)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}>
            <Trash2 size={20} />
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '10px' }}>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sector Title</label>
                <input type="text" value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="e.g., Agribusiness" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL Slug</label>
                <input type="text" value={item.slug} onChange={(e) => handleItemChange(index, 'slug', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="e.g., agriculture" />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Short Description (For Cards/Grid)</label>
              <textarea value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} style={{ width: '100%', padding: '10px', minHeight: '60px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Brief summary..." />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Details (For the Individual Page)</label>
              <textarea value={item.details} onChange={(e) => handleItemChange(index, 'details', e.target.value)} style={{ width: '100%', padding: '10px', minHeight: '100px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="Full, comprehensive details..." />
            </div>
            
            <div style={{ background: '#fff', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Representative Image</label>
              {item.image && <img src={item.image} alt="preview" style={{ height: '80px', objectFit: 'cover', marginBottom: '10px', display: 'block', borderRadius: '4px' }} />}
              <input type="file" onChange={(e) => handleFileUpload(e, index)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpertiseManager;