import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getPricingTier } from '../lib/pricing'

const JOB_FUNCTIONS = [
  'Product Management', 'Engineering', 'Design', 'Data Science',
  'Marketing', 'Finance', 'Operations', 'Sales', 'Other',
]
const INDUSTRIES = [
  'Tech', 'Fintech', 'Healthcare', 'Media', 'Consulting',
  'E-commerce', 'Education', 'Other',
]

export default function MentorProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    linkedin_url: '',
    job_function: '',
    industry: '',
    years_experience: '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('mentor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setForm({
          linkedin_url: data.linkedin_url || '',
          job_function: data.job_function || '',
          industry: data.industry || '',
          years_experience: data.years_experience?.toString() || '',
          bio: data.bio || '',
        })
      }
      setFetching(false)
    }
    loadProfile()
  }, [user.id])

  const previewTier = getPricingTier(
    form.years_experience ? parseInt(form.years_experience) : null
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('mentor_profiles').upsert({
      user_id: user.id,
      linkedin_url: form.linkedin_url,
      job_function: form.job_function,
      industry: form.industry,
      years_experience: form.years_experience ? parseInt(form.years_experience) : null,
      bio: form.bio || null,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  if (fetching) return null

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h2 className="font-serif text-2xl font-bold mb-2">Tell us about yourself</h2>
      <p className="text-text-muted text-sm mb-8 font-sans">
        This is what mentees see when browsing. You can update it anytime.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            LinkedIn Profile URL <span className="text-coral">*</span>
          </label>
          <input
            required
            type="url"
            value={form.linkedin_url}
            onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
              Function <span className="text-coral">*</span>
            </label>
            <select
              required
              value={form.job_function}
              onChange={e => setForm(f => ({ ...f, job_function: e.target.value }))}
              className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            >
              <option value="">Select…</option>
              {JOB_FUNCTIONS.map(fn => <option key={fn}>{fn}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
              Industry <span className="text-coral">*</span>
            </label>
            <select
              required
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            >
              <option value="">Select…</option>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            Years of Experience <span className="text-coral">*</span>
          </label>
          <input
            required
            type="number"
            min="0"
            max="50"
            value={form.years_experience}
            onChange={e => setForm(f => ({ ...f, years_experience: e.target.value }))}
            className="w-28 border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="e.g. 8"
          />
          {previewTier && (
            <div className="mt-2 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded px-3 py-2">
              <span className="text-sm font-bold text-coral font-sans">${previewTier} / session</span>
              <span className="text-xs text-text-muted font-sans">auto-assigned by experience</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            Short Bio <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral resize-none"
            placeholder="Tell mentees what you can help with…"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Saving…' : 'Submit for Review'}
        </button>
        <p className="text-center text-text-muted text-xs font-sans">
          Your profile will be reviewed within 24 hours before going live
        </p>
      </form>
    </div>
  )
}
