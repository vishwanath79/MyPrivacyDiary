import { NextResponse } from 'next/server'
import { analyzeSiteWithPuppeteer } from '../../../../utils/puppeteerTracker'
import { TRACKING_PATTERNS } from '@/constants/trackingPatterns'
import { analyzePrivacyImpact } from '@/utils/privacyAnalyzer'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    const { results } = await request.json()
    
    if (!results) {
      throw new Error('No results provided for AI analysis')
    }

    // Get AI analysis
    const aiAnalysis = await analyzePrivacyImpact(results)
    console.log('AI Analysis:', aiAnalysis) // Debug log

    return NextResponse.json({
      aiAnalysis: {
        summary: aiAnalysis.summary,
        riskLevel: aiAnalysis.riskLevel,
        concerningTrackers: aiAnalysis.concerningTrackers,
        totalTrackers: aiAnalysis.totalTrackers
      }
    })
    
  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI analysis' },
      { status: 500 }
    )
  }
} 