export interface Tracker {
  pattern: string
  name: string
  impact: 'low' | 'medium' | 'high'
}

export interface TrackingPatterns {
  analytics: Tracker[]
  social_media: Tracker[]
  ad_networks: Tracker[]
  fingerprinting: Tracker[]
  marketing: Tracker[]
}

export interface CookiePatterns {
  tracking: string[]
  marketing: string[]
  advertising: string[]
  session: string[]
} 