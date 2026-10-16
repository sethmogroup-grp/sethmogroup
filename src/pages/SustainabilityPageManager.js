import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import VideoField from '../components/VideoField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getSustainabilityPage,
  saveSustainabilityPage,
  uploadSustainabilityPageFile,
} from '../services/contentService';
import './HomeSections.css';

const blankItem = () => ({
  id: `feature-${Date.now()}`,
  heading: '',
  body: '',
  buttonText: '',
  buttonUrl: '',
  image: '',
});

const SustainabilityPageManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getSustainabilityPage,
    saveSustainabilityPage
  );

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

  const items = data.items || [];

  return (
    <div className="hs-page">
      <SectionHeader
        title="Sustainability Page"
        description="The Sustainability page: the hero (with an optional background video), the intro blurb, and the feature rows. Rows alternate the photo left/right automatically — you don't need to set that."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      {/* Hero */}
      <div className="hs-card">
        <h3>Hero (top of the page)</h3>
        <div className="hs-grid">
          <div>
            <div style={{ marginBottom: 14 }}>
              <label className="hs-label">Heading</label>
              <input className="hs-input" value={data.heroHeading || ''} onChange={(e) => setField('heroHeading', e.target.value)} />
            </div>
            <div>
              <label className="hs-label">Subtitle</label>
              <textarea className="hs-textarea" value={data.heroSubtitle || ''} onChange={(e) => setField('heroSubtitle', e.target.value)} />
            </div>
          </div>
          <ImageField
            label="Background picture"
            hint="Wide photo, at least 1600px wide. Used behind the hero text when there's no video."
            aspect="16 / 9"
            value={data.heroImage}
            onChange={(url) => setField('heroImage', url)}
            uploader={uploadSustainabilityPageFile}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <VideoField
            label="Background video (optional)"
            hint="Short, muted, looping video. When set, it plays behind the hero instead of the background picture."
            value={data.heroVideo}
            onChange={(url) => setField('heroVideo', url)}
            uploader={uploadSustainabilityPageFile}
          />
        </div>
      </div>

      {/* Intro */}
      <div className="hs-card">
        <h3>Intro</h3>
        <div style={{ marginBottom: 14 }}>
          <label className="hs-label">Heading</label>
          <input className="hs-input" value={data.introHeading || ''} onChange={(e) => setField('introHeading', e.target.value)} />
        </div>
        <div>
          <label className="hs-label">Text</label>
          <textarea className="hs-textarea" style={{ minHeight: 100 }} value={data.introBody || ''} onChange={(e) => setField('introBody', e.target.value)} />
        </div>
      </div>

      {/* Feature rows */}
      <div className="hs-card">
        <h3>Feature Rows</h3>
        <p className="hs-hint" style={{ marginTop: -6, marginBottom: 16 }}>
          Each row is a photo with a heading, short text, and a button. They alternate photo-right / photo-left down the page automatically, in the order listed below.
        </p>

        {items.map((item, i) => (
          <div className="hs-row" key={item.id}>
            <div className="hs-row-head">
              <strong>{i + 1}. {item.heading || 'New row'}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('items', i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveListItem('items', i, 1)} disabled={i === items.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeListItem('items', i, 'Remove this row?')}><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="hs-grid">
              <div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Heading</label>
                  <input className="hs-input" value={item.heading || ''} onChange={(e) => setListItem('items', i, 'heading', e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label className="hs-label">Text</label>
                  <textarea className="hs-textarea" value={item.body || ''} onChange={(e) => setListItem('items', i, 'body', e.target.value)} />
                </div>
                <div className="hs-grid">
                  <div>
                    <label className="hs-label">Button text</label>
                    <input className="hs-input" value={item.buttonText || ''} onChange={(e) => setListItem('items', i, 'buttonText', e.target.value)} />
                  </div>
                  <div>
                    <label className="hs-label">Button link</label>
                    <input className="hs-input" placeholder="/contact or https://…" value={item.buttonUrl || ''} onChange={(e) => setListItem('items', i, 'buttonUrl', e.target.value)} />
                  </div>
                </div>
              </div>
              <ImageField
                label="Photo"
                hint="Landscape photo, roughly 16:10. Leave empty to use a plain placeholder block."
                aspect="16 / 10"
                value={item.image}
                onChange={(url) => setListItem('items', i, 'image', url)}
                uploader={uploadSustainabilityPageFile}
              />
            </div>
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={() => addListItem('items', blankItem)}>
          <Plus size={16} /> Add row
        </button>
      </div>
    </div>
  );
};

export default SustainabilityPageManager;
