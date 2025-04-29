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

export const paymentService = {
  // Create a new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post("/create-payment", paymentData)
      return response.data
    } catch (error) {
      console.error("Error creating payment:", error)
      throw error
    }
  },

  // Get payment status
  getPaymentStatus: async (collect_request_id, school_id) => {
    try {
      const response = await api.get(`/payment-status/${collect_request_id}?school_id=${school_id}`)
      return response.data
    } catch (error) {
      console.error("Error getting payment status:", error)
      throw error
    }
  },

  // Process payment status (called after payment completion)
  processPaymentStatus: async (collect_request_id, school_id) => {
    try {
      const response = await api.get(`/process-status/${collect_request_id}?school_id=${school_id}`)
      return response.data
    } catch (error) {
      console.error("Error processing payment status:", error)
      throw error
    }
  },

  // Process webhook for payment status update
  processWebhook: async (webhookData) => {
    try {
      const response = await api.post("/webhook", webhookData)
      return response.data
    } catch (error) {
      console.error("Error processing webhook:", error)
      throw error
    }
  },
}
