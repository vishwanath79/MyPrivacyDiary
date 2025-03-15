export interface NetworkRequest {
  url: string
  type: string
  method: string
}

export interface Script {
  src: string
  content: string
}

export interface TrackerData {
  requests: NetworkRequest[]
  cookies: Set<string>
  scripts: Array<{
    src: string
    content: string
  }>
}

export interface TrackerResult {
  trackers: Array<{
    name: string
    type: string
    impact: 'low' | 'medium' | 'high'
    details: string
  }>
  summary: string
  recommendations: string[]
  privacyScore: number
}

export interface TrackingPatterns {
  analytics: Array<{
    pattern: string
    name: string
    impact: 'low' | 'medium' | 'high'
  }>
  social_media: Array<{
    pattern: string
    name: string
    impact: 'low' | 'medium' | 'high'
  }>
  ad_networks: Array<{
    pattern: string
    name: string
    impact: 'low' | 'medium' | 'high'
  }>
  fingerprinting: Array<{
    pattern: string
    name: string
    impact: 'low' | 'medium' | 'high'
  }>
  marketing: Array<{
    pattern: string
    name: string
    impact: 'low' | 'medium' | 'high'
  }>
}

export interface CookiePatterns {
  tracking: string[]
}

export interface AnalysisResult {
  riskLevel: string
  totalTrackers: number
  trackers: {
    category: string
    trackers: TrackerResult[]
  }[]
  aiAnalysis: {
    summary: string
    concerningTrackers: string[]
  }
} 