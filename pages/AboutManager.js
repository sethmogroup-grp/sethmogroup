import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import { getAboutData, saveAboutData, uploadAboutFile } from '../services/contentService';
import './HomeSections.css';

const emptyValue = () => ({ title: '', tagline: '' });

const AboutManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(getAboutData, saveAboutData);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  // ---- helpers ----
  const setHero = (field, value) => setData((d) => ({ ...d, hero: { ...d.hero, [field]: value } }));
  const setHistory = (field, value) => setData((d) => ({ ...d, history: { ...d.history, [field]: value } }));
  const setValues = (field, value) => setData((d) => ({ ...d, values: { ...d.values, [field]: value } }));
  const setPurpose = (field, value) => setData((d) => ({ ...d, purpose: { ...d.purpose, [field]: value } }));

  // ---- history images (carousel) ----
  const historyImages = data.history?.images || [];

  const addHistoryImage = () => setHistory('images', [...historyImages, '']);

  const setHistoryImage = (index, url) => {
    const updated = [...historyImages];
    updated[index] = url;
    setHistory('images', updated);
  };

  const removeHistoryImage = (index) => {
    setHistory('images', historyImages.filter((_, i) => i !== index));
  };

  // ---- values grid ----
  const valueItems = data.values?.items || [];

  const setValueField = (index, field, value) => {
    const updated = [...valueItems];
    updated[index] = { ...updated[index], [field]: value };
    setValues('items', updated);
  };

  const addValue = () => setValues('items', [...valueItems, emptyValue()]);
  const removeValue = (index) => setValues('items', valueItems.filter((_, i) => i !== index));

  return (
    <div className="hs-page">
      <SectionHeader
        title="About Page — General Info"
        description="Everything on the public About page: the top banner, the History section, the Our Values grid, and the closing Our Purpose banner."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      {/* HERO */}
      <div className="hs-card">
        <h3>Top Banner (Hero)</h3>
        <div className="hs-grid">
          <div className="hs-full">
            <label className="hs-label">Page Title</label>
            <input
              className="hs-input"
              value={data.hero?.title || ''}
              onChange={(e) => setHero('title', e.target.value)}
            />
          </div>
          <div className="hs-full">
            <label className="hs-label">Subtitle</label>
            <textarea
              className="hs-textarea"
              value={data.hero?.subtitle || ''}
              onChange={(e) => setHero('subtitle', e.target.value)}
            />
          </div>
          <div className="hs-full">
            <ImageField
              label="Background Photo"
              hint="A wide landscape photo works best (e.g. an office or building). Leave empty for a plain dark background."
              aspect="21 / 9"
              value={data.hero?.backgroundImage}
              onChange={(url) => setHero('backgroundImage', url)}
              uploader={uploadAboutFile}
            />
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <div className="hs-card">
        <h3>History Section</h3>
        <div className="hs-grid">
          <div>
            <label className="hs-label">Heading</label>
            <input
              className="hs-input"
              value={data.history?.heading || ''}
              onChange={(e) => setHistory('heading', e.target.value)}
            />
          </div>
          <div>
            <label className="hs-label">Button Text</label>
            <input
              className="hs-input"
              value={data.history?.buttonText || ''}
              onChange={(e) => setHistory('buttonText', e.target.value)}
              placeholder="Read More"
            />
          </div>
          <div className="hs-full">
            <label className="hs-label">Text</label>
            <textarea
              className="hs-textarea"
              value={data.history?.text || ''}
              onChange={(e) => setHistory('text', e.target.value)}
            />
            <small className="hs-hint">
              If this text is long, the website automatically shortens it and shows the button above to expand it.
            </small>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="hs-row-head">
            <strong>Photo Carousel ({historyImages.length})</strong>
            <button type="button" className="hs-add-btn" onClick={addHistoryImage}>
              <Plus size={15} /> Add Photo
            </button>
          </div>
          <small className="hs-hint" style={{ marginBottom: 12, display: 'block' }}>
            Add one photo, or several — with two or more, the website automatically rotates between them with dot
            indicators underneath.
          </small>

          {historyImages.map((img, i) => (
            <div className="hs-row" key={i}>
              <div className="hs-row-head">
                <strong>Photo {i + 1}</strong>
                <div className="hs-row-tools">
                  <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeHistoryImage(i)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <ImageField
                label={`Photo ${i + 1}`}
                aspect="4 / 3"
                value={img}
                onChange={(url) => setHistoryImage(i, url)}
                uploader={uploadAboutFile}
              />
            </div>
          ))}
        </div>
      </div>

      {/* OUR VALUES */}
      <div className="hs-card">
        <h3>Our Values</h3>
        <div className="hs-grid">
          <div className="hs-full">
            <label className="hs-label">Section Heading</label>
            <input
              className="hs-input"
              value={data.values?.heading || ''}
              onChange={(e) => setValues('heading', e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="hs-row-head">
            <strong>Value Tiles ({valueItems.length})</strong>
            <button type="button" className="hs-add-btn" onClick={addValue}>
              <Plus size={15} /> Add Value
            </button>
          </div>

          {valueItems.map((item, i) => (
            <div className="hs-row" key={i}>
              <div className="hs-row-head">
                <strong>Value {i + 1}</strong>
                <div className="hs-row-tools">
                  <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeValue(i)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="hs-grid">
                <div>
                  <label className="hs-label">Title</label>
                  <input
                    className="hs-input"
                    value={item.title || ''}
                    onChange={(e) => setValueField(i, 'title', e.target.value)}
                    placeholder="e.g. Integrity"
                  />
                </div>
                <div>
                  <label className="hs-label">Tagline</label>
                  <input
                    className="hs-input"
                    value={item.tagline || ''}
                    onChange={(e) => setValueField(i, 'tagline', e.target.value)}
                    placeholder="e.g. We Do What Is Right"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OUR PURPOSE */}
      <div className="hs-card">
        <h3>Our Purpose (closing banner)</h3>
        <div className="hs-grid">
          <div>
            <label className="hs-label">Heading</label>
            <input
              className="hs-input"
              value={data.purpose?.heading || ''}
              onChange={(e) => setPurpose('heading', e.target.value)}
            />
          </div>
          <div>
            <label className="hs-label">Bold Highlight Line (over the photo)</label>
            <input
              className="hs-input"
              value={data.purpose?.highlight || ''}
              onChange={(e) => setPurpose('highlight', e.target.value)}
              placeholder="Inspired By You"
            />
          </div>
          <div className="hs-full">
            <label className="hs-label">Text</label>
            <textarea
              className="hs-textarea"
              value={data.purpose?.text || ''}
              onChange={(e) => setPurpose('text', e.target.value)}
            />
          </div>
          <div className="hs-full">
            <ImageField
              label="Background Photo"
              hint="A wide, high-impact photo for the closing banner."
              aspect="21 / 9"
              value={data.purpose?.backgroundImage}
              onChange={(url) => setPurpose('backgroundImage', url)}
              uploader={uploadAboutFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
