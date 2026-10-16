import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import ImageField from '../components/ImageField';
import SectionHeader from '../components/SectionHeader';
import useSectionEditor from '../hooks/useSectionEditor';
import {
  getSocialImpact,
  saveSocialImpact,
  uploadSocialImpactFile,
} from '../services/contentService';
import './HomeSections.css';

/** Social Impact -> The Goodness Programme: every word, picture and link of the page, top to bottom. */
const SocialImpactManager = () => {
  const { data, setData, saving, status, handleSave } = useSectionEditor(getSocialImpact, saveSocialImpact);

  if (!data) return <div className="hs-page">{status.message || 'Loading…'}</div>;

  const setField = (field, value) => setData((d) => ({ ...d, [field]: value }));

  // ----- paragraph lists (What do we do / Why do we care) -----
  const setPara = (key, i, text) =>
    setData((d) => ({ ...d, [key]: (d[key] || []).map((p, idx) => (idx === i ? { ...p, text } : p)) }));
  const movePara = (key, i, dir) =>
    setData((d) => {
      const next = [...(d[key] || [])];
      const t = i + dir;
      if (t < 0 || t >= next.length) return d;
      [next[i], next[t]] = [next[t], next[i]];
      return { ...d, [key]: next };
    });
  const addPara = (key) =>
    setData((d) => ({ ...d, [key]: [...(d[key] || []), { id: `p${Date.now()}`, text: '' }] }));
  const removePara = (key, i) => {
    if (!window.confirm('Remove this paragraph?')) return;
    setData((d) => ({ ...d, [key]: (d[key] || []).filter((_, idx) => idx !== i) }));
  };

  // ----- Thapelo Foundation page: sliding hero pictures -----
  const slides = Array.isArray(data.thapeloSlides) ? data.thapeloSlides : [];
  const setSlides = (fn) => setData((d) => ({ ...d, thapeloSlides: fn(Array.isArray(d.thapeloSlides) ? d.thapeloSlides : []) }));
  const setSlideImage = (i, image) => setSlides((l) => l.map((s, idx) => (idx === i ? { ...s, image } : s)));
  const moveSlide = (i, dir) => setSlides((l) => {
    const next = [...l]; const t = i + dir;
    if (t < 0 || t >= next.length) return l;
    [next[i], next[t]] = [next[t], next[i]];
    return next;
  });
  const addSlide = () => setSlides((l) => [...l, { id: `s${Date.now()}`, image: '' }]);
  const removeSlide = (i) => {
    if (!window.confirm('Remove this picture from the slider?')) return;
    setSlides((l) => l.filter((_, idx) => idx !== i));
  };

  // ----- Thapelo Foundation page: colour panels that slide up -----
  const panels = Array.isArray(data.thapeloPanels) ? data.thapeloPanels : [];
  const setPanels = (fn) => setData((d) => ({ ...d, thapeloPanels: fn(Array.isArray(d.thapeloPanels) ? d.thapeloPanels : []) }));
  const setPanel = (i, field, value) => setPanels((l) => l.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  const movePanel = (i, dir) => setPanels((l) => {
    const next = [...l]; const t = i + dir;
    if (t < 0 || t >= next.length) return l;
    [next[i], next[t]] = [next[t], next[i]];
    return next;
  });
  const addPanel = () => setPanels((l) => (l.length >= 4 ? l : [...l, { id: `c${Date.now()}`, color: '#1a7769', label: '', title: '', text: '', buttonText: 'Read More', buttonUrl: '' }]));
  const removePanel = (i) => {
    if (!window.confirm('Remove this colour panel?')) return;
    setPanels((l) => l.filter((_, idx) => idx !== i));
  };

  const input = (label, field, props = {}, hint) => (
    <div style={{ marginBottom: 14 }}>
      <label className="hs-label">{label}</label>
      <input className="hs-input" value={data[field] || ''} onChange={(e) => setField(field, e.target.value)} {...props} />
      {hint && <small className="hs-hint">{hint}</small>}
    </div>
  );

  const area = (label, field, rows = 4, hint) => (
    <div style={{ marginBottom: 14 }}>
      <label className="hs-label">{label}</label>
      <textarea
        className="hs-textarea"
        style={{ minHeight: rows * 26 }}
        value={data[field] || ''}
        onChange={(e) => setField(field, e.target.value)}
      />
      {hint && <small className="hs-hint">{hint}</small>}
    </div>
  );

  const picture = (label, field, hint, aspect, contain = false) => (
    <ImageField
      label={label}
      hint={hint}
      aspect={aspect}
      contain={contain}
      value={data[field]}
      onChange={(url) => setField(field, url)}
      uploader={uploadSocialImpactFile}
    />
  );

  const paragraphs = (key, hint) => {
    const list = data[key] || [];
    return (
      <>
        <p className="hs-hint" style={{ marginBottom: 12 }}>{hint}</p>
        {list.map((p, i) => (
          <div className="hs-row" key={p.id || i}>
            <div className="hs-row-head">
              <strong>Paragraph {i + 1}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => movePara(key, i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => movePara(key, i, 1)} disabled={i === list.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removePara(key, i)}><Trash2 size={16} /></button>
              </div>
            </div>
            <textarea
              className="hs-textarea"
              style={{ minHeight: 110 }}
              value={p.text || ''}
              onChange={(e) => setPara(key, i, e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={() => addPara(key)}><Plus size={16} /> Add paragraph</button>
      </>
    );
  };

  const linkHint = 'A page on the site (/news), a full link (https://…) or a spot on this page (#register). Empty = the button shows but does not open anything.';

  return (
    <div className="hs-page">
      <SectionHeader
        title="Social Impact — The Goodness Programme"
        description="The whole Goodness Programme page (Social Impact → The Goodness Programme), from the baby picture at the top down to the Thapelo Foundation logo. Change any words, picture or link below, then press Save. A picture you leave empty keeps the one the page was designed with."
        saving={saving}
        onSave={handleSave}
        status={status}
      />

      <div className="hs-card">
        <h3>1 · Top banner (baby picture)</h3>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          {picture('Banner picture', 'heroImage', 'Wide picture, about 3 : 1 (for example 1656 × 553 px). Keep the middle clear: the title sits over it.', '3 / 1')}
          {picture('Logo on the banner', 'heroLogo', 'White logo on a transparent background (PNG), about 1.75 : 1. It sits at the top centre.', '1.75 / 1', true)}
        </div>
        {input('Big title', 'heroTitle')}
        {input('Line under the title', 'heroSubtitle')}
      </div>

      <div className="hs-card">
        <h3>2 · What do we do?</h3>
        {picture('Pink watermark picture (behind the words)', 'whatWatermark', 'Optional. Empty = the pink heart from the logo. Use a PNG with a transparent background; it is shown very faintly.', '1 / 1.15', true)}
        <div style={{ height: 14 }} />
        {input('Welcome line', 'welcomeLine')}
        {area('Introduction', 'introText', 3, 'New line = new line on the page.')}
        {input('Heading', 'whatHeading')}
        {paragraphs('whatParagraphs', 'The paragraphs under the heading — add, remove or reorder as you like. Put **two asterisks** around words to make them bold.')}
      </div>

      <div className="hs-card">
        <h3>3 · Why Do We Care?</h3>
        {input('Heading', 'whyHeading')}
        {paragraphs('whyParagraphs', 'Put **two asterisks** around words to make them bold, like the highlighted sentences in the design.')}
        <h4 style={{ margin: '20px 0 10px' }}>Signature</h4>
        <div className="hs-grid">
          {input('Name (handwritten style)', 'signatureName')}
          {input('Title under the name', 'signatureRole')}
          {input('Pink label', 'signatureBadge')}
        </div>
      </div>

      <div className="hs-card">
        <h3>4 · Donations banner and gallery button</h3>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          {picture('Banner picture', 'bannerImage', 'Wide picture, about 3.1 : 1 (for example 1617 × 517 px).', '3.1 / 1')}
          {picture('Logo on the picture', 'bannerLogo', 'White logo on a transparent background (PNG). It sits at the bottom left.', '1.75 / 1', true)}
        </div>
        <div className="hs-grid">
          {input('Button text', 'galleryButtonText')}
          {input('Button link', 'galleryButtonUrl', { placeholder: '/news' }, linkHint)}
        </div>
      </div>

      <div className="hs-card">
        <h3>5 · Register</h3>
        <div style={{ marginBottom: 14 }}>
          {picture('Picture on the left', 'girlImage', 'About 1.57 : 1 (for example 609 × 387 px).', '1.57 / 1')}
        </div>
        {area('Words', 'registerText', 5, 'New line = new line on the page.')}
        <div className="hs-grid">
          {input('Button text', 'registerButtonText')}
          {input('Registration link', 'registerUrl', { placeholder: 'https://…' }, 'Paste the live registration link here when you have it. Links starting with https:// open in a new tab.')}
        </div>
      </div>

      <div className="hs-card">
        <h3>6 · "Standing together" banner</h3>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          {picture('Banner picture', 'standImage', 'Wide picture, about 2.6 : 1 (for example 1647 × 627 px). The words sit top left, the logo top right and the button bottom right.', '2.6 / 1')}
          {picture('Logo on the picture', 'standLogo', 'White logo on a transparent background (PNG). It sits at the top right.', '1.75 / 1', true)}
        </div>
        {area('Words in the box', 'standText', 3, 'New line = new line on the page.')}
        <div className="hs-grid">
          {input('Button text', 'standButtonText')}
          {input('Button link', 'standButtonUrl', { placeholder: '/social-impact/thapelo-foundation' }, 'Empty = the Thapelo Foundation page on this site.')}
        </div>
      </div>

      <div className="hs-card">
        <h3>7 · Thapelo Foundation logo</h3>
        <div className="hs-grid">
          {picture('Logo', 'thapeloLogo', 'Shown below the page, centred. Empty = the Thapelo Foundation logo.', '2.1 / 1', true)}
          <div>
            {input('Where the logo goes when clicked', 'thapeloUrl', { placeholder: '/social-impact/thapelo-foundation' }, 'Empty = the Thapelo Foundation page on this site (/social-impact/thapelo-foundation).')}
          </div>
        </div>
      </div>

      <div className="hs-card">
        <h3>Thapelo Foundation page · Sliding banner</h3>
        <p className="hs-hint" style={{ marginBottom: 12 }}>
          The big banner at the top of the Thapelo Foundation page. The pictures slide one after another; the logo stays in the top right corner.
          The first three pictures are the ones from the design until you replace them (about 2.7 : 1, for example 1660 × 620 px — bigger pictures look sharper on large screens).
        </p>
        {slides.map((sl, i) => (
          <div className="hs-row" key={sl.id || i}>
            <div className="hs-row-head">
              <strong>Picture {i + 1}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => moveSlide(i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removeSlide(i)}><Trash2 size={16} /></button>
              </div>
            </div>
            <ImageField
              label=""
              hint={i < 3 ? 'Empty = the picture from the design.' : 'Choose a picture (a picture-less slide is skipped).'}
              aspect="2.7 / 1"
              value={sl.image}
              onChange={(url) => setSlideImage(i, url)}
              uploader={uploadSocialImpactFile}
            />
          </div>
        ))}
        <button type="button" className="hs-add-btn" onClick={addSlide}><Plus size={16} /> Add picture</button>
        <div className="hs-grid" style={{ marginTop: 18 }}>
          <div>
            <label className="hs-label">Seconds each picture stays</label>
            <input
              className="hs-input"
              type="number"
              min="2"
              max="60"
              value={data.thapeloSlideSeconds ?? 7}
              onChange={(e) => setField('thapeloSlideSeconds', e.target.value === '' ? '' : Number(e.target.value))}
            />
            <small className="hs-hint">7 = a new picture every 7 seconds (between 2 and 60).</small>
          </div>
          {picture('Logo on the banner', 'thapeloHeroLogo', 'White Thapelo logo on a transparent background (PNG), about 2.1 : 1. Empty = the logo from the design.', '2.1 / 1', true)}
        </div>
      </div>

      <div className="hs-card">
        <h3>Thapelo Foundation page · Our Oath</h3>
        {input('Heading', 'oathTitle')}
        {area('Words', 'oathText', 3)}
      </div>

      <div className="hs-card">
        <h3>Thapelo Foundation page · Colour panels (slide up)</h3>
        <p className="hs-hint" style={{ marginBottom: 12 }}>
          Solid colours side by side. When a visitor moves the mouse over one (or taps it on a phone) the colour slides up and shows what is inside.
          Up to 4 panels. A panel's button only appears when you give it a link.
        </p>
        {panels.map((c, i) => (
          <div className="hs-row" key={c.id || i}>
            <div className="hs-row-head">
              <strong>Panel {i + 1}</strong>
              <div className="hs-row-tools">
                <button type="button" className="hs-icon-btn" onClick={() => movePanel(i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button type="button" className="hs-icon-btn" onClick={() => movePanel(i, 1)} disabled={i === panels.length - 1}><ArrowDown size={16} /></button>
                <button type="button" className="hs-icon-btn hs-danger" onClick={() => removePanel(i)}><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="hs-grid">
              <div>
                <label className="hs-label">Colour</label>
                <input type="color" value={c.color || '#1a7769'} onChange={(e) => setPanel(i, 'color', e.target.value)} style={{ width: 64, height: 38, padding: 0, border: '1px solid #d1d5db', borderRadius: 6, background: 'none' }} />
              </div>
              <div>
                <label className="hs-label">Words on the colour (optional)</label>
                <input className="hs-input" value={c.label || ''} onChange={(e) => setPanel(i, 'label', e.target.value)} />
                <small className="hs-hint">Empty = a plain colour, like the design.</small>
              </div>
            </div>
            <div style={{ margin: '12px 0' }}>
              <label className="hs-label">Title inside</label>
              <input className="hs-input" value={c.title || ''} onChange={(e) => setPanel(i, 'title', e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="hs-label">Words inside</label>
              <textarea className="hs-textarea" style={{ minHeight: 90 }} value={c.text || ''} onChange={(e) => setPanel(i, 'text', e.target.value)} />
            </div>
            <div className="hs-grid">
              <div>
                <label className="hs-label">Button text</label>
                <input className="hs-input" value={c.buttonText || ''} onChange={(e) => setPanel(i, 'buttonText', e.target.value)} />
              </div>
              <div>
                <label className="hs-label">Button link</label>
                <input className="hs-input" value={c.buttonUrl || ''} placeholder="/news or https://…" onChange={(e) => setPanel(i, 'buttonUrl', e.target.value)} />
                <small className="hs-hint">Empty = no button.</small>
              </div>
            </div>
          </div>
        ))}
        {panels.length < 4 && <button type="button" className="hs-add-btn" onClick={addPanel}><Plus size={16} /> Add panel</button>}
      </div>

      <div className="hs-card">
        <h3>Thapelo Foundation page · About block</h3>
        <div className="hs-grid" style={{ marginBottom: 14 }}>
          {picture('Big picture', 'aboutImage', 'Wide picture, about 2.4 : 1 (for example 1500 × 618 px). The words sit over the left side.', '2.4 / 1')}
          {picture('Logo on the picture', 'aboutLogo', 'White Thapelo logo on a transparent background (PNG). Empty = the logo from the design.', '2.1 / 1', true)}
        </div>
        {area('Words', 'aboutText', 5)}
        <div className="hs-grid">
          {input('Button text', 'aboutButtonText')}
          {input('Button link', 'aboutButtonUrl', { placeholder: '/news or https://…' }, linkHint)}
        </div>
      </div>

      <div className="hs-card">
        <h3>Thapelo Foundation page · Feeding Program block</h3>
        <div style={{ marginBottom: 14 }}>
          {picture('Picture on the left', 'feedImage', 'About 1.78 : 1 (for example 748 × 421 px).', '1.78 / 1')}
        </div>
        {input('Heading', 'feedTitle')}
        {area('Words', 'feedText', 5)}
        <div className="hs-grid">
          {input('Button text', 'feedButtonText')}
          {input('Button link', 'feedButtonUrl', { placeholder: '/news or https://…' }, linkHint)}
        </div>
        {input('Line beside the button', 'feedTagline')}
      </div>
    </div>
  );
};

export default SocialImpactManager;
