import axios from 'axios';

const API_BASE_URL = 'https://task-manager-three-lime-64.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;

