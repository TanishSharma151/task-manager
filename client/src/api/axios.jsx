import axios from 'axios';

// Create a reusable Axios instance with base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Attach token to every request automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Add Authorization header for protected API calls
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;