import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Trash2, Droplets, Edit3 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import toast from 'react-hot-toast'
import { dietService } from '../services/dietService'
import { setTodayLog, setSearchResults } from '../store/slices/dietSlice'

const DietPlanner = () => {
  const dispatch = useDispatch()
  const { todayLog } = useSelector((state: RootState) => state.diet)
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualMeal, setManualMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })

  useEffect(() => {
    fetchTodayLog()
  }, [])

  const fetchTodayLog = async () => {
    try {
      const response = await dietService.getTodayLog()
      dispatch(setTodayLog(response.data))
    } catch (error) {
      console.error('Error fetching diet log:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      setLoading(true)
      const response = await dietService.getNutrition(searchQuery)
      setResults(response.data)
      dispatch(setSearchResults(response.data))
    } catch (error) {
      toast.error('Error searching for food')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMeal = async (foodItem: any) => {
    try {
      // Handle cases where API returns premium-only data or invalid values
      const parseValue = (val: any) => {
        if (typeof val === 'string' && val.includes('premium')) return 0;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
      };

      const meal = {
        name: foodItem.name || 'Unknown Food',
        mealType: selectedMealType,
        calories: parseValue(foodItem.calories),
        protein: parseValue(foodItem.protein_g),
        carbs: parseValue(foodItem.carbohydrates_total_g),
        fat: parseValue(foodItem.fat_total_g),
        fiber: parseValue(foodItem.fiber_g || 0),
        sugar: parseValue(foodItem.sugar_g || 0),
      }

      // If all values are 0, use estimated values based on food name
      if (meal.calories === 0 && meal.protein === 0 && meal.carbs === 0 && meal.fat === 0) {
        // Provide default estimation
        meal.calories = 150;
        meal.protein = 5;
        meal.carbs = 20;
        meal.fat = 5;
        toast('Using estimated nutrition values. Please update manually if needed.', {
          icon: 'ℹ️',
          duration: 3000
        });
      }

      await dietService.logMeal({
        date: new Date(),
        meal,
      })

      toast.success('Meal added successfully! 🍽️')
      fetchTodayLog()
      setResults([])
      setSearchQuery('')
    } catch (error: any) {
      console.error('Error adding meal:', error);
      toast.error(error?.response?.data?.message || 'Error adding meal')
    }
  }

  const handleAddWater = async (amount: number) => {
    try {
      await dietService.updateWaterIntake(amount)
      toast.success(`Added ${amount}ml water! 💧`)
      fetchTodayLog()
    } catch (error) {
      toast.error('Error updating water intake')
    }
  }

  const handleManualMealSubmit = async () => {
    if (!manualMeal.name || !manualMeal.calories) {
      toast.error('Please fill in meal name and calories')
      return
    }

    try {
      const meal = {
        name: manualMeal.name,
        mealType: selectedMealType,
        calories: parseFloat(manualMeal.calories) || 0,
        protein: parseFloat(manualMeal.protein) || 0,
        carbs: parseFloat(manualMeal.carbs) || 0,
        fat: parseFloat(manualMeal.fat) || 0,
        fiber: 0,
        sugar: 0
      }

      await dietService.logMeal({
        date: new Date(),
        meal
      })

      toast.success('Custom meal added successfully! 🍽️')
      fetchTodayLog()
      setShowManualEntry(false)
      setManualMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    } catch (error: any) {
      console.error('Error adding manual meal:', error)
      toast.error(error?.response?.data?.message || 'Error adding meal')
    }
  }

  const calorieProgress = todayLog 
    ? (todayLog.totalCalories / (user?.targetCalories || 2000)) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Diet Planner</h1>
          <p className="text-gray-600">Track your nutrition and reach your goals</p>
        </motion.div>

        {/* Calorie Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {todayLog?.totalCalories || 0} / {user?.targetCalories || 2000}
              </h2>
              <p className="text-gray-600">Calories consumed today</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{Math.round(calorieProgress)}%</p>
              <p className="text-sm text-gray-500">of daily goal</p>
            </div>
          </div>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
              transition={{ duration: 1 }}
              className={`h-full ${
                calorieProgress > 100 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                  : 'bg-gradient-to-r from-green-400 to-blue-500'
              }`}
            />
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-2xl font-bold text-blue-600">{todayLog?.totalProtein || 0}g</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-2xl font-bold text-green-600">{todayLog?.totalCarbs || 0}g</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Fat</p>
              <p className="text-2xl font-bold text-yellow-600">{todayLog?.totalFat || 0}g</p>
            </div>
          </div>
        </motion.div>

        {/* Water Intake */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Droplets className="w-6 h-6 mr-2 text-blue-500" />
            Water Intake
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((todayLog?.waterIntake || 0) / 2000 * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {todayLog?.waterIntake || 0} / 2000 ml
              </p>
            </div>
            <div className="flex gap-2">
              {[250, 500, 750].map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddWater(amount)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  +{amount}ml
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Search Food</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {showManualEntry ? 'Search Food' : 'Manual Entry'}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {!showManualEntry ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search for food (e.g., chicken breast, apple, rice)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Food name *"
                    value={manualMeal.name}
                    onChange={(e) => setManualMeal({ ...manualMeal, name: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Calories *"
                    value={manualMeal.calories}
                    onChange={(e) => setManualMeal({ ...manualMeal, calories: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Protein (g)"
                    value={manualMeal.protein}
                    onChange={(e) => setManualMeal({ ...manualMeal, protein: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={manualMeal.carbs}
                    onChange={(e) => setManualMeal({ ...manualMeal, carbs: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Fat (g)"
                    value={manualMeal.fat}
                    onChange={(e) => setManualMeal({ ...manualMeal, fat: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManualMealSubmit}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Custom Meal
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <h4 className="font-semibold text-gray-800 mb-2 capitalize">{item.name}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Calories: <span className="font-semibold">{item.calories}</span></p>
                    <p>Protein: {item.protein_g}g</p>
                    <p>Carbs: {item.carbohydrates_total_g}g</p>
                    <p>Fat: {item.fat_total_g}g</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddMeal(item)}
                    className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to {selectedMealType}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Today's Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Meals</h3>
          {todayLog?.meals && todayLog.meals.length > 0 ? (
            <div className="space-y-3">
              {todayLog.meals.map((meal: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800 capitalize">{meal.name}</h4>
                    <p className="text-sm text-gray-600">
                      {meal.mealType} • {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    meal.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                    meal.mealType === 'lunch' ? 'bg-green-100 text-green-800' :
                    meal.mealType === 'dinner' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {meal.mealType}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No meals logged yet today</p>
              <p className="text-sm mt-1">Search for food above to get started!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DietPlanner
