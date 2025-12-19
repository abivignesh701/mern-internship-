# Health & Fitness Planner - MERN Stack Application

A full-stack Health & Fitness Planner built with MongoDB, Express.js, React, and Node.js. Features include diet planning with Ninja API, workout management with RapidAPI, and smooth animations using Framer Motion.

## 🚀 Features

- **Authentication System**: JWT-based secure login/signup with password strength indicator
- **Dashboard**: Interactive overview with charts, progress tracking, and daily stats
- **Diet Planner**: 
  - Search nutritional data using Ninja API
  - Log meals and track macros
  - Water intake tracker
  - Calorie progress visualization
- **Workout Planner**:
  - Browse exercises from RapidAPI Exercise DB
  - Filter by body part and equipment
  - Track workouts and calories burned
  - Animated exercise cards with GIFs
- **Profile Management**: Update personal info, fitness goals, and preferences
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion animations throughout

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Redux Toolkit for state management
- Tailwind CSS for styling
- Framer Motion for animations
- React Hook Form with Zod validation
- Recharts for data visualization
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication with bcrypt
- Express Validator for input validation
- Axios for external API calls
- Morgan for logging

### External APIs
- Ninja API for nutrition data
- RapidAPI Exercise DB for workout exercises

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- NPM or Yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already created with your API keys)

4. Start MongoDB:
```bash
# Make sure MongoDB is running on mongodb://localhost:27017/
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

1. **Sign Up**: Create a new account with your details, fitness goals, and preferences
2. **Login**: Access your dashboard
3. **Dashboard**: View your progress, calories, workouts, and streak
4. **Diet Planner**: Search for foods, log meals, and track water intake
5. **Workout Planner**: Browse exercises, create workouts, and log activity
6. **Profile**: Update your personal information and goals

## 📁 Project Structure

```
health-and-fitness/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── DietLog.js
│   │   └── WorkoutLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── diet.js
│   │   └── workouts.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DietPlanner.tsx
│   │   │   ├── WorkoutPlanner.tsx
│   │   │   └── Profile.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── dietService.ts
│   │   │   ├── workoutService.ts
│   │   │   └── userService.ts
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── dietSlice.ts
│   │   │   │   └── workoutSlice.ts
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🔑 API Keys

The following API keys are already configured in the `.env` files:

- **Ninja API**: `e3drZJyUvjXdOc/O7JOErA==oZ8Jogaz4QpehFO6`
- **RapidAPI**: `bd2ae0769cmsh8cd6bbc46013124p1df51ejsn5e3754152055`

## 🌟 Key Features Implementation

### Animations
- Page transitions with Framer Motion
- Loading skeletons for API calls
- Hover effects on cards and buttons
- Progress bar animations
- Smooth micro-interactions

### Security
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

### Performance
- Lazy loading for routes
- Optimized re-renders with Redux
- Responsive images
- Debounced search inputs

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/progress` - Get progress stats

### Diet
- `GET /api/diet/plan` - Search nutrition data
- `POST /api/diet/log-meal` - Log a meal
- `GET /api/diet/today` - Get today's diet log
- `GET /api/diet/history` - Get diet history
- `PUT /api/diet/water-intake` - Update water intake

### Workouts
- `GET /api/workouts/exercises` - Get exercises
- `GET /api/workouts/exercises/search` - Search exercises
- `GET /api/workouts/bodyparts` - Get body parts list
- `POST /api/workouts/log` - Log workout
- `GET /api/workouts/today` - Get today's workout
- `GET /api/workouts/history` - Get workout history

## 🚀 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, or Render
- Set environment variables
- Configure MongoDB Atlas connection

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update API base URL in environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built as a comprehensive MERN stack demonstration project.

## 🙏 Acknowledgments

- Ninja API for nutrition data
- RapidAPI for exercise database
- Framer Motion for animations
- Tailwind CSS for styling
