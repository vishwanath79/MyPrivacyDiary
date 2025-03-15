'use client'

interface AnalysisResultsProps {
  results: {
    riskLevel: string;
    trackers: Array<{
      category: string;
      trackers: Array<{
        name: string;
        impact: string;
        description?: string;
        source?: string;
      }>;
    }>;
    totalTrackers: number;
    sources: {
      scriptCount: number;
      networkRequestCount: number;
      cookieCount: number;
    };
    aiAnalysis?: {
      summary: string;
      concerningTrackers: string[];
    };
  };
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  console.log("AnalysisResults component rendering", results);
  
  const highImpactCount = results.trackers.reduce((count, category) => 
    count + category.trackers.filter(t => t.impact === 'high').length, 0
  );

  // Helper function to truncate and format cookie strings
  const formatCookieValue = (value: string) => {
    if (value.length > 50) {
      return (
        <span title={value} className="cursor-help">
          {value.substring(0, 47)}...
        </span>
      )
    }
    return value;
  };

  // Function to download tracker data as JSON
  const downloadTrackerData = () => {
    console.log("Download button clicked");
    
    // Create a formatted data object for download
    const downloadData = {
      timestamp: new Date().toISOString(),
      riskLevel: results.riskLevel,
      totalTrackers: results.totalTrackers,
      highImpactTrackers: highImpactCount,
      cookiesDetected: results.sources.cookieCount,
      trackers: results.trackers,
      aiAnalysis: results.aiAnalysis
    };
    
    console.log("Download data prepared:", downloadData);
    
    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(downloadData, null, 2);
    
    // Create a blob with the data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    
    // Set link properties
    link.href = url;
    link.download = `tracker-analysis-${new Date().toISOString().split('T')[0]}.json`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the URL object
    URL.revokeObjectURL(url);
    
    console.log("Download completed");
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Tracking Analysis Results</h1>
        <button
          onClick={downloadTrackerData}
          className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Tracker Data
        </button>
      </div>

      {/* AI Analysis Summary */}
      {results.aiAnalysis?.summary && (
        <div className="bg-[#1a1b2e] rounded-lg p-6 mb-8 border border-blue-500/20">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">AI Analysis Summary</h2>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {results.aiAnalysis.summary.split('\n').map((line, index) => (
              <div key={index} className="mb-2">
                {line.startsWith('•') ? (
                  <div className="flex">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>{line.substring(1).trim()}</span>
                  </div>
                ) : line.trim() && (
                  <div className={line.includes(':') ? 'text-blue-300 font-semibold mt-4' : ''}>
                    {line}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1b2e] rounded-lg p-6 border border-blue-500/20">
          <div className="text-4xl font-bold text-blue-400 mb-2">
            {results.totalTrackers}
          </div>
          <div className="text-gray-400">Total Trackers</div>
        </div>
        
        <div className="bg-[#1a1b2e] rounded-lg p-6 border border-red-500/20">
          <div className="text-4xl font-bold text-red-400 mb-2">
            {highImpactCount}
          </div>
          <div className="text-gray-400">High Impact Trackers</div>
        </div>
        
        <div className="bg-[#1a1b2e] rounded-lg p-6 border border-yellow-500/20">
          <div className="text-4xl font-bold text-yellow-400 mb-2">
            {results.sources.cookieCount}
          </div>
          <div className="text-gray-400">Cookies Detected</div>
        </div>
      </div>

      {/* Trackers Table */}
      <div className="bg-[#1a1b2e] rounded-lg p-6 border border-blue-500/20 overflow-x-auto">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Detected Trackers</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-gray-400">Category</th>
              <th className="py-2 px-4 text-gray-400">Name</th>
              <th className="py-2 px-4 text-gray-400">Impact</th>
              <th className="py-2 px-4 text-gray-400">Source</th>
            </tr>
          </thead>
          <tbody>
            {results.trackers.map((category, i) => (
              category.trackers.map((tracker, j) => (
                <tr key={`${i}-${j}`} className="border-b border-gray-800/50">
                  <td className="py-2 px-4 text-gray-300">{category.category}</td>
                  <td className="py-2 px-4 text-gray-300">{tracker.name}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                      ${tracker.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                        tracker.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'}`}>
                      {tracker.impact}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-300 max-w-md break-words">
                    {formatCookieValue(tracker.source || '')}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 