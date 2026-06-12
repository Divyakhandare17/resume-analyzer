import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHistory } from '../api/resumeApi'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import ScoreRing from '../components/ScoreRing'

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function History() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      setIsLoading(true)
      setError('')

      try {
        const history = await fetchHistory()
        if (!cancelled) setItems(history)
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Could not load history. Please try again.'
          setError(message)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadHistory()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Analysis History
          </h1>
          <p className="mt-2 text-slate-600">
            Review your past resume analyses and track your progress over time.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
            <LoadingSpinner label="Loading your history..." />
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <p className="text-slate-600">
              No past analyses yet. Upload a resume to get started!
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Upload Resume
            </Link>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <ScoreRing score={item.score} size="md" label="Score" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {formatDate(item.date)}
                    </p>
                    {item.skills.length > 0 ? (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                          Skills
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">
                        No skills detected for this analysis.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
