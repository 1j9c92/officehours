import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminApproval() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectionInputs, setRejectionInputs] = useState({})
  const [actionLoading, setActionLoading] = useState({})

  async function loadPendingMentors() {
    const { data } = await supabase
      .from('mentor_profiles')
      .select('*, profiles(full_name, email)')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: true })
    setMentors(data || [])
    setLoading(false)
  }

  useEffect(() => { loadPendingMentors() }, [])

  async function approve(userId) {
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    await supabase
      .from('mentor_profiles')
      .update({ approval_status: 'approved', rejection_reason: null })
      .eq('user_id', userId)
    setMentors(prev => prev.filter(m => m.user_id !== userId))
    setActionLoading(prev => ({ ...prev, [userId]: false }))
  }

  async function reject(userId) {
    const reason = rejectionInputs[userId] || null
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    await supabase
      .from('mentor_profiles')
      .update({ approval_status: 'rejected', rejection_reason: reason })
      .eq('user_id', userId)
    setMentors(prev => prev.filter(m => m.user_id !== userId))
    setActionLoading(prev => ({ ...prev, [userId]: false }))
  }

  if (loading) return null

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-serif text-xl font-bold">Pending Mentor Applications</h2>
        <span className="text-xs font-bold text-coral bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-sans">
          {mentors.length}
        </span>
      </div>

      {mentors.length === 0 && (
        <p className="text-text-muted font-sans text-sm">No pending applications.</p>
      )}

      <div className="space-y-4">
        {mentors.map(mentor => (
          <div key={mentor.user_id} className="bg-white border border-border-light rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-bold text-text-primary font-sans">
                  {mentor.profiles?.full_name}
                </div>
                <div className="text-sm text-text-muted font-sans mt-0.5">
                  {mentor.job_function} · {mentor.industry} · {mentor.years_experience} yrs ·{' '}
                  <span className="text-coral font-semibold">${mentor.pricing_tier}/session</span>
                </div>
                {mentor.linkedin_url && (
                  <a
                    href={mentor.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-sans mt-1 inline-block"
                  >
                    LinkedIn →
                  </a>
                )}
                {mentor.bio && (
                  <p className="text-sm text-text-secondary font-sans mt-2 max-w-sm">{mentor.bio}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => approve(mentor.user_id)}
                  disabled={actionLoading[mentor.user_id]}
                  className="bg-success hover:opacity-90 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg font-sans"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(mentor.user_id)}
                  disabled={actionLoading[mentor.user_id]}
                  className="border border-border-mid hover:border-text-muted text-text-muted text-sm px-4 py-2 rounded-lg font-sans"
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="mt-3">
              <input
                value={rejectionInputs[mentor.user_id] || ''}
                onChange={e => setRejectionInputs(prev => ({
                  ...prev,
                  [mentor.user_id]: e.target.value,
                }))}
                placeholder="Rejection reason (optional — shown to mentor)"
                className="w-full text-sm border border-border-light rounded px-3 py-2 font-sans text-text-secondary focus:outline-none focus:border-border-mid bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
