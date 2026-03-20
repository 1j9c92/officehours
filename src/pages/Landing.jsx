import { useNavigate } from 'react-router-dom'

const STATS = [
  { value: '30 min', label: 'Focused session' },
  { value: '$50–125', label: 'Per session' },
  { value: 'AI', label: 'Smart matching' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-14">
        <p className="text-xs tracking-widest uppercase text-coral font-sans font-semibold mb-3">
          Career mentorship · AI-powered matching
        </p>
        <h1 className="font-serif text-4xl font-bold text-text-primary leading-tight mb-5 max-w-xl mx-auto">
          Talk to someone who has<br />walked your exact path
        </h1>
        <p className="text-text-secondary font-sans text-base max-w-md mx-auto mb-8 leading-relaxed">
          30-minute video sessions with vetted professionals. AI matches you to the right mentor for your career stage and goals.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate('/signup?role=mentee')}
            className="bg-coral hover:bg-coral-dark text-white font-bold px-9 py-3 rounded-lg font-sans transition-colors"
          >
            Find My Mentor
          </button>
          <button
            onClick={() => navigate('/signup?role=mentor')}
            className="border-2 border-border-mid text-text-primary hover:border-text-secondary font-semibold px-7 py-3 rounded-lg font-sans transition-colors"
          >
            Become a Mentor
          </button>
        </div>
      </section>

      {/* Stat bar */}
      <section className="flex max-w-lg mx-auto gap-4 px-6 pb-16">
        {STATS.map(({ value, label }) => (
          <div
            key={value}
            className="flex-1 text-center py-5 bg-white rounded-lg shadow-sm"
          >
            <div className="font-sans text-2xl font-bold text-text-primary">{value}</div>
            <div className="font-sans text-xs text-text-muted mt-1">{label}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
