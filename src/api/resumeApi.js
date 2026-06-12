import axios from 'axios'
import { getUserId } from '../utils/userId'

export const API_URL =
  'https://lkgp7acf7h.execute-api.ap-south-1.amazonaws.com/default/analyzeResume'

export const HISTORY_API_URL =
  'https://qsrs75k9bd.execute-api.ap-south-1.amazonaws.com/default/getHistory'

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

function normalizeHistoryItem(item) {
  if (!item || typeof item !== 'object') {
    return { id: crypto.randomUUID(), date: null, score: 0, skills: [] }
  }

  return {
    id: item.id ?? item.timestamp ?? item.createdAt ?? crypto.randomUUID(),
    date: item.createdAt ?? item.date ?? item.timestamp ?? item.analyzedAt ?? null,
    score: item.resumeScore ?? item.score ?? item.resume_score ?? 0,
    skills: toArray(item.skills ?? item.detectedSkills ?? item.foundSkills),
  }
}

export function normalizeHistory(data) {
  if (!data) return []

  let payload = data
  if (data.body) {
    try {
      payload = typeof data.body === 'string' ? JSON.parse(data.body) : data.body
    } catch {
      payload = data
    }
  }

  const items = Array.isArray(payload)
    ? payload
    : (payload.items ?? payload.history ?? payload.results ?? [])

  return items
    .map(normalizeHistoryItem)
    .sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0))
}

export async function analyzeResume(resumeText) {
  const userId = getUserId()
  const { data } = await client.post(API_URL, { resumeText, userId })
  return normalizeAnalysis(data)
}

export async function matchJob(resumeText, jobDescription) {
  const userId = getUserId()
  const { data } = await client.post(API_URL, { resumeText, jobDescription, userId })
  return normalizeAnalysis(data)
}

export async function fetchHistory() {
  const userId = getUserId()
  const { data } = await client.get(HISTORY_API_URL, { params: { userId } })
  return normalizeHistory(data)
}
export const generateCoverLetter = async (resumeText, jobDescription) => {
  const response = await axios.post(
    'https://fdn0j8ff50.execute-api.ap-south-1.amazonaws.com/default/generateCoverLetter',
    { resumeText, jobDescription }
  )
  return response.data
}
