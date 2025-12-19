const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  sugar: Number,
  time: {
    type: String,
    default: new Date().toLocaleTimeString()
  }
});

const DietLogSchema = new mongoose.Schema({
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
  meals: [MealSchema],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  waterIntake: {
    type: Number,
    default: 0,
    comment: 'in ml'
  },
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
DietLogSchema.pre('save', function(next) {
  this.totalCalories = this.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  this.totalProtein = this.meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  this.totalCarbs = this.meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  this.totalFat = this.meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
  next();
});

module.exports = mongoose.model('DietLog', DietLogSchema);
