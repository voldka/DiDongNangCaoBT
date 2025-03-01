import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.56.1:4500'; // Replace 'http://default-api-base-url' with your default base URL if needed

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors or other configurations here if needed
