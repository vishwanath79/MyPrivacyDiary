export interface AnalysisResults {
  totalTrackers: number;
  riskLevel: string;
  trackers: Array<{
    category: string;
    trackers: Array<{
      name: string;
      impact: 'low' | 'medium' | 'high';
      source?: string;
    }>;
  }>;
}

export interface TrackerSet {
  name: string;
  impact: 'low' | 'medium' | 'high';
  source?: string;
} 