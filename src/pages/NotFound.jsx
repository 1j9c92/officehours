import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      <div className="font-serif text-8xl font-bold text-border-mid mb-6">404</div>
      <h2 className="font-serif text-2xl font-bold text-text-primary mb-3">Page not found</h2>
      <p className="text-text-muted font-sans text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="bg-coral hover:bg-coral-dark text-white font-bold px-6 py-3 rounded-xl font-sans text-sm transition-colors">
          Go home
        </Link>
        <Link to="/browse" className="border border-border-mid hover:border-coral text-text-primary font-bold px-6 py-3 rounded-xl font-sans text-sm transition-colors">
          Browse mentors
        </Link>
      </div>
    </div>
  )
}
