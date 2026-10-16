import { API_URL } from './auth';

// Small helper: JSON in, JSON out, readable error messages (token is added by auth.js)
async function request(path, { method = 'GET', body, formData } = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: formData || (body ? JSON.stringify(body) : undefined),
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }
  if (!res.ok) throw new Error((data && (data.error || data.message)) || `Server error (${res.status})`);
  return data;
}

// ---- own profile ----
export const updateMyName = (name) => request('/auth/me', { method: 'PATCH', body: { name } });
export const changeMyPassword = (currentPassword, newPassword) =>
  request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });
export const getMyIdImage = () => request('/auth/me/id-image');
export const uploadMyIdImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/auth/me/id-image', { method: 'POST', formData });
};
export const removeMyIdImage = () => request('/auth/me/id-image', { method: 'DELETE' });

// ---- password reset (public) ----
export const requestPasswordReset = (email) => request('/auth/forgot-password', { method: 'POST', body: { email } });
export const resetPassword = (token, password) => request('/auth/reset-password', { method: 'POST', body: { token, password } });

// ---- user management (Super Admin) ----
export const getUsers = () => request('/users');
export const getRoleCatalogue = () => request('/users/roles');
export const createUser = (data) => request('/users', { method: 'POST', body: data });
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', body: data });
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });
export const sendUserLink = (id) => request(`/users/${id}/send-link`, { method: 'POST' });
export const getUserIdImage = (id) => request(`/users/${id}/id-image`);

// ---- email: replies & newsletters ----
export const replyToMessage = (id, body) => request(`/messages/${id}/reply`, { method: 'POST', body: { body } });
export const getNewsletterCampaigns = () => request('/newsletter-campaigns');
export const getNewsletterCampaign = (id) => request(`/newsletter-campaigns/${id}`);
export const sendNewsletterTest = (data) => request('/newsletter-campaigns/test', { method: 'POST', body: data });
export const sendNewsletter = (data) => request('/newsletter-campaigns/send', { method: 'POST', body: data });
