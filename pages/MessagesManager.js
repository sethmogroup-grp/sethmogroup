import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, MailOpen, Trash2, CheckCircle, Search, CheckCheck, MailPlus, RefreshCw, Send } from 'lucide-react';
import { getMessages, markMessageRead, markMessageUnread, markAllMessagesRead, deleteMessage } from '../services/contentService';
import { useAuth } from '../services/AuthContext';
import { replyToMessage } from '../services/accountService';
import './MessagesManager.css';
import './MessagesReply.css';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'contact', label: 'Contact Form' },
  { id: 'newsletter', label: 'Newsletter' }
];

// Tell the sidebar badge to refresh itself
const notifyInbox = () => window.dispatchEvent(new Event('sg:inbox-updated'));

const formatWhen = (iso) => {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const { can } = useAuth();                      // role-based: who may reply / delete
  const [replyText, setReplyText] = useState({}); // draft per message id
  const [sendingId, setSendingId] = useState('');

  const flash = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus({ type: '', text: '' }), 3000);
  };

  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      if (!silent) setStatus({ type: 'error', text: 'Failed to load messages.' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load now, then check for new mail every 30 seconds
  useEffect(() => {
    fetchMessages();
    const timer = setInterval(() => fetchMessages(true), 30000);
    return () => clearInterval(timer);
  }, [fetchMessages]);

  const handleToggleExpand = async (msg) => {
    const opening = expandedId !== msg._id;
    setExpandedId(opening ? msg._id : null);

    // Opening an unread message marks it as read in the database
    if (opening && !msg.isRead) {
      try {
        await markMessageRead(msg._id);
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m)));
        notifyInbox();
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }
  };

  const handleMarkUnread = async (msg, e) => {
    e.stopPropagation();
    try {
      await markMessageUnread(msg._id);
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, isRead: false } : m)));
      setExpandedId(null);
      notifyInbox();
    } catch (err) {
      flash('error', 'Could not mark as unread.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllMessagesRead();
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      notifyInbox();
      flash('success', 'All messages marked as read.');
    } catch (err) {
      flash('error', 'Could not update messages.');
    }
  };

  // Reply by email from the panel (sent through Nodemailer on the server)
  const handleReply = async (msg) => {
    const text = (replyText[msg._id] || '').trim();
    if (!text) { flash('error', 'Please write your reply first.'); return; }
    setSendingId(msg._id);
    try {
      const updated = await replyToMessage(msg._id, text);
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? updated : m)));
      setReplyText((prev) => ({ ...prev, [msg._id]: '' }));
      notifyInbox();
      flash('success', `Reply sent to ${msg.email}.`);
    } catch (err) {
      flash('error', err.message || 'The reply could not be sent.');
    }
    setSendingId('');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent the accordion from opening when clicking delete
    if (window.confirm('Are you sure you want to permanently delete this message?')) {
      try {
        await deleteMessage(id);
        setMessages((prev) => prev.filter((m) => m._id !== id));
        notifyInbox();
        flash('success', 'Message deleted successfully.');
      } catch (err) {
        flash('error', 'Failed to delete message.');
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const counts = {
    all: messages.length,
    unread: unreadCount,
    contact: messages.filter((m) => (m.type || 'contact') === 'contact').length,
    newsletter: messages.filter((m) => m.type === 'newsletter').length
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (tab === 'unread' && m.isRead) return false;
      if (tab === 'contact' && (m.type || 'contact') !== 'contact') return false;
      if (tab === 'newsletter' && m.type !== 'newsletter') return false;
      if (!q) return true;
      return [m.name, m.email, m.subject, m.message].some((f) => String(f || '').toLowerCase().includes(q));
    });
  }, [messages, tab, query]);

  if (loading) return <div className="inbox-page"><p>Loading Inbox...</p></div>;

  return (
    <div className="inbox-page">
      <div className="inbox-head">
        <div>
          <h2>Inbox <span className="inbox-count">{unreadCount} unread</span></h2>
          <p className="inbox-sub">Messages from the website Contact Us form and new newsletter sign-ups appear here automatically.</p>
        </div>
        <div className="inbox-actions">
          <button className="inbox-btn ghost" onClick={() => fetchMessages()} title="Check for new messages">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="inbox-btn" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>
      </div>

      {status.text && <div className={`inbox-flash ${status.type}`}>{status.text}</div>}

      <div className="inbox-toolbar">
        <div className="inbox-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label} <span>{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <div className="inbox-search">
          <Search size={16} />
          <input type="text" placeholder="Search name, email or text…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="inbox-empty">
          <CheckCircle size={48} />
          <h3>{messages.length === 0 ? "You're all caught up!" : 'Nothing matches this filter'}</h3>
          <p>{messages.length === 0 ? 'No messages in your inbox right now.' : 'Try another tab or clear the search box.'}</p>
        </div>
      ) : (
        <div className="inbox-list">
          {visible.map((msg) => {
            const isNewsletter = msg.type === 'newsletter';
            const open = expandedId === msg._id;
            return (
              <div key={msg._id} className={`inbox-item ${msg.isRead ? 'read' : 'unread'} ${open ? 'open' : ''}`}>
                <div className="inbox-row" onClick={() => handleToggleExpand(msg)}>
                  <div className="inbox-icon">
                    {isNewsletter ? <MailPlus size={20} /> : msg.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                  </div>

                  <div className="inbox-cols">
                    <div className="inbox-from">
                      {msg.name}
                      {isNewsletter && <em className="inbox-tag">Newsletter</em>}
                    </div>
                    <div className="inbox-subject">{msg.subject || 'No Subject'}</div>
                    <div className="inbox-date">{formatWhen(msg.createdAt)}</div>
                  </div>

                  {can('inbox:delete') && (
                    <button className="inbox-del" onClick={(e) => handleDelete(msg._id, e)} title="Delete Message">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {open && (
                  <div className="inbox-body">
                    <div className="inbox-meta">
                      <div><strong>From:</strong> {msg.name} &lt;{msg.email}&gt;</div>
                      <div><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString('en-GB')}</div>
                      <div><strong>Subject:</strong> {msg.subject || 'No Subject'}</div>
                    </div>
                    <div className="inbox-text">{msg.message}</div>

                    {(msg.replies || []).length > 0 && (
                      <div className="inbox-replies">
                        {msg.replies.map((r) => (
                          <div className="inbox-reply" key={r._id}>
                            <div className="inbox-reply-meta">
                              Replied by <strong>{(r.sentBy && (r.sentBy.name || r.sentBy.email)) || 'Staff'}</strong> · {new Date(r.sentAt).toLocaleString('en-GB')}
                            </div>
                            <div className="inbox-text">{r.body}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {can('inbox:reply') && !isNewsletter && (
                      <div className="inbox-reply-box">
                        <textarea
                          placeholder={`Write your reply to ${msg.name}…`}
                          value={replyText[msg._id] || ''}
                          onChange={(e) => setReplyText((prev) => ({ ...prev, [msg._id]: e.target.value }))}
                          rows={5}
                        />
                        <p className="inbox-reply-hint">Sent from the company email to {msg.email}. Your name is added as the signature.</p>
                      </div>
                    )}

                    <div className="inbox-body-actions">
                      {can('inbox:reply') && !isNewsletter && (
                        <button className="inbox-btn" disabled={sendingId === msg._id} onClick={() => handleReply(msg)}>
                          <Send size={16} /> {sendingId === msg._id ? 'Sending…' : 'Send reply'}
                        </button>
                      )}
                      <button className="inbox-btn ghost" onClick={(e) => handleMarkUnread(msg, e)}>Mark as unread</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesManager;
