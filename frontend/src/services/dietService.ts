import api from './api'

export const dietService = {
  getNutrition: async (query: string) => {
    const response = await api.get(`/diet/plan?query=${query}`)
    return response.data
  },

  logMeal: async (mealData: any) => {
    const response = await api.post('/diet/log-meal', mealData)
    return response.data
  },

  getTodayLog: async () => {
    const response = await api.get('/diet/today')
    return response.data
  },

  getHistory: async (params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const response = await api.get('/diet/history', { params })
    return response.data
  },

  updateWaterIntake: async (amount: number, date?: string) => {
    const response = await api.put('/diet/water-intake', { amount, date })
    return response.data
  },

  deleteMeal: async (logId: string, mealId: string) => {
    const response = await api.delete(`/diet/meal/${logId}/${mealId}`)
    return response.data
  },
}
