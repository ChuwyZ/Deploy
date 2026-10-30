import apiClient from './AxiosClient'

// attach the JWT to every request
apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

// expired / invalid token, or the account was deactivated while logged in -> clean logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    if (error.response?.status === 401 && !url.includes('/api/v1/auth')) {
      const msg = `Server rejected your session: 401 on ${String(error.config?.method).toUpperCase()} ${url}`
      console.error(msg, error.response?.data)
      sessionStorage.setItem('authError', msg) // shown on the login page so you can see WHICH call failed
      ;['access_token', 'username', 'role', 'userId'].forEach((k) => localStorage.removeItem(k))
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
