import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getEmployeesPage,
  saveEmployeesPage,
  uploadEmployeesPageFile,
} from '../services/contentService';
import './HomeSections.css';

const blankInterview = () => ({
  id: `interview-${Date.now()}`,
  image: '',
  role: '',
  name: '',
  company: '',
  link: '',
});

const EmployeesPageManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getEmployeesPage,
    saveEmployeesPage
  );

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const setListItem = (listField, index, field, value) =>
    setData((d) => ({
      ...d,
      [listField]: (d[listField] || []).map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));

  const moveListItem = (listField, index, dir) =>
    setData((d) => {
      const next = [...(d[listField] || [])];
      const target = index + dir;
      if (target < 0 || target >= next.length) return d;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...d, [listField]: next };
    });

  const addListItem = (listField, factory) =>
    setData((d) => ({ ...d, [listField]: [...(d[listField] || []), factory()] }));

  const removeListItem = (listField, index, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    setData((d) => ({ ...d, [listField]: (d[listField] || []).filter((_, i) => i !== index) }));
  };

  const pillars = data.pillars || [];
  const divCards = data.divCards || [];
  const subsidiaries = data.subsidiaries || [];
  const interviews = data.interviews || [];

  return (
    <div className="hs-page">
      <SectionHeader
        title="Employees Page"
        description="Everything on the Employees page (opened from Employees / Careers → Employees Topics): the hero picture, the “Inspired By you” block, the subsidiaries diagram, the looping Employee Interview cards, the People Strategy and the Diversified / Career Information picture cards."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      {/* Title + hero */}
      <div className="hs-card">
        <h3>Page title &amp; hero picture</h3>
        <div className="hs-grid">
          <div>
            <label className="hs-label">Page title (also shown in the “Home &gt; …” breadcrumb)</label>
            <input className="hs-input" value={data.pageTitle || ''} onChange={(e) => setField('pageTitle', e.target.value)} />
          </div>
          <ImageField
            label="Hero picture"
            hint="Wide photo, about 4:1 (the design is 2093 × 530). It fills the full width of the page and is never cropped or shrunk."
            aspect="4 / 1"
            value={data.heroImage}
            onChange={(url) => setField('heroImage', url)}
            uploader={uploadEmployeesPageFile}
          />
        </div>
      </div>

      {/* Inspired By you */}
      <div className="hs-card">
        <h3>“Inspired By you” block</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Heading</label>
          <input className="hs-input" value={data.inspiredHeading || ''} onChange={(e) => setField('inspiredHeading', e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Text</label>
          <textarea className="hs-textarea" style={{ minHeight: 110 }} value={data.inspiredBody || ''} onChange={(e) => setField('inspiredBody', e.target.value)} />
        </div>
        <div className="hs-grid">
          <div>
            <label className="hs-label">Left circle text (grey-blue)</label>
            <input className="hs-input" value={data.circleLeftLabel || ''} onChange={(e) => setField('circleLeftLabel', e.target.value)} />
          </div>
          <div>
            <label className="hs-label">Right circle text (orange)</label>
            <input className="hs-input" value={data.circleRightLabel || ''} onChange={(e) => setField('circleRightLabel', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Diverse individuals */}
      <div className="hs-card">
        <h3>Diverse Individuals Supporting Diversified Businesses</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Orange heading</label>
          <input className="hs-input" value={data.diverseHeading || ''} onChange={(e) => setField('diverseHeading', e.target.value)} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="hs-label">Text</label>
          <textarea className="hs-textarea" style={{ minHeight: 120 }} value={data.diverseBody || ''} onChange={(e) => setField('diverseBody', e.target.value)} />
        </div>

        <div className="hs-grid" style={{ marginBottom: 18 }}>
          <ImageField
            label="Centre logo (Sethmo Group)"
            hint="Transparent PNG works best. Empty = the default Sethmo Group logo."
            aspect="16 / 9"
            contain
            value={data.hubLogo}
            onChange={(url) => setField('hubLogo', url)}
            uploader={uploadEmployeesPageFile}
          />
        </div>

        <p className="hs-hint" style={{ marginBottom: 12 }}>
          The six circles around the centre, clockwise from the top. Change a logo or the words under it here.
        </p>
        {subsidiaries.map((sub, i) => (
          <div className="hs-row" key={sub.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {sub.name || 'Circle'}</strong>
            </div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Company name (line 1 under the circle)</label>
                  <input className="hs-input" value={sub.name || ''} onChange={(e) => setListItem('subsidiaries', i, 'name', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">What it does (line 2)</label>
                  <input className="hs-input" value={sub.description || ''} onChange={(e) => setListItem('subsidiaries', i, 'description', e.target.value)} />
                </div>
              </div>
              <ImageField
                label="Logo"
                hint="Shown inside the orange circle. Empty = the default logo."
                aspect="16 / 9"
                contain
                value={sub.logo}
                onChange={(url) => setListItem('subsidiaries', i, 'logo', url)}
                uploader={uploadEmployeesPageFile}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Employee Interview */}
      <div className="hs-card">
        <h3>Employee Interview (looping cards)</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Heading</label>
          <input className="hs-input" value={data.interviewHeading || ''} onChange={(e) => setField('interviewHeading', e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Text under the heading</label>
          <textarea className="hs-textarea" value={data.interviewSubtitle || ''} onChange={(e) => setField('interviewSubtitle', e.target.value)} />
        </div>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          <div>
            <label className="hs-label">Button text</label>
            <input className="hs-input" value={data.interviewButtonText || ''} onChange={(e) => setField('interviewButtonText', e.target.value)} />
          </div>
          <div>
            <label className="hs-label">Button link</label>
            <input className="hs-input" placeholder="/contact or https://…" value={data.interviewButtonUrl || ''} onChange={(e) => setField('interviewButtonUrl', e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: 20, maxWidth: 260 }}>
          <label className="hs-label">Seconds each slide stays (speed)</label>
          <input
            className="hs-input"
            type="number"
            min="1.5"
            max="15"
            step="0.5"
            value={data.interviewSpeed ?? 3.5}
            onChange={(e) => setField('interviewSpeed', Number(e.target.value))}
          />
        </div>

        <p className="hs-hint" style={{ marginBottom: 12 }}>
          Add as many people as you like. The cards slide round in a loop in this order, and the dots underneath
          follow — one dot per person. The button under the carousel links wherever you set above.
        </p>

        {interviews.map((p, i) => (
          <div className="hs-row" key={p.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {p.name || 'New person'}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('interviews', i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('interviews', i, 1)} disabled={i === interviews.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeListItem('interviews', i, 'Remove this person from the carousel?')}><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Job / what they do (first line)</label>
                  <input className="hs-input" value={p.role || ''} onChange={(e) => setListItem('interviews', i, 'role', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Name (second line)</label>
                  <input className="hs-input" value={p.name || ''} onChange={(e) => setListItem('interviews', i, 'name', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Company (third line)</label>
                  <input className="hs-input" value={p.company || ''} onChange={(e) => setListItem('interviews', i, 'company', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">Link when the card is clicked (optional)</label>
                  <input className="hs-input" placeholder="/contact or https://…" value={p.link || ''} onChange={(e) => setListItem('interviews', i, 'link', e.target.value)} />
                </div>
              </div>
              <ImageField
                label="Photo"
                hint="Roughly square portrait (about 490 × 480). Leave empty to keep the original design photo."
                aspect="1.03 / 1"
                value={p.image}
                onChange={(url) => setListItem('interviews', i, 'image', url)}
                uploader={uploadEmployeesPageFile}
              />
            </div>
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={() => addListItem('interviews', blankInterview)}>
          <Plus size={16} /> Add person
        </button>
      </div>

      {/* People Strategy */}
      <div className="hs-card">
        <h3>People Strategy Centered on Diverse Individuals</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Orange heading</label>
          <input className="hs-input" value={data.psHeading || ''} onChange={(e) => setField('psHeading', e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">First paragraph</label>
          <textarea className="hs-textarea" value={data.psIntro1 || ''} onChange={(e) => setField('psIntro1', e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Second paragraph</label>
          <textarea className="hs-textarea" value={data.psIntro2 || ''} onChange={(e) => setField('psIntro2', e.target.value)} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="hs-label">Orange bar text</label>
          <input className="hs-input" value={data.psBanner || ''} onChange={(e) => setField('psBanner', e.target.value)} />
        </div>

        <p className="hs-hint" style={{ marginBottom: 12 }}>
          The three navy circles and the text under each one. A new line in the text starts a new paragraph on the website.
        </p>
        {pillars.map((pl, i) => (
          <div className="hs-row" key={pl.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {pl.title || 'Priority'}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('pillars', i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('pillars', i, 1)} disabled={i === pillars.length - 1}><ArrowDown size={16} /></button>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Words inside the circle</label>
              <input className="hs-input" value={pl.title || ''} onChange={(e) => setListItem('pillars', i, 'title', e.target.value)} />
            </div>
            <div>
              <label className="hs-label">Text under the circle</label>
              <textarea className="hs-textarea" style={{ minHeight: 130 }} value={pl.body || ''} onChange={(e) => setListItem('pillars', i, 'body', e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      {/* Diversified + Career Information */}
      <div className="hs-card">
        <h3>Picture cards: Diversified &amp; Career Information</h3>
        <p className="hs-hint" style={{ marginTop: -6, marginBottom: 16 }}>
          Sit under the People Strategy. The words under each picture (and the picture itself) are a clickable link — by default both open the Careers Topics page.
        </p>
        {divCards.map((c, i) => (
          <div className="hs-row" key={c.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {c.caption || 'Card'}</strong>
            </div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Words under the picture (clickable)</label>
                  <input className="hs-input" value={c.caption || ''} onChange={(e) => setListItem('divCards', i, 'caption', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">White words on top of the picture (optional)</label>
                  <input className="hs-input" value={c.overlayText || ''} onChange={(e) => setListItem('divCards', i, 'overlayText', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">Where it links to</label>
                  <input className="hs-input" placeholder="/careers or https://…" value={c.link || ''} onChange={(e) => setListItem('divCards', i, 'link', e.target.value)} />
                </div>
              </div>
              <ImageField
                label="Picture"
                hint="Landscape photo, about 3:2. Leave empty to keep the design picture."
                aspect="1.46 / 1"
                value={c.image}
                onChange={(url) => setListItem('divCards', i, 'image', url)}
                uploader={uploadEmployeesPageFile}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPageManager;
