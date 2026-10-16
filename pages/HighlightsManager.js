import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getHighlights,
  saveHighlights,
  uploadHighlightsFile,
} from '../services/contentService';
import './HomeSections.css';

const blankItem = (size) => ({
  id: `highlight-${Date.now()}`,
  size,
  image: '',
  heading: '', subheading: '', year: '',
  panelColor: '#272f4d', panelHeading: '', panelSubheading: '',
  personName: '', personRole: '',
  caption: '', captionButtonText: 'Read More',
  buttonUrl: '',
});

const HighlightsManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(getHighlights, saveHighlights);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const items = data.items || [];

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const setItem = (index, field, value) =>
    setData((d) => ({
      ...d,
      items: d.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));

  const move = (index, dir) =>
    setData((d) => {
      const next = [...d.items];
      const target = index + dir;
      if (target < 0 || target >= next.length) return d;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...d, items: next };
    });

  const addItem = (size) => setData((d) => ({ ...d, items: [...d.items, blankItem(size)] }));

  const removeItem = (index) => {
    if (!window.confirm('Remove this card?')) return;
    setData((d) => ({ ...d, items: d.items.filter((_, i) => i !== index) }));
  };

  return (
    <div className="hs-page">
      <SectionHeader
        title='Home "Sethmo Highlights And Latest Updates"'
        description="The grid of report and news cards under the Press Releases banner. The first row is the small report cards, the second row is the three larger feature cards."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <label className="hs-label">Section title</label>
        <input className="hs-input" value={data.title || ''} onChange={(e) => setField('title', e.target.value)} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h3 style={{ margin: 0 }}>Cards ({items.length})</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="hs-add-btn" onClick={() => addItem('report')}>
            <Plus size={16} /> Add report card
          </button>
          <button type="button" className="hs-add-btn" onClick={() => addItem('feature')}>
            <Plus size={16} /> Add feature card
          </button>
        </div>
      </div>

      {items.map((item, i) => (
        <div className="hs-row" key={item.id}>
          <div className="hs-row-head">
            <strong>
              {i + 1}. {item.heading || item.panelHeading || 'New card'}{' '}
              <span style={{ fontWeight: 400, color: '#718096' }}>
                — {item.size === 'feature' ? 'feature card' : 'report card'}
              </span>
            </strong>
            <div className="hs-row-tools">
              <button type="button" className="hs-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} title="Move earlier">
                <ArrowUp size={16} />
              </button>
              <button type="button" className="hs-icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move later">
                <ArrowDown size={16} />
              </button>
              <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeItem(i)} title="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {item.size === 'feature' ? (
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Heading on the card</label>
                  <input className="hs-input" value={item.panelHeading || ''} onChange={(e) => setItem(i, 'panelHeading', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Text on the card</label>
                  <textarea className="hs-textarea" value={item.panelSubheading || ''} onChange={(e) => setItem(i, 'panelSubheading', e.target.value)} />
                </div>
                <div className="hs-grid" style={{ marginBottom: 14 }}>
                  <div>
                    <label className="hs-label">Name (optional)</label>
                    <input className="hs-input" value={item.personName || ''} onChange={(e) => setItem(i, 'personName', e.target.value)} />
                  </div>
                  <div>
                    <label className="hs-label">Role (optional)</label>
                    <input className="hs-input" value={item.personRole || ''} onChange={(e) => setItem(i, 'personRole', e.target.value)} />
                  </div>
                </div>
                <div>
                  <span className="hs-label">Colour of the text panel</span>
                  <div className="hs-inline">
                    <input type="color" value={item.panelColor || '#272f4d'} onChange={(e) => setItem(i, 'panelColor', e.target.value)} />
                    <input className="hs-input" style={{ maxWidth: 130 }} value={item.panelColor || ''} onChange={(e) => setItem(i, 'panelColor', e.target.value)} />
                  </div>
                  <small className="hs-hint">Use white (#ffffff) for a card like “Vision 2027”, where the picture sits under the heading instead of behind it.</small>
                </div>
              </div>

              <ImageField
                label="Picture"
                hint="Photo or graphic for this card. Leave empty to use the default."
                aspect="4 / 5"
                value={item.image}
                onChange={(url) => setItem(i, 'image', url)}
                uploader={uploadHighlightsFile}
              />
            </div>
          ) : (
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Heading (white footer, bold)</label>
                  <input className="hs-input" value={item.heading || ''} onChange={(e) => setItem(i, 'heading', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Subheading (white footer)</label>
                  <input className="hs-input" value={item.subheading || ''} onChange={(e) => setItem(i, 'subheading', e.target.value)} />
                </div>
                <div>
                  <label className="hs-label">Year</label>
                  <input className="hs-input" value={item.year || ''} onChange={(e) => setItem(i, 'year', e.target.value)} />
                </div>
              </div>

              <ImageField
                label="Card picture"
                hint="Landscape picture, about 625 × 434 px. Leave empty to use the default."
                aspect="16 / 11"
                value={item.image}
                onChange={(url) => setItem(i, 'image', url)}
                uploader={uploadHighlightsFile}
              />
            </div>
          )}

          <div className="hs-grid" style={{ marginTop: 14 }}>
            {item.size === 'feature' && (
              <div>
                <label className="hs-label">“Read More” button text (under the card)</label>
                <input className="hs-input" value={item.captionButtonText || ''} onChange={(e) => setItem(i, 'captionButtonText', e.target.value)} />
              </div>
            )}
            <div>
              <label className="hs-label">Link (both the arrow and the button use this)</label>
              <input className="hs-input" placeholder="/news/... or https://…" value={item.buttonUrl || ''} onChange={(e) => setItem(i, 'buttonUrl', e.target.value)} />
            </div>
          </div>

          {item.size === 'feature' && (
            <div style={{ marginTop: 14 }}>
              <label className="hs-label">Caption under the card</label>
              <textarea className="hs-textarea" value={item.caption || ''} onChange={(e) => setItem(i, 'caption', e.target.value)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HighlightsManager;
