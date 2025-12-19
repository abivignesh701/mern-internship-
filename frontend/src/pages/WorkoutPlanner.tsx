import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Dumbbell, Play, Pause, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import toast from 'react-hot-toast'
import { workoutService } from '../services/workoutService'
import { setTodayLog, setExercises, setBodyParts } from '../store/slices/workoutSlice'

const WorkoutPlanner = () => {
  const dispatch = useDispatch()
  const { todayLog } = useSelector((state: RootState) => state.workout)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [bodyParts, setBodyPartsList] = useState<string[]>([])
  const [selectedBodyPart, setSelectedBodyPart] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTodayLog()
    fetchBodyParts()
  }, [])

  const fetchTodayLog = async () => {
    try {
      const response = await workoutService.getTodayLog()
      dispatch(setTodayLog(response.data))
    } catch (error) {
      console.error('Error fetching workout log:', error)
    }
  }

  const fetchBodyParts = async () => {
    try {
      const response = await workoutService.getBodyParts()
      setBodyPartsList(response.data)
      dispatch(setBodyParts(response.data))
    } catch (error) {
      console.error('Error fetching body parts:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedBodyPart) return
    
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await workoutService.searchExercises(searchQuery)
      } else {
        response = await workoutService.getExercises({ 
          bodyPart: selectedBodyPart,
          limit: 20 
        })
      }
      setSearchResults(response.data)
      dispatch(setExercises(response.data))
    } catch (error) {
      toast.error('Error searching for exercises')
    } finally {
      setLoading(false)
    }
  }

  const handleAddExercise = async (exercise: any) => {
    try {
      const exerciseData = {
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
        target: exercise.target,
        gifUrl: exercise.gifUrl,
        sets: 3,
        reps: 12,
        duration: 180,
        caloriesBurned: 50,
      }

      await workoutService.logWorkout({
        date: new Date(),
        exercises: [exerciseData],
        workoutType: 'strength',
        intensity: 'medium',
      })

      toast.success('Exercise added! 💪')
      fetchTodayLog()
    } catch (error) {
      toast.error('Error adding exercise')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Workout Planner</h1>
          <p className="text-gray-600">Build your perfect workout routine</p>
        </motion.div>

        {/* Workout Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              <Dumbbell className="w-12 h-12 mx-auto mb-2" />
              <p className="text-3xl font-bold">{todayLog?.exercises?.length || 0}</p>
              <p className="text-sm opacity-90">Exercises Today</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <Play className="w-12 h-12 mx-auto mb-2" />
              <p className="text-3xl font-bold">{todayLog?.totalDuration || 0}</p>
              <p className="text-sm opacity-90">Minutes</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.div>
              <p className="text-3xl font-bold">{todayLog?.totalCaloriesBurned || 0}</p>
              <p className="text-sm opacity-90">Calories Burned</p>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Exercises</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by exercise name..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Body Parts</option>
              {bodyParts.map((part) => (
                <option key={part} value={part} className="capitalize">
                  {part}
                </option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </motion.button>
          </div>

          {/* Exercise Results */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.slice(0, 12).map((exercise, index) => (
                <motion.div
                  key={exercise.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition bg-white"
                >
                  {exercise.gifUrl && (
                    <div className="w-full h-48 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                    {exercise.name}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p className="capitalize">🎯 Target: {exercise.target}</p>
                    <p className="capitalize">💪 Body Part: {exercise.bodyPart}</p>
                    <p className="capitalize">🏋️ Equipment: {exercise.equipment}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddExercise(exercise)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Workout
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Workout</h3>
          {todayLog?.exercises && todayLog.exercises.length > 0 ? (
            <div className="space-y-3">
              {todayLog.exercises.map((exercise: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    {exercise.gifUrl && (
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800 capitalize">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps • {exercise.bodyPart}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      {exercise.caloriesBurned || 50} cal
                    </span>
                    {exercise.completed && (
                      <Check className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Dumbbell className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>No exercises logged yet today</p>
              <p className="text-sm mt-1">Search for exercises above to build your workout!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default WorkoutPlanner
