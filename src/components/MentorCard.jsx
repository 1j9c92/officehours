import { Link } from 'react-router-dom'

const INITIALS_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
]

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length]
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function MentorCard({ mentor, profileName }) {
  const name = profileName || 'Mentor'
  const color = getColor(name)
  const initials = getInitials(name)

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {mentor.avatar_url ? (
            <img src={mentor.avatar_url} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className={`w-12 h-12 rounded-full ${color} font-bold text-sm flex items-center justify-center font-sans flex-shrink-0`}>
              {initials}
            </div>
          )}
          <div>
            <div className="font-bold text-text-primary font-sans">{name}</div>
            <div className="text-xs text-text-muted font-sans">
              {mentor.job_function}{mentor.industry ? ` · ${mentor.industry}` : ''}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-coral font-bold font-sans text-sm">${mentor.pricing_tier}</div>
          <div className="text-xs text-text-muted font-sans">/session</div>
        </div>
      </div>

      {mentor.bio && (
        <p className="text-sm text-text-secondary font-sans leading-relaxed flex-1 mb-4 line-clamp-3">
          {mentor.bio}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-light">
        <span className="text-xs text-text-muted font-sans">
          {mentor.years_experience} yrs experience
        </span>
        <Link
          to={`/mentors/${mentor.user_id}`}
          className="text-xs font-bold text-coral hover:underline font-sans"
        >
          View profile →
        </Link>
      </div>
    </div>
  )
}
