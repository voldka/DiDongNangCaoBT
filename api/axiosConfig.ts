import axios from 'axios';
import Constants from 'expo-constants';


const API_URL = 'http://196.169.6.113:4500/'; // Replace 'http://default-api-base-url' with your default base URL if needed

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors or other configurations here if needed
