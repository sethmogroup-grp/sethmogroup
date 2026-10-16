import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Loads one home-page section, tracks edits, and saves it.
 * `load` and `save` are the functions from services/contentService.js.
 */
const useSectionEditor = (load, save) => {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const timer = useRef(null);

  const flash = useCallback((type, message, keep = 3500) => {
    clearTimeout(timer.current);
    setStatus({ type, message });
    if (keep) timer.current = setTimeout(() => setStatus({ type: '', message: '' }), keep);
  }, []);

  useEffect(() => {
    let alive = true;
    load()
      .then((result) => {
        if (alive) setData(result);
      })
      .catch((err) => {
        if (alive) flash('error', `Failed to load: ${err.message}`, 0);
      });
    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, [load, flash]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await save(data);
      setData(saved);
      flash('success', 'Saved. The website now shows your changes.');
    } catch (err) {
      flash('error', `Failed to save: ${err.message}`, 0);
    } finally {
      setSaving(false);
    }
  };

  return { data, setData, saving, status, handleSave };
};

export default useSectionEditor;
