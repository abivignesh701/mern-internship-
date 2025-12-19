import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Flame, Activity, Apple, Dumbbell, Droplets } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dietService } from '../services/dietService'
import { workoutService } from '../services/workoutService'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

const DailyTracker = () => {
  const [selectedDays, setSelectedDays] = useState(7)
  const [dietHistory, setDietHistory] = useState<any[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([])
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    waterIntake: 0,
    workoutDuration: 0,
    caloriesBurned: 0,
    exerciseCount: 0
  })

  useEffect(() => {
    fetchAllData()
  }, [selectedDays])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch diet history
      const dietResponse = await dietService.getHistory({ limit: selectedDays })
      setDietHistory(dietResponse.data)

      // Fetch workout history
      const workoutResponse = await workoutService.getHistory({ limit: selectedDays })
      setWorkoutHistory(workoutResponse.data)

      // Fetch overall progress
      const progressResponse = await userService.getProgress(selectedDays)
      setProgress(progressResponse.data)

      // Get today's data
      const today = new Date().toDateString()
      const todayDiet = dietResponse.data.find((log: any) => 
        new Date(log.date).toDateString() === today
      )
      const todayWorkout = workoutResponse.data.find((log: any) => 
        new Date(log.date).toDateString() === today
      )

      setTodayStats({
        calories: todayDiet?.totalCalories || 0,
        protein: todayDiet?.totalProtein || 0,
        carbs: todayDiet?.totalCarbs || 0,
        fat: todayDiet?.totalFat || 0,
        waterIntake: todayDiet?.waterIntake || 0,
        workoutDuration: todayWorkout?.totalDuration || 0,
        caloriesBurned: todayWorkout?.totalCaloriesBurned || 0,
        exerciseCount: todayWorkout?.exercises?.length || 0
      })
    } catch (error) {
      console.error('Error fetching tracker data:', error)
      toast.error('Failed to load tracking data')
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const calorieChartData = dietHistory.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    consumed: log.totalCalories,
    burned: workoutHistory.find((w) => 
      new Date(w.date).toDateString() === new Date(log.date).toDateString()
    )?.totalCaloriesBurned || 0
  })).reverse()

  const macroData = [
    { name: 'Protein', value: todayStats.protein, color: '#3b82f6' },
    { name: 'Carbs', value: todayStats.carbs, color: '#10b981' },
    { name: 'Fats', value: todayStats.fat, color: '#f59e0b' }
  ]

  const workoutChartData = workoutHistory.map((log) => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    duration: log.totalDuration,
    exercises: log.exercises.length
  })).reverse()

  const StatCard = ({ icon: Icon, title, value, unit, color, subtitle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {value}
            <span className="text-xl ml-1">{unit}</span>
          </p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-12 h-12 opacity-80" />
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracker data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Tracker</h1>
          <p className="text-gray-600">Monitor your health journey</p>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 mb-8"
        >
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedDays === days
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              {days} Days
            </button>
          ))}
        </motion.div>

        {/* Today's Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Flame}
            title="Calories Consumed"
            value={todayStats.calories}
            unit="kcal"
            color="from-orange-400 to-red-500"
            subtitle="Today"
          />
          <StatCard
            icon={Activity}
            title="Calories Burned"
            value={todayStats.caloriesBurned}
            unit="kcal"
            color="from-green-400 to-emerald-500"
            subtitle={`${todayStats.exerciseCount} exercises`}
          />
          <StatCard
            icon={Dumbbell}
            title="Workout Time"
            value={todayStats.workoutDuration}
            unit="min"
            color="from-blue-400 to-indigo-500"
            subtitle="Today"
          />
          <StatCard
            icon={Droplets}
            title="Water Intake"
            value={todayStats.waterIntake}
            unit="ml"
            color="from-cyan-400 to-blue-500"
            subtitle="Stay hydrated!"
          />
        </div>

        {/* Calorie Tracking Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Calorie Balance</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={calorieChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumed" 
                stroke="#f97316" 
                strokeWidth={3}
                name="Calories Consumed"
                dot={{ fill: '#f97316', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="burned" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Calories Burned"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Macro Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Apple className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Today's Macros</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}g`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Protein</p>
                <p className="font-bold text-lg">{todayStats.protein}g</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="font-bold text-lg">{todayStats.carbs}g</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Fats</p>
                <p className="font-bold text-lg">{todayStats.fat}g</p>
              </div>
            </div>
          </motion.div>

          {/* Workout Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Workout Trends</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#3b82f6" name="Duration (min)" />
                <Bar dataKey="exercises" fill="#8b5cf6" name="Exercises" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Progress Summary */}
        {progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Your Progress Summary</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold">{progress.currentStreak || 0}</p>
                <p className="text-sm opacity-90 mt-1">Day Streak 🔥</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{progress.totalWorkouts || 0}</p>
                <p className="text-sm opacity-90 mt-1">Total Workouts</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{progress.totalMeals || 0}</p>
                <p className="text-sm opacity-90 mt-1">Meals Logged</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{Math.round(progress.avgCaloriesBurned || 0)}</p>
                <p className="text-sm opacity-90 mt-1">Avg Calories/Day</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DailyTracker
