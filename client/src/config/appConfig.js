import axios from "axios";

export const TAX_RATE = 20; 


const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "https://pos-app-m2qb.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("posUser"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;