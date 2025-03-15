import type { AnalysisResult } from '../types'

document.addEventListener('DOMContentLoaded', () => {
  const analyzeButton = document.getElementById('analyzeButton')
  const resultsDiv = document.getElementById('results')

  // Load previous analysis if available
  chrome.storage.local.get(['lastAnalysis'], (result) => {
    if (result.lastAnalysis) {
      displayResults(result.lastAnalysis)
    }
  })

  analyzeButton?.addEventListener('click', async () => {
    if (resultsDiv) {
      resultsDiv.innerHTML = '<div class="loading"></div>'
      
      chrome.runtime.sendMessage(
        { action: 'analyzeCurrentTab' },
        (response) => {
          if (response.success) {
            // Save analysis to storage
            chrome.storage.local.set({ lastAnalysis: response.data })
            displayResults(response.data)
          } else {
            resultsDiv.innerHTML = `
              <div class="error">
                Analysis failed. Please try again.
                ${response.error ? `<br>Error: ${response.error}` : ''}
              </div>
            `
          }
        }
      )
    }
  })

  function displayResults(analysis: AnalysisResult) {
    if (!resultsDiv) return

    resultsDiv.innerHTML = `
      <div class="risk-level ${analysis.riskLevel}">
        Risk Level: ${analysis.riskLevel.toUpperCase()}
      </div>
      
      <div class="total-trackers">
        Total Trackers: ${analysis.totalTrackers}
      </div>
      
      <div class="ai-analysis">
        ${analysis.aiAnalysis.summary.replace(/\n/g, '<br>')}
      </div>
      
      <div class="tracker-list">
        ${analysis.trackers.map(category => `
          <div class="tracker-category">
            ${category.category.toUpperCase()}
          </div>
          ${category.trackers.map(tracker => `
            <div class="tracker-item">
              <span>${tracker.name}</span>
              <span class="impact-badge ${tracker.impact}">
                ${tracker.impact}
              </span>
            </div>
          `).join('')}
        `).join('')}
      </div>
    `
  }
}) 