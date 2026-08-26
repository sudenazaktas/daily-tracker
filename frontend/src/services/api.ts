import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Aynı anda birden fazla 401 gelirse tek bir yenileme isteği yapılır.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('refresh token yok')

  // Interceptor'a tekrar takılmamak için düz axios kullanılır.
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
  localStorage.setItem('jwt', data.jwt)
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken)
  }
  return data.jwt
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // Token süresi dolduysa (401) bir kez yenilemeyi dene ve isteği tekrarla.
    if (status === 401 && original && !original._retry) {
      original._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }
        const newToken = await refreshPromise
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        // Yenileme başarısız → oturumu temizle ve giriş sayfasına yönlendir.
        localStorage.removeItem('jwt')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
