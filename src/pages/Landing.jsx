import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView, useCountUp } from '../hooks/useInView'

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const base = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal'
    el.classList.add(base)
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
  }, [delay, direction])
  return <div ref={ref} className={className}>{children}</div>
}

function StatTile({ value, suffix, label, active }) {
  const count = useCountUp(value, active)
  return (
    <div className="text-center">
      <div className="font-serif text-4xl md:text-5xl font-bold text-text-primary">
        {count}{suffix}
      </div>
      <div className="text-sm text-text-muted font-sans mt-2">{label}</div>
    </div>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border-light">
      <button
        className="w-full text-left py-5 flex justify-between items-start gap-4 font-sans"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-semibold text-text-primary text-sm leading-relaxed">{q}</span>
        <span className={`text-coral flex-shrink-0 text-xl font-light transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="pb-5 text-sm text-text-secondary font-sans leading-relaxed animate-fade-in">{a}</div>
      )}
    </div>
  )
}

const STEPS = [
  { num: '01', icon: '🔍', title: 'Browse mentors', body: 'Filter by role, industry, and experience. Every mentor is vetted before going live.' },
  { num: '02', icon: '📋', title: 'Complete your intake', body: 'Answer a few questions about your goals so we can surface the right mentors for you.' },
  { num: '03', icon: '📅', title: 'Book a 30-min session', body: 'Pay a flat rate, pick a time, show up with questions. No subscription, no commitment.' },
]

const MENTOR_PREVIEWS = [
  { name: 'Sarah Chen', fn: 'Product Management', industry: 'Tech', years: 8, rate: 100, bio: 'PM at a top-5 tech company. Helped 40+ candidates break into PM roles. Former founder.', initials: 'SC', bg: 'bg-blue-100', fg: 'text-blue-700' },
  { name: 'Marcus Williams', fn: 'Engineering', industry: 'Fintech', years: 12, rate: 125, bio: 'Staff engineer at a Series C fintech. System design, FAANG prep, leveling up mid-career.', initials: 'MW', bg: 'bg-purple-100', fg: 'text-purple-700' },
  { name: 'Priya Patel', fn: 'Design', industry: 'Healthcare', years: 5, rate: 75, bio: 'UX lead designing products used by millions. Portfolio reviews and career pivot coaching.', initials: 'PP', bg: 'bg-green-100', fg: 'text-green-700' },
]

const TESTIMONIALS = [
  { quote: "I got more actionable advice in 30 minutes than from months of YouTube videos. My interviewer said my PM framing was 'unusually clear.'", name: 'Alex T.', role: 'Now: APM at a Series B startup', initials: 'AT' },
  { quote: "My mentor helped me reframe my story from 'career changer' to 'industry translator.' Three weeks later I had two offers.", name: 'Jordan M.', role: 'Now: Associate at McKinsey', initials: 'JM' },
  { quote: "I was nervous the whole time but she got straight to my portfolio's problems. Brutal, honest, and exactly what I needed.", name: 'Kezia O.', role: 'Now: UX Designer at Google', initials: 'KO' },
]

const FAQS = [
  { q: "How is this different from LinkedIn coffee chats?", a: "Mentors on OfficeHours have agreed to give their full attention in exchange for fair compensation. No awkward 'just wanted to connect' energy — you show up with questions, they show up with answers." },
  { q: "What if the session isn't useful?", a: "We stand behind every session. If you feel you didn't get value, contact us within 48 hours and we'll make it right — either a credit or a refund." },
  { q: "How do mentors get approved?", a: "Every mentor submits their LinkedIn and career background. Our team reviews each application to verify experience and fit before they can take bookings." },
  { q: "How much do sessions cost?", a: "Sessions are priced by experience: $50 (0–2 yrs), $75 (3–4 yrs), $100 (5–9 yrs), $125 (10+ yrs). No subscriptions, no hidden fees." },
  { q: "Can I become a mentor?", a: "Yes — if you have 2+ years of relevant tech industry experience. Apply via the signup flow, get reviewed within 24 hours, and start taking bookings on your schedule." },
]

export default function Landing() {
  const [statsRef, statsInView] = useInView()

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-orange-50 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-coral/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-border-light rounded-full px-4 py-1.5 mb-8 animate-fade-in shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse" />
            <span className="text-xs font-semibold text-text-secondary font-sans tracking-wide">Mentors available now</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] mb-6 animate-fade-in-up">
            30 minutes with the<br />
            <span className="text-coral">right person</span><br />
            changes everything.
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary font-sans leading-relaxed max-w-xl mx-auto mb-10 animate-fade-in-up delay-200">
            Book a focused session with a senior tech professional who's been where you're trying to go. Real advice. No fluff.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-300">
            <Link to="/signup?role=mentee" className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-4 rounded-xl font-sans text-base transition-colors shadow-lg shadow-coral/20">
              Find a mentor →
            </Link>
            <Link to="/browse" className="bg-white hover:bg-orange-50 text-text-primary font-bold px-8 py-4 rounded-xl font-sans text-base transition-colors border border-border-mid">
              Browse mentors
            </Link>
          </div>

          <p className="text-xs text-text-muted font-sans mt-5 animate-fade-in delay-500">
            Starting at $50/session · No subscription · Guaranteed value
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
          <div className="w-6 h-9 border-2 border-border-mid rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-text-muted rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-white border-y border-border-light py-16">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-6 md:gap-12">
          <StatTile value={500} suffix="+" label="Sessions booked" active={statsInView} />
          <StatTile value={120} suffix="+" label="Vetted mentors" active={statsInView} />
          <StatTile value={94} suffix="%" label="Would recommend" active={statsInView} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">How it works</p>
          <h2 className="font-serif text-4xl font-bold text-text-primary">Three steps to a better career move</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 120}>
              <div className="bg-white border border-border-light rounded-2xl p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-coral font-sans mb-2">{step.num}</div>
                <h3 className="font-serif text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary font-sans leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="text-center mt-10" delay={360}>
          <Link to="/how-it-works" className="text-sm font-semibold text-coral hover:underline font-sans">
            Learn more about how it works →
          </Link>
        </Reveal>
      </section>

      {/* FOR MENTEES */}
      <section className="bg-white border-y border-border-light py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Reveal direction="left">
            <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">For mentees</p>
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-5 leading-tight">Stop guessing.<br />Start asking.</h2>
            <p className="text-text-secondary font-sans text-base leading-relaxed mb-6">
              Early-career decisions compound. The right conversation at the right time can shorten your path by years.
            </p>
            <ul className="space-y-3 mb-8">
              {['Interview prep and offer negotiation', 'Breaking into PM, design, or engineering', 'Career pivots into tech', 'Portfolio and resume reviews', 'Navigating toxic workplaces or burnout'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm font-sans text-text-secondary">
                  <span className="text-coral font-bold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup?role=mentee" className="inline-block bg-coral hover:bg-coral-dark text-white font-bold px-6 py-3 rounded-xl font-sans text-sm transition-colors">
              Find my mentor →
            </Link>
          </Reveal>
          <Reveal direction="right">
            <div className="bg-cream rounded-2xl p-8 border border-border-light">
              <p className="text-xs uppercase tracking-widest text-text-muted font-sans mb-5">Popular topics</p>
              <div className="flex flex-wrap gap-2">
                {['PM interviews', 'FAANG prep', 'Career switch', 'Portfolio review', 'Salary negotiation', 'Breaking into tech', 'Leadership', 'Startups vs. big co', 'MBA decision', 'Job search strategy', 'Technical interviews', 'Work-life balance'].map(tag => (
                  <span key={tag} className="bg-white border border-border-light text-text-secondary text-xs font-sans px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOR MENTORS */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Reveal direction="left" className="order-2 md:order-1">
            <div className="bg-white rounded-2xl p-8 border border-border-light">
              <p className="text-xs uppercase tracking-widest text-text-muted font-sans mb-5">Mentor earnings</p>
              <div className="space-y-1">
                {[
                  { label: '0–2 yrs', rate: '$50', mo: '$200+/mo' },
                  { label: '3–4 yrs', rate: '$75', mo: '$300+/mo' },
                  { label: '5–9 yrs', rate: '$100', mo: '$400+/mo' },
                  { label: '10+ yrs', rate: '$125', mo: '$500+/mo' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-3 border-b border-border-light last:border-0">
                    <div>
                      <span className="text-sm font-semibold text-text-primary font-sans">{row.label} experience</span>
                      <span className="text-xs text-text-muted font-sans ml-2">· {row.rate}/session</span>
                    </div>
                    <div className="text-coral font-bold font-sans text-sm">{row.mo}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted font-sans mt-3">Based on 4 sessions/month. No ceiling on bookings.</p>
            </div>
          </Reveal>
          <Reveal direction="right" className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">For mentors</p>
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-5 leading-tight">Your experience<br />is worth more<br />than a coffee chat.</h2>
            <p className="text-text-secondary font-sans text-base leading-relaxed mb-6">
              You've navigated what they're trying to figure out. Turn that into meaningful conversations — and fair pay for your time.
            </p>
            <ul className="space-y-3 mb-8">
              {['Set your own schedule', 'Rate auto-set by experience level', 'Profile reviewed within 24 hours', 'Direct payout after every session'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm font-sans text-text-secondary">
                  <span className="text-coral font-bold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup?role=mentor" className="inline-block bg-text-primary hover:opacity-80 text-cream font-bold px-6 py-3 rounded-xl font-sans text-sm transition-opacity">
              Apply to mentor →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURED MENTORS */}
      <section className="bg-white border-y border-border-light py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">Our mentors</p>
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-3">Meet a few of our mentors</h2>
            <p className="text-text-muted font-sans">Every mentor is vetted. Every session is guaranteed.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {MENTOR_PREVIEWS.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="bg-cream rounded-2xl p-6 border border-border-light hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-full ${m.bg} ${m.fg} font-bold text-sm flex items-center justify-center mb-4 font-sans`}>
                    {m.initials}
                  </div>
                  <div className="font-bold text-text-primary font-sans mb-0.5">{m.name}</div>
                  <div className="text-xs text-text-muted font-sans mb-3">{m.fn} · {m.industry} · {m.years} yrs</div>
                  <p className="text-sm text-text-secondary font-sans leading-relaxed flex-1 mb-4">{m.bio}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-coral font-bold font-sans text-sm">${m.rate}/session</span>
                    <Link to="/browse" className="text-xs font-semibold text-text-muted hover:text-coral transition-colors font-sans">View →</Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10" delay={300}>
            <Link to="/browse" className="inline-block border border-border-mid hover:border-coral text-text-primary hover:text-coral font-bold px-7 py-3 rounded-xl font-sans text-sm transition-colors">
              Browse all mentors
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">Stories</p>
            <h2 className="font-serif text-4xl font-bold text-text-primary">Real results from real sessions</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="bg-white border border-border-light rounded-2xl p-7 h-full flex flex-col">
                  <div className="text-coral text-4xl font-serif font-bold mb-3 leading-none">"</div>
                  <p className="text-sm text-text-secondary font-sans leading-relaxed flex-1 mb-5">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-coral font-sans flex-shrink-0">{t.initials}</div>
                    <div>
                      <div className="text-sm font-bold text-text-primary font-sans">{t.name}</div>
                      <div className="text-xs text-text-muted font-sans">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-border-light py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-coral font-sans font-semibold mb-3">FAQ</p>
            <h2 className="font-serif text-4xl font-bold text-text-primary">Common questions</h2>
          </Reveal>
          {FAQS.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center bg-text-primary rounded-3xl px-8 py-16">
            <h2 className="font-serif text-4xl font-bold text-cream mb-4">Ready to move faster?</h2>
            <p className="text-cream/70 font-sans text-base leading-relaxed mb-8 max-w-md mx-auto">
              One conversation with the right person can unlock the next chapter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup?role=mentee" className="bg-coral hover:bg-coral-dark text-white font-bold px-8 py-4 rounded-xl font-sans transition-colors">
                Find a mentor →
              </Link>
              <Link to="/browse" className="bg-white/10 hover:bg-white/20 text-cream font-bold px-8 py-4 rounded-xl font-sans transition-colors border border-white/20">
                Browse first
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
