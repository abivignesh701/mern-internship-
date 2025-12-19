const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const DietLog = require('../models/DietLog');

// @route   GET /api/diet/plan
// @desc    Get diet plan from Ninja API
// @access  Private
router.get('/plan', protect, async (req, res) => {
  try {
    const { query, calories } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a food query'
      });
    }

    const response = await axios.get(`https://api.api-ninjas.com/v1/nutrition?query=${query}`, {
      headers: {
        'X-Api-Key': process.env.NINJA_API_KEY
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Ninja API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrition data',
      error: error.response?.data || error.message
    });
  }
});

// @route   POST /api/diet/log-meal
// @desc    Log a meal
// @access  Private
router.post('/log-meal', protect, async (req, res) => {
  try {
    const { date, meal } = req.body;
    const userId = req.user._id;

    // Validate and sanitize meal data (handle premium API restrictions)
    const sanitizedMeal = {
      name: meal.name || 'Unknown Food',
      mealType: meal.mealType || 'snack',
      calories: parseFloat(meal.calories) || 0,
      protein: parseFloat(meal.protein) || 0,
      carbs: parseFloat(meal.carbs) || 0,
      fat: parseFloat(meal.fat) || 0,
      fiber: parseFloat(meal.fiber) || 0,
      sugar: parseFloat(meal.sugar) || 0
    };

    // Find or create diet log for the day
    let dietLog = await DietLog.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (dietLog) {
      dietLog.meals.push(sanitizedMeal);
      await dietLog.save();
    } else {
      dietLog = await DietLog.create({
        userId,
        date,
        meals: [sanitizedMeal]
      });
    }

    res.json({
      success: true,
      data: dietLog,
      message: 'Meal logged successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error logging meal',
      error: error.message
    });
  }
});

// @route   GET /api/diet/history
// @desc    Get diet history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, limit = 30 } = req.query;

    let query = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const dietLogs = await DietLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: dietLogs.length,
      data: dietLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diet history'
    });
  }
});

// @route   GET /api/diet/today
// @desc    Get today's diet log
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dietLog = await DietLog.findOne({
      userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({
      success: true,
      data: dietLog || {
        userId,
        date: new Date(),
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        waterIntake: 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s diet'
    });
  }
});

// @route   PUT /api/diet/water-intake
// @desc    Update water intake
// @access  Private
router.put('/water-intake', protect, async (req, res) => {
  try {
    const { amount, date } = req.body;
    const userId = req.user._id;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let dietLog = await DietLog.findOne({
      userId,
      date: {
        $gte: targetDate,
        $lt: nextDay
      }
    });

    if (dietLog) {
      dietLog.waterIntake = (dietLog.waterIntake || 0) + amount;
      await dietLog.save();
    } else {
      dietLog = await DietLog.create({
        userId,
        date: targetDate,
        meals: [],
        waterIntake: amount
      });
    }

    res.json({
      success: true,
      data: dietLog,
      message: 'Water intake updated'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating water intake'
    });
  }
});

// @route   DELETE /api/diet/meal/:logId/:mealId
// @desc    Delete a meal from log
// @access  Private
router.delete('/meal/:logId/:mealId', protect, async (req, res) => {
  try {
    const { logId, mealId } = req.params;
    const userId = req.user._id;

    const dietLog = await DietLog.findOne({ _id: logId, userId });

    if (!dietLog) {
      return res.status(404).json({
        success: false,
        message: 'Diet log not found'
      });
    }

    dietLog.meals = dietLog.meals.filter(meal => meal._id.toString() !== mealId);
    await dietLog.save();

    res.json({
      success: true,
      data: dietLog,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meal'
    });
  }
});

module.exports = router;
