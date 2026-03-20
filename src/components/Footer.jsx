import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-text-primary text-cream/70 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-serif text-xl font-bold text-cream block mb-3">
              OfficeHours
            </Link>
            <p className="text-sm leading-relaxed">
              30-minute mentorship sessions with senior tech professionals.
              Real advice, real experience, real impact.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">Platform</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-cream transition-colors">Browse Mentors</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cream transition-colors">How It Works</Link></li>
              <li><Link to="/signup?role=mentee" className="hover:text-cream transition-colors">Find a Mentor</Link></li>
              <li><Link to="/signup?role=mentor" className="hover:text-cream transition-colors">Become a Mentor</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">Company</p>
            <ul className="space-y-2 text-sm">
              <li><span className="opacity-40 cursor-default">About</span></li>
              <li><span className="opacity-40 cursor-default">Blog</span></li>
              <li><span className="opacity-40 cursor-default">Press</span></li>
              <li><span className="opacity-40 cursor-default">Contact</span></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><span className="opacity-40 cursor-default">Privacy</span></li>
              <li><span className="opacity-40 cursor-default">Terms</span></li>
              <li><span className="opacity-40 cursor-default">Cookie Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-cream/30">© 2026 OfficeHours. All rights reserved.</p>
          <p className="text-xs text-cream/30">Built for early-career professionals in tech.</p>
        </div>
      </div>
    </footer>
  )
}
