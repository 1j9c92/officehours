import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('reveal')
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('in-view'), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

const FOR_MENTEES = [
  { icon: '🎯', title: 'Set your intention', body: 'Know what you want to get out of the session before you book. The more specific you are, the more useful the advice.' },
  { icon: '🔍', title: 'Find the right mentor', body: 'Browse by role, industry, and experience level. Read bios and select someone whose path resembles where you want to go.' },
  { icon: '📋', title: 'Complete your intake', body: 'Answer a short set of questions about your career stage and goals. This helps mentors prepare and helps us match you better.' },
  { icon: '📅', title: 'Book your session', body: 'Pick a time that works, pay the flat session fee, and receive a calendar invite with a video call link.' },
  { icon: '💬', title: 'Show up ready', body: 'Come with 2–3 specific questions. The best sessions have a clear agenda. Your mentor will give you honest, useful answers.' },
  { icon: '🚀', title: 'Apply what you learned', body: 'Take notes. Share them back with your mentor if you want feedback. Then act on what you learned. That is the whole point.' },
]

const FOR_MENTORS = [
  { icon: '📝', title: 'Apply to mentor', body: 'Fill out your profile with your LinkedIn, job function, industry, and years of experience. The whole thing takes 5 minutes.' },
  { icon: '⏳', title: 'Get reviewed', body: 'Our team reviews every application within 24 hours to verify your experience and ensure fit with what mentees are looking for.' },
  { icon: '💰', title: 'Go live', body: 'Once approved, your profile is published and you can start accepting bookings. Your rate is automatically set based on your experience.' },
  { icon: '📆', title: 'Accept bookings', body: 'You control your availability. When a mentee books, you get a notification and a calendar invite. Sessions are 30 minutes.' },
  { icon: '✅', title: 'Run the session', body: "Show up, be honest, and give the advice you wish you'd had. That's it." },
  { icon: '💸', title: 'Get paid', body: 'Payment is released after the session completes. No invoicing, no chasing. It just lands in your account.' },
]

const PRICING = [
  { label: '0–2 years', rate: '$50', desc: 'Early career perspective — often the most relatable for students and recent grads.' },
  { label: '3–4 years', rate: '$75', desc: 'Solid industry experience with a clear memory of the early-career struggle.' },
  { label: '5–9 years', rate: '$100', desc: 'Senior perspective with the range to help across multiple transition types.' },
  { label: '10+ years', rate: '$125', desc: 'Deep expertise, leadership context, and pattern recognition built over a decade+.' },
]

export default function HowItWorks() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-border-light py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">How it works</p>
          <h1 className="font-serif text-5xl font-bold text-text-primary mb-5">Simple, focused, honest.</h1>
          <p className="text-text-secondary font-sans text-lg leading-relaxed">
            OfficeHours isn't a platform for vague networking. It's for people who want real answers from real practitioners — and are willing to pay a fair price for the time it takes.
          </p>
        </div>
      </section>

      {/* For Mentees */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <Reveal className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">🌱</span>
            <h2 className="font-serif text-3xl font-bold text-text-primary">For mentees</h2>
          </div>
          <p className="text-text-muted font-sans text-base">How to get the most out of an OfficeHours session.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {FOR_MENTEES.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <div className="bg-white border border-border-light rounded-2xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{step.icon}</span>
                  <div>
                    <h3 className="font-sans font-bold text-text-primary mb-1">{step.title}</h3>
                    <p className="text-sm text-text-secondary font-sans leading-relaxed">{step.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8" delay={480}>
          <Link to="/signup?role=mentee" className="inline-block bg-coral hover:bg-coral-dark text-white font-bold px-7 py-3 rounded-xl font-sans text-sm transition-colors">
            Find a mentor →
          </Link>
        </Reveal>
      </section>

      {/* For Mentors */}
      <section className="bg-white border-y border-border-light py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">🤝</span>
              <h2 className="font-serif text-3xl font-bold text-text-primary">For mentors</h2>
            </div>
            <p className="text-text-muted font-sans text-base">What it looks like from the other side.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {FOR_MENTORS.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="bg-cream border border-border-light rounded-2xl p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{step.icon}</span>
                    <div>
                      <h3 className="font-sans font-bold text-text-primary mb-1">{step.title}</h3>
                      <p className="text-sm text-text-secondary font-sans leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8" delay={480}>
            <Link to="/signup?role=mentor" className="inline-block bg-text-primary hover:opacity-80 text-cream font-bold px-7 py-3 rounded-xl font-sans text-sm transition-opacity">
              Apply to mentor →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">Pricing</p>
          <h2 className="font-serif text-4xl font-bold text-text-primary mb-3">Simple, flat-rate pricing</h2>
          <p className="text-text-muted font-sans">Rates are set automatically based on mentor experience. No negotiation, no surprises.</p>
        </Reveal>
        <div className="space-y-4">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.label} delay={i * 80}>
              <div className="bg-white border border-border-light rounded-2xl px-7 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="font-bold text-text-primary font-sans mb-1">{tier.label} experience</div>
                  <p className="text-sm text-text-muted font-sans">{tier.desc}</p>
                </div>
                <div className="text-3xl font-bold text-coral font-sans flex-shrink-0">{tier.rate}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
            <p className="text-sm font-sans text-orange-800 leading-relaxed">
              <strong>Our guarantee:</strong> If you don't get value from a session, contact us within 48 hours for a full refund or credit. No questions asked.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-border-light py-20 px-6 text-center">
        <Reveal>
          <h2 className="font-serif text-4xl font-bold text-text-primary mb-4">Ready to start?</h2>
          <p className="text-text-muted font-sans mb-8 max-w-sm mx-auto">Browse available mentors or create your account to get matched.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/browse" className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-4 rounded-xl font-sans transition-colors">
              Browse mentors
            </Link>
            <Link to="/signup" className="bg-white border border-border-mid hover:border-coral text-text-primary font-bold px-8 py-4 rounded-xl font-sans transition-colors">
              Create account
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
