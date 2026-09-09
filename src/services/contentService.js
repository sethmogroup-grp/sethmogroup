const API_URL = process.env.REACT_APP_API_URL || 'https://sethmogroup-backend.onrender.com';

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
  const res = await fetch(`${API_URL}/api/hero`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const updateHeroSettings = async (settings) => {
  const res = await fetch(`${API_URL}/api/hero`, {
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
  
  const res = await fetch(`${API_URL}/api/hero/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- About ----------
export const getAboutData = async () => {
  const res = await fetch(`${API_URL}/api/about`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveAboutData = async (data) => {
  const res = await fetch(`${API_URL}/api/about`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Team ----------
export const getTeamData = async () => {
  const res = await fetch(`${API_URL}/api/team`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveTeamData = async (data) => {
  const res = await fetch(`${API_URL}/api/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const deleteTeamMember = async (memberId) => {
  const res = await fetch(`${API_URL}/api/team/${memberId}`, {
    method: 'DELETE',
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Vision ----------
export const getVisionData = async () => {
  const res = await fetch(`${API_URL}/api/vision`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveVisionData = async (data) => {
  const res = await fetch(`${API_URL}/api/vision`, {
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
  const res = await fetch(`${API_URL}/api/upload?section=${section}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Sectors ----------
export const getSectors = async () => {
  const res = await fetch(`${API_URL}/api/sectors`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveSectors = async (data) => {
  const res = await fetch(`${API_URL}/api/sectors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Company Info (Name, Motto, Vision, Mission) ----------
export const getCompanyInfo = async () => {
  const res = await fetch(`${API_URL}/api/company-info`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveCompanyInfo = async (data) => {
  const res = await fetch(`${API_URL}/api/company-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Pillars (The 7 Pillars) ----------
export const getPillars = async () => {
  const res = await fetch(`${API_URL}/api/pillars`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const savePillars = async (pillarsArray) => {
  const res = await fetch(`${API_URL}/api/pillars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pillars: pillarsArray }),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Sustainability ----------
export const getSustainability = async () => {
  const res = await fetch(`${API_URL}/api/sustainability`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveSustainability = async (focusAreas) => {
  const res = await fetch(`${API_URL}/api/sustainability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ focusAreas }),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- News & Blog ----------
export const getNews = async () => {
  const res = await fetch(`${API_URL}/api/news`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveNews = async (newsArray) => {
  const res = await fetch(`${API_URL}/api/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles: newsArray }), 
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const deleteNewsArticle = async (id) => {
  const res = await fetch(`${API_URL}/api/news/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Community Page Settings (Banner & Impact) ----------
export const getCommunitySettings = async () => {
  const res = await fetch(`${API_URL}/api/community-settings`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveCommunitySettings = async (data) => {
  const res = await fetch(`${API_URL}/api/community-settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Careers ----------
export const getCareers = async () => {
  const res = await fetch(`${API_URL}/api/careers`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveCareers = async (jobsArray) => {
  const res = await fetch(`${API_URL}/api/careers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs: jobsArray }),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/api/dashboard/stats`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Global System Settings ----------
export const getSettings = async () => {
  const res = await fetch(`${API_URL}/api/settings`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveSettings = async (settingsData) => {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Messages (Contact Form Inbox) ----------
export const getMessages = async () => {
  const res = await fetch(`${API_URL}/api/messages`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const markMessageRead = async (id) => {
  const res = await fetch(`${API_URL}/api/messages/${id}/read`, {
    method: 'PATCH',
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const deleteMessage = async (id) => {
  const res = await fetch(`${API_URL}/api/messages/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Expertise ----------
export const getExpertiseData = async () => {
  const res = await fetch(`${API_URL}/api/expertise`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveExpertiseData = async (data) => {
  const res = await fetch(`${API_URL}/api/expertise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const uploadExpertiseFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/expertise/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

// ---------- Home Page: Our Businesses ----------
export const getHomeBusinessData = async () => {
  const res = await fetch(`${API_URL}/api/home-business`);
  if (!res.ok) await handleFetchError(res);
  return res.json();
};

export const saveHomeBusinessData = async (data) => {
  const res = await fetch(`${API_URL}/api/home-business`, {
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
  const res = await fetch(`${API_URL}/api/home-business/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) await handleFetchError(res);
  return res.json();
};
