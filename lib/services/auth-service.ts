import axios from "axios"

// Set base URL from environment variable or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://instaedupay.onrender.com"

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile")
    return response.data
  },

  // Generate signature for payment
  generateSign: async (school_id, collect_request_id) => {
    const response = await api.post("/auth/generate-sign", { school_id, collect_request_id })
    return response.data
  },
}
