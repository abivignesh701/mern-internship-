import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { 
  Activity, 
  Flame, 
  TrendingUp, 
  Calendar,
  Apple,
  Dumbbell,
  Droplet,
  Award
} from 'lucide-react'
import { userService } from '../services/userService'
import { dietService } from '../services/dietService'
import { workoutService } from '../services/workoutService'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [progress, setProgress] = useState<any>(null)
  const [todayDiet, setTodayDiet] = useState<any>(null)
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [progressRes, dietRes, workoutRes] = await Promise.all([
        userService.getProgress(7),
        dietService.getTodayLog(),
        workoutService.getTodayLog(),
      ])
      
      setProgress(progressRes.data)
      setTodayDiet(dietRes.data)
      setTodayWorkout(workoutRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calorieProgress = todayDiet 
    ? (todayDiet.totalCalories / (user?.targetCalories || 2000)) * 100 
    : 0

  const waterProgress = todayDiet 
    ? (todayDiet.waterIntake / 2000) * 100 
    : 0

  const stats = [
    {
      icon: Flame,
      label: 'Calories Today',
      value: todayDiet?.totalCalories || 0,
      target: user?.targetCalories || 2000,
      color: 'from-orange-500 to-red-500',
      iconColor: 'text-orange-500',
    },
    {
      icon: Dumbbell,
      label: 'Workouts',
      value: progress?.totalWorkouts || 0,
      target: 'this week',
      color: 'from-blue-500 to-purple-500',
      iconColor: 'text-blue-500',
    },
    {
      icon: TrendingUp,
      label: 'Streak',
      value: progress?.streak || 0,
      target: 'days',
      color: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-500',
    },
    {
      icon: Activity,
      label: 'Calories Burned',
      value: progress?.totalCaloriesBurned || 0,
      target: 'this week',
      color: 'from-pink-500 to-rose-500',
      iconColor: 'text-pink-500',
    },
  ]

  const macroData = todayDiet ? [
    { name: 'Protein', value: todayDiet.totalProtein || 0, color: '#3b82f6' },
    { name: 'Carbs', value: todayDiet.totalCarbs || 0, color: '#10b981' },
    { name: 'Fat', value: todayDiet.totalFat || 0, color: '#f59e0b' },
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username}!</span>
          </h1>
          <p className="text-gray-600">Here's your fitness overview for today</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-xl shadow-lg p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className={`w-5 h-5 ${stat.iconColor}`} />
                </motion.div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">/ {stat.target}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Calorie Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Apple className="w-5 h-5 mr-2 text-red-500" />
                Daily Calorie Intake
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(calorieProgress)}%
              </span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${
                  calorieProgress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-blue-500'
                }`}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {todayDiet?.totalCalories || 0} / {user?.targetCalories || 2000} calories
            </p>
          </motion.div>

          {/* Water Intake */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Droplet className="w-5 h-5 mr-2 text-blue-500" />
                Water Intake
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(waterProgress)}%
              </span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(waterProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {todayDiet?.waterIntake || 0} / 2000 ml
            </p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Macronutrients Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Macros</h3>
            {macroData.length > 0 && macroData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>No meal data for today</p>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              Today's Activity
            </h3>
            <div className="space-y-4">
              {todayDiet?.meals?.length > 0 && (
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-gray-800">Meals Logged</p>
                  <p className="text-sm text-gray-600">{todayDiet.meals.length} meals</p>
                </div>
              )}
              {todayWorkout?.exercises?.length > 0 && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-gray-800">Exercises Completed</p>
                  <p className="text-sm text-gray-600">{todayWorkout.exercises.length} exercises</p>
                </div>
              )}
              {(!todayDiet?.meals?.length && !todayWorkout?.exercises?.length) && (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No activity logged yet today</p>
                  <p className="text-sm mt-1">Start by logging a meal or workout!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
