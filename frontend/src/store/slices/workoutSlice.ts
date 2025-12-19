import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Exercise {
  _id?: string
  name: string
  bodyPart?: string
  equipment?: string
  target?: string
  gifUrl?: string
  sets?: number
  reps?: number
  duration?: number
  caloriesBurned?: number
  completed?: boolean
}

interface WorkoutLog {
  _id?: string
  userId: string
  date: string
  exercises: Exercise[]
  totalDuration: number
  totalCaloriesBurned: number
  workoutType?: string
  intensity?: string
  notes?: string
}

interface WorkoutState {
  todayLog: WorkoutLog | null
  history: WorkoutLog[]
  loading: boolean
  exercises: Exercise[]
  bodyParts: string[]
}

const initialState: WorkoutState = {
  todayLog: null,
  history: [],
  loading: false,
  exercises: [],
  bodyParts: [],
}

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setTodayLog: (state, action: PayloadAction<WorkoutLog>) => {
      state.todayLog = action.payload
    },
    setHistory: (state, action: PayloadAction<WorkoutLog[]>) => {
      state.history = action.payload
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      if (state.todayLog) {
        state.todayLog.exercises.push(action.payload)
      }
    },
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload
    },
    setBodyParts: (state, action: PayloadAction<string[]>) => {
      state.bodyParts = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setTodayLog,
  setHistory,
  addExercise,
  setExercises,
  setBodyParts,
  setLoading,
} = workoutSlice.actions
export default workoutSlice.reducer
