'use client'

import { useState } from 'react'
import AnalysisResults from './AnalysisResults'

interface AnalysisData {
  riskLevel: string
  trackers: Array<{
    category: string
    trackers: Array<{
      name: string
      impact: string
      source?: string
    }>
  }>
  totalTrackers: number
  sources: {
    scriptCount: number
    networkRequestCount: number
    cookieCount: number
  }
  aiAnalysis?: {
    summary: string
    concerningTrackers: string[]
  }
}

export default function TrackerAnalyzer() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisData | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setError('')
    setResults(null)
    
    try {
      // First get tracker analysis
      const trackerResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      
      if (!trackerResponse.ok) {
        throw new Error('Analysis failed')
      }
      
      const trackerData = await trackerResponse.json()

      // Then get AI analysis
      const aiResponse = await fetch('/api/analyze/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: trackerData }),
      })

      if (!aiResponse.ok) {
        throw new Error('AI analysis failed')
      }

      const { aiAnalysis } = await aiResponse.json()
      
      // Combine results
      setResults({
        ...trackerData,
        aiAnalysis
      })
    } catch (error) {
      setError('Failed to analyze website. Please try again.')
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            required
            className="flex-1 p-3 border border-gray-700 rounded-lg 
              bg-[#1a1b2e] text-gray-100 placeholder-gray-500
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-base font-normal"
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              font-medium transition-colors duration-200"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
      <p className="text-sm text-gray-500 mt-2 mb-6">
    Note: Analysis time may vary depending on the complexity of the website and number of trackers present.
  </p>

      {error && (
        <div className="p-4 mb-6 bg-red-900/50 text-red-200 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {results && <AnalysisResults results={formatResults(results)} />}
    </div>
  )
}

// Helper function to format cookie names and descriptions
function formatResults(results: AnalysisData): AnalysisData {
  return {
    ...results,
    trackers: results.trackers.map(category => ({
      ...category,
      trackers: category.trackers.map(tracker => ({
        ...tracker,
        name: formatTrackerName(tracker.name),
        description: formatTrackerDescription(tracker.name, category.category)
      }))
    }))
  }
}

function formatTrackerName(name: string): string {
  if (name.includes('=')) {
    const cookieParts = name.split(';')[0]
    const cookieName = cookieParts.split('=')[0]
    return cookieName.trim()
  }
  return name
}

function formatTrackerDescription(name: string, category: string): string {
  if (name.includes('=')) {
    const parts = name.split(';')
    const domain = parts.find(p => p.toLowerCase().includes('domain='))?.split('=')[1] || ''
    const expires = parts.find(p => p.toLowerCase().includes('expires='))?.split('=')[1] || ''
    
    return `${category} cookie${domain ? ` from ${domain}` : ''}${expires ? ` (expires ${new Date(expires).toLocaleDateString()})` : ''}`
  }
  return `${category} tracker`
} 