import React, { useState, useEffect } from 'react';
import { getNews, saveNews } from '../services/contentService';
import { convertToBase64 } from '../utils/fileHandler';
import './SectorsManager.css'; // Reusing your existing professional styles

const NewsManager = () => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getNews();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleAdd = () => {
    const newArticle = {
      title: "New Story Title",
      category: "Corporate",
      excerpt: "A brief summary for the grid...",
      content: "The full story content goes here...",
      image: "",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setArticles([newArticle, ...articles]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...articles];
    updated[index][field] = value;
    setArticles(updated);
  };

  const handleImage = async (index, file) => {
    if (file) {
      const base64 = await convertToBase64(file);
      handleUpdate(index, 'image', base64);
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Delete this story?")) {
      setArticles(articles.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    try {
      setStatus('Publishing updates...');
      await saveNews(articles);
      setStatus('Success: News feed updated!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error: Failed to save news');
    }
  };

  if (loading) return <div className="p-8">Syncing News Feed...</div>;

  return (
    <div className="manager-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">News & Insights</h1>
          <p className="page-subtitle">Manage stories for the Sethmo Community page.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleAdd}>+ New Story</button>
          <button className="btn btn-primary" onClick={handleSave}>Save All Changes</button>
        </div>
      </div>

      {status && <div className={`status-badge ${status.includes('Error') ? 'error' : 'success'}`}>{status}</div>}

      <div className="news-editor-grid">
        {articles.map((article, index) => (
          <div key={index} className="sector-editor-card" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
              
              {/* Image Column */}
              <div style={{ width: '250px' }}>
                <div className="image-preview-box" style={{ height: '160px', marginBottom: '10px' }}>
                  {article.image ? (
                    <img src={article.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>No Image</div>
                  )}
                </div>
                <input type="file" onChange={(e) => handleImage(index, e.target.files[0])} style={{ fontSize: '11px' }} />
              </div>

              {/* Text Column */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div className="input-group" style={{ flex: 2 }}>
                    <label>Article Title</label>
                    <input type="text" value={article.title} onChange={(e) => handleUpdate(index, 'title', e.target.value)} />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Category</label>
                    <select value={article.category} onChange={(e) => handleUpdate(index, 'category', e.target.value)}>
                      <option value="Corporate">Corporate</option>
                      <option value="Community">Community</option>
                      <option value="Agribusiness">Agribusiness</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Excerpt (Grid View Summary)</label>
                  <textarea rows="2" value={article.excerpt} onChange={(e) => handleUpdate(index, 'excerpt', e.target.value)} />
                </div>

                <button className="btn-delete" onClick={() => handleDelete(index)} style={{ color: '#d3121b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                  Remove Article
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManager;