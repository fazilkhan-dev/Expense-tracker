import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/transactions",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const budgetAPI = axios.create({
  baseURL: "http://localhost:5000/api/budgets",
});

budgetAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;