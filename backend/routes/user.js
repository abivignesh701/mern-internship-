const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const DietLog = require('../models/DietLog');
const WorkoutLog = require('../models/WorkoutLog');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, age, gender, weight, height, fitnessGoals, dietaryPreferences, targetCalories } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.username = username || user.username;
      user.age = age || user.age;
      user.gender = gender || user.gender;
      user.weight = weight || user.weight;
      user.height = height || user.height;
      user.fitnessGoals = fitnessGoals || user.fitnessGoals;
      user.dietaryPreferences = dietaryPreferences || user.dietaryPreferences;
      user.targetCalories = targetCalories || user.targetCalories;

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   GET /api/user/progress
// @desc    Get user progress stats
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get diet logs
    const dietLogs = await DietLog.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Get workout logs
    const workoutLogs = await WorkoutLog.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Calculate stats
    const totalCaloriesConsumed = dietLogs.reduce((sum, log) => sum + log.totalCalories, 0);
    const totalCaloriesBurned = workoutLogs.reduce((sum, log) => sum + log.totalCaloriesBurned, 0);
    const totalWorkouts = workoutLogs.length;
    const avgCaloriesPerDay = dietLogs.length > 0 ? totalCaloriesConsumed / dietLogs.length : 0;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasActivity = workoutLogs.some(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === checkDate.getTime();
      });
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    res.json({
      success: true,
      data: {
        totalCaloriesConsumed,
        totalCaloriesBurned,
        totalWorkouts,
        avgCaloriesPerDay: Math.round(avgCaloriesPerDay),
        streak,
        dietLogs: dietLogs.slice(0, 7),
        workoutLogs: workoutLogs.slice(0, 7)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress'
    });
  }
});

module.exports = router;
