import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import { getFooterSettings, saveFooterSettings } from '../services/contentService';
import './HomeSections.css';

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/…' },
  { key: 'x', label: 'X (formerly Twitter)', placeholder: 'https://x.com/…' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/…' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@…' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/…' },
];

const FooterManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(getFooterSettings, saveFooterSettings);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const setLine = (list, i, text) =>
    setData((d) => ({ ...d, [list]: (d[list] || []).map((l, idx) => (idx === i ? { ...l, text } : l)) }));
  const moveLine = (list, i, dir) =>
    setData((d) => {
      const next = [...(d[list] || [])];
      const t = i + dir;
      if (t < 0 || t >= next.length) return d;
      [next[i], next[t]] = [next[t], next[i]];
      return { ...d, [list]: next };
    });
  const addLine = (list, prefix) =>
    setData((d) => ({ ...d, [list]: [...(d[list] || []), { id: `${prefix}${Date.now()}`, text: '' }] }));
  const removeLine = (list, i, what) => {
    if (!window.confirm(`Remove this ${what}?`)) return;
    setData((d) => ({ ...d, [list]: (d[list] || []).filter((_, idx) => idx !== i) }));
  };

  const renderList = (list, prefix, what, placeholder) => {
    const items = data[list] || [];
    return (
      <>
        {items.map((item, i) => (
          <div className="hs-row" key={item.id}>
            <div className="hs-row-head">
              <strong>{i + 1}.</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveLine(list, i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveLine(list, i, 1)} disabled={i === items.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeLine(list, i, what)}><Trash2 size={16} /></button>
              </div>
            </div>
            <input className="hs-input" placeholder={placeholder} value={item.text || ''} onChange={(e) => setLine(list, i, e.target.value)} />
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={() => addLine(list, prefix)}>
          <Plus size={16} /> Add {what}
        </button>
      </>
    );
  };

  return (
    <div className="hs-page">
      <SectionHeader
        title="Footer & Contact"
        description="The “Contact Us” column and the social icons in the footer at the bottom of every page. Changes show on the website straight after you save."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Address</h3>
        <label className="hs-label">Address lines</label>
        <textarea
          className="hs-textarea"
          style={{ minHeight: 90 }}
          value={data.addressLines || ''}
          onChange={(e) => setField('addressLines', e.target.value)}
        />
        <small className="hs-hint">Each new line you type becomes a new line in the footer (the design has the street on the first line and “Zambia” on the second).</small>
      </div>

      <div className="hs-card">
        <h3>Phone numbers</h3>
        <p className="hs-hint" style={{ marginBottom: 12 }}>
          Type them the way you want them to read. Visitors on a phone can tap a number to call it.
        </p>
        {renderList('phones', 'ph', 'phone number', '(+260) 767 841 135')}
      </div>

      <div className="hs-card">
        <h3>Email addresses</h3>
        <p className="hs-hint" style={{ marginBottom: 12 }}>Each one becomes a link that opens the visitor’s email app.</p>
        {renderList('emails', 'em', 'email address', 'info@sethmogroup.com')}
      </div>

      <div className="hs-card">
        <h3>Social media links</h3>
        <p className="hs-hint" style={{ marginBottom: 12 }}>
          Paste the full web address of each page. An icon with an empty box stays in the footer but is not clickable until you add its link.
        </p>
        <div className="hs-grid">
          {SOCIALS.map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label className="hs-label">{label}</label>
              <input
                className="hs-input"
                placeholder={placeholder}
                value={data[key] || ''}
                onChange={(e) => setField(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterManager;
