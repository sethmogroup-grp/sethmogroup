import axios from 'axios';

/**
 * Admin-panel session handling.
 *  - keeps the login token + the user (role & permissions) in localStorage
 *  - attaches "Authorization: Bearer <token>" to every request that goes to the API, so the
 *    existing service files (fetch + axios) did not have to be edited one by one
 *  - if the server says the session is no longer valid (401) the user is sent to the login page
 */
const TOKEN_KEY = 'token';
const USER_KEY = 'sg_user';

export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://sethmogroup-backend.onrender.com' : 'http://localhost:5000');

// every base address the panel's services may use
const API_BASES = Array.from(new Set([
  API_URL,
  process.env.REACT_APP_API_URL,
  'https://sethmogroup-backend.onrender.com',
  'http://localhost:5000',
].filter(Boolean).map((b) => b.replace(/\/+$/, ''))));

const isApiUrl = (url) => typeof url === 'string' && API_BASES.some((b) => url.startsWith(`${b}/api/`));
// login / forgot / reset are allowed to answer 401-ish things without logging the user out
const isPublicAuthUrl = (url) => /\/api\/auth\/(login|forgot-password|reset-password)/.test(url);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
};

export const saveSession = (token, user) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const userCan = (user, permission) =>
  !!(user && Array.isArray(user.permissions) && user.permissions.includes(permission));

const endSession = () => {
  clearSession();
  if (!window.location.pathname.startsWith('/login')) window.location.assign('/login?expired=1');
};

let installed = false;
export function installAuthInterceptors() {
  if (installed) return;
  installed = true;

  // ---- fetch ----
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input && input.url;
    const token = getToken();
    const api = isApiUrl(url);

    if (api && token) {
      const headers = new Headers(init.headers || (typeof input !== 'string' && input.headers) || undefined);
      if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
      init = { ...init, headers };
    }

    const res = await originalFetch(input, init);
    if (api && token && res.status === 401 && !isPublicAuthUrl(url)) endSession();
    return res;
  };

  // ---- axios (heroService uses it) ----
  axios.interceptors.request.use((config) => {
    const token = getToken();
    const full = `${(config.baseURL || '').replace(/\/+$/, '')}${config.url || ''}`;
    if (token && (isApiUrl(config.url) || isApiUrl(full))) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  axios.interceptors.response.use(
    (r) => r,
    (error) => {
      const url = error && error.config && error.config.url;
      if (error && error.response && error.response.status === 401 && isApiUrl(url) && getToken() && !isPublicAuthUrl(url)) {
        endSession();
      }
      return Promise.reject(error);
    }
  );
}
