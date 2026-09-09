// src/services/heroService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sethmogroup-backend.onrender.com';

export const getHeroSettings = () => 
  axios.get(`${API_URL}/api/hero`).then(res => res.data);

export const updateHeroSettings = (settings) => 
  axios.post(`${API_URL}/api/hero`, settings).then(res => res.data);

export const uploadHeroFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/api/hero/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};