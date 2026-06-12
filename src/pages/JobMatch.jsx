import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { matchJob } from '../api/resumeApi'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'

export default function JobMatch() {
  const location = useLocation()
  const resumeText = location.state?.resumeText
  const [jobDescription, setJobDescription] = useState('')
  const [matchResult, setMatchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const onAnalyze = async (e) => {
    e.preventDefault()

    if (!resumeText) {
      setError('Please analyze a resume first before checking job match.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description to analyze.')
      return
    }
    if (jobDescription.trim().length < 50) {
      setError('Job description is too short. Paste the full posting for better results.')
      return
    }

    setIsLoading(true)
    setError('')
    setMatchResult(null)

    try {
      const result = await matchJob(resumeText, jobDescription.trim())
      setMatchResult(result)
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Job match analysis failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const matchScore = matchResult?.matchScore ?? matchResult?.resumeScore ?? 0

  const scoreColor =
    matchScore >= 80
      ? 'text-emerald-600'
      : matchScore >= 60
        ? 'text-brand-600'
        : 'text-amber-600'

  const scoreLabel =
    matchScore >= 80
      ? 'Strong match'
      : matchScore >= 60
        ? 'Moderate match'
        : 'Needs improvement'

  if (!resumeText) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Resume required</h1>
            <p className="mt-2 text-slate-600">
              Upload and analyze your resume first, then come back to check how
              well it matches a job description.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Upload Resume
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Job Match Score
          </h1>
          <p className="mt-2 text-slate-600">
            Paste a job description to see how well your resume aligns with the role.
          </p>
        </div>

        <form onSubmit={onAnalyze} className="space-y-4">
          <div>
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Job Description
            </label>
            <textarea
              id="job-description"
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
              placeholder="Paste the full job posting here — responsibilities, requirements, and preferred qualifications..."
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {isLoading ? (
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 py-4">
              <LoadingSpinner label="Calculating job match..." />
            </div>
          ) : (
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-lg"
            >
              Check Match
            </button>
          )}
        </form>

        {matchResult && (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                    Match Percentage
                  </p>
                  <p className={`mt-1 text-5xl font-bold ${scoreColor}`}>
                    {matchScore}%
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {scoreLabel}
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-600 transition-all duration-700 ease-out"
                      style={{ width: `${matchScore}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {matchResult.missingSkills.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Missing Skills
                    </h2>
                    <p className="text-sm text-slate-500">
                      Skills from the job description not found in your resume
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {matchResult.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-amber-50 px-3.5 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-amber-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {matchResult.skills.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-emerald-700">
                  Matched Skills
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {matchResult.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
