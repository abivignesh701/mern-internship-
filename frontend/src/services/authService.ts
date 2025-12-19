import api from './api'

export interface RegisterData {
  username: string
  email: string
  password: string
  age?: number
  gender?: string
  weight?: number
  height?: number
  fitnessGoals?: string[]
  dietaryPreferences?: string
}

export interface LoginData {
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  refreshToken: async (token: string) => {
    const response = await api.post('/auth/refresh-token', { token })
    return response.data
  },
}
