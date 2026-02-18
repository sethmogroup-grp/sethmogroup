import React, { useState, useEffect } from 'react';
import { getCareers, saveCareers } from '../services/contentService';
import './CareersManager.css'; // Using the new dedicated CSS

const CareersManager = () => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareers()
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    const newJob = {
      title: "",
      department: "Corporate",
      location: "Lusaka, Zambia",
      type: "Full-time",
      applyLink: "",
      active: true
    };
    setJobs([newJob, ...jobs]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...jobs];
    updated[index][field] = value;
    setJobs(updated);
  };

  const handleSave = async () => {
    if (jobs.some(j => !j.title)) {
      setStatus('Error: Please provide a Job Title for all listings.');
      return;
    }
    try {
      setStatus('Publishing vacancies...');
      await saveCareers(jobs);
      setStatus('Success: Job board updated!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error: Could not save jobs');
    }
  };

  if (loading) return <div className="admin-loader">Loading Job Board...</div>;

  return (
    <div className="careers-mgr-container">
      <div className="mgr-header">
        <div className="mgr-title-box">
          <h1 className="mgr-title">Careers & Recruitment</h1>
          <p className="mgr-subtitle">Manage open positions across Sethmo Group sectors.</p>
        </div>
        <div className="mgr-actions">
          <button className="mgr-btn-add" onClick={handleAdd}>+ New Position</button>
          <button className="mgr-btn-save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      {status && (
        <div className={`mgr-status-alert ${status.includes('Error') ? 'err' : 'success'}`}>
          {status}
        </div>
      )}

      <div className="job-cards-stack">
        {jobs.map((job, i) => (
          <div key={i} className="job-editor-card">
            <div className="job-editor-grid">
              <div className="job-input-wrap">
                <label>Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Mine Engineer" 
                  value={job.title} 
                  onChange={(e) => handleUpdate(i, 'title', e.target.value)} 
                />
              </div>
              <div className="job-input-wrap">
                <label>Department</label>
                <select value={job.department} onChange={(e) => handleUpdate(i, 'department', e.target.value)}>
                  <option value="Mining">Mining</option>
                  <option value="Agribusiness">Agribusiness</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Financial Services">Financial Services</option>
                </select>
              </div>
              <div className="job-input-wrap">
                <label>Application Link / HR Email</label>
                <input 
                  type="text" 
                  placeholder="URL or hr@sethmo.com" 
                  value={job.applyLink} 
                  onChange={(e) => handleUpdate(i, 'applyLink', e.target.value)} 
                />
              </div>
            </div>
            <div className="job-card-footer">
              <button className="mgr-btn-delete" onClick={() => setJobs(jobs.filter((_, idx) => idx !== i))}>
                Remove Listing
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <div className="empty-mgr-state">No active job listings.</div>}
      </div>
    </div>
  );
};

export default CareersManager;