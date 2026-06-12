import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ScoreRing from '../components/ScoreRing'

function ImprovementIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    </span>
  )
}

export default function Results() {
  const location = useLocation()
  const fileName = location.state?.fileName
  const resumeText = location.state?.resumeText
  const analysis = location.state?.analysis

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 0v-3.375m0 0h-3.375m3.375 0h3.375m-9.75 8.25h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">No results yet</h1>
            <p className="mt-2 text-slate-600">
              Upload and analyze a resume to see your personalized feedback.
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

  const {
    resumeScore = 0,
    skills = [],
    experienceSummary = '',
    improvements = [],
  } = analysis

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Analysis Results
          </h1>
          {fileName && (
            <p className="mt-2 text-slate-600">
              Resume analyzed:{' '}
              <span className="font-medium text-slate-800">{fileName}</span>
            </p>
          )}
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ScoreRing score={resumeScore} size="lg" label="Resume Score" />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-slate-900">
                Overall Assessment
              </h2>
              <p className="mt-2 text-slate-600">
                {resumeScore >= 80
                  ? 'Excellent resume — strong content and presentation.'
                  : resumeScore >= 60
                    ? 'Good foundation — a few targeted improvements will strengthen it.'
                    : 'Room for improvement — follow the suggestions below to boost your score.'}
              </p>
            </div>
          </div>
        </div>

        {skills.length > 0 && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
            <p className="mt-1 text-sm text-slate-500">
              Technologies and competencies detected in your resume
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {experienceSummary && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-brand-600">
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
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0V5.25a2.25 2.25 0 0 0-2.25-2.25h-3a2.25 2.25 0 0 0-2.25 2.25v.894m0 0h7.5"
                  />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                Experience Summary
              </h2>
            </div>
            <p className="mt-4 leading-relaxed text-slate-600">
              {experienceSummary}
            </p>
          </section>
        )}

        {improvements.length > 0 && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Improvements
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Actionable steps to strengthen your resume
            </p>
            <ol className="mt-5 space-y-4">
              {improvements.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <ImprovementIcon />
                  <div className="flex-1 pt-0.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-600">
                      Step {index + 1}
                    </span>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-700">
                      {item}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Upload Another Resume
          </Link>
          <Link
            to="/job-match"
            state={{ resumeText, analysis }}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Match Against a Job
          </Link>
        </div>
      </main>
    </div>
  )
}
