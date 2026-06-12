import axios from 'axios'

export const API_URL =
  'https://lkgp7acf7h.execute-api.ap-south-1.amazonaws.com/default/analyzeResume'

const client = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
})

function toArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

export function normalizeAnalysis(data) {
  if (!data || typeof data !== 'object') {
    return {
      resumeScore: 0,
      skills: [],
      experienceSummary: '',
      improvements: [],
      matchScore: null,
      missingSkills: [],
    }
  }

  let payload = data
  if (data.body) {
    try {
      payload = typeof data.body === 'string' ? JSON.parse(data.body) : data.body
    } catch {
      payload = data
    }
  }

  return {
    resumeScore:
      payload.resumeScore ??
      payload.score ??
      payload.resume_score ??
      0,
    skills: toArray(payload.skills ?? payload.detectedSkills ?? payload.foundSkills),
    experienceSummary:
      payload.experienceSummary ??
      payload.experience ??
      payload.experience_summary ??
      payload.summary ??
      '',
    improvements: toArray(payload.improvements ?? payload.suggestions),
    matchScore:
      payload.matchScore ??
      payload.matchPercentage ??
      payload.match_score ??
      null,
    missingSkills: toArray(
      payload.missingSkills ?? payload.missing_skills ?? payload.gapSkills,
    ),
  }
}

export async function analyzeResume(resumeText) {
  const { data } = await client.post(API_URL, { resumeText })
  return normalizeAnalysis(data)
}

export async function matchJob(resumeText, jobDescription) {
  const { data } = await client.post(API_URL, { resumeText, jobDescription })
  return normalizeAnalysis(data)
}
