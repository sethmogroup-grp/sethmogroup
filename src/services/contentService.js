// src/services/contentService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ---------- Hero ----------
export const getHeroSettings = async () => {
  const res = await fetch(`${API_URL}/hero`);
  if (!res.ok) throw new Error('Failed to fetch hero settings');
  return res.json();
};

export const updateHeroSettings = async (settings) => {
  const res = await fetch(`${API_URL}/hero`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update hero settings');
  return res.json();
};

export const uploadHeroFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/hero/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

// ---------- About ----------
export const getAboutData = async () => {
  const res = await fetch(`${API_URL}/about`);
  if (!res.ok) throw new Error('Failed to fetch about data');
  return res.json();
};

export const saveAboutData = async (data) => {
  const res = await fetch(`${API_URL}/about`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save about data');
  return res.json();
};

// ---------- Team ----------
export const getTeamData = async () => {
  const res = await fetch(`${API_URL}/team`);
  if (!res.ok) throw new Error('Failed to fetch team data');
  return res.json();
};

export const saveTeamData = async (data) => {
  const res = await fetch(`${API_URL}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save team data');
  return res.json();
};

// ---------- Vision ----------
export const getVisionData = async () => {
  const res = await fetch(`${API_URL}/vision`);
  if (!res.ok) throw new Error('Failed to fetch vision data');
  return res.json();
};

export const saveVisionData = async (data) => {
  const res = await fetch(`${API_URL}/vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save vision data');
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
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

// ---------- Sectors ----------
export const getSectors = async () => {
  const res = await fetch(`${API_URL}/sectors`);
  if (!res.ok) throw new Error('Failed to fetch sectors');
  return res.json();
};

export const saveSectors = async (data) => {
  const res = await fetch(`${API_URL}/sectors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save sectors');
  return res.json();
};
// ---------- Company Info (Name, Motto, Vision, Mission) ----------
export const getCompanyInfo = async () => {
  const res = await fetch(`${API_URL}/company-info`);
  if (!res.ok) throw new Error('Failed to fetch company info');
  return res.json();
};

export const saveCompanyInfo = async (data) => {
  const res = await fetch(`${API_URL}/company-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save company info');
  return res.json();
};

// ---------- Pillars (The 7 Pillars) ----------
export const getPillars = async () => {
  const res = await fetch(`${API_URL}/pillars`);
  if (!res.ok) throw new Error('Failed to fetch pillars');
  return res.json();
};

export const savePillars = async (pillarsArray) => {
  const res = await fetch(`${API_URL}/pillars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pillars: pillarsArray }),
  });
  if (!res.ok) throw new Error('Failed to save pillars');
  return res.json();
};

// ---------- Sustainability ----------
export const getSustainability = async () => {
  const res = await fetch(`${API_URL}/sustainability`);
  if (!res.ok) throw new Error('Failed to fetch sustainability');
  return res.json();
};

export const saveSustainability = async (focusAreas) => {
  const res = await fetch(`${API_URL}/sustainability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ focusAreas }),
  });
  if (!res.ok) throw new Error('Failed to save sustainability');
  return res.json();
};

// ---------- News & Blog ----------
export const getNews = async () => {
  const res = await fetch(`${API_URL}/news`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
};

export const saveNews = async (newsArray) => {
  const res = await fetch(`${API_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles: newsArray }), // Ensure it sends { articles: [...] }
  });
  if (!res.ok) throw new Error('Failed to save news');
  return res.json();
};

// ---------- Community Page Settings (Banner & Impact) ----------
export const getCommunitySettings = async () => {
  const res = await fetch(`${API_URL}/community-settings`);
  if (!res.ok) throw new Error('Failed to fetch community settings');
  return res.json();
};

export const saveCommunitySettings = async (data) => {
  const res = await fetch(`${API_URL}/community-settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save community settings');
  return res.json();
};

// ---------- Careers ----------
export const getCareers = async () => {
  const res = await fetch(`${API_URL}/careers`);
  if (!res.ok) throw new Error('Failed to fetch careers');
  return res.json();
};

export const saveCareers = async (jobsArray) => {
  const res = await fetch(`${API_URL}/careers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs: jobsArray }),
  });
  if (!res.ok) throw new Error('Failed to save careers');
  return res.json();
};

export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard-stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

// ---------- Global System Settings ----------
export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const saveSettings = async (settingsData) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
};