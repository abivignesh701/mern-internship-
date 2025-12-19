const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bodyPart: String,
  equipment: String,
  target: String,
  gifUrl: String,
  sets: {
    type: Number,
    default: 3
  },
  reps: {
    type: Number,
    default: 12
  },
  duration: {
    type: Number,
    comment: 'in seconds'
  },
  caloriesBurned: Number,
  completed: {
    type: Boolean,
    default: false
  }
});

const WorkoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  exercises: [ExerciseSchema],
  totalDuration: {
    type: Number,
    default: 0,
    comment: 'in minutes'
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0
  },
  workoutType: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'mixed'],
    default: 'mixed'
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
WorkoutLogSchema.pre('save', function(next) {
  this.totalDuration = this.exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0) / 60;
  this.totalCaloriesBurned = this.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
  next();
});

module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);
