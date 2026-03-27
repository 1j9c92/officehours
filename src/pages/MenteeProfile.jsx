import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const CAREER_STAGES = [
  { value: 'student', emoji: '🎓', label: 'Student' },
  { value: 'recent_grad', emoji: '📄', label: 'Recent Grad' },
  { value: 'entry_level', emoji: '💼', label: 'Entry-level (0–2 yrs)' },
  { value: 'career_pivot', emoji: '🔄', label: 'Career Pivot' },
  { value: 'other', emoji: '✳️', label: 'Other' },
]

export default function MenteeProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [schoolOrRole, setSchoolOrRole] = useState('')
  const [careerStage, setCareerStage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!careerStage) { setError('Please select your career stage'); return }
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('mentee_profiles').upsert({
      user_id: user.id,
      school_or_role: schoolOrRole || null,
      career_stage: careerStage,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h2 className="font-serif text-2xl font-bold mb-2">A bit about you</h2>
      <p className="text-text-muted text-sm mb-8 font-sans">
        This helps us match you with the right mentor.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1 font-sans">
            Current Role or School
          </label>
          <input
            value={schoolOrRole}
            onChange={e => setSchoolOrRole(e.target.value)}
            className="w-full border border-border-mid rounded-lg px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral"
            placeholder="e.g. Junior Analyst at Acme, or NYU Stern MBA"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3 font-sans">
            Career Stage <span className="text-coral">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CAREER_STAGES.map(stage => (
              <button
                key={stage.value}
                type="button"
                onClick={() => setCareerStage(stage.value)}
                className={`border-2 rounded-lg px-4 py-3 text-left transition-colors font-sans ${
                  careerStage === stage.value
                    ? 'border-coral bg-white'
                    : 'border-border-mid bg-white'
                }`}
              >
                <span className="mr-2">{stage.emoji}</span>
                <span className="text-sm font-semibold text-text-primary">{stage.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral hover:bg-coral-dark disabled:opacity-50 text-white font-bold py-3 rounded-lg font-sans transition-colors"
        >
          {loading ? 'Saving…' : 'Continue →'}
        </button>
      </form>
    </div>
  )
}
