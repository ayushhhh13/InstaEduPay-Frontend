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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const transactionService = {
  // Create a new payment
  createPayment: async (paymentData: any) => {
    const response = await api.post("/create-payment", paymentData)
    return response.data
  },

  // Get payment status
  getPaymentStatus: async (collect_request_id: any, school_id: any) => {
    const response = await api.get(`/payment-status/${collect_request_id}?school_id=${school_id}`)
    return response.data
  },

  // Get all transactions with pagination, sorting, and filtering
  getAllTransactions: async (
    page = 1,
    sort = "payment_time",
    order = "desc",
    status = "",
    fromDate = "",
    toDate = "",
    search = "",
    limit = 10,
  ) => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("sort", sort)
    params.append("order", order)
    params.append("limit", limit.toString())

    // Handle multiple status values
    if (status) {
      params.append("status", status)
    }

    // Add date range parameters if provided
    if (fromDate) params.append("fromDate", fromDate)
    if (toDate) params.append("toDate", toDate)

    // Add search parameter if provided
    if (search) params.append("search", search)

    try {
      console.log(`Fetching transactions with params: ${params.toString()}`)
      const response = await api.get(`/transactions?${params.toString()}`)
      console.log("Response:", response.data)

      // Return formatted response with data and pagination info
      return {
        data: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 10,
        pages: response.data.meta?.pages || 1,
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  },

  // Get transactions for a specific school
  getSchoolTransactions: async (
    schoolId: any,
    page = 1,
    sort = "payment_time",
    order = "desc",
    status = "",
    fromDate = "",
    toDate = "",
    search = "",
    limit = 10,
  ) => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("sort", sort)
    params.append("order", order)
    params.append("limit", limit.toString())

    // Handle multiple status values
    if (status) {
      params.append("status", status)
    }

    // Add date range parameters if provided
    if (fromDate) params.append("fromDate", fromDate)
    if (toDate) params.append("toDate", toDate)

    // Add search parameter if provided
    if (search) params.append("search", search)

    try {
      console.log(`Fetching school transactions with params: ${params.toString()}`)
      const response = await api.get(`/transactions/school/${schoolId}?${params.toString()}`)
      console.log("Response:", response.data)

      // Return formatted response with data and pagination info
      return {
        data: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 10,
        pages: response.data.meta?.pages || 1,
      }
    } catch (error) {
      console.error("Error fetching school transactions:", error)
      throw error
    }
  },

  // Check transaction status by custom order ID
  getTransactionStatus: async (customOrderId: any) => {
    try {
      const response = await api.get(`/transaction-status/${customOrderId}`)
      return response.data
    } catch (error) {
      console.error("Error checking transaction status:", error)
      throw error
    }
  },
}
