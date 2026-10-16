import React, { useRef, useState } from 'react';
import { FileVideo, Trash2 } from 'lucide-react';

/**
 * Video picker for the Sustainability hero. Same shape as ImageField
 * (upload / replace / remove), but previews with a <video> tag.
 * When empty, the hero falls back to its background picture.
 */
const VideoField = ({ label, hint, value, onChange, uploader }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    try {
      const { url } = await uploader(file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hs-image-field">
      <span className="hs-label">{label}</span>

      <div className="hs-image-preview" style={{ aspectRatio: '16 / 9' }}>
        {value ? (
          <video
            src={value}
            muted
            loop
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span className="hs-image-empty">No video — using the background picture instead</span>
        )}
      </div>

      <div className="hs-image-actions">
        <button
          type="button"
          className="btn btn-outline hs-small-btn"
          onClick={() => inputRef.current && inputRef.current.click()}
          disabled={busy}
        >
          <FileVideo size={15} /> {busy ? 'Uploading…' : value ? 'Replace video' : 'Upload video'}
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-outline hs-small-btn hs-danger"
            onClick={() => onChange('')}
            disabled={busy}
            title="Remove the video and use the background picture instead"
          >
            <Trash2 size={15} /> Remove
          </button>
        )}
        <input ref={inputRef} type="file" accept="video/*" hidden onChange={handleFile} />
      </div>

      {hint && <small className="hs-hint">{hint}</small>}
      {error && <small className="hs-error">{error}</small>}
    </div>
  );
};

export default VideoField;
