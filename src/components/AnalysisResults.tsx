export default function AnalysisResults({ results }: AnalysisResultsProps) {
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Tracking Analysis Results</h1>

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