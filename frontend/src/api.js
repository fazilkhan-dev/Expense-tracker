import axios from "axios";

const BASE_URL = "https://expense-tracker-backend-4mhq.onrender.com/api";

// Transactions API
const API = axios.create({
  baseURL: `${BASE_URL}/transactions`,
});

// Budget API
export const budgetAPI = axios.create({
  baseURL: `${BASE_URL}/budgets`,
});

// Auth API
export const authAPI = axios.create({
  baseURL: `${BASE_URL}/auth`,
});

// Attach JWT token automatically
const attachToken = (config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

API.interceptors.request.use(attachToken);
budgetAPI.interceptors.request.use(attachToken);
authAPI.interceptors.request.use(attachToken);

export default API;