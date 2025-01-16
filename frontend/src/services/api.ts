import axios from "axios"

const isDev = import.meta.env.VITE_NODE_ENV === "dev" || false

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (isDev) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`, {
        body: config.data,
        headers: config.headers,
      })
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(
        `✅ [API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          data: response.data,
          headers: response.headers,
        },
      )
    }
    return response
  },
  async (error) => {
    if (isDev) {
      console.error(
        `❌ [API] ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          error: error.response?.data,
          headers: error.response?.headers,
        },
      )
    }
    if (error.response?.status === 401 && !error.config.url?.includes("/auth/signin")) {
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)
