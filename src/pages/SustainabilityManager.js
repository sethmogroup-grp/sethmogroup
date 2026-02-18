import React, { useState, useEffect } from 'react';
import { getSustainability, saveSustainability } from '../services/contentService'; // We will add these next
import './SectorsManager.css';

const initialSustainability = [
  {
    id: 1,
    title: "Environmental Stewardship",
    desc: "We are committed to reducing our carbon footprint across our manufacturing and logistics sectors by investing in green energy and sustainable farming practices in our agribusiness.",
    icon: "🌱"
  },
  {
    id: 2,
    title: "Community Upliftment",
    desc: "Through our partnership with the Thapelo Foundation, we actively invest in rural education, healthcare, and skills development programs in Zambia.",
    icon: "🤝"
  },
  {
    id: 3,
    title: "Ethical Governance",
    desc: "Transparency, safety, and accountability are the bedrock of our mining and financial operations, ensuring we create value responsibly.",
    icon: "⚖️"
  }
];

const SustainabilityManager = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from DB, fallback to initial if empty
    const loadData = async () => {
      try {
        const data = await getSustainability();
        if (!data || !data.focusAreas || data.focusAreas.length === 0) {
          setItems(initialSustainability);
        } else {
          setItems(data.focusAreas);
        }
      } catch (err) {
        setItems(initialSustainability);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdate = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      await saveSustainability(items);
      setStatus('Sustainability updated successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error saving data');
    }
  };

  if (loading) return <div className="p-8">Loading Sustainability Data...</div>;

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sustainability Focus</h1>
          <p className="page-subtitle">Manage Environmental, Social, and Governance (ESG) initiatives.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save Sustainability Data</button>
      </div>

      {status && <div className="status-badge success">{status}</div>}

      <div className="pillars-editor-list">
        {items.map((item, i) => (
          <div key={item.id} className="sector-editor-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ fontSize: '30px' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="input-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={item.title} 
                    onChange={(e) => handleUpdate(i, 'title', e.target.value)} 
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea 
                    rows="3" 
                    value={item.desc} 
                    onChange={(e) => handleUpdate(i, 'desc', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SustainabilityManager;