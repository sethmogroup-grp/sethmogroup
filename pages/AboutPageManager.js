import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import { getAboutPage, saveAboutPage, uploadAboutPageFile } from '../services/contentService';
import './HomeSections.css';

const blankValue = () => ({ id: `value-${Date.now()}`, title: '', tagline: '' });
const blankLeader = () => ({ id: `leader-${Date.now()}`, name: '', role: '', image: '', body: '' });

const AboutPageManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(getAboutPage, saveAboutPage);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const setListItem = (listField, index, field, value) =>
    setData((d) => ({
      ...d,
      [listField]: d[listField].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));

  const moveListItem = (listField, index, dir) =>
    setData((d) => {
      const next = [...d[listField]];
      const target = index + dir;
      if (target < 0 || target >= next.length) return d;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...d, [listField]: next };
    });

  const addListItem = (listField, factory) =>
    setData((d) => ({ ...d, [listField]: [...(d[listField] || []), factory()] }));

  const removeListItem = (listField, index, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    setData((d) => ({ ...d, [listField]: d[listField].filter((_, i) => i !== index) }));
  };

  const values = data.values || [];
  const leaders = data.leaders || [];

  return (
    <div className="hs-page">
      <SectionHeader
        title="About Us Page"
        description="Everything on the About Us page: the hero, History, Our Values, the Group President spotlight, Group Executive Leadership, and Our Purpose."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      {/* Hero */}
      <div className="hs-card">
        <h3>Hero (top of the page)</h3>
        <div className="hs-grid">
          <div className="hs-full">
            <label className="hs-label">Title</label>
            <input className="hs-input" value={data.heroTitle || ''} onChange={(e) => setField('heroTitle', e.target.value)} />
          </div>
          <div className="hs-full">
            <label className="hs-label">Subtitle</label>
            <textarea className="hs-textarea" value={data.heroSubtitle || ''} onChange={(e) => setField('heroSubtitle', e.target.value)} />
          </div>
          <ImageField
            label="Background picture"
            hint="Wide photo, at least 1600px wide. Leave empty to use the default."
            aspect="16 / 5"
            value={data.heroImage}
            onChange={(url) => setField('heroImage', url)}
            uploader={uploadAboutPageFile}
          />
        </div>
      </div>

      {/* History */}
      <div className="hs-card">
        <h3>History</h3>
        <div className="hs-grid">
          <div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Heading</label>
              <input className="hs-input" value={data.historyHeading || ''} onChange={(e) => setField('historyHeading', e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Text</label>
              <textarea className="hs-textarea" style={{ minHeight: 140 }} value={data.historyBody || ''} onChange={(e) => setField('historyBody', e.target.value)} />
            </div>
            <div className="hs-grid">
              <div>
                <label className="hs-label">Button text</label>
                <input className="hs-input" value={data.historyButtonText || ''} onChange={(e) => setField('historyButtonText', e.target.value)} />
              </div>
              <div>
                <label className="hs-label">Button link</label>
                <input className="hs-input" placeholder="/news or https://…" value={data.historyButtonUrl || ''} onChange={(e) => setField('historyButtonUrl', e.target.value)} />
              </div>
            </div>
          </div>
          <ImageField
            label="Picture"
            hint="Portrait photo. Leave empty to use the default."
            aspect="1 / 1.04"
            value={data.historyImage}
            onChange={(url) => setField('historyImage', url)}
            uploader={uploadAboutPageFile}
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="hs-card">
        <h3>Our Values</h3>
        <label className="hs-label">Section heading</label>
        <input className="hs-input" style={{ marginBottom: 16 }} value={data.valuesHeading || ''} onChange={(e) => setField('valuesHeading', e.target.value)} />

        {values.map((v, i) => (
          <div className="hs-row" key={v.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {v.title || 'New value'}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('values', i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('values', i, 1)} disabled={i === values.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeListItem('values', i, 'Remove this value?')}><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="hs-grid">
              <div>
                <label className="hs-label">Title</label>
                <input className="hs-input" value={v.title || ''} onChange={(e) => setListItem('values', i, 'title', e.target.value)} />
              </div>
              <div>
                <label className="hs-label">Tagline</label>
                <textarea className="hs-textarea" style={{ minHeight: 70 }} value={v.tagline || ''} onChange={(e) => setListItem('values', i, 'tagline', e.target.value)} />
                <small className="hs-hint">Start a new line for a second line of text under this value.</small>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={() => addListItem('values', blankValue)}>
          <Plus size={16} /> Add value
        </button>
      </div>

      {/* Group President */}
      <div className="hs-card">
        <h3>Group President</h3>
        <div className="hs-grid">
          <div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Role</label>
              <input className="hs-input" value={data.presidentRole || ''} onChange={(e) => setField('presidentRole', e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Name</label>
              <input className="hs-input" value={data.presidentName || ''} onChange={(e) => setField('presidentName', e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Text</label>
              <textarea className="hs-textarea" style={{ minHeight: 140 }} value={data.presidentBody || ''} onChange={(e) => setField('presidentBody', e.target.value)} />
            </div>
            <div className="hs-grid">
              <div>
                <label className="hs-label">Button text</label>
                <input className="hs-input" value={data.presidentButtonText || ''} onChange={(e) => setField('presidentButtonText', e.target.value)} />
              </div>
              <div>
                <label className="hs-label">Button link</label>
                <input className="hs-input" placeholder="/news or https://…" value={data.presidentButtonUrl || ''} onChange={(e) => setField('presidentButtonUrl', e.target.value)} />
              </div>
            </div>
          </div>
          <ImageField
            label="Photo"
            hint="Portrait photo. Leave empty to use the default."
            aspect="4 / 5"
            value={data.presidentImage}
            onChange={(url) => setField('presidentImage', url)}
            uploader={uploadAboutPageFile}
          />
        </div>
      </div>

      {/* Group Executive Leadership */}
      <div className="hs-card">
        <h3>Group Executive Leadership</h3>
        <div className="hs-grid" style={{ marginBottom: 16 }}>
          <div>
            <label className="hs-label">Heading</label>
            <input className="hs-input" value={data.leadershipHeading || ''} onChange={(e) => setField('leadershipHeading', e.target.value)} />
          </div>
          <div className="hs-full">
            <label className="hs-label">Subtitle</label>
            <textarea className="hs-textarea" value={data.leadershipSubtitle || ''} onChange={(e) => setField('leadershipSubtitle', e.target.value)} />
          </div>
        </div>

        {leaders.map((leader, i) => (
          <div className="hs-row" key={leader.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {leader.name || 'New leader'}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('leaders', i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('leaders', i, 1)} disabled={i === leaders.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeListItem('leaders', i, 'Remove this leader?')}><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Name</label>
                  <input className="hs-input" value={leader.name || ''} onChange={(e) => setListItem('leaders', i, 'name', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Role</label>
                  <input className="hs-input" value={leader.role || ''} onChange={(e) => setListItem('leaders', i, 'role', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">Short text under the photo</label>
                  <textarea className="hs-textarea" value={leader.body || ''} onChange={(e) => setListItem('leaders', i, 'body', e.target.value)} />
                </div>
              </div>
              <ImageField
                label="Photo"
                hint="Portrait (upright) photo, head near the top of the frame — it displays in a tall 3:4 box like this preview. Leave empty to use the default, if there is one."
                aspect="3 / 4"
                value={leader.image}
                onChange={(url) => setListItem('leaders', i, 'image', url)}
                uploader={uploadAboutPageFile}
              />
            </div>
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={() => addListItem('leaders', blankLeader)}>
          <Plus size={16} /> Add leader
        </button>
      </div>

      {/* Our Purpose */}
      <div className="hs-card">
        <h3>Our Purpose</h3>
        <div className="hs-grid">
          <div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Heading</label>
              <input className="hs-input" value={data.purposeHeading || ''} onChange={(e) => setField('purposeHeading', e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Text (top right)</label>
              <textarea className="hs-textarea" value={data.purposeBody || ''} onChange={(e) => setField('purposeBody', e.target.value)} />
            </div>
            <div>
              <label className="hs-label">Big text over the photo</label>
              <input className="hs-input" value={data.purposeBigText || ''} onChange={(e) => setField('purposeBigText', e.target.value)} />
            </div>
          </div>
          <ImageField
            label="Picture"
            hint="Landscape photo. Leave empty to use the default."
            aspect="16 / 9"
            value={data.purposeImage}
            onChange={(url) => setField('purposeImage', url)}
            uploader={uploadAboutPageFile}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPageManager;
