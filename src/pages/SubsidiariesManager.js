import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getSubsidiariesSection,
  saveSubsidiariesSection,
  uploadSubsidiariesFile,
} from '../services/contentService';
import './HomeSections.css';

// Where each company sits around the Sethmo Group logo (matches the approved layout)
const SPOTS = [
  'top right',
  'top centre',
  'left',
  'right',
  'lower left',
  'lower right',
  'bottom centre',
  'bottom left',
  'bottom right',
];

const SubsidiariesManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getSubsidiariesSection,
    saveSubsidiariesSection
  );

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const items = data.items || [];
  const usesFixedSpots = items.length <= SPOTS.length;

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
      items: [...d.items, { id: `sub-${Date.now()}`, name: '', logo: '', link: '' }],
    }));

  const removeItem = (index) => {
    if (!window.confirm('Remove this subsidiary from the page?')) return;
    setData((d) => ({ ...d, items: d.items.filter((_, i) => i !== index) }));
  };

  return (
    <div className="hs-page">
      <SectionHeader
        title="Home “Sethmo Group and its Subsidiaries”"
        description="The Sethmo Group logo in the middle with a dotted arrow out to each subsidiary."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Heading and centre logo</h3>
        <div className="hs-grid">
          <div>
            <label className="hs-label">Title (right side)</label>
            <input
              className="hs-input"
              value={data.title || ''}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>
          <ImageField
            label="Centre logo"
            hint="Transparent PNG. Leave empty to use the default Sethmo Group logo."
            aspect="16 / 9"
            contain
            value={data.hubLogo}
            onChange={(url) => setField('hubLogo', url)}
            uploader={uploadSubsidiariesFile}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <h3 style={{ margin: 0 }}>Subsidiaries ({items.length})</h3>
        <button type="button" className="hs-add-btn" onClick={addItem}>
          <Plus size={16} /> Add subsidiary
        </button>
      </div>
      <p className="hs-sub" style={{ marginBottom: 14 }}>
        {usesFixedSpots
          ? 'The order decides the spot around the centre logo. Use the arrows to swap places.'
          : `With more than ${SPOTS.length} subsidiaries they are spread evenly in a circle around the centre logo.`}
      </p>

      {items.map((item, i) => (
        <div className="hs-row" key={item.id}>
          <div className="hs-row-head">
            <strong>
              {i + 1}. {item.name || 'New subsidiary'}
              {usesFixedSpots && (
                <span style={{ fontWeight: 400, color: '#718096' }}> — {SPOTS[i]}</span>
              )}
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
                <label className="hs-label">Company name</label>
                <input
                  className="hs-input"
                  value={item.name || ''}
                  onChange={(e) => setItem(i, 'name', e.target.value)}
                />
                <small className="hs-hint">Used as the logo’s description for screen readers and search engines.</small>
              </div>
              <div>
                <label className="hs-label">Link when the logo is clicked (optional)</label>
                <input
                  className="hs-input"
                  placeholder="https://… or /services"
                  value={item.link || ''}
                  onChange={(e) => setItem(i, 'link', e.target.value)}
                />
              </div>
            </div>

            <ImageField
              label="Logo"
              hint="Logo on a transparent background (PNG). Leave empty to use the default logo, if there is one."
              aspect="16 / 9"
              contain
              value={item.logo}
              onChange={(url) => setItem(i, 'logo', url)}
              uploader={uploadSubsidiariesFile}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubsidiariesManager;
