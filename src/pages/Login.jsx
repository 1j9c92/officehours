import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resent, setResent] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setNeedsConfirmation(false)
    setLoading(true)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      if (error.message?.toLowerCase().includes('confirm') || error.message?.toLowerCase().includes('not confirmed')) {
        setNeedsConfirmation(true)
      } else {
        setError(error.message)
      }
    } else {
      navigate('/dashboard')
    }
  }

  async function resendConfirmation() {
    await supabase.auth.resend({ type: 'signup', email })
    setResent(true)
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email address above, then click Forgot password.')
      return
    }
    setResetLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setResetLoading(false)
    setResetSent(true)
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-6 py-12 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-text-muted text-sm font-sans">Sign in to your OfficeHours account</p>
        </div>

        {needsConfirmation && (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm px-4 py-4 rounded-lg mb-5 font-sans">
            <p className="font-semibold mb-1">Check your email</p>
            <p className="text-orange-700 mb-3">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back here to sign in.
            </p>
            {resent ? (
              <p className="text-green-700 font-semibold text-xs">✓ Confirmation email resent.</p>
            ) : (
              <button onClick={resendConfirmation} className="text-xs font-semibold text-coral hover:underline">
                Resend confirmation email →
              </button>
            )}
          </div>
        )}

        {resetSent && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-4 rounded-lg mb-5 font-sans">
            ✓ Password reset email sent to <strong>{email}</strong>. Check your inbox.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-text-primary font-sans">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs text-coral hover:underline font-sans disabled:opacity-50"
              >
                {resetLoading ? 'Sending…' : 'Forgot password?'}
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6 font-sans">
          No account yet?{' '}
          <Link to="/signup" className="text-coral hover:underline font-semibold">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
