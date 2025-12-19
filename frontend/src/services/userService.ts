import api from './api'

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile')
    return response.data
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/user/profile', data)
    return response.data
  },

  getProgress: async (days: number = 7) => {
    const response = await api.get(`/user/progress?days=${days}`)
    return response.data
  },
}
