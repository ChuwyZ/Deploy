import type { Authen, RegisterForm } from '@/type'
import { defineStore } from 'pinia'
import apiClient from '@/service/AxiosClient'
import { useUserStore } from '@/stores/user'

interface AuthResponse {
  access_token: string
  user: { id: number; roles: string[] }
}

export const authenUser = defineStore('authen', {
  // restored from localStorage -> the login survives a page reload
  state: (): Authen => ({
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    token: localStorage.getItem('access_token'),
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.token && !!state.role,
    isAdmin: (state): boolean => state.role === 'admin',
    authorizationHeader: (state): string => `Bearer ${state.token}`,
  },
  actions: {
    save(username: string, data: AuthResponse): void {
      this.username = username
      this.token = data.access_token
      this.userId = data.user.id
      this.role = data.user.roles.includes('ROLE_ADMIN') ? 'admin' : 'user'
      localStorage.setItem('username', username)
      localStorage.setItem('role', this.role)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('userId', String(data.user.id))
    },
    async login(username: string, password: string): Promise<void> {
      const res = await apiClient.post<AuthResponse>('/api/v1/auth/authenticate', {
        username,
        password,
      })
      useUserStore().setUser(null) // never show the previous user's data
      this.save(username, res.data)
    },
    async register(form: RegisterForm): Promise<void> {
      const res = await apiClient.post<AuthResponse>('/api/v1/auth/register', form)
      useUserStore().setUser(null)
      this.save(form.email, res.data) // already logged in after registering
    },
    logout(): void {
      this.username = null
      this.role = null
      this.token = null
      this.userId = null
      ;['username', 'role', 'access_token', 'userId'].forEach((k) => localStorage.removeItem(k))
      useUserStore().setUser(null)
      useUserStore().setExamHistory([])
    },
  },
})
