import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from './Footer'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const isLanding = pathname === '/'
  const navBg = scrolled || !isLanding
    ? 'bg-cream/95 backdrop-blur-sm shadow-sm border-b border-border-light'
    : 'bg-transparent'

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-bold text-text-primary hover:text-coral transition-colors">
            OfficeHours
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors">
              Browse Mentors
            </Link>
            <Link to="/how-it-works" className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors">
              How It Works
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/settings" className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors">
                  Settings
                </Link>
                <button onClick={handleSignOut} className="text-sm font-sans font-semibold text-coral hover:text-coral-dark transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-sans font-semibold text-text-primary hover:text-coral transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="bg-coral hover:bg-coral-dark text-white text-sm font-bold px-4 py-2 rounded-lg font-sans transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-text-primary transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-cream border-t border-border-light px-6 py-4 space-y-1 font-sans animate-fade-in">
            <Link to="/browse" className="block text-sm text-text-secondary hover:text-text-primary py-2.5 border-b border-border-light">Browse Mentors</Link>
            <Link to="/how-it-works" className="block text-sm text-text-secondary hover:text-text-primary py-2.5 border-b border-border-light">How It Works</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-sm text-text-secondary py-2.5 border-b border-border-light">Dashboard</Link>
                <Link to="/settings" className="block text-sm text-text-secondary py-2.5 border-b border-border-light">Settings</Link>
                <button onClick={handleSignOut} className="block text-sm text-coral font-semibold py-2.5 w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm font-semibold text-text-primary py-2.5 border-b border-border-light">Log In</Link>
                <div className="pt-2">
                  <Link to="/signup" className="block bg-coral text-white text-sm font-bold px-4 py-2.5 rounded-lg text-center">
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {children}
      </main>

      <Footer />
    </div>
  )
}
