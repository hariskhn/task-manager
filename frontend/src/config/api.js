import axios from 'axios';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'http://your-production-url.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;

