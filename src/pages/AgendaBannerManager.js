import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getAgendaBanner,
  saveAgendaBanner,
  uploadAgendaBannerFile,
} from '../services/contentService';
import './HomeSections.css';

const AgendaBannerManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(getAgendaBanner, saveAgendaBanner);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const pillars = data.pillars || [];
  const setPillar = (i, text) =>
    setData((d) => ({ ...d, pillars: (d.pillars || []).map((p, idx) => (idx === i ? { ...p, text } : p)) }));
  const movePillar = (i, dir) =>
    setData((d) => {
      const next = [...(d.pillars || [])];
      const t = i + dir;
      if (t < 0 || t >= next.length) return d;
      [next[i], next[t]] = [next[t], next[i]];
      return { ...d, pillars: next };
    });
  const addPillar = () =>
    setData((d) => ({ ...d, pillars: [...(d.pillars || []), { id: `p${Date.now()}`, text: '' }] }));
  const removePillar = (i) => {
    if (!window.confirm('Remove this pillar?')) return;
    setData((d) => ({ ...d, pillars: (d.pillars || []).filter((_, idx) => idx !== i) }));
  };

  const input = (label, field, props = {}) => (
    <div style={{ marginBottom: 14 }}>
      <label className="hs-label">{label}</label>
      <input className="hs-input" value={data[field] || ''} onChange={(e) => setField(field, e.target.value)} {...props} />
    </div>
  );

  const area = (label, field, rows = 4, hint) => (
    <div style={{ marginBottom: 14 }}>
      <label className="hs-label">{label}</label>
      <textarea
        className="hs-textarea"
        style={{ minHeight: rows * 26 }}
        value={data[field] || ''}
        onChange={(e) => setField(field, e.target.value)}
      />
      {hint && <small className="hs-hint">{hint}</small>}
    </div>
  );

  return (
    <div className="hs-page">
      <SectionHeader
        title="Agenda 2037 Banner"
        description="The “Sustainability Agenda 2037” banner at the bottom of “Sethmo Highlights And Latest Updates” on the home page: the navy side with the words, and the white side with the Vision 2037 logo, the picture and the 15+ figure. The owl illustrations stay in place."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Navy side — left</h3>
        {input('Small line at the top', 'eyebrow')}
        {area('Big heading', 'heading', 5, 'Each new line you type starts a new line on the banner.')}
        <div className="hs-grid">
          {input('Orange button text', 'buttonText')}
          <div style={{ marginBottom: 14 }}>
            <label className="hs-label">Button link</label>
            <input
              className="hs-input"
              placeholder="/sustainability"
              value={data.buttonUrl || ''}
              onChange={(e) => setField('buttonUrl', e.target.value)}
            />
            <small className="hs-hint">A page on the site (/sustainability), or a full link (https://…). Empty = the Sustainability page.</small>
          </div>
        </div>
      </div>

      <div className="hs-card">
        <h3>Navy side — notes in the middle</h3>
        {area('Opening paragraph', 'intro', 6, 'New line = new line on the banner (on phones it re-wraps by itself).')}
        {area('Line above the quote', 'lead', 3)}
        {area('Quote (with the orange bar)', 'quote', 3)}
        {input('Line above the pillars', 'pillarsTitle')}

        <p className="hs-hint" style={{ marginBottom: 12 }}>The pillars list — add, remove or reorder as you like.</p>
        {pillars.map((p, i) => (
          <div className="hs-row" key={p.id}>
            <div className="hs-row-head">
              <strong>{i + 1}.</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => movePillar(i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => movePillar(i, 1)} disabled={i === pillars.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removePillar(i)}><Trash2 size={16} /></button>
              </div>
            </div>
            <input className="hs-input" value={p.text || ''} onChange={(e) => setPillar(i, e.target.value)} />
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={addPillar}><Plus size={16} /> Add pillar</button>
      </div>

      <div className="hs-card">
        <h3>White side — right</h3>
        {input('Orange heading', 'visionHeading')}
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          <ImageField
            label="Vision 2037 logo"
            hint="Transparent PNG works best, about 2.2 : 1 wide. Empty = the logo from the artwork."
            aspect="2.2 / 1"
            contain
            value={data.visionLogo}
            onChange={(url) => setField('visionLogo', url)}
            uploader={uploadAgendaBannerFile}
          />
          <ImageField
            label="Person picture"
            hint="A person cut out on a transparent background (PNG or WebP), tall like the original (about 1 : 1.9). It sits on the right edge and reaches the bottom. Empty = the picture from the artwork."
            aspect="1 / 1.9"
            contain
            value={data.personImage}
            onChange={(url) => setField('personImage', url)}
            uploader={uploadAgendaBannerFile}
          />
        </div>
        <div className="hs-grid">
          {input('Big figure', 'statBig')}
          {area('Words under the figure', 'statText', 3, 'New line = new line (the design has “Subsidiaries” then “Growth”).')}
        </div>
      </div>
    </div>
  );
};

export default AgendaBannerManager;
