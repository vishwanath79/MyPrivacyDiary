document.addEventListener('DOMContentLoaded', () => {
  const analyzeButton = document.getElementById('analyze');
  const resultsSection = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  const contentDiv = document.getElementById('content');

  if (!analyzeButton) {
    console.error('Analyze button not found!');
    return;
  }

  // Keep popup open by creating a dummy audio element
  let keepAliveAudio;

  function startKeepAlive() {
    // Create a silent audio element to keep the popup alive
    keepAliveAudio = new Audio();
    keepAliveAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    keepAliveAudio.loop = true;
    keepAliveAudio.volume = 0.001; // Essentially silent
    keepAliveAudio.play().catch(() => {
      console.log('Auto-play prevented, popup may close if user switches tabs');
    });
  }

  function stopKeepAlive() {
    if (keepAliveAudio) {
      keepAliveAudio.pause();
      keepAliveAudio.src = '';
      keepAliveAudio = null;
    }
  }

  analyzeButton.addEventListener('click', () => {
    console.log('Analyze button clicked');
    
    // Start keeping the popup alive
    startKeepAlive();
    
    // Show loading state
    analyzeButton.disabled = true;
    resultsSection.style.display = 'block';
    loadingDiv.style.display = 'block';
    loadingDiv.innerHTML = `
      <div class="loading"></div>
      <div class="analysis-message">
        Analyzing trackers and privacy implications...<br>
        This may take a moment depending on the number of trackers detected.<br>
    
      </div>
    `;
    contentDiv.innerHTML = '';

    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'analyzeCurrentTab' },
      (response) => {
        console.log('Received response:', response);
        
        // Stop keeping the popup alive since analysis is complete
        stopKeepAlive();
        
        // Check for runtime errors
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          showError(chrome.runtime.lastError.message);
          return;
        }

        // Hide loading state
        loadingDiv.style.display = 'none';
        analyzeButton.disabled = false;

        if (response && response.success) {
          // Display the analysis results
          const analysis = response.data;
          contentDiv.innerHTML = `
            <h1>Who is tracking me ? </h1>
            
            <h2>**Key Findings:**</h2>
            <ul>
              ${analysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
            </ul>

            <h2>**Privacy Concerns:**</h2>
            <ul>
              ${analysis.privacyConcerns.map(concern => `<li>${concern}</li>`).join('')}
            </ul>

            <h2>**Recommendations:**</h2>
            <ul>
              ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>

            <div class="stats-container">
              <div class="stat-box">
                <div class="stat-number">${analysis.stats.totalTrackers}</div>
                <div class="stat-label">Total Trackers</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.stats.highImpactTrackers}</div>
                <div class="stat-label">High Impact Trackers</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.stats.cookiesDetected}</div>
                <div class="stat-label">Cookies Detected</div>
              </div>
            </div>

            <h2>Detected Trackers</h2>
            <div class="tracker-table-container">
              <table class="tracker-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Impact</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  ${analysis.detectedTrackers.map(tracker => `
                    <tr>
                      <td>${tracker.category}</td>
                      <td class="tracker-url">${tracker.name}</td>
                      <td><span class="impact-badge ${tracker.impact}">${tracker.impact}</span></td>
                      <td class="tracker-url">${tracker.source}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        } else {
          // Display error message
          showError(response ? response.error : 'No response received');
        }
      }
    );
  });

  function showError(message) {
    stopKeepAlive(); // Stop keeping popup alive on error
    loadingDiv.style.display = 'none';
    analyzeButton.disabled = false;
    
    // Check if it's a restricted URL error
    if (message.includes('cannot be analyzed')) {
      contentDiv.innerHTML = `
        <div class="error-message" style="background: rgba(96, 165, 250, 0.1); border-color: rgba(96, 165, 250, 0.2);">
          <div style="font-weight: 500; margin-bottom: 8px;">Restricted Page</div>
          <p style="margin: 0;">Browser system pages cannot be analyzed for security reasons. Please try the extension on a regular website.</p>
        </div>
      `;
    } else {
      contentDiv.innerHTML = `
        <div class="error-message">
          ${message || 'An unknown error occurred'}
        </div>
      `;
    }
  }

  // Clean up when popup is closed
  window.addEventListener('unload', () => {
    stopKeepAlive();
  });
}); 