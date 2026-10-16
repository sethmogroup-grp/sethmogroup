import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, User, Briefcase, AlignLeft, Quote } from 'lucide-react';
// IMPORT THE NEW DELETE FUNCTION HERE
import { getTeamData, saveTeamData, deleteTeamMember } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';
import './TeamManager.css';

const TeamManager = () => {
  const [sectionHeading, setSectionHeading] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamData();
        setSectionHeading(data.sectionHeading || 'Group Executive Leadership');
        setSectionDescription(data.sectionDescription || '');
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
    setMembers([...members, { name: '', role: '', tagline: '', bio: '', imageUrl: '' }]);
  };

  // UPDATED: Now permanently deletes from the database!
  const removeMember = async (index, memberId) => {
    if (window.confirm("Are you sure you want to permanently delete this team member?")) {
      try {
        // If they have an ID, delete them from the backend database first
        if (memberId) {
          setStatus('Deleting member from database...');
          await deleteTeamMember(memberId);
        }

        // Remove them from the local UI
        const updated = members.filter((_, i) => i !== index);
        setMembers(updated);

        setStatus('Member deleted successfully!');
        setTimeout(() => setStatus(''), 3000);
      } catch (error) {
        console.error("Delete error:", error);
        setStatus('Error: Could not delete member.');
        setTimeout(() => setStatus(''), 3000);
      }
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
      await saveTeamData({ sectionHeading, sectionDescription, members });
      setStatus('Team updated successfully!');
      setTimeout(() => setStatus(''), 3000);

      // Refresh the data so all new members get their official database _id
      const data = await getTeamData();
      setSectionHeading(data.sectionHeading || 'Group Executive Leadership');
      setSectionDescription(data.sectionDescription || '');
      setMembers(data.members || []);
    } catch (e) {
      setStatus('Error: Could not save team data.');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  if (loading) return <div className="loading-state">Loading Team Management...</div>;

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">President &amp; Leadership Team</h1>
          <p className="page-subtitle">
            The <strong>first person in the list</strong> is shown as the "Group President &amp; Chief Executive"
            spotlight on the About page. Everyone added after that appears as a tile in the Executive Leadership
            grid below it.
          </p>
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

      {/* Leadership grid heading + intro paragraph */}
      <div className="form-card" style={{ padding: '25px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '18px', color: '#F58634' }}>Executive Leadership Grid — Heading &amp; Intro</h3>
        <div className="input-group" style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Grid Heading</label>
          <input
            type="text"
            value={sectionHeading}
            onChange={(e) => setSectionHeading(e.target.value)}
            placeholder="Group Executive Leadership"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Intro Paragraph</label>
          <textarea
            rows="3"
            value={sectionDescription}
            onChange={(e) => setSectionDescription(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: '1.6' }}
          />
        </div>
      </div>

      <div className="members-list">
        {members.map((member, index) => (
          <div key={member._id || index} className="member-form-card">
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
                <span className="member-position-tag">
                  {index === 0 ? 'Shown as: Group President' : `Shown as: Leadership grid tile #${index}`}
                </span>
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
                {index > 0 && (
                  <div className="input-group">
                    <label><Quote size={14} /> Tagline (short line on the grid card)</label>
                    <input
                      type="text"
                      value={member.tagline || ''}
                      onChange={(e) => handleFieldChange(index, 'tagline', e.target.value)}
                      placeholder="e.g. We Grow With Purpose"
                    />
                  </div>
                )}
                <div className="input-group">
                  <label><AlignLeft size={14} /> Professional Bio</label>
                  <textarea
                    rows="2"
                    value={member.bio}
                    onChange={(e) => handleFieldChange(index, 'bio', e.target.value)}
                  />
                </div>
              </div>

              {/* Pass BOTH index and _id to the remove function */}
              <button className="btn-delete" onClick={() => removeMember(index, member._id)}>
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
