import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-cream">
        <Link to="/" className="font-serif text-lg font-bold text-text-primary">
          OfficeHours
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm text-text-muted hover:text-text-primary"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary">
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold text-white bg-coral hover:bg-coral-dark px-4 py-2 rounded transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
