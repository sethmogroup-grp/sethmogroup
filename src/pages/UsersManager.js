import React, { useCallback, useEffect, useState } from 'react';
import { UserPlus, Eye, Trash2, Send, Power, X } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import {
  getUsers, getRoleCatalogue, createUser, updateUser, deleteUser, sendUserLink, getUserIdImage
} from '../services/accountService';
import './RbacPages.css';

const fmt = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

const UsersManager = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState({ type: '', text: '', link: '' });
  const [form, setForm] = useState({ name: '', email: '', role: 'support_agent' });
  const [saving, setSaving] = useState(false);
  const [idView, setIdView] = useState(null); // { name, url, uploadedAt }

  const say = (type, text, link = '') => setFlash({ type, text, link });

  const load = useCallback(async () => {
    try {
      const [u, r] = await Promise.all([getUsers(), getRoleCatalogue()]);
      setUsers(u);
      setRoles(r);
    } catch (err) { say('error', err.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const roleLabel = (v) => (roles.find((r) => r.value === v) || {}).label || v;

  const statusBadge = (u) => {
    if (!u.isActive) return <span className="rb-badge off">Deactivated</span>;
    if (u.status === 'invited') return <span className="rb-badge warn">Invited</span>;
    return <span className="rb-badge ok">Active</span>;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createUser(form);
      if (res.emailSent) {
        say('success', `Account created. An invitation email was sent to ${res.user.email}.`);
      } else {
        say('info', `Account created, but the email could not be sent (${res.emailError}). Give ${res.user.email} this one-time link to set their password (valid 72 hours):`, res.inviteLink);
      }
      setForm({ name: '', email: '', role: 'support_agent' });
      load();
    } catch (err) { say('error', err.message); }
    setSaving(false);
  };

  const change = async (u, data, okText) => {
    try {
      await updateUser(u.id, data);
      say('success', okText);
      load();
    } catch (err) { say('error', err.message); load(); }
  };

  const handleLink = async (u) => {
    try {
      const res = await sendUserLink(u.id);
      const kind = u.status === 'invited' ? 'invitation' : 'password reset link';
      if (res.emailSent) say('success', `A ${kind} was emailed to ${u.email}.`);
      else say('info', `The email could not be sent (${res.emailError}). Share this link with ${u.email}:`, res.link);
    } catch (err) { say('error', err.message); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Permanently delete the account of ${u.name || u.email}? This also removes their ID image and cannot be undone.`)) return;
    try {
      await deleteUser(u.id);
      say('success', 'Account deleted.');
      load();
    } catch (err) { say('error', err.message); }
  };

  const viewId = async (u) => {
    try {
      const d = await getUserIdImage(u.id);
      setIdView({ name: u.name || u.email, url: d.url, uploadedAt: d.uploadedAt });
    } catch (err) { say('error', err.message); }
  };

  if (loading) return <div className="rb-page"><p>Loading users…</p></div>;

  const selected = roles.find((r) => r.value === form.role);

  return (
    <div className="rb-page">
      <div className="rb-head">
        <h1>Users &amp; Roles</h1>
        <p>Create accounts for your team and decide what each person can do. Only Super Admins see this page.</p>
      </div>

      {flash.text && (
        <div className={`rb-flash ${flash.type}`}>
          {flash.text}
          {flash.link && <code>{flash.link}</code>}
        </div>
      )}

      <div className="rb-card" style={{ marginBottom: 20 }}>
        <h3>Roles</h3>
        <div className="rb-roles">
          {roles.map((r) => (
            <div className="rb-role" key={r.value}>
              <span className={`rb-badge ${r.value}`}>{r.label}</span>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rb-card" style={{ marginBottom: 20 }}>
        <h3><UserPlus size={18} /> Add a user</h3>
        <form onSubmit={handleCreate}>
          <div className="rb-grid">
            <div className="rb-field">
              <label>Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
            </div>
            <div className="rb-field">
              <label>Email (their login)</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="rb-field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              {selected && <p className="rb-help">{selected.description}</p>}
            </div>
          </div>
          <button className="rb-btn" type="submit" disabled={saving}>
            <UserPlus size={16} /> {saving ? 'Creating…' : 'Create & send invitation'}
          </button>
          <p className="rb-help">They receive an email with a link to choose their own password. You never see or set it.</p>
        </form>
      </div>

      <div className="rb-card">
        <h3>Team ({users.length})</h3>
        <div className="rb-table-wrap">
          <table className="rb-table">
            <thead>
              <tr><th>Person</th><th>Role</th><th>Status</th><th>ID image</th><th>Last login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === me.id;
                return (
                  <tr key={u.id}>
                    <td><strong>{u.name || '—'}</strong>{isMe && ' (you)'}<small>{u.email}</small></td>
                    <td>
                      {isMe ? <span className={`rb-badge ${u.role}`}>{roleLabel(u.role)}</span> : (
                        <select value={u.role} onChange={(e) => change(u, { role: e.target.value }, `${u.name || u.email} is now ${roleLabel(e.target.value)}.`)}>
                          {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      )}
                    </td>
                    <td>{statusBadge(u)}</td>
                    <td>
                      {u.hasIdImage
                        ? <button className="rb-btn ghost small" onClick={() => viewId(u)}><Eye size={14} /> View</button>
                        : <small>Not uploaded</small>}
                    </td>
                    <td>{fmt(u.lastLoginAt)}</td>
                    <td>
                      <div className="rb-actions">
                        <button className="rb-btn ghost small" onClick={() => handleLink(u)} title={u.status === 'invited' ? 'Resend invitation' : 'Send password reset link'}>
                          <Send size={14} /> {u.status === 'invited' ? 'Resend invite' : 'Reset link'}
                        </button>
                        {!isMe && (
                          <>
                            <button className="rb-btn ghost small" onClick={() => change(u, { isActive: !u.isActive }, u.isActive ? 'Account deactivated.' : 'Account re-activated.')}>
                              <Power size={14} /> {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="rb-btn danger small" onClick={() => handleDelete(u)}><Trash2 size={14} /> Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {idView && (
        <div className="rb-modal-back" onClick={() => setIdView(null)}>
          <div className="rb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rb-row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>ID — {idView.name}</h3>
              <button className="rb-btn ghost small" onClick={() => setIdView(null)}><X size={14} /> Close</button>
            </div>
            <img src={idView.url} alt={`ID of ${idView.name}`} />
            <p className="rb-help">Uploaded {fmt(idView.uploadedAt)}. Viewing an ID is recorded in the activity log.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
