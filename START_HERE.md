# 🏋️‍♂️ Health & Fitness Planner - Project Index

## 📚 Documentation Files

| File | Description | When to Use |
|------|-------------|-------------|
| [README.md](README.md) | Main project documentation | First read for project overview |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Quick start instructions | Setting up for the first time |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Complete testing checklist | Testing all features |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Detailed feature breakdown | Understanding what's included |
| [START_HERE.md](START_HERE.md) | This file - Navigation guide | Finding your way around |

## 🚀 Quick Start Scripts

### Windows Batch Files
- `install-dependencies.bat` - Install all npm packages (run once)
- `start-backend.bat` - Start the backend server
- `start-frontend.bat` - Start the frontend dev server

### Manual Commands
```bash
# Install dependencies
cd backend && npm install
cd frontend && npm install

# Start servers (2 terminals)
cd backend && npm run dev
cd frontend && npm run dev
```

## 📁 Project Structure

```
health-and-fitness/
│
├── 📄 Documentation
│   ├── README.md              ← Main docs
│   ├── SETUP_GUIDE.md         ← Installation guide
│   ├── TESTING_GUIDE.md       ← Testing instructions
│   ├── PROJECT_SUMMARY.md     ← Feature list
│   └── START_HERE.md          ← This file
│
├── 🔧 Quick Start Scripts
│   ├── install-dependencies.bat
│   ├── start-backend.bat
│   └── start-frontend.bat
│
├── 🖥️ backend/                ← Node.js + Express API
│   ├── config/
│   │   └── database.js        ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js            ← JWT authentication
│   ├── models/
│   │   ├── User.js            ← User schema
│   │   ├── DietLog.js         ← Meal tracking
│   │   └── WorkoutLog.js      ← Exercise tracking
│   ├── routes/
│   │   ├── auth.js            ← /api/auth/*
│   │   ├── user.js            ← /api/user/*
│   │   ├── diet.js            ← /api/diet/*
│   │   └── workouts.js        ← /api/workouts/*
│   ├── utils/
│   │   └── generateToken.js   ← JWT helper
│   ├── .env                   ← Environment variables ⚠️
│   ├── .gitignore
│   ├── package.json
│   └── server.js              ← Entry point
│
└── 💻 frontend/               ← React + Vite + TypeScript
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx         ← Main layout + navbar
    │   │   └── PrivateRoute.tsx   ← Route protection
    │   ├── pages/
    │   │   ├── Login.tsx          ← /login
    │   │   ├── Signup.tsx         ← /signup
    │   │   ├── Dashboard.tsx      ← /dashboard
    │   │   ├── DietPlanner.tsx    ← /diet
    │   │   ├── WorkoutPlanner.tsx ← /workout
    │   │   └── Profile.tsx        ← /profile
    │   ├── services/
    │   │   ├── api.ts             ← Axios config
    │   │   ├── authService.ts     ← Auth API calls
    │   │   ├── dietService.ts     ← Diet API calls
    │   │   ├── workoutService.ts  ← Workout API calls
    │   │   └── userService.ts     ← User API calls
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.ts   ← Auth state
    │   │   │   ├── dietSlice.ts   ← Diet state
    │   │   │   └── workoutSlice.ts← Workout state
    │   │   └── index.ts           ← Redux store
    │   ├── App.tsx                ← Main component + routing
    │   ├── main.tsx               ← Entry point
    │   ├── index.css              ← Global styles
    │   └── vite-env.d.ts          ← TypeScript env types
    ├── .env                       ← Environment variables ⚠️
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js         ← Tailwind settings
    ├── tsconfig.json              ← TypeScript config
    └── vite.config.ts             ← Vite config
```

## 🎯 Common Tasks

### First Time Setup
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Run `install-dependencies.bat`
3. Start MongoDB
4. Run `start-backend.bat`
5. Run `start-frontend.bat`
6. Visit http://localhost:5173

### Daily Development
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### Testing Features
1. Follow [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Create test account
3. Test each feature section

### Making Changes

#### Add a new page:
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/Layout.tsx`

#### Add new API endpoint:
1. Add route in `backend/routes/`
2. Create controller function
3. Add to `backend/server.js`
4. Create service in `frontend/src/services/`

#### Modify styles:
1. Global styles: `frontend/src/index.css`
2. Tailwind config: `frontend/tailwind.config.js`
3. Component styles: inline with Tailwind classes

## 🔑 Important Files

### Configuration Files

| File | Purpose | Don't Commit? |
|------|---------|---------------|
| `backend/.env` | Backend environment variables | ⚠️ YES (.gitignore) |
| `frontend/.env` | Frontend environment variables | ⚠️ YES (.gitignore) |
| `backend/server.js` | Backend entry point | No |
| `frontend/src/main.tsx` | Frontend entry point | No |
| `tailwind.config.js` | Tailwind CSS config | No |
| `tsconfig.json` | TypeScript config | No |

### API Keys (Pre-configured)

Already set in `.env` files:
- **Ninja API**: Nutrition data
- **RapidAPI**: Exercise database
- **MongoDB**: Local connection
- **JWT**: Secret key

## 📚 Learning Path

### For Beginners
1. Start with [README.md](README.md) - Understand the project
2. Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) - Get it running
3. Read [TESTING_GUIDE.md](TESTING_GUIDE.md) - Test features
4. Explore code - Start with simple components

### For Developers
1. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Architecture
2. Explore `backend/routes/` - API endpoints
3. Study `frontend/src/pages/` - UI components
4. Modify and extend features

## 🐛 Troubleshooting

### Quick Fixes

**Backend won't start?**
→ Check MongoDB is running
→ Verify `.env` file exists
→ Run `npm install` in backend/

**Frontend won't start?**
→ Check backend is running
→ Run `npm install` in frontend/
→ Clear browser cache

**API not working?**
→ Check console for errors
→ Verify API keys in `.env`
→ Check internet connection

**Database issues?**
→ Start MongoDB service
→ Check connection string
→ Use MongoDB Compass to verify

### Get Help
1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md) troubleshooting section
2. Review console errors
3. Check browser DevTools Network tab
4. Verify environment variables

## 🎨 Customization Guide

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { ... }, // Change these
    }
  }
}
```

### Modify Animations
Edit components with Framer Motion:
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  // Customize animations here
/>
```

### Add Features
1. Backend: Add route → Create controller → Update model
2. Frontend: Create component → Add service → Update state
3. Connect: Call API from component → Update UI

## 📊 Tech Stack Reference

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Validation**: Express Validator
- **HTTP Client**: Axios

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### External APIs
- **Nutrition**: Ninja API
- **Exercises**: RapidAPI Exercise DB

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
# Push to GitHub
# Connect to Render/Railway
# Set environment variables
```

### Database (MongoDB Atlas)
- Create cluster
- Get connection string
- Update `.env`

## 📖 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: YOUR_DEPLOYED_URL/api
```

### Endpoints

**Authentication**
- POST `/auth/register` - Sign up
- POST `/auth/login` - Sign in
- POST `/auth/refresh-token` - Refresh JWT

**User**
- GET `/user/profile` - Get profile
- PUT `/user/profile` - Update profile
- GET `/user/progress` - Get stats

**Diet**
- GET `/diet/plan?query=food` - Search nutrition
- POST `/diet/log-meal` - Log meal
- GET `/diet/today` - Today's log
- GET `/diet/history` - Past logs
- PUT `/diet/water-intake` - Add water

**Workouts**
- GET `/workouts/exercises` - Browse exercises
- GET `/workouts/exercises/search?name=` - Search
- GET `/workouts/bodyparts` - Get body parts
- POST `/workouts/log` - Log workout
- GET `/workouts/today` - Today's workout
- GET `/workouts/history` - Past workouts

## ✅ Checklist for Demo

Before showcasing:
- [ ] MongoDB running
- [ ] Backend server started
- [ ] Frontend server started
- [ ] Test account created
- [ ] Sample data added
- [ ] All features tested
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Smooth animations

## 🎓 What You'll Learn

By studying this project:
- Full-stack MERN development
- JWT authentication
- Redux state management
- TypeScript with React
- RESTful API design
- MongoDB schemas
- External API integration
- Framer Motion animations
- Tailwind CSS
- Form validation
- Protected routes
- Responsive design

## 📞 Support

Need help?
1. Check documentation files
2. Review code comments
3. Test with [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. Explore example code

## 🎉 You're Ready!

Start here:
1. ✅ Read this file (done!)
2. ✅ Run `install-dependencies.bat`
3. ✅ Start servers
4. ✅ Visit http://localhost:5173
5. ✅ Create account and explore

**Happy Coding! 💪🚀**
