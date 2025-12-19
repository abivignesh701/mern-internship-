# 🧪 Testing Guide - Health & Fitness Planner

## Quick Test Checklist

### Prerequisites
- ✅ MongoDB running on localhost:27017
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 5173

---

## 🚀 Getting Started

### 1. Install Everything (One-Click)
Double-click: `install-dependencies.bat`

OR manually:
```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

### 2. Start Servers

**Terminal 1 - Backend:**
Double-click: `start-backend.bat`

OR manually:
```bash
cd backend
npm run dev
```
✅ Should show: "Server running in development mode on port 5000"
✅ Should show: "MongoDB Connected: localhost"

**Terminal 2 - Frontend:**
Double-click: `start-frontend.bat`

OR manually:
```bash
cd frontend
npm run dev
```
✅ Should show: "Local: http://localhost:5173/"

---

## 📋 Feature Testing Checklist

### Test 1: Authentication ✅

#### Signup
1. Visit: http://localhost:5173
2. Click "Create an Account" or navigate to /signup
3. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123456` (watch the password strength indicator)
   - Confirm Password: `test123456`
   - Age: `25`
   - Gender: `Male`
   - Weight: `75` kg
   - Height: `175` cm
   - Dietary Preferences: `No preference`
4. Click "Sign Up"

**Expected Results:**
- ✅ Password strength bar animates
- ✅ Form validates in real-time
- ✅ Success toast appears: "Account created successfully! 🎉"
- ✅ Redirects to Dashboard
- ✅ User data stored in MongoDB

#### Login
1. Logout (top-right button)
2. Visit /login
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `test123456`
4. Click "Log In"

**Expected Results:**
- ✅ Success toast: "Welcome back! 🎉"
- ✅ Redirects to Dashboard
- ✅ JWT token stored in localStorage
- ✅ User info displayed in navbar

---

### Test 2: Dashboard 📊

Navigate to: http://localhost:5173/dashboard

**Check for:**
- ✅ Welcome message with username
- ✅ 4 stat cards with animations:
  - Calories Today (0/2000)
  - Workouts (0 this week)
  - Streak (0 days)
  - Calories Burned (0 this week)
- ✅ Calorie progress bar
- ✅ Water intake tracker
- ✅ Macro nutrients pie chart (empty initially)
- ✅ Today's Activity section
- ✅ All cards have hover animations
- ✅ Smooth page transitions

---

### Test 3: Diet Planner 🍎

Navigate to: http://localhost:5173/diet

#### Search Nutrition Data (Ninja API)
1. Search for: `chicken breast`
2. Select meal type: `Lunch`
3. Click Search

**Expected Results:**
- ✅ Loading state appears
- ✅ Results display with:
  - Food name
  - Calories
  - Protein, Carbs, Fat
  - "Add to Lunch" button
- ✅ Cards animate in

#### Log a Meal
1. Click "Add to Lunch" on any item

**Expected Results:**
- ✅ Success toast: "Meal added successfully! 🍽️"
- ✅ Meal appears in "Today's Meals" section
- ✅ Calorie progress bar updates
- ✅ Macro totals update
- ✅ Data saved to MongoDB

#### Add Water Intake
1. Click "+250ml" button
2. Click "+500ml" button

**Expected Results:**
- ✅ Toast: "Added 250ml water! 💧"
- ✅ Water progress bar animates
- ✅ Total water shows: 750 / 2000 ml

#### Test More Foods
Try searching for:
- `apple` → Should show apple nutrition
- `brown rice` → Should show rice data
- `salmon` → Should show fish data
- `banana` → Should show banana info

---

### Test 4: Workout Planner 💪

Navigate to: http://localhost:5173/workout

#### Browse Exercises (RapidAPI)

**Option 1: Search by Name**
1. Type: `push`
2. Click Search

**Expected Results:**
- ✅ Loading state
- ✅ Shows push-up variations
- ✅ Each exercise shows:
  - Animated GIF
  - Exercise name
  - Target muscle
  - Body part
  - Equipment needed
  - "Add to Workout" button

**Option 2: Filter by Body Part**
1. Select dropdown: `chest`
2. Click Search

**Expected Results:**
- ✅ Shows chest exercises
- ✅ Grid of exercise cards
- ✅ Hover animations on cards

#### Log a Workout
1. Click "Add to Workout" on any exercise

**Expected Results:**
- ✅ Success toast: "Exercise added! 💪"
- ✅ Exercise appears in "Today's Workout"
- ✅ Shows sets/reps (3 × 12)
- ✅ Shows calories burned
- ✅ Exercise stats update:
  - Exercises Today: 1
  - Duration increases
  - Calories Burned updates

#### Test Different Body Parts
- `back` → Pull exercises, rows
- `legs` → Squats, lunges
- `shoulders` → Presses, raises
- `arms` → Curls, extensions
- `abs` → Core exercises

---

### Test 5: Profile Management 👤

Navigate to: http://localhost:5173/profile

1. Click "Edit Profile"
2. Change any values:
   - Username → `testuser2`
   - Age → `26`
   - Weight → `76`
   - Target Calories → `2200`
3. Click "Save Changes"

**Expected Results:**
- ✅ Success toast: "Profile updated successfully! ✨"
- ✅ Values update in UI
- ✅ Username updates in navbar
- ✅ Changes saved to database
- ✅ Edit mode exits

---

## 🔄 Integration Testing

### Complete User Journey

1. **Sign Up** → Creates account
2. **Dashboard** → View empty state
3. **Diet Planner** → Log 3 meals:
   - Breakfast: oatmeal
   - Lunch: chicken breast
   - Dinner: salmon
4. **Add Water** → 2000ml total
5. **Workout Planner** → Add 5 exercises
6. **Dashboard** → Check updated stats:
   - Calories consumed
   - Macros pie chart filled
   - Workouts count
   - Activity feed populated
7. **Profile** → Update weight
8. **Logout** → Clear session
9. **Login** → Data persists

---

## 🔍 API Testing

### Backend Endpoints

Use Postman or curl to test:

#### 1. Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "apitest",
  "email": "api@test.com",
  "password": "test123456",
  "age": 25,
  "gender": "male"
}
```

#### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "api@test.com",
  "password": "test123456"
}
```
**Copy the token from response**

#### 3. Get Profile (Protected)
```bash
GET http://localhost:5000/api/user/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. Get Nutrition Data
```bash
GET http://localhost:5000/api/diet/plan?query=apple
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 5. Get Exercises
```bash
GET http://localhost:5000/api/workouts/exercises?bodyPart=chest
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start
**Solution:**
- Check MongoDB is running
- Verify port 5000 is free
- Check .env file exists
- Run `npm install` in backend folder

### Issue: Frontend won't start
**Solution:**
- Check port 5173 is free
- Verify backend is running
- Run `npm install` in frontend folder
- Clear browser cache

### Issue: API calls fail
**Solution:**
- Verify backend URL: http://localhost:5000
- Check browser console for errors
- Verify token in localStorage
- Check CORS settings

### Issue: MongoDB connection fails
**Solution:**
- Start MongoDB: `mongod` or check Windows Services
- Verify connection string in .env
- Check MongoDB is accessible

### Issue: External APIs not working
**Solution:**
- API keys are pre-configured
- Check internet connection
- Verify API endpoints in console
- Check rate limits

---

## 📊 Database Verification

### Check Data in MongoDB

Using MongoDB Compass:
1. Connect to: `mongodb://localhost:27017`
2. Database: `health-fitness-planner`
3. Collections:
   - `users`
   - `dietlogs`
   - `workoutlogs`

Using mongosh:
```bash
mongosh
use health-fitness-planner
db.users.find().pretty()
db.dietlogs.find().pretty()
db.workoutlogs.find().pretty()
```

---

## ✅ Success Criteria

Your application is working correctly if:

- ✅ Users can register and login
- ✅ Dashboard shows real-time stats
- ✅ Diet planner fetches nutrition data
- ✅ Meals are logged and persisted
- ✅ Workout planner shows exercises
- ✅ Exercises are logged successfully
- ✅ Charts update with data
- ✅ Animations are smooth
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Data persists after logout/login
- ✅ All CRUD operations work
- ✅ External APIs respond correctly

---

## 🎯 Performance Checks

- Page load < 2 seconds
- API response < 1 second
- Smooth animations (60fps)
- No memory leaks
- Responsive on all devices
- Fast navigation between pages

---

## 📸 Expected Screenshots

**Login Page:**
- Gradient background (purple to pink)
- Animated login form
- Smooth transitions

**Dashboard:**
- 4 stat cards with icons
- Progress bars
- Pie chart for macros
- Activity feed

**Diet Planner:**
- Search bar with meal type selector
- Grid of nutrition cards
- Water intake tracker
- Today's meals list

**Workout Planner:**
- Exercise search and filters
- Grid of exercise cards with GIFs
- Today's workout list
- Stats overview

---

## 🚀 Ready for Demo!

After all tests pass, your application is ready to:
- Present as portfolio project
- Demo in interviews
- Deploy to production
- Share with others

**Happy Testing! 🎉**
