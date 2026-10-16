import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getBusinessFocus,
  saveBusinessFocus,
  uploadBusinessFocusFile,
} from '../services/contentService';
import './HomeSections.css';

const BusinessFocusManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getBusinessFocus,
    saveBusinessFocus
  );

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

  const addItem = () =>
    setData((d) => ({
      ...d,
      items: [...d.items, { id: `focus-${Date.now()}`, label: '', image: '', link: '' }],
    }));

  const removeItem = (index) => {
    if (!window.confirm('Remove this card from the slide?')) return;
    setData((d) => ({ ...d, items: d.items.filter((_, i) => i !== index) }));
  };

  return (
    <div className="hs-page">
      <SectionHeader
        title='Home "Business Focus" (3D slide)'
        description="The 3D slide that replaces the old “Our Businesses” section. Each card is one industry."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Heading and loop</h3>
        <div className="hs-grid">
          <div className="hs-full">
            <label className="hs-label">Title</label>
            <input
              className="hs-input"
              value={data.title || ''}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>
          <div className="hs-full">
            <label className="hs-label">Description</label>
            <textarea
              className="hs-textarea"
              value={data.description || ''}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          <div>
            <span className="hs-label">Automatic loop</span>
            <label className="hs-inline">
              <input
                type="checkbox"
                checked={data.autoplay !== false}
                onChange={(e) => setField('autoplay', e.target.checked)}
              />
              Keep the slide moving on its own
            </label>
          </div>
          <div>
            <span className="hs-label">Seconds between each move</span>
            <div className="hs-inline">
              <input
                className="hs-input"
                type="number"
                min="1"
                max="30"
                step="0.5"
                value={data.speedSeconds}
                onChange={(e) => setField('speedSeconds', Number(e.target.value))}
              />
              <small className="hs-hint" style={{ margin: 0 }}>
                4 = slow. Higher is slower.
              </small>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Cards ({items.length})</h3>
        <button type="button" className="hs-add-btn" onClick={addItem}>
          <Plus size={16} /> Add card
        </button>
      </div>

      {items.map((item, i) => (
        <div className="hs-row" key={item.id}>
          <div className="hs-row-head">
            <strong>
              {i + 1}. {item.label || 'New card'}
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

          <div className="hs-grid">
            <div>
              <div style={{ marginBottom: 14 }}>
                <label className="hs-label">Name under the card</label>
                <input
                  className="hs-input"
                  value={item.label || ''}
                  onChange={(e) => setItem(i, 'label', e.target.value)}
                />
              </div>
              <div>
                <label className="hs-label">Link when the centre card is clicked (optional)</label>
                <input
                  className="hs-input"
                  placeholder="/services or https://…"
                  value={item.link || ''}
                  onChange={(e) => setItem(i, 'link', e.target.value)}
                />
              </div>
            </div>

            <ImageField
              label="Card picture"
              hint="Portrait picture, about 400 × 505 px (4:5). Leave empty to use the default."
              aspect="1 / 1.26"
              value={item.image}
              onChange={(url) => setItem(i, 'image', url)}
              uploader={uploadBusinessFocusFile}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessFocusManager;
