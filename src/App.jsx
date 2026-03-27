import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGate from './components/RoleGate'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MentorProfile from './pages/MentorProfile'
import MenteeProfile from './pages/MenteeProfile'
import AdminApproval from './pages/AdminApproval'
import BrowseMentors from './pages/BrowseMentors'
import MentorPublicProfile from './pages/MentorPublicProfile'
import HowItWorks from './pages/HowItWorks'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse" element={<BrowseMentors />} />
        <Route path="/mentors/:userId" element={<MentorPublicProfile />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route path="/onboarding/mentor" element={
          <ProtectedRoute>
            <RoleGate role="mentor">
              <MentorProfile />
            </RoleGate>
          </ProtectedRoute>
        } />

        <Route path="/onboarding/mentee" element={
          <ProtectedRoute>
            <RoleGate role="mentee">
              <MenteeProfile />
            </RoleGate>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <RoleGate adminOnly>
              <AdminApproval />
            </RoleGate>
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
