/* eslint-disable no-undef */
const API_URL = process.env.REACT_APP_API_URL || 'https://sethmoserver.onrender.com/api';

// Helper function to extract error messages from the backend safely
const handleFetchError = async (res) => {
  let errorMessage = `Server error: ${res.status} ${res.statusText}`;
  
  // Read the response body as plain text FIRST so we only consume the stream once
  const text = await res.text(); 
  
  try {
    // Try to parse that text as JSON
    const errorData = JSON.parse(text);
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch (e) {
    // If it's not JSON (like an HTML error page from Render), use the raw text
    if (text) errorMessage = text.substring(0, 150); // Truncate so it doesn't flood your screen
  }
  
  throw new Error(errorMessage);
};

// ---------- Hero ----------
export const getHeroSettings = async () => {
  const res = await fetch(`${API_URL}/hero`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const updateHeroSettings = async (settings) => {
  const res = await fetch(`${API_URL}/hero`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const uploadHeroFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_URL}/hero/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- About ----------
export const getAboutData = async () => {
  const res = await fetch(`${API_URL}/about`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveAboutData = async (data) => {
  const res = await fetch(`${API_URL}/about`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Team ----------
export const getTeamData = async () => {
  const res = await fetch(`${API_URL}/team`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveTeamData = async (data) => {
  const res = await fetch(`${API_URL}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// Add this new function for deleting team members!
export const deleteTeamMember = async (memberId) => {
  const res = await fetch(`${API_URL}/team/${memberId}`, {
    method: 'DELETE',
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Vision ----------
export const getVisionData = async () => {
  const res = await fetch(`${API_URL}/vision`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveVisionData = async (data) => {
  const res = await fetch(`${API_URL}/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// Optional: Generic upload if needed
export const uploadFile = async (file, section) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload?section=${section}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Sectors ----------
export const getSectors = async () => {
  const res = await fetch(`${API_URL}/sectors`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveSectors = async (data) => {
  const res = await fetch(`${API_URL}/sectors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Company Info (Name, Motto, Vision, Mission) ----------
export const getCompanyInfo = async () => {
  const res = await fetch(`${API_URL}/company-info`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveCompanyInfo = async (data) => {
  const res = await fetch(`${API_URL}/company-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Pillars (The 7 Pillars) ----------
export const getPillars = async () => {
  const res = await fetch(`${API_URL}/pillars`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const savePillars = async (pillarsArray) => {
  const res = await fetch(`${API_URL}/pillars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pillars: pillarsArray }),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Sustainability ----------
export const getSustainability = async () => {
  const res = await fetch(`${API_URL}/sustainability`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveSustainability = async (focusAreas) => {
  const res = await fetch(`${API_URL}/sustainability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ focusAreas }),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- News & Blog ----------
export const getNews = async () => {
  const res = await fetch(`${API_URL}/news`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveNews = async (newsArray) => {
  const res = await fetch(`${API_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles: newsArray }), 
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// delete function for news articles
export const deleteNewsArticle = async (articleId) => {
  const res = await fetch(`${API_URL}/news/${articleId}`, {
    method: 'DELETE',
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Community Page Settings (Banner & Impact) ----------
export const getCommunitySettings = async () => {
  const res = await fetch(`${API_URL}/community-settings`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveCommunitySettings = async (data) => {
  const res = await fetch(`${API_URL}/community-settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Careers ----------
export const getCareers = async () => {
  const res = await fetch(`${API_URL}/careers`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveCareers = async (jobsArray) => {
  const res = await fetch(`${API_URL}/careers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs: jobsArray }),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- DASHBOARD STATS ----------
export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard/stats`); 
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Global System Settings ----------
export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveSettings = async (settingsData) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Home Businesses ----------
export const getHomeBusinessData = async () => {
  const res = await fetch(`${API_URL}/home-business`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveHomeBusinessData = async (data) => {
  const res = await fetch(`${API_URL}/home-business`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const uploadHomeBusinessFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/home-business/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};
// eslint-disable-next-line no-unused-vars
const removeBusiness = (index) => {
    if (window.confirm("Are you sure you want to remove this business? Remember to click 'Save Changes' after!")) {
      const updated = formData.businesses.filter((_, i) => i !== index);
      setFormData({ ...formData, businesses: updated });
    }
  };