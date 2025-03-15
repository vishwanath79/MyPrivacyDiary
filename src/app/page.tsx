import TrackerAnalyzer from '@/components/TrackerAnalyzer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-4 border-b">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Who Can Track Me?</h1>
          <nav>
            <a href="https://vishsubramanian.me" target="_blank" className="text-gray-600 hover:text-gray-900">About</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <h1 className="text-4xl font-bold">Who Can Track Me?</h1>
          <p className="text-xl text-gray-600">
            Discover who is tracking you on any website
          </p>
          <TrackerAnalyzer />
        </div>
      </div>
    </main>
  )
} 