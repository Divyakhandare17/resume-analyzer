import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import JobMatch from './pages/JobMatch'
import History from './pages/History'
import { getUserId } from './utils/userId'

export default function App() {
  useEffect(() => {
    getUserId()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/job-match" element={<JobMatch />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}
