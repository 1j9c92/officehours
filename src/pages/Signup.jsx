import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(searchParams.get('role') || 'mentee')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signUp({ email, password, fullName, role })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate(role === 'mentor' ? '/onboarding/mentor' : '/onboarding/mentee')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-12">
      <h2 className="font-serif text-3xl font-bold text-center mb-2">Create your account</h2>
      <p className="text-text-muted text-sm text-center mb-8 font-sans">Join in under a minute</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Full Name</label>
          <input
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
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
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
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
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2 font-sans">I want to…</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'mentee', emoji: '🌱', label: 'Find a Mentor', sub: 'Get guidance' },
              { value: 'mentor', emoji: '🤝', label: 'Be a Mentor', sub: 'Share your path' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`border-2 rounded-xl py-4 text-center transition-colors ${
                  role === opt.value
                    ? 'border-coral bg-white'
                    : 'border-border-mid bg-white'
                }`}
              >
                <div className="text-xl mb-1">{opt.emoji}</div>
                <div className="text-sm font-bold text-text-primary font-sans">{opt.label}</div>
                <div className="text-xs text-text-muted font-sans">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-text-muted text-sm mt-5 font-sans">
        Already have an account?{' '}
        <Link to="/login" className="text-coral hover:underline">Log in</Link>
      </p>
    </div>
  )
}
