import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { analyzeResume } from '../api/resumeApi'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')
    pages.push(pageText)
  }

  return pages.join('\n').trim()
}

export default function Home() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (selected) => {
    if (!selected) return false
    if (selected.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return false
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File size must be under 10 MB.')
      return false
    }
    setError('')
    return true
  }

  const extractText = async (selected) => {
    setIsReading(true)
    try {
      const text = await extractTextFromPdf(selected)
      const trimmed = text.trim()
      console.log('Extracted PDF text length:', trimmed.length)
      if (!trimmed) {
        setResumeText('')
        setError(
          'Could not extract text from this PDF. Try a text-based PDF (not a scanned image).',
        )
        return
      }
      setResumeText(trimmed)
      setError('')
    } catch {
      setResumeText('')
      setError('Could not read the file. Please try another PDF.')
    } finally {
      setIsReading(false)
    }
  }

  const handleFile = async (selected) => {
    if (!validateFile(selected)) {
      setFile(null)
      setResumeText('')
      return
    }
    setFile(selected)
    await extractText(selected)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onFileChange = (e) => {
    handleFile(e.target.files[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a resume PDF to analyze.')
      return
    }
    const textToAnalyze = resumeText.trim()
    if (!textToAnalyze) {
      setError('Could not extract text from the PDF. Please try a different file.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const analysis = await analyzeResume(textToAnalyze)
      navigate('/results', {
        state: { fileName: file.name, resumeText, analysis },
      })
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Analysis failed. Please try again.'
      setError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isBusy = isReading || isAnalyzing

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-brand-50/30">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Analyze your resume with AI
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Upload your PDF resume and get instant feedback on strengths,
            gaps, and improvements.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !isBusy && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (isBusy) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all ${
              isDragging
                ? 'border-brand-500 bg-brand-50/80 shadow-inner'
                : file
                  ? 'border-brand-300 bg-brand-50/40'
                  : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50/80'
            } ${isBusy ? 'pointer-events-none opacity-70' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
              disabled={isBusy}
            />

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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>

            {isReading ? (
              <LoadingSpinner label="Reading PDF..." />
            ) : file ? (
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {file.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatSize(file.size)} ·{' '}
                  {resumeText
                    ? 'Text extracted successfully'
                    : 'Waiting for text extraction'}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setResumeText('')
                    setError('')
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Drag & drop your resume here
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  or click to browse · PDF only · max 10 MB
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {isAnalyzing ? (
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 py-4">
              <LoadingSpinner label="Analyzing your resume with AI..." />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!file || !resumeText || isReading}
              className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              Analyze Resume
            </button>
          )}
        </form>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'ATS-friendly', desc: 'Check formatting and keyword coverage' },
            { title: 'Skill insights', desc: 'Identify strengths and missing skills' },
            { title: 'Job matching', desc: 'Compare against any job description' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
