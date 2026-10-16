import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

/**
 * Picture picker used by the home-section managers.
 * Shows the current picture, uploads a new one, and lets the admin clear it
 * (an empty picture falls back to the default design picture on the website).
 */
const ImageField = ({ label, hint, value, onChange, uploader, aspect = '4 / 3', contain = false }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // allow choosing the same file again
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

      <div className="hs-image-preview" style={{ aspectRatio: aspect }}>
        {value ? (
          <img src={value} alt={label} style={{ objectFit: contain ? 'contain' : 'cover' }} />
        ) : (
          <span className="hs-image-empty">Using the default picture</span>
        )}
      </div>

      <div className="hs-image-actions">
        <button
          type="button"
          className="btn btn-outline hs-small-btn"
          onClick={() => inputRef.current && inputRef.current.click()}
          disabled={busy}
        >
          <ImagePlus size={15} /> {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-outline hs-small-btn hs-danger"
            onClick={() => onChange('')}
            disabled={busy}
            title="Go back to the default picture"
          >
            <Trash2 size={15} /> Remove
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>

      {hint && <small className="hs-hint">{hint}</small>}
      {error && <small className="hs-error">{error}</small>}
    </div>
  );
};

export default ImageField;
