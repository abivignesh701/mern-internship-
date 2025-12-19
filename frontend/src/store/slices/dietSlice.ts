import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Meal {
  _id?: string
  name: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  time?: string
}

interface DietLog {
  _id?: string
  userId: string
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  waterIntake: number
  notes?: string
}

interface DietState {
  todayLog: DietLog | null
  history: DietLog[]
  loading: boolean
  searchResults: any[]
}

const initialState: DietState = {
  todayLog: null,
  history: [],
  loading: false,
  searchResults: [],
}

const dietSlice = createSlice({
  name: 'diet',
  initialState,
  reducers: {
    setTodayLog: (state, action: PayloadAction<DietLog>) => {
      state.todayLog = action.payload
    },
    setHistory: (state, action: PayloadAction<DietLog[]>) => {
      state.history = action.payload
    },
    addMeal: (state, action: PayloadAction<Meal>) => {
      if (state.todayLog) {
        state.todayLog.meals.push(action.payload)
      }
    },
    updateWaterIntake: (state, action: PayloadAction<number>) => {
      if (state.todayLog) {
        state.todayLog.waterIntake = action.payload
      }
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setTodayLog,
  setHistory,
  addMeal,
  updateWaterIntake,
  setSearchResults,
  setLoading,
} = dietSlice.actions
export default dietSlice.reducer
