import React, { useState, useEffect } from 'react';
import { getPillars, savePillars } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';
import './SectorsManager.css';

const initialPillars = [
  { id: "01", title: "Diversified Multi-Sector Strength", desc: "Operates across multiple high-impact sectors including branding, agribusiness, manufacturing, and mining..." },
  { id: "02", title: "Customer-Centric Philosophy", desc: "Driven by the 'Inspired By You' motto, ensuring solutions are designed around specific needs." },
  { id: "03", title: "Empowerment of SMEs", desc: "Integrating local enterprises into value chains to promote entrepreneurship." },
  { id: "04", title: "Community Impact", desc: "Partnering with the Thapelo Foundation to give back through sustainable initiatives." },
  { id: "05", title: "Innovation", desc: "Continuously enhancing processes and technologies for world-class solutions." },
  { id: "06", title: "Quality & Reliability", desc: "Strict adherence to quality standards to build a trusted household brand." },
  { id: "07", title: "Sustainable Value", desc: "Focusing on long-term value creation and scalable growth." }
];

const PillarsManager = () => {
  const [pillars, setPillars] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true); // Now correctly managed by useEffect

  useEffect(() => {
    const loadPillars = async () => {
      try {
        const data = await getPillars();
        // If DB has no pillars, use the initial data
        if (!data || !data.pillars || data.pillars.length === 0) {
          setPillars(initialPillars);
        } else {
          setPillars(data.pillars);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setPillars(initialPillars); // Fallback so you can still save
      } finally {
        setLoading(false); // This stops the "Syncing..." message
      }
    };
    loadPillars();
  }, []);

  const handleUpdate = (index, field, value) => {
    const updated = [...pillars];
    updated[index][field] = value;
    setPillars(updated);
  };

  const handleImage = async (index, file) => {
    if (file) {
      const base64 = await convertToBase64(file);
      handleUpdate(index, 'image', base64);
    }
  };

  const handleSave = async () => {
    try {
      setStatus('Saving Pillars and Images...');
      await savePillars(pillars);
      setStatus('Strategic Pillars updated!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) { 
      setStatus('Error saving pillars'); 
    }
  };

  if (loading) return <div className="loading-state">Syncing Pillars...</div>;

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">7 Strategic Pillars</h1>
          <p className="page-subtitle">Core principles shaping Sethmo Group Limited.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>

      {status && <div className={`status-badge ${status.includes('Error') ? 'error' : 'success'}`}>{status}</div>}

      <div className="pillars-editor-list">
        {pillars.map((p, i) => (
          <div key={p.id} className="sector-editor-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '150px' }}>
                <div className="image-preview-box" style={{ height: '100px', marginBottom: '10px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image ? (
                    <img src={p.image} alt="Pillar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <span style={{fontSize: '2rem', fontWeight: 'bold', color: '#ccc'}}>{p.id}</span>
                  )}
                </div>
                <input 
                  type="file" 
                  style={{ fontSize: '10px', width: '100%' }} 
                  onChange={(e) => handleImage(i, e.target.files[0])} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="input-group">
                  <label>Pillar Title</label>
                  <input 
                    type="text" 
                    value={p.title} 
                    onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                    style={{ fontWeight: 'bold' }} 
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea 
                    value={p.desc} 
                    onChange={(e) => handleUpdate(i, 'desc', e.target.value)}
                    rows="3"
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

export default PillarsManager;