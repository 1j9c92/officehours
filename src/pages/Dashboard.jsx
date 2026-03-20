import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function MentorPendingDashboard({ mentorProfile }) {
  const navigate = useNavigate()
  const isRejected = mentorProfile?.approval_status === 'rejected'

  return (
    <div className="text-center py-16 px-6">
      <div className="text-5xl mb-5">{isRejected ? '❌' : '⏳'}</div>
      <h2 className="font-serif text-2xl font-bold mb-3">
        {isRejected ? 'Your application was not approved' : 'Your profile is under review'}
      </h2>
      {isRejected && mentorProfile?.rejection_reason && (
        <div className="max-w-sm mx-auto bg-red-50 border border-red-200 rounded-lg px-5 py-4 mb-5 text-left">
          <p className="text-xs uppercase tracking-wider text-red-500 font-sans mb-1">Reason</p>
          <p className="text-sm text-red-700 font-sans">{mentorProfile.rejection_reason}</p>
        </div>
      )}
      {!isRejected && (
        <p className="text-text-muted max-w-xs mx-auto font-sans text-sm leading-relaxed mb-6">
          We review all applications to ensure quality. You'll hear back within 24 hours.
        </p>
      )}

      {mentorProfile && (
        <div className="max-w-xs mx-auto border border-border-light rounded-xl p-5 bg-white text-left mb-6">
          <p className="text-xs uppercase tracking-widest text-text-muted font-sans mb-3">Your Profile</p>
          <div className="text-sm text-text-primary font-sans space-y-1">
            <div><span className="text-text-muted">Function:</span> {mentorProfile.job_function}</div>
            <div><span className="text-text-muted">Industry:</span> {mentorProfile.industry}</div>
            <div><span className="text-text-muted">Experience:</span> {mentorProfile.years_experience} years</div>
            <div><span className="text-text-muted">Rate:</span> <span className="text-coral font-bold">${mentorProfile.pricing_tier}/session</span></div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/onboarding/mentor')}
        className="bg-coral hover:bg-coral-dark text-white font-bold px-7 py-2.5 rounded-lg font-sans text-sm transition-colors"
      >
        {isRejected ? 'Update & Resubmit' : 'Edit Profile'}
      </button>
    </div>
  )
}

function MenteeDashboard() {
  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <h2 className="font-serif text-xl font-bold mb-2">Welcome 👋</h2>
      <p className="text-text-muted text-sm mb-8 font-sans">
        Complete your AI intake to get matched with the right mentor.
      </p>
      <div className="flex gap-4">
        <div className="flex-[2] bg-white border-2 border-coral rounded-xl p-6">
          <p className="text-xs uppercase tracking-wider text-coral font-sans font-semibold mb-2">Next Step</p>
          <h3 className="font-serif text-lg font-bold mb-2">Complete your AI intake</h3>
          <p className="text-text-muted text-sm font-sans mb-5 leading-relaxed">
            Answer a few questions so we can match you with the right mentor. Takes 3 minutes.
          </p>
          <button
            disabled
            className="bg-coral text-white font-bold px-5 py-2.5 rounded-lg font-sans text-sm opacity-50 cursor-not-allowed"
          >
            Start Intake → <span className="font-normal text-xs">(coming soon)</span>
          </button>
        </div>
        <div className="flex-1 bg-white border border-border-light rounded-xl p-6 opacity-50">
          <p className="text-xs uppercase tracking-wider text-text-muted font-sans mb-2">Locked</p>
          <h3 className="font-serif text-lg font-bold mb-2">Browse Mentors</h3>
          <p className="text-text-muted text-sm font-sans">Complete your intake first</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { profile, user } = useAuth()
  const [mentorProfile, setMentorProfile] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function load() {
      if (profile?.role === 'mentor') {
        const { data } = await supabase
          .from('mentor_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setMentorProfile(data)
      }
      setFetching(false)
    }
    if (profile) load()
  }, [profile, user?.id])

  if (!profile || fetching) return null

  if (profile.role === 'mentor') {
    const status = mentorProfile?.approval_status
    if (status === 'approved') {
      return (
        <div className="text-center py-16 font-sans text-text-muted">
          ✅ You're approved! Full mentor dashboard coming in Sub-project 2.
        </div>
      )
    }
    return <MentorPendingDashboard mentorProfile={mentorProfile} />
  }

  return <MenteeDashboard />
}
