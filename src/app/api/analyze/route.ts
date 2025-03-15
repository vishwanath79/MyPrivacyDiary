import { NextResponse } from 'next/server'
import { analyzeSiteWithPuppeteer } from '../../../utils/puppeteerTracker'
import { TRACKING_PATTERNS } from '@/constants/trackingPatterns'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    // Get data from Puppeteer
    const puppeteerData = await analyzeSiteWithPuppeteer(url)
    
    // Initialize tracking data
    const foundTrackers: { [key: string]: Set<any> } = {
      analytics: new Set(),
      social_media: new Set(),
      ad_networks: new Set(),
      fingerprinting: new Set(),
      cookies: new Set()
    }

    // Helper function to check patterns
    const checkPattern = (pattern: string, content: string): boolean => {
      if (!content) return false
      const lowerPattern = pattern.toLowerCase()
      const lowerContent = content.toLowerCase()
      return lowerContent.includes(lowerPattern)
    }

    // Safely check for trackers
    if (puppeteerData && puppeteerData.requests && puppeteerData.scripts) {
      // Scan for trackers in all sources
      Object.entries(TRACKING_PATTERNS).forEach(([category, patterns]) => {
        patterns.forEach(tracker => {
          const foundInRequests = puppeteerData.requests.some(req => 
            checkPattern(tracker.pattern, req.url)
          )

          const foundInScripts = puppeteerData.scripts.some(script => 
            checkPattern(tracker.pattern, script.src) || 
            checkPattern(tracker.pattern, script.content)
          )

          if (foundInRequests || foundInScripts) {
            foundTrackers[category].add({
              name: tracker.name,
              impact: tracker.impact,
              source: foundInRequests ? 'network' : 'script'
            })
          }
        })
      })
    }

    // Add cookie trackers
    if (puppeteerData && puppeteerData.cookies) {
      puppeteerData.cookies.forEach(cookie => {
        foundTrackers.cookies.add({
          name: cookie,
          impact: 'medium',
          source: 'cookie'
        })
      })
    }

    // Calculate totals
    const totalTrackers = Object.values(foundTrackers)
      .reduce((sum, set) => sum + set.size, 0)

    // Format trackers for response
    const formattedTrackers = Object.entries(foundTrackers)
      .filter(([_, trackers]) => trackers.size > 0)
      .map(([category, trackers]) => ({
        category,
        trackers: Array.from(trackers)
      }))

    return NextResponse.json({
      riskLevel: totalTrackers > 10 ? 'high' : totalTrackers > 5 ? 'medium' : 'low',
      trackers: formattedTrackers,
      totalTrackers,
      sources: {
        scriptCount: (puppeteerData?.scripts || []).length,
        networkRequestCount: (puppeteerData?.requests || []).length,
        cookieCount: (puppeteerData?.cookies || []).length
      }
    })
    
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    )
  }
} 