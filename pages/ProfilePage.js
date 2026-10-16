import React, { useEffect, useRef, useState } from 'react';
import { Check, X, Camera, Upload, Trash2, KeyRound, UserCircle, Info, ShieldCheck } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import {
  updateMyName, changeMyPassword, getMyIdImage, uploadMyIdImage, removeMyIdImage
} from '../services/accountService';
import './RbacPages.css';

const CAPABILITIES = [
  ['users:manage', 'Create, edit and delete user accounts'],
  ['settings:manage', 'Change website settings, footer and contact details'],
  ['logs:view', 'View system activity logs'],
  ['site:manage', 'Edit website pages and layout'],
  ['news:manage', 'Manage News, the Press banner and Highlights'],
  ['media:manage', 'Manage media: Hero section and Full-Width banner'],
  ['community:manage', 'Manage the Community page'],
  ['analytics:view', 'View website analytics'],
  ['inbox:read', 'Read client emails'],
  ['inbox:reply', 'Reply to client emails'],
  ['inbox:delete', 'Delete messages permanently'],
  ['newsletter:send', 'Send newsletters to subscribers'],
];

const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ProfilePage = () => {
  const { user, can, updateUser } = useAuth();
  const fileRef = useRef(null);

  const [flash, setFlash] = useState({ type: '', text: '' });
  const [name, setName] = useState(user.name || '');
  const [idUrl, setIdUrl] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState('');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const say = (type, text) => { setFlash({ type, text }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // load my current ID image (signed, private link)
  useEffect(() => {
    let alive = true;
    if (user.hasIdImage) {
      getMyIdImage().then((d) => { if (alive) setIdUrl(d.url); }).catch(() => {});
    } else {
      setIdUrl('');
    }
    return () => { alive = false; };
  }, [user.hasIdImage]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const pickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) { say('error', 'Please choose a JPG, PNG or WEBP image.'); return; }
    if (f.size > MAX_BYTES) { say('error', 'That image is larger than 5 MB. Please choose a smaller photo.'); return; }
    setFlash({ type: '', text: '' });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const cancelPick = () => { setFile(null); setPreview(''); if (fileRef.current) fileRef.current.value = ''; };

  const saveName = async () => {
    setBusy('name');
    try {
      const data = await updateMyName(name);
      updateUser(data.user);
      say('success', 'Your name has been updated.');
    } catch (err) { say('error', err.message); }
    setBusy('');
  };

  const upload = async () => {
    if (!file) return;
    setBusy('id');
    try {
      const data = await uploadMyIdImage(file);
      updateUser(data.user);
      setIdUrl(data.url);
      cancelPick();
      say('success', 'Your ID image has been saved.');
    } catch (err) { say('error', err.message); }
    setBusy('');
  };

  const removeId = async () => {
    if (!window.confirm('Remove your ID image?')) return;
    setBusy('id');
    try {
      const data = await removeMyIdImage();
      updateUser(data.user);
      setIdUrl('');
      say('success', 'Your ID image has been removed.');
    } catch (err) { say('error', err.message); }
    setBusy('');
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { say('error', 'The new passwords do not match.'); return; }
    setBusy('pw');
    try {
      const data = await changeMyPassword(pw.current, pw.next);
      updateUser(user, data.token); // keep this session signed in with the fresh token
      setPw({ current: '', next: '', confirm: '' });
      say('success', 'Password changed. Your other devices have been signed out.');
    } catch (err) { say('error', err.message); }
    setBusy('');
  };

  return (
    <div className="rb-page">
      <div className="rb-head">
        <h1>My Profile</h1>
        <p>Your account, your ID and what your role allows you to do.</p>
      </div>

      {flash.text && <div className={`rb-flash ${flash.type}`}>{flash.text}</div>}

      <div className="rb-grid">
        {/* Account */}
        <div className="rb-card">
          <h3><UserCircle size={18} /> Account</h3>
          <div className="rb-field">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
          </div>
          <div className="rb-field">
            <label>Email (your login)</label>
            <input value={user.email} disabled />
          </div>
          <div className="rb-field">
            <label>Role</label>
            <span className={`rb-badge ${user.role}`}>{user.roleLabel}</span>
            <p className="rb-help">{user.roleDescription}</p>
          </div>
          <button className="rb-btn" onClick={saveName} disabled={busy === 'name' || !name.trim() || name === user.name}>
            <Check size={16} /> Save name
          </button>
        </div>

        {/* What I can do */}
        <div className="rb-card">
          <h3><ShieldCheck size={18} /> What my role can do</h3>
          <ul className="rb-caps">
            {CAPABILITIES.map(([perm, label]) => (
              <li key={perm} className={can(perm) ? 'yes' : 'no'}>
                {can(perm) ? <Check size={16} /> : <X size={16} />}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ID image */}
        <div className="rb-card wide">
          <h3><Camera size={18} /> My ID image</h3>

          <div className="rb-instructions">
            <h4><Info size={16} /> How to add your ID</h4>
            <ol>
              <li>Use your official ID: national registration card, driver's licence, or the photo page of your passport.</li>
              <li>Lay it flat on a plain surface in good light. Avoid glare, shadows and your fingers over the text.</li>
              <li>Take the photo straight on, with all four corners in the picture. Your photo and every word must be easy to read.</li>
              <li>Do not crop out details, add filters or edit the image.</li>
              <li>Accepted: JPG, PNG or WEBP, up to 5 MB. Press <strong>Choose image</strong>, check the preview, then press <strong>Upload ID</strong>.</li>
              <li>Your ID is stored privately. Only you and the Super Admin can view it, and you can replace or remove it at any time.</li>
            </ol>
          </div>

          <div className="rb-id-box">
            {preview ? (
              <img src={preview} alt="ID preview" />
            ) : idUrl ? (
              <img src={idUrl} alt="My ID" />
            ) : (
              <div className="rb-placeholder"><Camera size={40} /><p>No ID uploaded yet</p></div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} style={{ display: 'none' }} />
          <div className="rb-row">
            {!file ? (
              <>
                <button className="rb-btn" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy === 'id'}>
                  <Upload size={16} /> {user.hasIdImage ? 'Replace image' : 'Choose image'}
                </button>
                {user.hasIdImage && (
                  <button className="rb-btn ghost" onClick={removeId} disabled={busy === 'id'}>
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </>
            ) : (
              <>
                <button className="rb-btn" onClick={upload} disabled={busy === 'id'}>
                  <Upload size={16} /> {busy === 'id' ? 'Uploading…' : 'Upload ID'}
                </button>
                <button className="rb-btn ghost" onClick={cancelPick} disabled={busy === 'id'}>Cancel</button>
              </>
            )}
          </div>
          {user.idUploadedAt && !file && (
            <p className="rb-help">Last updated {new Date(user.idUploadedAt).toLocaleString('en-GB')}</p>
          )}
        </div>

        {/* Password */}
        <div className="rb-card wide">
          <h3><KeyRound size={18} /> Change password</h3>
          <form onSubmit={savePassword} style={{ maxWidth: 420 }}>
            <div className="rb-field">
              <label>Current password</label>
              <input type="password" autoComplete="current-password" value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })} required />
            </div>
            <div className="rb-field">
              <label>New password</label>
              <input type="password" autoComplete="new-password" value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })} required />
              <p className="rb-help">At least 10 characters, with letters and numbers.</p>
            </div>
            <div className="rb-field">
              <label>Confirm new password</label>
              <input type="password" autoComplete="new-password" value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
            </div>
            <button className="rb-btn" type="submit" disabled={busy === 'pw'}>
              {busy === 'pw' ? 'Saving…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
