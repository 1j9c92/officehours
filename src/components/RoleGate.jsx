import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Renders children only if the user's profile matches the required role or is admin.
 * Props:
 *   role: 'mentor' | 'mentee' — required profile role
 *   adminOnly: boolean — if true, requires is_admin = true regardless of role
 */
export default function RoleGate({ children, role, adminOnly = false }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile) return <Navigate to="/login" replace />
  if (adminOnly && !profile.is_admin) return <Navigate to="/dashboard" replace />
  if (role && profile.role !== role) return <Navigate to="/dashboard" replace />
  return children
}
