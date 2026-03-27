import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const SAMPLE_MENTORS = {
  'sample-1': { user_id: 'sample-1', job_function: 'Product Management', industry: 'Tech', years_experience: 8, pricing_tier: 100, bio: 'PM at a top-5 tech company. I spent 3 years at a startup before moving to a large org — so I understand both worlds. I help early-career PMs break in, ace interviews, and build the confidence to own their roadmap.\n\nSpecializing in: FAANG PM interviews, product sense frameworks, roadmap prioritization, stakeholder communication, and making the leap from IC to manager.', linkedin_url: null, _name: 'Sarah Chen', _initials: 'SC', _color: 'bg-blue-100 text-blue-700' },
  'sample-2': { user_id: 'sample-2', job_function: 'Engineering', industry: 'Fintech', years_experience: 12, pricing_tier: 125, bio: 'Staff Engineer at a Series C fintech processing $2B/year. Before that: 5 years at Amazon, 3 at early-stage startups. I know what interviewers at big tech are actually looking for — and I know how to spot the BS.\n\nI help engineers nail system design interviews, get promoted from mid to senior, and decide whether a startup or big co is the right next move.', linkedin_url: null, _name: 'Marcus Williams', _initials: 'MW', _color: 'bg-purple-100 text-purple-700' },
  'sample-3': { user_id: 'sample-3', job_function: 'Design', industry: 'Healthcare', years_experience: 5, pricing_tier: 75, bio: "UX Lead at a digital health company — my work is used by over 3 million patients daily. I made the switch from graphic design to UX 5 years ago and I know how intimidating that pivot feels.\n\nI specialize in portfolio reviews, helping career-changers position their work, and interview prep for product design roles at companies that actually care about the craft.", linkedin_url: null, _name: 'Priya Patel', _initials: 'PP', _color: 'bg-green-100 text-green-700' },
}

function BookingModal({ mentor, mentorName, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [goal, setGoal] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
          <div className="text-4xl mb-4">👋</div>
          <h3 className="font-serif text-xl font-bold mb-2">Sign in to book</h3>
          <p className="text-text-muted font-sans text-sm mb-6">Create a free account to book sessions with mentors.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-border-mid text-text-secondary font-sans text-sm py-2.5 rounded-lg">Cancel</button>
            <button onClick={() => navigate('/signup?role=mentee')} className="flex-1 bg-coral text-white font-bold font-sans text-sm py-2.5 rounded-lg">Sign up free</button>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="font-serif text-xl font-bold mb-2">Request sent!</h3>
          <p className="text-text-muted font-sans text-sm mb-6">
            {mentorName} will confirm availability and you'll receive a calendar invite with the session link.
          </p>
          <button onClick={onClose} className="w-full bg-coral text-white font-bold font-sans py-3 rounded-xl">Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold">Book with {mentorName}</h3>
            <p className="text-text-muted font-sans text-sm mt-0.5">${mentor.pricing_tier} · 30 min session</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5 font-sans">
              What do you want to cover? <span className="text-coral">*</span>
            </label>
            <textarea
              value={goal}
              onChange={e => setGoal(e.target.value)}
              rows={4}
              className="w-full border border-border-mid rounded-xl px-4 py-3 text-sm font-sans bg-white focus:outline-none focus:border-coral resize-none"
              placeholder="e.g. I have a PM interview at Stripe in 2 weeks and I want to work on my product sense answers…"
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm font-sans text-orange-800">
            <strong>Booking coming soon.</strong> We're adding payment and scheduling shortly. Submit your request now and we'll reach out to confirm your session.
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-border-mid text-text-secondary font-sans text-sm py-3 rounded-xl">
              Cancel
            </button>
            <button
              onClick={() => goal.trim() && setSubmitted(true)}
              disabled={!goal.trim()}
              className="flex-1 bg-coral hover:bg-coral-dark disabled:opacity-40 text-white font-bold font-sans text-sm py-3 rounded-xl transition-colors"
            >
              Send request →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MentorPublicProfile() {
  const { userId } = useParams()
  const [mentor, setMentor] = useState(null)
  const [mentorName, setMentorName] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function load() {
      // Check sample data first
      if (SAMPLE_MENTORS[userId]) {
        const s = SAMPLE_MENTORS[userId]
        setMentor(s)
        setMentorName(s._name)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('mentor_profiles')
        .select('*, profiles(full_name, avatar_url)')
        .eq('user_id', userId)
        .eq('approval_status', 'approved')
        .single()

      if (data) {
        setMentor(data)
        setMentorName(data.profiles?.full_name || 'Mentor')
      }
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading) return null

  if (!mentor) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-4xl mb-4">🤷</div>
        <h2 className="font-serif text-2xl font-bold mb-3">Mentor not found</h2>
        <p className="text-text-muted font-sans mb-6">This profile doesn't exist or isn't available yet.</p>
        <Link to="/browse" className="text-coral hover:underline font-sans text-sm font-semibold">← Back to Browse</Link>
      </div>
    )
  }

  const initials = mentor._initials || mentorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colorClass = mentor._color || 'bg-orange-100 text-orange-700'
  const bioLines = mentor.bio?.split('\n').filter(Boolean) || []

  return (
    <>
      {showModal && <BookingModal mentor={mentor} mentorName={mentorName} onClose={() => setShowModal(false)} />}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/browse" className="text-sm text-text-muted hover:text-coral font-sans flex items-center gap-1.5 mb-8 transition-colors">
          ← Back to Browse
        </Link>

        <div className="bg-white rounded-2xl border border-border-light p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className={`w-20 h-20 rounded-2xl ${colorClass} font-bold text-2xl flex items-center justify-center font-sans flex-shrink-0`}>
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-text-primary mb-1">{mentorName}</h1>
              <p className="text-text-secondary font-sans mb-1">
                {mentor.job_function}{mentor.industry ? ` · ${mentor.industry}` : ''}
              </p>
              <p className="text-text-muted font-sans text-sm mb-4">
                {mentor.years_experience} years of experience
              </p>

              {mentor.linkedin_url && (
                <a
                  href={mentor.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline font-sans"
                >
                  LinkedIn profile →
                </a>
              )}
            </div>
            <div className="sm:text-right flex-shrink-0">
              <div className="text-3xl font-bold text-coral font-sans">${mentor.pricing_tier}</div>
              <div className="text-sm text-text-muted font-sans mb-4">per 30-min session</div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-coral hover:bg-coral-dark text-white font-bold px-6 py-3 rounded-xl font-sans text-sm transition-colors w-full sm:w-auto"
              >
                Book a session
              </button>
            </div>
          </div>
        </div>

        {mentor.bio && (
          <div className="bg-white rounded-2xl border border-border-light p-8 mb-6">
            <h2 className="font-serif text-xl font-bold text-text-primary mb-4">About</h2>
            <div className="space-y-3">
              {bioLines.map((line, i) => (
                <p key={i} className="text-text-secondary font-sans text-base leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-border-light p-8 mb-6">
          <h2 className="font-serif text-xl font-bold text-text-primary mb-5">Session details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: 'Duration', value: '30 minutes' },
              { label: 'Format', value: 'Video call (link sent on booking)' },
              { label: 'Rate', value: `$${mentor.pricing_tier} flat` },
              { label: 'Cancellation', value: 'Free up to 24 hrs before' },
            ].map(item => (
              <div key={item.label}>
                <div className="text-xs uppercase tracking-widest text-text-muted font-sans mb-1">{item.label}</div>
                <div className="text-sm font-semibold text-text-primary font-sans">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
          <p className="font-serif text-lg font-bold text-text-primary mb-2">Ready to book?</p>
          <p className="text-text-secondary font-sans text-sm mb-5">
            Sessions are guaranteed. If you don't get value, we'll make it right.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-3 rounded-xl font-sans text-sm transition-colors"
          >
            Book a session with {mentorName.split(' ')[0]} →
          </button>
        </div>
      </div>
    </>
  )
}
