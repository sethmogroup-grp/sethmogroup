import React from 'react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getCustomerCentric,
  saveCustomerCentric,
  uploadCustomerCentricFile,
} from '../services/contentService';
import './HomeSections.css';

const CustomerCentricManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getCustomerCentric,
    saveCustomerCentric
  );

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  return (
    <div className="hs-page">
      <SectionHeader
        title='Home "Our Brands. Centered on You."'
        description="The customer-centric section that follows Our Footprint | Our Vision | Our Mission."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Words</h3>
        <div className="hs-grid">
          <div className="hs-full">
            <label className="hs-label">Heading</label>
            <input
              className="hs-input"
              value={data.heading || ''}
              onChange={(e) => setField('heading', e.target.value)}
            />
          </div>

          <div className="hs-full">
            <label className="hs-label">Text</label>
            <textarea
              className="hs-textarea"
              style={{ minHeight: 240 }}
              value={data.body || ''}
              onChange={(e) => setField('body', e.target.value)}
            />
            <small className="hs-hint">
              Leave a blank line between paragraphs. A single new line stays inside the same paragraph.
            </small>
          </div>

          <div>
            <label className="hs-label">Button text</label>
            <input
              className="hs-input"
              value={data.buttonText || ''}
              onChange={(e) => setField('buttonText', e.target.value)}
            />
          </div>
          <div>
            <label className="hs-label">Button link</label>
            <input
              className="hs-input"
              placeholder="/about or https://…"
              value={data.buttonUrl || ''}
              onChange={(e) => setField('buttonUrl', e.target.value)}
            />
            <small className="hs-hint">Clear the text or the link to hide the button.</small>
          </div>
        </div>
      </div>

      <div className="hs-card">
        <h3>Pictures</h3>
        <div className="hs-grid">
          <ImageField
            label="Person cut-out (left)"
            hint="Transparent PNG of a person, cut out from the background. Leave empty to use the default."
            aspect="3 / 4"
            contain
            value={data.personImage}
            onChange={(url) => setField('personImage', url)}
            uploader={uploadCustomerCentricFile}
          />
          <ImageField
            label="Photo (right)"
            hint="Fills the right side of the section. Leave empty to use the default."
            aspect="4 / 3"
            value={data.sideImage}
            onChange={(url) => setField('sideImage', url)}
            uploader={uploadCustomerCentricFile}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerCentricManager;
