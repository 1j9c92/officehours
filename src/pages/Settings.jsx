import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Settings() {
  const { profile, user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-12 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold text-text-primary mb-1">Settings</h1>
      <p className="text-text-muted font-sans text-sm mb-10">Manage your account information.</p>

      {/* Account info card */}
      <div className="bg-white border border-border-light rounded-2xl p-7 mb-6">
        <h2 className="font-sans font-bold text-text-primary mb-5 text-sm uppercase tracking-widest text-text-muted">Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 font-sans">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-5 font-sans">
            ✓ Changes saved.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Full Name</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Email</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full border border-border-light rounded-lg px-3 py-2.5 text-sm font-sans bg-cream text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted font-sans mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">Role</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-cream border border-border-light rounded-lg">
              <span className="text-sm font-sans text-text-secondary capitalize">{profile?.role || '—'}</span>
              {profile?.is_admin && (
                <span className="text-xs font-bold text-coral bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-sans">Admin</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg font-sans text-sm transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Profile links */}
      {profile?.role === 'mentor' && (
        <div className="bg-white border border-border-light rounded-2xl p-7 mb-6">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-text-muted mb-4">Mentor profile</h2>
          <p className="text-sm text-text-secondary font-sans mb-4">
            Edit your mentor profile, update your bio, or adjust your LinkedIn link. Edits will re-trigger the review process.
          </p>
          <Link
            to="/onboarding/mentor"
            className="inline-block text-sm font-bold text-coral hover:underline font-sans"
          >
            Edit mentor profile →
          </Link>
        </div>
      )}

      {profile?.role === 'mentee' && (
        <div className="bg-white border border-border-light rounded-2xl p-7 mb-6">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-text-muted mb-4">Mentee profile</h2>
          <p className="text-sm text-text-secondary font-sans mb-4">
            Update your career stage and current role so mentors can prepare for your sessions.
          </p>
          <Link
            to="/onboarding/mentee"
            className="inline-block text-sm font-bold text-coral hover:underline font-sans"
          >
            Edit mentee profile →
          </Link>
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white border border-border-light rounded-2xl p-7">
        <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-red-400 mb-4">Account</h2>
        <p className="text-sm text-text-muted font-sans mb-3">
          Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
        </p>
        <p className="text-xs text-text-muted font-sans">
          To delete your account, contact{' '}
          <a href="mailto:support@officehours.app" className="text-coral hover:underline">support@officehours.app</a>.
        </p>
      </div>
    </div>
  )
}
