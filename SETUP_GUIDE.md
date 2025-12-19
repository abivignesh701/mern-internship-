# Health & Fitness Planner - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
cd "d:\health and fitness\backend"
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd "d:\health and fitness\frontend"
npm install
```

### Step 3: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service, it's already running)
# Or start it manually:
mongod

# Your MongoDB connection: mongodb://localhost:27017/health-fitness-planner
```

### Step 4: Start Backend Server
```bash
cd "d:\health and fitness\backend"
npm run dev
```
✅ Backend will run on: http://localhost:5000

### Step 5: Start Frontend Development Server
Open a new terminal:
```bash
cd "d:\health and fitness\frontend"
npm run dev
```
✅ Frontend will run on: http://localhost:5173

## 🎯 Testing the Application

### 1. Create an Account
- Visit: http://localhost:5173
- Click "Sign Up"
- Fill in the registration form:
  - Username: testuser
  - Email: test@example.com
  - Password: test123
  - Age, weight, height, etc.
- Click "Sign Up"

### 2. Test Diet Planner
- Click "Diet" in navigation
- Search for food: "chicken breast" or "apple"
- Select meal type (breakfast, lunch, dinner, snack)
- Click "Add to meal"
- Add water intake using the +250ml, +500ml buttons

### 3. Test Workout Planner
- Click "Workout" in navigation
- Search for exercises by name or select a body part
- Click "Search" to browse exercises
- Click "Add to Workout" on any exercise
- View your workout plan

### 4. View Dashboard
- Click "Dashboard" to see:
  - Calorie progress
  - Workout stats
  - Streak counter
  - Macro breakdown charts

## 📝 Environment Variables

### Backend (.env) - Already Configured ✅
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health-fitness-planner
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NINJA_API_KEY=e3drZJyUvjXdOc/O7JOErA==oZ8Jogaz4QpehFO6
RAPID_API_KEY=bd2ae0769cmsh8cd6bbc46013124p1df51ejsn5e3754152055
RAPID_API_HOST=exercisedb.p.rapidapi.com
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env) - Already Configured ✅
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Health & Fitness Planner
```

## 🔧 Troubleshooting

### Backend not starting?
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify all dependencies are installed: `npm install`

### Frontend not loading?
- Make sure backend is running first
- Check if port 5173 is available
- Clear browser cache
- Try: `npm install` again

### API calls failing?
- Verify backend is running on http://localhost:5000
- Check browser console for errors
- Ensure CORS is properly configured

### MongoDB connection issues?
- Make sure MongoDB is installed and running
- Check MongoDB connection string in backend/.env
- Verify MongoDB is accessible at mongodb://localhost:27017/

## 🎨 Features to Test

### ✅ Authentication
- [x] Sign up with validation
- [x] Login with JWT token
- [x] Password strength indicator
- [x] Logout functionality

### ✅ Dashboard
- [x] Calorie progress bar
- [x] Workout statistics
- [x] Streak counter
- [x] Macro nutrients pie chart
- [x] Recent activity feed

### ✅ Diet Planner
- [x] Search nutrition data (Ninja API)
- [x] Log meals by type
- [x] Track water intake
- [x] View daily calorie progress
- [x] Macro breakdown

### ✅ Workout Planner
- [x] Browse exercises (RapidAPI)
- [x] Filter by body part
- [x] Search by name
- [x] Log workouts
- [x] Track calories burned
- [x] View exercise GIFs

### ✅ Profile
- [x] Update personal info
- [x] Change fitness goals
- [x] Update dietary preferences
- [x] Set target calories

### ✅ Animations
- [x] Framer Motion page transitions
- [x] Loading animations
- [x] Hover effects
- [x] Progress bar animations
- [x] Card animations

## 📱 Responsive Design
The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px)
- Tablet (768px)
- Mobile (375px)

## 🔐 Security Features
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- Input validation
- CORS protection

## 🎯 Sample Data for Testing

### Food Search Examples:
- "chicken breast"
- "brown rice"
- "apple"
- "salmon"
- "broccoli"
- "sweet potato"

### Exercise Search Examples:
Body Parts to filter:
- chest
- back
- legs
- shoulders
- arms
- abs

Exercise Names:
- "push"
- "squat"
- "bench"
- "curl"
- "press"

## 📊 MongoDB Data Structure

Your data will be stored in collections:
- `users` - User accounts and profiles
- `dietlogs` - Daily meal tracking
- `workoutlogs` - Workout sessions

View data using MongoDB Compass or mongosh:
```bash
mongosh
use health-fitness-planner
db.users.find()
db.dietlogs.find()
db.workoutlogs.find()
```

## 🚀 Next Steps

1. **Customize**: Update colors, add features, modify UI
2. **Deploy**: Deploy to Vercel (frontend) + Render/Railway (backend)
3. **Enhance**: Add more features like meal plans, workout programs
4. **Share**: Show off your project!

## 📞 Support

If you encounter any issues:
1. Check the console for errors
2. Verify all environment variables
3. Ensure MongoDB is running
4. Restart both servers

Happy coding! 💪🎉
