import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, CheckCircle } from 'lucide-react';
import { getMessages, markMessageRead, deleteMessage } from '../services/contentService';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to load messages.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = async (msg) => {
    // Toggle accordion
    setExpandedId(expandedId === msg._id ? null : msg._id);

    // If opening an unread message, mark it as read in the database
    if (!msg.isRead && expandedId !== msg._id) {
      try {
        await markMessageRead(msg._id);
        // Update local state so it instantly turns grey
        setMessages(messages.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent the accordion from opening when clicking delete
    if (window.confirm("Are you sure you want to permanently delete this message?")) {
      try {
        await deleteMessage(id);
        setMessages(messages.filter(m => m._id !== id));
        setStatus({ type: 'success', text: 'Message deleted successfully.' });
        setTimeout(() => setStatus({ type: '', text: '' }), 3000);
      } catch (err) {
        setStatus({ type: 'error', text: 'Failed to delete message.' });
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Inbox...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Inbox ({messages.filter(m => !m.isRead).length} Unread)</h2>
      </div>

      {status.text && (
        <div className={`badge badge-${status.type}`} style={{ marginBottom: '20px', padding: '10px', borderRadius: '4px', background: status.type === 'error' ? '#fed7d7' : '#c6f6d5', color: status.type === 'error' ? '#9b2c2c' : '#22543d' }}>
          {status.text}
        </div>
      )}

      {messages.length === 0 ? (
        <div style={{ background: '#fff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#718096' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 15px auto', color: '#48bb78' }} />
          <h3>You're all caught up!</h3>
          <p>No messages in your inbox right now.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {messages.map((msg) => (
            <div key={msg._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              
              {/* Message Header (Clickable) */}
              <div 
                onClick={() => handleToggleExpand(msg)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '15px 20px', 
                  cursor: 'pointer',
                  background: msg.isRead ? '#f8fafc' : '#fff',
                  fontWeight: msg.isRead ? 'normal' : 'bold',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ marginRight: '15px', color: msg.isRead ? '#a0aec0' : '#d3121b' }}>
                  {msg.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                </div>
                
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', gap: '15px', alignItems: 'center' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.name}
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: msg.isRead ? '#718096' : '#2d3748' }}>
                    {msg.subject || 'No Subject'}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#718096' }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button 
                  onClick={(e) => handleDelete(msg._id, e)}
                  style={{ marginLeft: '15px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', padding: '5px' }}
                  title="Delete Message"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Expanded Message Body */}
              {expandedId === msg._id && (
                <div style={{ padding: '20px', background: '#fff', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ marginBottom: '15px', fontSize: '14px', color: '#4a5568' }}>
                    <strong>From:</strong> {msg.name} &lt;{msg.email}&gt; <br />
                    <strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}
                  </div>
                  <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#2d3748' }}>
                    {msg.message}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager;