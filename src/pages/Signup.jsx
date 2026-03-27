import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const presetRole = searchParams.get('role')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(presetRole || 'mentee')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signUp({ email, password, fullName, role })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      // Supabase may require email confirmation — show success state
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="max-w-sm mx-auto px-6 py-16 text-center animate-fade-in">
        <div className="text-5xl mb-5">📬</div>
        <h2 className="font-serif text-2xl font-bold mb-3">Check your inbox</h2>
        <p className="text-text-muted text-sm font-sans leading-relaxed mb-6">
          We sent a confirmation link to <strong className="text-text-primary">{email}</strong>.
          Click it to activate your account, then{' '}
          <Link to="/login" className="text-coral hover:underline font-semibold">sign in here</Link>.
        </p>
        <p className="text-xs text-text-muted font-sans">
          No email? Check your spam folder or{' '}
          <button onClick={() => setSuccess(false)} className="text-coral hover:underline">try again</button>.
        </p>
      </div>
    )
  }

  const roleOptions = [
    { value: 'mentee', emoji: '🌱', label: 'Find a Mentor', sub: 'Get career guidance' },
    { value: 'mentor', emoji: '🤝', label: 'Be a Mentor', sub: 'Share your expertise' },
  ]

  return (
    <div className="max-w-sm mx-auto px-6 py-14 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-bold mb-2">Create your account</h2>
        <p className="text-text-muted text-sm font-sans">Free to join. No credit card required.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role toggle — only show if not pre-selected from URL */}
        {!presetRole && (
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2 font-sans">I want to…</label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`border-2 rounded-xl py-4 text-center transition-colors ${
                    role === opt.value ? 'border-coral bg-white' : 'border-border-mid bg-white hover:border-border-mid'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.emoji}</div>
                  <div className="text-sm font-bold text-text-primary font-sans">{opt.label}</div>
                  <div className="text-xs text-text-muted font-sans">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show role badge if pre-selected */}
        {presetRole && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <span className="text-lg">{presetRole === 'mentor' ? '🤝' : '🌱'}</span>
            <div>
              <p className="text-sm font-semibold text-text-primary font-sans">
                {presetRole === 'mentor' ? 'Joining as a Mentor' : 'Joining as a Mentee'}
              </p>
              <button type="button" onClick={() => navigate('/signup')} className="text-xs text-coral hover:underline font-sans">
                Change role
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Full Name</label>
          <input
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral transition-colors"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral transition-colors"
            placeholder="jane@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral transition-colors"
            placeholder="6+ characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Creating account…' : 'Create Account →'}
        </button>
      </form>

      <p className="text-center text-text-muted text-xs mt-5 font-sans leading-relaxed">
        By signing up you agree to our Terms and Privacy Policy.
      </p>
      <p className="text-center text-text-muted text-sm mt-3 font-sans">
        Already have an account?{' '}
        <Link to="/login" className="text-coral hover:underline font-semibold">Log in</Link>
      </p>
    </div>
  )
}
