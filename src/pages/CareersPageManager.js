import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getCareersPage,
  saveCareersPage,
  uploadCareersPageFile,
} from '../services/contentService';
import './HomeSections.css';

const CareersPageManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getCareersPage,
    saveCareersPage
  );

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const setListItem = (list, index, field, value) =>
    setData((d) => ({
      ...d,
      [list]: (d[list] || []).map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));

  const moveItem = (list, index, dir) =>
    setData((d) => {
      const next = [...(d[list] || [])];
      const t = index + dir;
      if (t < 0 || t >= next.length) return d;
      [next[index], next[t]] = [next[t], next[index]];
      return { ...d, [list]: next };
    });

  const addCategory = () =>
    setData((d) => ({ ...d, categories: [...(d.categories || []), { id: `cat-${Date.now()}`, name: '' }] }));

  const removeCategory = (index) => {
    if (!window.confirm('Remove this job category?')) return;
    setData((d) => ({ ...d, categories: (d.categories || []).filter((_, i) => i !== index) }));
  };

  const cards = data.purposeCards || [];
  const categories = data.categories || [];
  const detailPages = data.detailPages || [];

  return (
    <div className="hs-page">
      <SectionHeader
        title="Careers Topics Page"
        description="The page opened from Employees / Careers → Career's Topics: the title, hero picture, the “The next big thing here is. You” message, Purpose / President cards and their pages, the Apply button, the Corporate Profile box and the Job Categories. (Job openings are still managed under Careers.)"
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Title &amp; hero picture</h3>
        <div className="hs-grid">
          <div>
            <label className="hs-label">Page title</label>
            <input className="hs-input" value={data.pageTitle || ''} onChange={(e) => setField('pageTitle', e.target.value)} />
          </div>
          <ImageField
            label="Hero picture"
            hint="Wide photo, about 2.8:1 (the design is 2012 × 729). It fills the full width of the page and is never cropped or shrunk."
            aspect="2.76 / 1"
            value={data.heroImage}
            onChange={(url) => setField('heroImage', url)}
            uploader={uploadCareersPageFile}
          />
        </div>
      </div>

      <div className="hs-card">
        <h3>“The next big thing here is. You”</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Heading (underlined in orange)</label>
          <input className="hs-input" value={data.nextHeading || ''} onChange={(e) => setField('nextHeading', e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Message</label>
          <textarea
            className="hs-textarea"
            style={{ minHeight: 420 }}
            value={data.nextBody || ''}
            onChange={(e) => setField('nextBody', e.target.value)}
          />
          <small className="hs-hint">
            Every new line here is a new line on the website. Put words inside double square brackets to show them in orange, e.g. [[“What if?”]].
          </small>
        </div>
        <div>
          <label className="hs-label">Closing line (bold, orange)</label>
          <input className="hs-input" value={data.nextClosing || ''} onChange={(e) => setField('nextClosing', e.target.value)} />
        </div>
      </div>

      {/* Purpose + President */}
      <div className="hs-card">
        <h3>Sethmo’s Purpose and Our President Message</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Heading</label>
          <input className="hs-input" value={data.purposeHeading || ''} onChange={(e) => setField('purposeHeading', e.target.value)} />
        </div>
        {cards.map((card, i) => (
          <div className="hs-row" key={card.id}>
            <div className="hs-row-head"><strong>{i + 1}. {card.caption || 'Card'}</strong></div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Link text (orange box under the picture)</label>
                  <input className="hs-input" value={card.caption || ''} onChange={(e) => setListItem('purposeCards', i, 'caption', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">Opens page</label>
                  <input className="hs-input" placeholder="/careers/purpose" value={card.link || ''} onChange={(e) => setListItem('purposeCards', i, 'link', e.target.value)} />
                  <small className="hs-hint">Leave as it is to open the detail page you fill in further down.</small>
                </div>
              </div>
              <ImageField
                label="Picture"
                hint="About 1.46 : 1 (the design is 1062 × 728). Empty = the design picture."
                aspect="1.46 / 1"
                value={card.image}
                onChange={(url) => setListItem('purposeCards', i, 'image', url)}
                uploader={uploadCareersPageFile}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Detail pages */}
      <div className="hs-card">
        <h3>Pages opened from those two links</h3>
        <p className="hs-hint" style={{ marginBottom: 12 }}>
          This is where you add the details. A blank line starts a new paragraph; put words in [[double square brackets]] to show them orange.
        </p>
        {detailPages.map((pg, i) => (
          <div className="hs-row" key={pg.id}>
            <div className="hs-row-head"><strong>/careers/{pg.id}</strong></div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Page title</label>
                  <input className="hs-input" value={pg.title || ''} onChange={(e) => setListItem('detailPages', i, 'title', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">Text</label>
                  <textarea className="hs-textarea" style={{ minHeight: 220 }} value={pg.body || ''} onChange={(e) => setListItem('detailPages', i, 'body', e.target.value)} />
                </div>
              </div>
              <ImageField
                label="Picture at the top (optional)"
                hint="Empty = the same picture as the card."
                aspect="1.46 / 1"
                value={pg.image}
                onChange={(url) => setListItem('detailPages', i, 'image', url)}
                uploader={uploadCareersPageFile}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Apply + profile */}
      <div className="hs-card">
        <h3>Apply button &amp; Corporate Profile box</h3>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          <div>
            <label className="hs-label">Orange button text</label>
            <input className="hs-input" value={data.applyText || ''} onChange={(e) => setField('applyText', e.target.value)} />
          </div>
          <div>
            <label className="hs-label">Button link</label>
            <input className="hs-input" placeholder="#job-categories" value={data.applyLink || ''} onChange={(e) => setField('applyLink', e.target.value)} />
            <small className="hs-hint">#job-categories scrolls down to the Job Categories. You can also use /contact or https://…</small>
          </div>
        </div>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          <div>
            <label className="hs-label">Grey box — small line</label>
            <input className="hs-input" value={data.profileSmall || ''} onChange={(e) => setField('profileSmall', e.target.value)} />
          </div>
          <div>
            <label className="hs-label">Grey box — big line</label>
            <input className="hs-input" value={data.profileTitle || ''} onChange={(e) => setField('profileTitle', e.target.value)} />
          </div>
        </div>
        <div className="hs-grid">
          <ImageField
            label="Corporate Profile picture (optional)"
            hint="Upload the profile artwork to replace the grey box. Empty = the grey box with the words above."
            aspect="3 / 1"
            value={data.profileImage}
            onChange={(url) => setField('profileImage', url)}
            uploader={uploadCareersPageFile}
          />
          <div>
            <label className="hs-label">Link when the box is clicked (optional)</label>
            <input className="hs-input" placeholder="https://… link to the profile PDF" value={data.profileLink || ''} onChange={(e) => setField('profileLink', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Job categories */}
      <div className="hs-card">
        <h3>Job Categories</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Heading</label>
          <input className="hs-input" value={data.categoriesHeading || ''} onChange={(e) => setField('categoriesHeading', e.target.value)} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="hs-label">Text</label>
          <textarea className="hs-textarea" style={{ minHeight: 140 }} value={data.categoriesBody || ''} onChange={(e) => setField('categoriesBody', e.target.value)} />
        </div>
        <p className="hs-hint" style={{ marginBottom: 12 }}>
          The names in the navy band. When a visitor clicks one, the jobs you post under Careers whose Department matches that name are shown.
        </p>
        {categories.map((cat, i) => (
          <div className="hs-row" key={cat.id}>
            <div className="hs-row-head">
              <strong>{i + 1}.</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveItem('categories', i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveItem('categories', i, 1)} disabled={i === categories.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeCategory(i)}><Trash2 size={16} /></button>
              </div>
            </div>
            <input className="hs-input" value={cat.name || ''} onChange={(e) => setListItem('categories', i, 'name', e.target.value)} />
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={addCategory}><Plus size={16} /> Add category</button>
      </div>
    </div>
  );
};

export default CareersPageManager;
