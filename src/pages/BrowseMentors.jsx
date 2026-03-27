import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import MentorCard from '../components/MentorCard'

const JOB_FUNCTIONS = ['All', 'Product Management', 'Engineering', 'Design', 'Data Science', 'Marketing', 'Finance', 'Operations', 'Sales']
const INDUSTRIES = ['All', 'Tech', 'Fintech', 'Healthcare', 'Media', 'Consulting', 'E-commerce', 'Education']
const PRICE_TIERS = ['All', '$50', '$75', '$100', '$125']

// Sample mentors shown while real ones are loading / as placeholders
const SAMPLE_MENTORS = [
  { user_id: 'sample-1', job_function: 'Product Management', industry: 'Tech', years_experience: 8, pricing_tier: 100, bio: 'PM at a top-5 tech company. Helped 40+ candidates break into PM roles. Former startup founder.', _name: 'Sarah Chen' },
  { user_id: 'sample-2', job_function: 'Engineering', industry: 'Fintech', years_experience: 12, pricing_tier: 125, bio: 'Staff engineer at a Series C fintech. Expert in system design, FAANG interview prep, and career growth.', _name: 'Marcus Williams' },
  { user_id: 'sample-3', job_function: 'Design', industry: 'Healthcare', years_experience: 5, pricing_tier: 75, bio: 'UX lead designing products used by millions. Specializes in portfolio reviews and pivoting into tech design.', _name: 'Priya Patel' },
  { user_id: 'sample-4', job_function: 'Data Science', industry: 'Tech', years_experience: 7, pricing_tier: 100, bio: 'Senior DS at a Fortune 500. I help people transition from analytics to ML roles and ace DS interviews.', _name: 'David Kim' },
  { user_id: 'sample-5', job_function: 'Marketing', industry: 'E-commerce', years_experience: 9, pricing_tier: 100, bio: 'Growth marketing lead who scaled a brand from $1M to $50M ARR. Specializing in brand strategy and growth loops.', _name: 'Aisha Johnson' },
  { user_id: 'sample-6', job_function: 'Finance', industry: 'Fintech', years_experience: 11, pricing_tier: 125, bio: 'VP Finance at a pre-IPO fintech. Expert in financial modeling, FP&A interviews, and corp finance career paths.', _name: 'Carlos Rivera' },
]

export default function BrowseMentors() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [fnFilter, setFnFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [usingSamples, setUsingSamples] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('mentor_profiles')
        .select('*, profiles(full_name, avatar_url)')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        setMentors(data)
      } else {
        setMentors(SAMPLE_MENTORS)
        setUsingSamples(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = mentors.filter(m => {
    const name = m.profiles?.full_name || m._name || ''
    if (fnFilter !== 'All' && m.job_function !== fnFilter) return false
    if (industryFilter !== 'All' && m.industry !== industryFilter) return false
    if (priceFilter !== 'All' && `$${m.pricing_tier}` !== priceFilter) return false
    if (search && !name.toLowerCase().includes(search.toLowerCase()) &&
        !m.job_function?.toLowerCase().includes(search.toLowerCase()) &&
        !m.bio?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">Browse Mentors</h1>
        <p className="text-text-muted font-sans text-base">Every mentor is vetted. Every session is guaranteed.</p>
      </div>

      {usingSamples && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-8 font-sans text-sm text-blue-800">
          <strong>Preview mode</strong> — showing sample profiles. Real mentor profiles will appear here once mentors are approved.
        </div>
      )}

      {/* Search + Filters */}
      <div className="bg-white border border-border-light rounded-2xl p-5 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, role, or keyword…"
          className="w-full border border-border-mid rounded-lg px-4 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral mb-4 transition-colors"
        />
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-text-muted mb-1.5 font-sans uppercase tracking-wide">Function</label>
            <div className="relative">
              <select
                value={fnFilter}
                onChange={e => setFnFilter(e.target.value)}
                className="w-full appearance-none border border-border-mid rounded-xl px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral pr-8 transition-colors"
              >
                {JOB_FUNCTIONS.map(f => <option key={f}>{f}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-text-muted mb-1.5 font-sans uppercase tracking-wide">Industry</label>
            <div className="relative">
              <select
                value={industryFilter}
                onChange={e => setIndustryFilter(e.target.value)}
                className="w-full appearance-none border border-border-mid rounded-xl px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral pr-8 transition-colors"
              >
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-text-muted mb-1.5 font-sans uppercase tracking-wide">Price</label>
            <div className="relative">
              <select
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                className="w-full appearance-none border border-border-mid rounded-xl px-3 py-2.5 text-sm font-sans bg-white focus:outline-none focus:border-coral pr-8 transition-colors"
              >
                {PRICE_TIERS.map(p => <option key={p}>{p}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          {(fnFilter !== 'All' || industryFilter !== 'All' || priceFilter !== 'All' || search) && (
            <div className="flex items-end">
              <button
                onClick={() => { setFnFilter('All'); setIndustryFilter('All'); setPriceFilter('All'); setSearch('') }}
                className="text-xs font-semibold text-coral hover:underline font-sans py-2 px-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-border-light p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-border-light" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-border-light rounded" />
                  <div className="h-3 w-32 bg-border-light rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-border-light rounded" />
                <div className="h-3 w-4/5 bg-border-light rounded" />
                <div className="h-3 w-2/3 bg-border-light rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-serif text-xl font-bold text-text-primary mb-2">No mentors found</h3>
          <p className="text-text-muted font-sans text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-muted font-sans mb-5">
            {filtered.length} mentor{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(m => (
              <MentorCard
                key={m.user_id}
                mentor={m}
                profileName={m.profiles?.full_name || m._name}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
