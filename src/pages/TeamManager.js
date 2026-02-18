import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, User, Briefcase, AlignLeft } from 'lucide-react';
import { getTeamData, saveTeamData } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';
import './TeamManager.css';

const TeamManager = () => {
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamData();
        setMembers(data.members || []);
      } catch (err) {
        setStatus('Error loading team data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addMember = () => {
    setMembers([...members, { name: '', role: '', bio: '', imageUrl: '' }]);
  };

  const removeMember = (index) => {
    if (window.confirm("Delete this team member?")) {
      const updated = members.filter((_, i) => i !== index);
      setMembers(updated);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        handleFieldChange(index, 'imageUrl', base64);
      } catch (error) {
        alert("Image processing failed.");
      }
    }
  };

  const handleSave = async () => {
    try {
      setStatus('Saving changes...');
      await saveTeamData({ members });
      setStatus('Team updated successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      setStatus('Error: Could not save team data.');
    }
  };

  if (loading) return <div className="loading-state">Loading Team Management...</div>;

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leadership Team</h1>
          <p className="page-subtitle">Add or edit executive staff members.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={addMember}>
            <Plus size={18} /> Add Member
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save All
          </button>
        </div>
      </div>

      {status && (
        <div className={`status-badge ${status.includes('Error') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}

      <div className="members-list">
        {members.map((member, index) => (
          <div key={index} className="member-form-card">
            <div className="member-grid">
              {/* Image Section */}
              <div className="upload-col">
                <div className="member-img-preview" onClick={() => document.getElementById(`file-${index}`).click()}>
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt="Staff" />
                  ) : (
                    <div className="placeholder-box">
                      <Upload size={24} />
                      <span>Upload Photo</span>
                    </div>
                  )}
                  <input type="file" id={`file-${index}`} hidden onChange={(e) => handleImageUpload(index, e)} />
                </div>
              </div>

              {/* Form Section */}
              <div className="data-col">
                <div className="input-group">
                  <label><User size={14} /> Full Name</label>
                  <input 
                    type="text" 
                    value={member.name} 
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label><Briefcase size={14} /> Position</label>
                  <input 
                    type="text" 
                    value={member.role} 
                    onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label><AlignLeft size={14} /> Professional Bio</label>
                  <textarea 
                    rows="2"
                    value={member.bio} 
                    onChange={(e) => handleFieldChange(index, 'bio', e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-delete" onClick={() => removeMember(index)}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;