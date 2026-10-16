import React, { useState, useEffect } from 'react';
import { getSectors, saveSectors } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';
import './SectorsManager.css';

// We define the initial data here so we don't need to import an external file
const initialSectorsData = [
  { id: 1, slug: "branding", title: "Branding & Design", description: "Comprehensive corporate branding solutions...", details: "We offer branding of all kinds..." },
  { id: 2, slug: "agriculture", title: "Agribusiness", description: "Sustainable farming and agricultural solutions...", details: "We leverage modern farming techniques..." },
  { id: 3, slug: "manufacturing", title: "Manufacturing", description: "State-of-the-art production facilities...", details: "Our manufacturing plants are equipped with the latest technology..." },
  { id: 4, slug: "printing", title: "Commercial Printing", description: "Your premier destination for Large Format printing...", details: "Our printing division is equipped for versatility and precision..." },
  { id: 5, slug: "hospitality", title: "Hospitality", description: "Exceptional guest experiences...", details: "We operate premium hospitality venues..." },
  { id: 6, slug: "finance", title: "Finance & Capital", description: "Strategic financial services...", details: "Our financial arm provides capital solutions..." },
  { id: 7, slug: "logistics", title: "Shipping & Logistics", description: "Efficient global and regional supply chain solutions...", details: "With a fleet of modern vehicles..." },
  { id: 8, slug: "mining", title: "Mining", description: "Responsible extraction and resource management...", details: "We are committed to responsible mining practices..." }
];

const SectorsManager = () => {
  const [sectors, setSectors] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getSectors();
        // If database is empty, use the initial data defined above
        if (!data.sectors || data.sectors.length === 0) {
          setSectors(initialSectorsData);
        } else {
          setSectors(data.sectors);
        }
      } catch (err) {
        console.error("Fetch error, using local defaults");
        setSectors(initialSectorsData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = [...sectors];
    updated[index][field] = value;
    setSectors(updated);
  };

  const handleImage = async (index, file) => {
    if (file) {
      const base64 = await convertToBase64(file);
      handleFieldChange(index, 'image', base64);
    }
  };

  const addNewSector = () => {
    const newSector = {
      id: sectors.length + 1,
      slug: `new-sector-${Date.now()}`,
      title: "New Sector Name",
      description: "Brief hero description...",
      details: "Full details and capabilities...",
      image: ""
    };
    setSectors([...sectors, newSector]);
    setActiveIndex(sectors.length);
  };

  const deleteSector = (index) => {
    if (window.confirm("Are you sure you want to remove this sector?")) {
      const updated = sectors.filter((_, i) => i !== index);
      setSectors(updated);
      setActiveIndex(0);
    }
  };

  const handleSave = async () => {
    try {
      setStatus('Saving to Database...');
      await saveSectors({ sectors });
      setStatus('Success: All changes saved!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error: Could not save to database');
    }
  };

  if (loading) return <div className="loading-state">Syncing Sector Data...</div>;

  const current = sectors[activeIndex];

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sectors & Services</h1>
          <p className="page-subtitle">Manage Sethmo Group's business divisions.</p>
        </div>
        <div className="header-actions">
           <button className="btn btn-secondary" onClick={addNewSector}>+ Add New Sector</button>
           <button className="btn btn-primary" onClick={handleSave}>Save All Changes</button>
        </div>
      </div>

      {status && <div className={`status-badge ${status.includes('Error') ? 'error' : 'success'}`}>{status}</div>}

      <div className="sectors-manager-grid">
        <div className="sector-list-sidebar">
          {sectors.map((s, idx) => (
            <div key={idx} className={`sidebar-item ${activeIndex === idx ? 'active' : ''}`}>
               <button onClick={() => setActiveIndex(idx)}>{s.title}</button>
               {sectors.length > 1 && (
                 <span className="delete-icon" onClick={() => deleteSector(idx)}>×</span>
               )}
            </div>
          ))}
        </div>

        {current && (
          <div className="sector-editor-card">
            <div className="input-group">
              <label>Sector Title</label>
              <input 
                type="text" 
                value={current.title} 
                onChange={(e) => handleFieldChange(activeIndex, 'title', e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>URL Slug (e.g., agribusiness)</label>
              <input 
                type="text" 
                value={current.slug} 
                onChange={(e) => handleFieldChange(activeIndex, 'slug', e.target.value.toLowerCase().replace(/ /g, '-'))} 
              />
            </div>

            <div className="input-group">
              <label>Hero Description (Brief)</label>
              <textarea 
                value={current.description} 
                onChange={(e) => handleFieldChange(activeIndex, 'description', e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Full Capabilities (Detailed)</label>
              <textarea 
                rows="6"
                value={current.details} 
                onChange={(e) => handleFieldChange(activeIndex, 'details', e.target.value)} 
              />
            </div>

            <div className="image-upload-section">
              <label>Sector Feature Image</label>
              <div className="image-preview-box">
                {current.image ? (
                  <img src={current.image} alt="Sector" />
                ) : (
                  <p>No image selected</p>
                )}
                <input type="file" onChange={(e) => handleImage(activeIndex, e.target.files[0])} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorsManager;