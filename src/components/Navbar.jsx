import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Upload' },
  { to: '/results', label: 'Results' },
  { to: '/job-match', label: 'Job Match' },
  { to: '/history', label: 'History' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-sm">
            R
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            ResumeAI
          </span>
        </Link>

        <ul className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
