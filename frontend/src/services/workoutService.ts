import api from './api'

export const workoutService = {
  getExercises: async (params?: {
    bodyPart?: string
    target?: string
    equipment?: string
    limit?: number
    offset?: number
  }) => {
    const response = await api.get('/workouts/exercises', { params })
    return response.data
  },

  searchExercises: async (name: string) => {
    const response = await api.get(`/workouts/exercises/search?name=${name}`)
    return response.data
  },

  getBodyParts: async () => {
    const response = await api.get('/workouts/bodyparts')
    return response.data
  },

  logWorkout: async (workoutData: any) => {
    const response = await api.post('/workouts/log', workoutData)
    return response.data
  },

  getTodayLog: async () => {
    const response = await api.get('/workouts/today')
    return response.data
  },

  getHistory: async (params?: { startDate?: string; endDate?: string; limit?: number }) => {
    const response = await api.get('/workouts/history', { params })
    return response.data
  },

  updateExercise: async (logId: string, exerciseId: string, completed: boolean) => {
    const response = await api.put(`/workouts/exercise/${logId}/${exerciseId}`, { completed })
    return response.data
  },
}
