const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');

// @route   GET /api/workouts/exercises
// @desc    Get exercises from RapidAPI
// @access  Private
router.get('/exercises', protect, async (req, res) => {
  try {
    const { bodyPart, target, equipment, limit = 10, offset = 0 } = req.query;

    let endpoint = 'https://exercisedb.p.rapidapi.com/exercises';

    if (bodyPart) {
      endpoint = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
    } else if (target) {
      endpoint = `https://exercisedb.p.rapidapi.com/exercises/target/${target}`;
    } else if (equipment) {
      endpoint = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`;
    }

    const response = await axios.get(endpoint, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST
      },
      params: {
        limit,
        offset
      }
    });

    res.json({
      success: true,
      count: response.data.length,
      data: response.data
    });
  } catch (error) {
    console.error('RapidAPI Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching exercises',
      error: error.response?.data || error.message
    });
  }
});

// @route   GET /api/workouts/exercises/search
// @desc    Search exercises by name
// @access  Private
router.get('/exercises/search', protect, async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/name/${name}`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST
      }
    });

    res.json({
      success: true,
      count: response.data.length,
      data: response.data
    });
  } catch (error) {
    console.error('RapidAPI Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error searching exercises',
      error: error.response?.data || error.message
    });
  }
});

// @route   GET /api/workouts/bodyparts
// @desc    Get list of body parts
// @access  Private
router.get('/bodyparts', protect, async (req, res) => {
  try {
    const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('RapidAPI Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching body parts'
    });
  }
});

// @route   POST /api/workouts/log
// @desc    Log a workout
// @access  Private
router.post('/log', protect, async (req, res) => {
  try {
    const { date, exercises, workoutType, intensity, notes } = req.body;
    const userId = req.user._id;

    // Find or create workout log for the day
    let workoutLog = await WorkoutLog.findOne({
      userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (workoutLog) {
      workoutLog.exercises.push(...exercises);
      workoutLog.workoutType = workoutType || workoutLog.workoutType;
      workoutLog.intensity = intensity || workoutLog.intensity;
      workoutLog.notes = notes || workoutLog.notes;
      await workoutLog.save();
    } else {
      workoutLog = await WorkoutLog.create({
        userId,
        date,
        exercises,
        workoutType,
        intensity,
        notes
      });
    }

    res.json({
      success: true,
      data: workoutLog,
      message: 'Workout logged successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error logging workout'
    });
  }
});

// @route   GET /api/workouts/history
// @desc    Get workout history
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

    const workoutLogs = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: workoutLogs.length,
      data: workoutLogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout history'
    });
  }
});

// @route   GET /api/workouts/today
// @desc    Get today's workout log
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const workoutLog = await WorkoutLog.findOne({
      userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({
      success: true,
      data: workoutLog || {
        userId,
        date: new Date(),
        exercises: [],
        totalDuration: 0,
        totalCaloriesBurned: 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s workout'
    });
  }
});

// @route   PUT /api/workouts/exercise/:logId/:exerciseId
// @desc    Update exercise completion status
// @access  Private
router.put('/exercise/:logId/:exerciseId', protect, async (req, res) => {
  try {
    const { logId, exerciseId } = req.params;
    const { completed } = req.body;
    const userId = req.user._id;

    const workoutLog = await WorkoutLog.findOne({ _id: logId, userId });

    if (!workoutLog) {
      return res.status(404).json({
        success: false,
        message: 'Workout log not found'
      });
    }

    const exercise = workoutLog.exercises.id(exerciseId);
    if (exercise) {
      exercise.completed = completed;
      await workoutLog.save();
    }

    res.json({
      success: true,
      data: workoutLog,
      message: 'Exercise updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating exercise'
    });
  }
});

module.exports = router;
