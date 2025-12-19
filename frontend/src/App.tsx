import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DietPlanner from './pages/DietPlanner'
import WorkoutPlanner from './pages/WorkoutPlanner'
import Profile from './pages/Profile'
import DailyTracker from './pages/DailyTracker'

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
      />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/diet"
        element={
          <PrivateRoute>
            <Layout>
              <DietPlanner />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workout"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutPlanner />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tracker"
        element={
          <PrivateRoute>
            <Layout>
              <DailyTracker />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
