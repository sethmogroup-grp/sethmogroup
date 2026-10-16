import React, { useState, useEffect } from 'react';
import { getCompanyInfo, saveCompanyInfo } from '../services/contentService';

const CompanyManager = () => {
  const [info, setInfo] = useState({
    name: "Sethmo Group Limited",
    motto: "Inspired By You",
    vision: "",
    mission: ""
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    getCompanyInfo().then(data => {
      if (data) setInfo(data);
    });
  }, []);

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      await saveCompanyInfo(info);
      setStatus('Saved successfully!');
    } catch (err) { setStatus('Error saving'); }
  };

  return (
    <div className="manager-container">
      <h1>General Company Info</h1>
      <div className="sector-editor-card">
        <div className="input-group">
          <label>Company Name</label>
          <input type="text" value={info.name} onChange={(e) => setInfo({...info, name: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Motto</label>
          <input type="text" value={info.motto} onChange={(e) => setInfo({...info, motto: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Vision Statement</label>
          <textarea value={info.vision} onChange={(e) => setInfo({...info, vision: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Mission Statement</label>
          <textarea value={info.mission} onChange={(e) => setInfo({...info, mission: e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Update Identity</button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
};

export default CompanyManager;