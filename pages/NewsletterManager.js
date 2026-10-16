import React from 'react';
import { Users } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getNewsletterSection,
  saveNewsletterSection,
  uploadNewsletterFile,
  getNewsletterSubscribers,
} from '../services/contentService';
import './HomeSections.css';

const NewsletterManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getNewsletterSection,
    saveNewsletterSection
  );
  const [subscribers, setSubscribers] = React.useState(null);

  React.useEffect(() => {
    getNewsletterSubscribers()
      .then(setSubscribers)
      .catch(() => setSubscribers(null));
  }, []);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  return (
    <div className="hs-page">
      <SectionHeader
        title='Home "Stay updated with our Newsletters"'
        description="The orange subscribe banner under Sethmo Highlights And Latest Updates."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      {subscribers && (
        <div className="hs-card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={18} />
          <strong>{subscribers.count}</strong> people subscribed so far
        </div>
      )}

      <div className="hs-card">
        <h3>Words</h3>
        <div className="hs-grid">
          <div className="hs-full">
            <label className="hs-label">Heading</label>
            <input className="hs-input" value={data.heading || ''} onChange={(e) => setField('heading', e.target.value)} />
          </div>
          <div className="hs-full">
            <label className="hs-label">Text</label>
            <textarea className="hs-textarea" value={data.body || ''} onChange={(e) => setField('body', e.target.value)} />
          </div>
          <div>
            <label className="hs-label">Email box placeholder</label>
            <input className="hs-input" value={data.placeholder || ''} onChange={(e) => setField('placeholder', e.target.value)} />
          </div>
          <div>
            <label className="hs-label">Button text</label>
            <input className="hs-input" value={data.buttonText || ''} onChange={(e) => setField('buttonText', e.target.value)} />
          </div>
          <div>
            <span className="hs-label">Banner colour</span>
            <div className="hs-inline">
              <input type="color" value={data.panelColor || '#f47b20'} onChange={(e) => setField('panelColor', e.target.value)} />
              <input className="hs-input" style={{ maxWidth: 130 }} value={data.panelColor || ''} onChange={(e) => setField('panelColor', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="hs-card">
        <h3>Icon</h3>
        <ImageField
          label="Icon in the circle"
          hint="Small square picture. Leave empty to use the default envelope icon."
          aspect="1 / 1"
          contain
          value={data.icon}
          onChange={(url) => setField('icon', url)}
          uploader={uploadNewsletterFile}
        />
      </div>
    </div>
  );
};

export default NewsletterManager;
