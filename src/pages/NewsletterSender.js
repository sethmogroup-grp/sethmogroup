import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, MailCheck, RefreshCw } from 'lucide-react';
import {
  getNewsletterCampaigns, getNewsletterCampaign, sendNewsletter, sendNewsletterTest
} from '../services/accountService';
import './RbacPages.css';

const EMPTY = { subject: '', headline: '', body: '', imageUrl: '', buttonText: '', buttonUrl: '' };
const STATUS = { sending: ['warn', 'Sending…'], sent: ['ok', 'Sent'], partial: ['warn', 'Sent with errors'], failed: ['off', 'Failed'] };

const NewsletterSender = () => {
  const [form, setForm] = useState(EMPTY);
  const [info, setInfo] = useState({ campaigns: [], subscriberCount: 0, mailConfigured: true });
  const [flash, setFlash] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState('');
  const [live, setLive] = useState(null); // campaign being sent right now
  const timer = useRef(null);

  const say = (type, text) => setFlash({ type, text });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = useCallback(async () => {
    try { setInfo(await getNewsletterCampaigns()); }
    catch (err) { say('error', err.message); }
  }, []);

  useEffect(() => { load(); return () => clearInterval(timer.current); }, [load]);

  // poll the running campaign every 3 s
  const follow = useCallback((id) => {
    clearInterval(timer.current);
    timer.current = setInterval(async () => {
      try {
        const c = await getNewsletterCampaign(id);
        setLive(c);
        if (c.status !== 'sending') {
          clearInterval(timer.current);
          load();
          say(c.status === 'failed' ? 'error' : 'success',
            c.status === 'sent' ? `Newsletter delivered to ${c.sent} subscribers.`
              : c.status === 'partial' ? `Delivered to ${c.sent}; ${c.failed} could not be reached.`
              : 'The newsletter could not be delivered. Check the email settings.');
        }
      } catch (e) { /* keep trying */ }
    }, 3000);
  }, [load]);

  const test = async () => {
    setBusy('test'); setFlash({ type: '', text: '' });
    try { const r = await sendNewsletterTest(form); say('success', r.message); }
    catch (err) { say('error', err.message); }
    setBusy('');
  };

  const send = async () => {
    if (!window.confirm(`Send "${form.subject}" to ${info.subscriberCount} subscribers now? This cannot be undone.`)) return;
    setBusy('send'); setFlash({ type: '', text: '' });
    try {
      const r = await sendNewsletter(form);
      setLive(r.campaign);
      say('info', `Sending to ${r.campaign.total} subscribers…`);
      follow(r.campaign._id);
      setForm(EMPTY);
    } catch (err) { say('error', err.message); }
    setBusy('');
  };

  const sending = live && live.status === 'sending';
  const pct = live && live.total ? Math.min(100, Math.round(((live.sent + live.failed) / live.total) * 100)) : 0;
  const ready = form.subject.trim() && form.body.trim();

  return (
    <div className="rb-page">
      <div className="rb-head">
        <h1>Send Newsletter</h1>
        <p>Write one message and send it to everyone who subscribed on the website. Each email includes an unsubscribe link.</p>
      </div>

      {!info.mailConfigured && (
        <div className="rb-flash error">Email is not set up on the server yet, so sending is disabled. Ask the Super Admin to add the SMTP settings.</div>
      )}
      {flash.text && <div className={`rb-flash ${flash.type}`}>{flash.text}</div>}

      {live && (
        <div className="rb-card" style={{ marginBottom: 20 }}>
          <h3><MailCheck size={18} /> Current send</h3>
          <div className="rb-progress"><div style={{ width: `${pct}%` }} /></div>
          <p className="rb-help">{live.sent + live.failed} of {live.total} processed · {live.failed} failed</p>
        </div>
      )}

      <div className="rb-grid">
        <div className="rb-card wide">
          <h3><Send size={18} /> Compose</h3>
          <div className="rb-field">
            <label>Subject line</label>
            <input value={form.subject} onChange={set('subject')} maxLength={150} placeholder="e.g. Sethmo Group news – October" />
          </div>
          <div className="rb-field">
            <label>Headline (optional)</label>
            <input value={form.headline} onChange={set('headline')} maxLength={150} />
          </div>
          <div className="rb-field">
            <label>Message</label>
            <textarea value={form.body} onChange={set('body')} placeholder={'Write your message here.\n\nLeave a blank line to start a new paragraph.'} />
          </div>
          <div className="rb-grid">
            <div className="rb-field">
              <label>Image link (optional)</label>
              <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
              <p className="rb-help">A picture address starting with https://</p>
            </div>
            <div className="rb-field">
              <label>Button text (optional)</label>
              <input value={form.buttonText} onChange={set('buttonText')} maxLength={40} placeholder="Read more" />
            </div>
            <div className="rb-field">
              <label>Button link</label>
              <input value={form.buttonUrl} onChange={set('buttonUrl')} placeholder="https://sethmogroup.com/news" />
            </div>
          </div>

          <div className="rb-row">
            <button className="rb-btn ghost" onClick={test} disabled={!ready || !info.mailConfigured || busy !== ''}>
              {busy === 'test' ? 'Sending test…' : 'Send test to me'}
            </button>
            <button className="rb-btn" onClick={send} disabled={!ready || !info.mailConfigured || busy !== '' || sending || info.subscriberCount === 0}>
              <Send size={16} /> Send to {info.subscriberCount} subscribers
            </button>
          </div>
          <p className="rb-help">Tip: always send a test to yourself first.</p>
        </div>

        <div className="rb-card wide">
          <h3>Previous newsletters <button className="rb-btn ghost small" onClick={load} style={{ marginLeft: 'auto' }}><RefreshCw size={13} /> Refresh</button></h3>
          {info.campaigns.length === 0 ? <p className="rb-help">Nothing sent yet.</p> : (
            <div className="rb-table-wrap">
              <table className="rb-table">
                <thead><tr><th>Subject</th><th>Sent by</th><th>When</th><th>Delivered</th><th>Status</th></tr></thead>
                <tbody>
                  {info.campaigns.map((c) => {
                    const [cls, label] = STATUS[c.status] || ['off', c.status];
                    return (
                      <tr key={c._id}>
                        <td>{c.subject}</td>
                        <td>{(c.sentBy && (c.sentBy.name || c.sentBy.email)) || '—'}</td>
                        <td>{new Date(c.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{c.sent} / {c.total}</td>
                        <td><span className={`rb-badge ${cls}`}>{label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSender;
