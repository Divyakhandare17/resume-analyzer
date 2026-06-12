export default function ScoreRing({ score, size = 'lg', label }) {
  const clamped = Math.min(100, Math.max(0, Number(score) || 0))
  const circumference = 264
  const dashOffset = circumference - (clamped / 100) * circumference

  const sizeClasses = {
    lg: { ring: 'h-32 w-32', text: 'text-3xl', stroke: 8 },
    md: { ring: 'h-24 w-24', text: 'text-2xl', stroke: 8 },
  }

  const { ring, text, stroke } = sizeClasses[size] || sizeClasses.lg

  const ringColor =
    clamped >= 80 ? '#059669' : clamped >= 60 ? '#4f46e5' : '#d97706'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative flex ${ring} items-center justify-center`}>
        <svg className={`${ring} -rotate-90`} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={ringColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className={`block font-bold ${text}`} style={{ color: ringColor }}>
            {clamped}
          </span>
          <span className="text-xs font-medium text-slate-500">/ 100</span>
        </div>
      </div>
      {label && (
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}
    </div>
  )
}
