import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dietReducer from './slices/dietSlice'
import workoutReducer from './slices/workoutSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diet: dietReducer,
    workout: workoutReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
