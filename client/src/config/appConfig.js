import axios from "axios";

export const TAX_RATE = 20; 

const API = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`, 
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