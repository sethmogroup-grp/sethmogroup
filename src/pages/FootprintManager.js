import React from 'react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getFootprintTabs,
  saveFootprintTabs,
  uploadFootprintFile,
} from '../services/contentService';
import './HomeSections.css';

const SIDE_IMAGE = {
  footprint: {
    label: 'Map picture (right side)',
    hint: 'Transparent PNG works best. Leave empty to use the default Africa map.',
    aspect: '4 / 5',
  },
  vision: {
    label: 'Person cut-out (left side)',
    hint: 'Transparent PNG of a person, cut out from the background. It stands on the bottom edge of the card.',
    aspect: '3 / 5',
  },
  mission: {
    label: 'Flag picture (right side)',
    hint: 'Transparent PNG works best. It is allowed to overlap the top and right edge of the card.',
    aspect: '7 / 5',
  },
};

const TITLES = {
  footprint: 'Slide 1 — Our Footprint',
  vision: 'Slide 2 — Our Vision',
  mission: 'Slide 3 — Our Mission',
};

const FootprintManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(
    getFootprintTabs,
    saveFootprintTabs
  );

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const setSlide = (index, field, value) =>
    setData((d) => ({
      ...d,
      slides: d.slides.map((slide, i) => (i === index ? { ...slide, [field]: value } : slide)),
    }));

  return (
    <div className="hs-page">
      <SectionHeader
        title='Home "Our Footprint | Our Vision | Our Mission"'
        description="The looping tabbed banner right after the full-width banner. Change the words and pictures of each tab, and how fast it loops."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>Loop</h3>
        <div className="hs-grid">
          <div>
            <span className="hs-label">Automatic loop</span>
            <label className="hs-inline">
              <input
                type="checkbox"
                checked={data.autoplay !== false}
                onChange={(e) => setField('autoplay', e.target.checked)}
              />
              Move to the next tab automatically
            </label>
          </div>
          <div>
            <span className="hs-label">Seconds each tab stays on screen</span>
            <div className="hs-inline">
              <input
                className="hs-input"
                type="number"
                min="2"
                max="60"
                step="1"
                value={data.intervalSeconds}
                onChange={(e) => setField('intervalSeconds', Number(e.target.value))}
              />
              <small className="hs-hint" style={{ margin: 0 }}>
                7 = medium. Lower is faster, higher is slower.
              </small>
            </div>
          </div>
        </div>
      </div>

      {data.slides.map((slide, i) => {
        const side = SIDE_IMAGE[slide.id] || SIDE_IMAGE.footprint;
        const isFootprint = slide.id === 'footprint';
        const isVision = slide.id === 'vision';

        return (
          <div className="hs-card" key={slide.id}>
            <h3>{TITLES[slide.id] || slide.id}</h3>

            <div className="hs-grid">
              <div>
                <label className="hs-label">Tab name (top row)</label>
                <input
                  className="hs-input"
                  value={slide.tabLabel}
                  onChange={(e) => setSlide(i, 'tabLabel', e.target.value)}
                />
              </div>
              <div>
                <label className="hs-label">Heading on the card</label>
                <input
                  className="hs-input"
                  value={slide.heading}
                  onChange={(e) => setSlide(i, 'heading', e.target.value)}
                />
                <small className="hs-hint">The first word goes on the first line, the rest on the second.</small>
              </div>

              {isFootprint && (
                <div className="hs-full">
                  <label className="hs-label">Short line under the heading</label>
                  <input
                    className="hs-input"
                    value={slide.subheading || ''}
                    onChange={(e) => setSlide(i, 'subheading', e.target.value)}
                  />
                </div>
              )}

              {isVision && (
                <div className="hs-full">
                  <label className="hs-label">Quote (next to the person)</label>
                  <input
                    className="hs-input"
                    value={slide.quote || ''}
                    onChange={(e) => setSlide(i, 'quote', e.target.value)}
                  />
                </div>
              )}

              <div className="hs-full">
                <label className="hs-label">Text</label>
                <textarea
                  className="hs-textarea"
                  value={slide.body || ''}
                  onChange={(e) => setSlide(i, 'body', e.target.value)}
                />
              </div>

              {isFootprint && (
                <>
                  <div>
                    <label className="hs-label">Button text</label>
                    <input
                      className="hs-input"
                      value={slide.buttonText || ''}
                      onChange={(e) => setSlide(i, 'buttonText', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="hs-label">Button link</label>
                    <input
                      className="hs-input"
                      placeholder="/about or https://…"
                      value={slide.buttonUrl || ''}
                      onChange={(e) => setSlide(i, 'buttonUrl', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <span className="hs-label">Colour of the text panel</span>
                <div className="hs-inline">
                  <input
                    type="color"
                    value={slide.panelColor || '#272f4d'}
                    onChange={(e) => setSlide(i, 'panelColor', e.target.value)}
                  />
                  <input
                    className="hs-input"
                    style={{ maxWidth: 130 }}
                    value={slide.panelColor || ''}
                    onChange={(e) => setSlide(i, 'panelColor', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="hs-grid" style={{ marginTop: 18 }}>
              <ImageField
                label="Photo on the card"
                hint="Landscape photo, about 500 × 440 px or larger. Leave empty to use the default."
                aspect="8 / 7"
                value={slide.photo}
                onChange={(url) => setSlide(i, 'photo', url)}
                uploader={uploadFootprintFile}
              />
              <ImageField
                label={side.label}
                hint={side.hint}
                aspect={side.aspect}
                contain
                value={slide.sideImage}
                onChange={(url) => setSlide(i, 'sideImage', url)}
                uploader={uploadFootprintFile}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FootprintManager;
